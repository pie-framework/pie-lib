import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import debug from 'debug';
import { styled } from '@mui/material/styles';
import SlatePropTypes from 'slate-prop-types';

const log = debug('@pie-lib:editable-html:plugins:image:component');

const size = (s) => (s ? `${s}px` : 'auto');

const StyledImageRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  border: `solid 1px ${theme.palette.common.white}`,
  display: 'flex',
  transition: 'opacity 200ms linear',
  '&.loading': {
    opacity: 0.3,
  },
  '&.pendingDelete': {
    opacity: 0.3,
  },
}));

const StyledProgress = styled(LinearProgress)(() => ({
  position: 'absolute',
  left: '0',
  width: 'fit-content',
  top: '0%',
  transition: 'opacity 200ms linear',
  '&.hideProgress': {
    opacity: 0,
  },
}));

const StyledImageContainer = styled('div')(() => ({
  position: 'relative',
  width: 'fit-content',
  display: 'flex',
  alignItems: 'center',
  '&&:hover > .resize': {
    display: 'block',
  },
}));

const StyledImage = styled('img')(({ theme }) => ({
  '&.active': {
    border: `solid 1px ${theme.palette.primary.main}`,
  },
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

export class Component extends React.Component {
  static propTypes = {
    node: SlatePropTypes.node.isRequired,
    editor: PropTypes.shape({
      change: PropTypes.func.isRequired,
      value: PropTypes.object,
    }).isRequired,
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

    let update = node.data;

    const w = update.get('width');
    if (w) {
      update = update.set('resizePercent', this.getPercentFromWidth(w));
    }

    log('[applySizeData] update: ', update);

    if (!update.equals(node.data)) {
      editor.change((c) => c.setNodeByKey(node.key, { data: update }));
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
      width: size(data.get('width')),
      height: size(data.get('height')),
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

      let update = node.data;

      update = update.set('width', width);
      update = update.set('height', height);

      if (!update.equals(node.data)) {
        editor.change((c) => c.setNodeByKey(node.key, { data: update }));
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
    const { node, editor, attributes, onFocus } = this.props;
    const active = editor.value.isFocused && editor.value.selection.hasEdgeIn(node);
    const src = node.data.get('src');
    const loaded = node.data.get('loaded') !== false;
    const deleteStatus = node.data.get('deleteStatus');
    const alignment = node.data.get('alignment');
    const percent = node.data.get('percent');
    const alt = node.data.get('alt');
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

    const className = classNames(
      !loaded && 'loading',
      deleteStatus === 'pending' && 'pendingDelete',
    );

    const progressClasses = classNames(loaded && 'hideProgress');

    return [
      <span key={'sp1'}>&nbsp;</span>,
      <StyledImageRoot key={'comp'} onFocus={onFocus} className={className} style={{ justifyContent }}>
        <StyledProgress mode="determinate" value={percent > 0 ? percent : 0} className={progressClasses} />
        <StyledImageContainer>
          <StyledImage
            {...attributes}
            className={classNames(active && 'active')}
            ref={(ref) => {
              this.img = ref;
            }}
            src={src}
            style={size}
            onLoad={this.loadImage}
            alt={alt}
          />
          <StyledResize
            ref={(ref) => {
              this.resize = ref;
            }}
            className="resize"
          />
        </StyledImageContainer>
      </StyledImageRoot>,
      <span key={'sp2'}>&nbsp;</span>,
    ];
  }
}

export default Component;
