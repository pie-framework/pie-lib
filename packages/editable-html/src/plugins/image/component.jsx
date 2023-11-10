import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debug from 'debug';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { Editor } from 'slate';

const log = debug('@pie-lib:editable-html:plugins:image:component');

const size = (s) => (s ? `${s}px` : 'auto');

export class Component extends React.Component {
  static propTypes = {
    node: PropTypes.shape({
      type: PropTypes.string,
      children: PropTypes.array,
      data: PropTypes.object,
    }).isRequired,
    focused: PropTypes.bool,
    editor: PropTypes.shape({
      change: PropTypes.func.isRequired,
      value: PropTypes.object,
    }).isRequired,
    classes: PropTypes.object.isRequired,
    attributes: PropTypes.object,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    maxImageWidth: PropTypes.number,
    maxImageHeight: PropTypes.number,
  };

  getWidth = (percent) => {
    const multiplier = percent / 100;
    return this.img.naturalWidth * multiplier;
  };

  getHeight = (percent) => {
    const multiplier = percent / 100;
    return this.img.naturalHeight * multiplier;
  };

  getPercentFromWidth = (width) => {
    var floored = (width / this.img.naturalWidth) * 4;
    return parseInt(floored.toFixed(0) * 25, 10);
  };

  applySizeData = () => {
    const { node, editor } = this.props;

    let update = cloneDeep(node.data);

    const w = update.width;

    if (w) {
      update = update.resizePercent = this.getPercentFromWidth(w);
    }

    log('[applySizeData] update: ', update);

    if (editor.selection && !isEqual(update, node.data)) {
      const nodePath = Editor.path(editor, editor.selection);

      editor.apply({
        type: 'set_node',
        path: nodePath,
        properties: {
          data: node.data,
        },
        newProperties: { data: update },
      });
    }
  };

  initialiseResize = () => {
    window.addEventListener('mousemove', this.startResizing, false);
    window.addEventListener('mouseup', this.stopResizing, false);
  };

  componentDidMount() {
    this.applySizeData();

    const resizeHandle = this.resize;

    if (resizeHandle) {
      resizeHandle.addEventListener('mousedown', this.initialiseResize, false);
    }
  }

  componentDidUpdate() {
    this.applySizeData();
  }

  getSize(data) {
    return {
      width: size(data.width),
      height: size(data.height),
      objectFit: 'contain',
    };
  }

  loadImage = () => {
    let { maxImageWidth, maxImageHeight } = this.props || {};
    maxImageWidth = maxImageWidth || 700;
    maxImageHeight = maxImageHeight || 900;

    const box = this.img;

    //on first load
    if (!box.style.width || box.style.width === 'auto') {
      const dimensions = {
        width: (box && box.naturalWidth) || 100,
        height: (box && box.naturalHeight) || 100,
      };

      const { width, height } = this.updateImageDimensions(
        dimensions,
        {
          width: dimensions.width < maxImageWidth ? dimensions.width : maxImageWidth,
          height: dimensions.height < maxImageHeight ? dimensions.height : maxImageHeight,
        },
        true,
      );

      box.style.width = `${width}px`;
      box.style.height = `${height}px`;

      this.setState({
        dimensions: { height: height, width: width },
      });

      const { node, editor } = this.props;

      const update = cloneDeep(node.data);

      update.width = width;
      update.height = height;

      if (editor.selection && !isEqual(update, node.data)) {
        const nodePath = Editor.path(editor, editor.selection);

        editor.apply({
          type: 'set_node',
          path: nodePath,
          properties: {
            data: node.data,
          },
          newProperties: { data: update },
        });
      }
    }
  };

  startResizing = (e) => {
    const bounds = e.target.getBoundingClientRect();
    const box = this.img;
    const dimensions = {
      width: (box && box.naturalWidth) || 100,
      height: (box && box.naturalHeight) || 100,
    };

    const { width, height } = this.updateImageDimensions(
      dimensions,
      {
        width: e.clientX - bounds.left,
        height: e.clientY - bounds.top,
      },
      true,
    );

    const hasMinimumWidth = width > 50 && height > 50;
    const hasDimensionsConstraints = width <= 700 && height <= 900;

    if (hasMinimumWidth && hasDimensionsConstraints && box) {
      box.style.width = `${width}px`;
      box.style.height = `${height}px`;

      this.setState({
        dimensions: { height: height, width: width },
      });

      const { node, editor } = this.props;

      let update = node.data;

      update = update.set('width', width);
      update = update.set('height', height);

      if (!update.equals(node.data)) {
        editor.change((c) => c.setNodeByKey(node.key, { data: update }));
      }
    }
  };

  stopResizing = () => {
    window.removeEventListener('mousemove', this.startResizing, false);
    window.removeEventListener('mouseup', this.stopResizing, false);
  };

  updateImageDimensions = (initialDim, nextDim, keepAspectRatio, resizeType) => {
    // if we want to keep image aspect ratio
    if (keepAspectRatio) {
      const imageAspectRatio = initialDim.width / initialDim.height;

      if (resizeType === 'height') {
        // if we want to change image height => we update the width accordingly
        return {
          width: nextDim.height * imageAspectRatio,
          height: nextDim.height,
        };
      }

      // if we want to change image width => we update the height accordingly
      return {
        width: nextDim.width,
        height: nextDim.width / imageAspectRatio,
      };
    }

    // if we don't want to keep aspect ratio, we just update both values
    return {
      width: nextDim.width,
      height: nextDim.height,
    };
  };

  render() {
    const { node, focused, classes, attributes, children, onFocus } = this.props;
    const active = focused;
    const { alignment, alt, deleteStatus, loaded, percent, src } = node.data;
    const isLoaded = loaded !== false;
    let justifyContent;

    switch (alignment) {
      case 'left':
        justifyContent = 'flex-start';
        break;

      case 'center':
        justifyContent = 'center';
        break;

      case 'right':
        justifyContent = 'flex-end';
        break;

      default:
        justifyContent = 'flex-start';
        break;
    }
    log('[render] node.data:', node.data);

    const size = this.getSize(node.data);

    log('[render] style:', size);

    const className = classNames(classes.root, {
      [classes.loading]: !isLoaded,
      [classes.pendingDelete]: deleteStatus === 'pending',
    });

    const progressClasses = classNames(classes.progress, {
      [classes.hideProgress]: isLoaded,
    });

    return (
      <div onFocus={onFocus} className={className} style={{ justifyContent }} {...attributes}>
        {children}
        <LinearProgress mode="determinate" value={percent > 0 ? percent : 0} className={progressClasses} />
        <div className={classes.imageContainer}>
          <img
            className={classNames(classes.image, { [classes.active]: active })}
            ref={(ref) => {
              this.img = ref;
            }}
            src={src}
            style={size}
            onLoad={this.loadImage}
            alt={alt}
          />
          <div
            ref={(ref) => {
              this.resize = ref;
            }}
            className={classNames(classes.resize, 'resize')}
          />
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
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
    width: '100%',
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
});

export default withStyles(styles)(Component);
