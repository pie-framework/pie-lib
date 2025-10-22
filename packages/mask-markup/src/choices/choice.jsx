import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import classnames from 'classnames';

import { renderMath } from '@pie-lib/math-rendering';
import { color } from '@pie-lib/render-ui';
import { DragSource } from '@pie-lib/drag';

export const DRAG_TYPE = 'MaskBlank';

const StyledChoice = styled('span')(({ theme }) => ({
  border: `solid 0px ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(2),
  margin: theme.spacing(0.5),
  transform: 'translate(0, 0)',
  '&.disabled': {
    opacity: 0.6,
  },
}));

const StyledChip = styled(Chip)(() => ({
  backgroundColor: color.white(),
  border: `1px solid ${color.text()}`,
  color: color.text(),
  alignItems: 'center',
  display: 'inline-flex',
  height: 'initial',
  minHeight: '32px',
  fontSize: 'inherit',
  whiteSpace: 'pre-wrap',
  maxWidth: '374px',
  // Added for touch devices, for image content.
  // This will prevent the context menu from appearing and not allowing other interactions with the image.
  // If interactions with the image in the token will be requested we should handle only the context Menu.
  pointerEvents: 'none',
  borderRadius: '3px',
  paddingTop: '12px',
  paddingBottom: '12px',
}));

const StyledChipLabel = styled('span')(() => ({
  whiteSpace: 'normal',
  '& img': {
    display: 'block',
    padding: '2px 0',
  },
  '& mjx-frac': {
    fontSize: '120% !important',
  },
}));

class BlankContentComp extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    choice: PropTypes.object,
    connectDragSource: PropTypes.func,
  };

  startDrag = () => {
    const { connectDragSource, disabled } = this.props;
    if (!disabled) {
      connectDragSource(this.dragContainerRef);
    }
  };

  // start drag after 500ms (touch and hold duration) for chromebooks and other touch devices PD-4888
  handleTouchStart = (e) => {
    e.preventDefault();
    this.longPressTimer = setTimeout(() => {
      this.startDrag(e);
    }, 500);
  };

  handleTouchEnd = () => {
    clearTimeout(this.longPressTimer);
  };

  handleTouchMove = () => {
    clearTimeout(this.longPressTimer);
  };

  componentDidMount() {
    if (this.dragContainerRef) {
      this.dragContainerRef.addEventListener('touchstart', this.handleTouchStart, { passive: false });
      this.dragContainerRef.addEventListener('touchend', this.handleTouchEnd);
      this.dragContainerRef.addEventListener('touchmove', this.handleTouchMove);
    }
  }

  componentWillUnmount() {
    if (this.dragContainerRef) {
      this.dragContainerRef.removeEventListener('touchstart', this.handleTouchStart);
      this.dragContainerRef.removeEventListener('touchend', this.handleTouchEnd);
      this.dragContainerRef.removeEventListener('touchmove', this.handleTouchMove);
    }
  }

  componentDidUpdate() {
    renderMath(this.rootRef);
  }

  render() {
    const { connectDragSource, choice, disabled } = this.props;

    // TODO the Chip element is causing drag problems on touch devices. Avoid using Chip and consider refactoring the code. Keep in mind that Chip is a span with a button role, which interferes with seamless touch device dragging.

    return connectDragSource(
      <StyledChoice
        className={disabled ? 'disabled' : ''}
        ref={(ref) => {
          //eslint-disable-next-line
          this.dragContainerRef = ReactDOM.findDOMNode(ref);
        }}
      >
        <StyledChip
          clickable={false}
          disabled={true}
          ref={(ref) => {
            //eslint-disable-next-line
            this.rootRef = ReactDOM.findDOMNode(ref);
          }}
          label={
            <StyledChipLabel
              ref={(ref) => {
                if (ref) {
                  ref.innerHTML = choice.value || ' ';
                }
              }}
            >
              {' '}
            </StyledChipLabel>
          }
          variant={disabled ? 'outlined' : undefined}
        />
      </StyledChoice>,
      {},
    );
  }
}

export const BlankContent = BlankContentComp;

const tileSource = {
  canDrag(props) {
    return !props.disabled;
  },
  beginDrag(props) {
    return {
      choice: props.choice,
      instanceId: props.instanceId,
    };
  },
};

const DragDropTile = DragSource(DRAG_TYPE, tileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(BlankContent);

export default DragDropTile;
