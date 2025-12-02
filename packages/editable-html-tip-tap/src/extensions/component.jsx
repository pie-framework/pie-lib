import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import debug from 'debug';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { NodeViewWrapper } from '@tiptap/react';
import InsertImageHandler from '../components/image/InsertImageHandler';
import ImageToolbar from '../components/image/ImageToolbar';
import CustomToolbarWrapper from './custom-toolbar-wrapper';

const log = debug('@pie-lib:editable-html:plugins:image:component');

const sizePx = (s) => (s ? `${s}px` : 'calc(20px)');

function ImageComponent(props) {
  const {
    node,
    editor,
    classes,
    attributes,
    onFocus,
    selected,
    options,
    maxImageWidth = 700,
    maxImageHeight = 900,
    latex,
    handleChange,
    handleDone,
  } = props;
  const { alt } = node.attrs;

  const [showToolbar, setShowToolbar] = useState(false);

  const imgRef = useRef(null);
  const resizeRef = useRef(null);
  const toolbarRef = useRef(null);

  const getPercentFromWidth = useCallback((width) => {
    const floored = (width / imgRef.current.naturalWidth) * 4;
    return parseInt(floored.toFixed(0) * 25, 10);
  }, []);

  const applySizeData = useCallback(() => {
    if (!node.attrs.width || !imgRef.current) return;

    const update = {
      ...node.attrs,
      resizePercent: getPercentFromWidth(node.attrs.width),
    };

    if (!isEqual(update, node.attrs)) {
      editor.commands.updateAttributes('imageUploadNode', update);
    }
  }, [editor, node.attrs, getPercentFromWidth]);

  useEffect(() => {
    setShowToolbar(selected);
  }, [selected]);

  useEffect(() => {
    options.imageHandling.insertImageRequested(node, (finish) => new InsertImageHandler(editor, finish));
    applySizeData();

    const resizeHandle = resizeRef.current;
    if (resizeHandle) {
      resizeHandle.addEventListener('mousedown', initResize, false);
    }
    return () => {
      if (resizeHandle) resizeHandle.removeEventListener('mousedown', initResize, false);
    };
  }, []);

  useEffect(() => {
    applySizeData();
  });

  const loadImage = useCallback(() => {
    const box = imgRef.current;
    if (!box) return;

    if (!box.style.width || box.style.width === 'calc(20px)') {
      const w = Math.min(box.naturalWidth, maxImageWidth);
      const h = Math.min(box.naturalHeight, maxImageHeight);

      box.style.width = `${w}px`;
      box.style.height = `${h}px`;

      const update = { width: w, height: h };
      if (!isEqual(update, node.attrs)) {
        editor.commands.updateAttributes('imageUploadNode', update);
      }
    }
  }, [editor, node.attrs, maxImageWidth, maxImageHeight]);

  const updateAspect = (initial, next, keepAspect = true, resizeType) => {
    if (keepAspect) {
      const ratio = initial.width / initial.height;
      if (resizeType === 'height') return { width: next.height * ratio, height: next.height };
      return { width: next.width, height: next.width / ratio };
    }
    return next;
  };

  const startResize = useCallback(
    (e) => {
      const box = imgRef.current;
      if (!box) return;

      const bounds = e.target.getBoundingClientRect();
      const initial = { width: box.naturalWidth, height: box.naturalHeight };

      const next = updateAspect(initial, {
        width: e.clientX - bounds.left,
        height: e.clientY - bounds.top,
      });

      if (next.width > 50 && next.height > 50 && next.width <= 700 && next.height <= 900) {
        box.style.width = `${next.width}px`;
        box.style.height = `${next.height}px`;

        const update = { width: next.width, height: next.height };
        if (!isEqual(update, node.attrs)) {
          editor.commands.updateAttributes('imageUploadNode', update);
        }
      }
    },
    [editor, node.attrs],
  );

  const onChange = useCallback(
    (newValues) => {
      editor.commands.updateAttributes('imageUploadNode', newValues);
    },
    [editor],
  );

  const stopResize = useCallback(() => {
    window.removeEventListener('mousemove', startResize);
    window.removeEventListener('mouseup', stopResize);
  }, [startResize]);

  const initResize = useCallback(() => {
    window.addEventListener('mousemove', startResize);
    window.addEventListener('mouseup', stopResize);
  }, [startResize, stopResize]);

  const style = {
    width: sizePx(node.attrs.width),
    height: sizePx(node.attrs.height),
    objectFit: 'contain',
  };

  const flexAlign = { left: 'flex-start', center: 'center', right: 'flex-end' }[node.attrs.alignment] || 'flex-start';

  return (
    <NodeViewWrapper>
      <div
        onFocus={onFocus}
        className={classNames(
          classes.root,
          !node.attrs.loaded && classes.loading,
          node.attrs.deleteStatus === 'pending' && classes.pendingDelete,
        )}
        style={{ justifyContent: flexAlign }}
      >
        <LinearProgress
          mode="determinate"
          value={node.attrs.percent || 0}
          className={classNames(classes.progress, node.attrs.loaded && classes.hideProgress)}
        />

        <div className={classes.imageContainer}>
          <img
            {...attributes}
            ref={imgRef}
            src={node.attrs.src}
            className={classNames(classes.image, selected && classes.active)}
            style={style}
            onLoad={loadImage}
            alt={node.attrs.alt}
          />
          <div ref={resizeRef} className={classNames(classes.resize, 'resize')} />
        </div>
      </div>

      {showToolbar && (
        <div
          ref={toolbarRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 20,
            background: 'var(--editable-html-toolbar-bg, #efefef)',
            boxShadow:
              '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
            width: '100%',
          }}
        >
          <CustomToolbarWrapper
            showDone
            {...options}
            onDone={() => {
              setShowToolbar(false);
              props.imageHandling?.onDone();
              props.editor.commands.focus('end');
            }}
          >
            <ImageToolbar
              disableImageAlignmentButtons={options.disableImageAlignmentButtons}
              alt={node.attrs.alt}
              imageLoaded={node.attrs.loaded}
              alignment={node.attrs.alignment || 'left'}
              onChange={onChange}
            />
          </CustomToolbarWrapper>
        </div>
      )}
    </NodeViewWrapper>
  );
}

ImageComponent.propTypes = {
  node: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  attributes: PropTypes.object,
  onFocus: PropTypes.func,
  maxImageWidth: PropTypes.number,
  maxImageHeight: PropTypes.number,
};

export default withStyles((theme) => ({
  portal: {
    position: 'absolute',
    opacity: 0,
    transition: 'opacity 200ms linear',
  },
  floatingButtonRow: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '1px',
    display: 'flex',
    padding: '10px',
    border: `solid 1px ${theme.palette.grey[200]}`,
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
  },
  progress: {
    position: 'absolute',
    left: '0',
    width: 'fit-content',
    top: '0%',
    transition: 'opacity 200ms linear',
  },
  hideProgress: {
    opacity: 0,
  },
  loading: {
    opacity: 0.3,
  },
  pendingDelete: {
    opacity: 0.3,
  },
  root: {
    position: 'relative',
    border: `solid 1px ${theme.palette.common.white}`,
    display: 'flex',
    transition: 'opacity 200ms linear',
  },
  delete: {
    position: 'absolute',
    right: 0,
  },
  imageContainer: {
    position: 'relative',
    width: 'fit-content',
    display: 'flex',
    alignItems: 'center',

    '&&:hover > .resize': {
      display: 'block',
    },
  },
  active: {
    border: `solid 1px ${theme.palette.primary.main}`,
  },
  resize: {
    backgroundColor: theme.palette.primary.main,
    cursor: 'col-resize',
    height: '35px',
    width: '5px',
    borderRadius: 8,
    marginLeft: '5px',
    marginRight: '10px',
    display: 'none',
  },
  drawableHeight: {
    minHeight: 350,
  },
}))(ImageComponent);
