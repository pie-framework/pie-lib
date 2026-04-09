import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash-es/isEqual';
import debug from 'debug';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { NodeViewWrapper } from '@tiptap/react';
import ReactDOM from 'react-dom';
import InsertImageHandler from '../components/image/InsertImageHandler';
import ImageToolbar from '../components/image/ImageToolbar';
import CustomToolbarWrapper from './custom-toolbar-wrapper';

const log = debug('@pie-lib:editable-html:plugins:image:component');

const StyledProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'hideProgress',
})(({ hideProgress }) => ({
  position: 'absolute',
  left: '0',
  width: 'fit-content',
  top: '0%',
  transition: 'opacity 200ms linear',
  ...(hideProgress && {
    opacity: 0,
  }),
}));

const StyledRoot = styled('div', {
  shouldForwardProp: (prop) => !['active', 'loading', 'pendingDelete'].includes(prop),
})(({ loading, pendingDelete }) => ({
  position: 'relative',
  display: 'flex',
  transition: 'opacity 200ms linear',
  ...(loading && {
    opacity: 0.3,
  }),
  ...(pendingDelete && {
    opacity: 0.3,
  }),
}));

const StyledImageContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  width: 'fit-content',
  display: 'flex',
  alignItems: 'center',
  '&&:hover > .resize': {
    display: 'block',
  },
}));

const StyledImage = styled('img',{
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
   border: active ? `solid 1px ${theme.palette.primary.main}` : `solid 1px transparent`,
}));

const StyledResize = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  cursor: 'col-resize',
  height: '35px',
  width: '5px',
  borderRadius: 8,
  marginLeft: '5px',
  marginRight: '10px',
  display: 'none',
}));

const sizePx = (s) => (s ? `${s}px` : 'calc(20px)');

function ImageComponent(props) {
  const {
    node,
    editor,
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

  const latestNodeRef = useRef(node);
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

  // keep ref in sync with latest node
  useEffect(() => {
    latestNodeRef.current = node;
  }, [node]);

  useEffect(() => {
    const { selection } = editor.state;
    const onlyThisNodeSelected = selection.from + node.nodeSize === selection.to;

    if (selected) {
      if (onlyThisNodeSelected) {
        setShowToolbar(selected);
      }
    } else {
      setShowToolbar(selected);
    }
  }, [editor, node, selected]);

  useEffect(() => {
    options.imageHandling.insertImageRequested(node, (finish) => new InsertImageHandler(editor, node, finish));
    applySizeData();

    const resizeHandle = resizeRef.current;
    if (resizeHandle) {
      resizeHandle.addEventListener('mousedown', initResize, false);
    }
    return () => {
      if (resizeHandle) {
        resizeHandle.removeEventListener('mousedown', initResize, false);
      }
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

  // Helper to find this node's current position in the doc.
  // We cannot use object identity (n === node) because ProseMirror replaces
  // node objects after every transaction — match by src instead.
  const findNodePos = useCallback(() => {
    let found = null;
    const src = latestNodeRef.current.attrs.src;
    editor.state.doc.descendants((n, pos) => {
      if (found !== null) return false;
      if (n.type.name === 'imageUploadNode' && n.attrs.src === src) {
        found = pos;
        return false;
      }
    });
    return found;
  }, [editor]);

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
      <StyledRoot
        onFocus={onFocus}
        loading={!node.attrs.loaded}
        pendingDelete={node.attrs.deleteStatus === 'pending'}
        style={{ justifyContent: flexAlign }}
      >
        <StyledProgress mode="determinate" value={node.attrs.percent || 0} hideProgress={node.attrs.loaded} />

        <StyledImageContainer onDragStart={(e) => e.preventDefault()}>
          <StyledImage
            {...attributes}
            active={selected && node.attrs.loaded}
            draggable={false}
            ref={imgRef}
            src={node.attrs.src}
            style={style}
            onLoad={loadImage}
            alt={node.attrs.alt}
          />
          <StyledResize ref={resizeRef} className="resize" />
        </StyledImageContainer>
      </StyledRoot>

      {showToolbar && editor._tiptapContainerEl && ReactDOM.createPortal(
        <div
          ref={toolbarRef}
          style={{
            zIndex: 20,
            background: 'var(--editable-html-toolbar-bg, #efefef)',
            boxShadow:
              '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
            width: '100%',
          }}
        >
          <CustomToolbarWrapper
            showDone
            deletable
            toolbarOpts={options.toolbarOpts || {}}
            onDelete={() => {
              const nodePos = findNodePos();
              if (nodePos === null) return;

              options.imageHandling?.onDelete?.(latestNodeRef.current);

              editor.view.dispatch(
                editor.state.tr.delete(nodePos, nodePos + editor.state.doc.nodeAt(nodePos).nodeSize),
              );
              setShowToolbar(false);
              editor.commands.focus();
            }}
            onDone={() => {
              setShowToolbar(false);
              options.imageHandling?.onDone?.();
              editor.commands.focus('end');
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
        </div>,
        editor._tiptapContainerEl,
      )}
    </NodeViewWrapper>
  );
}

ImageComponent.propTypes = {
  node: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  attributes: PropTypes.object,
  onFocus: PropTypes.func,
  maxImageWidth: PropTypes.number,
  maxImageHeight: PropTypes.number,
};

export default ImageComponent;
