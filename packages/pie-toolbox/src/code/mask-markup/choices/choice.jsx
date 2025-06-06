import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import classnames from 'classnames';

import { renderMath } from '../../math-rendering';
import { color } from '../../render-ui';
import { DragSource } from '../../drag';

export const DRAG_TYPE = 'MaskBlank';

class BlankContentComp extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    choice: PropTypes.object,
    classes: PropTypes.object,
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
    const { connectDragSource, choice, classes, disabled } = this.props;

    // TODO the Chip element is causing drag problems on touch devices. Avoid using Chip and consider refactoring the code. Keep in mind that Chip is a span with a button role, which interferes with seamless touch device dragging.

    return connectDragSource(
      <span
        className={classnames(classes.choice, disabled && classes.disabled)}
        ref={(ref) => {
          //eslint-disable-next-line
          this.dragContainerRef = ReactDOM.findDOMNode(ref);
        }}
      >
        <Chip
          clickable={false}
          disabled={true}
          ref={(ref) => {
            //eslint-disable-next-line
            this.rootRef = ReactDOM.findDOMNode(ref);
          }}
          className={classes.chip}
          label={
            <span
              className={classes.chipLabel}
              ref={(ref) => {
                if (ref) {
                  ref.innerHTML = choice.value || ' ';
                }
              }}
            >
              {' '}
            </span>
          }
          variant={disabled ? 'outlined' : undefined}
        />
      </span>,
      {},
    );
  }
}

export const BlankContent = withStyles((theme) => ({
  choice: {
    border: `solid 0px ${theme.palette.primary.main}`,
    borderRadius: theme.spacing.unit * 2,
    margin: theme.spacing.unit / 2,
    transform: 'translate(0, 0)',
  },
  chip: {
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
  },
  chipLabel: {
    whiteSpace: 'normal',
    '& img': {
      display: 'block',
      padding: '2px 0',
    },
    '& mjx-frac': {
      fontSize: '120% !important',
    },
  },
  disabled: {
    opacity: 0.6,
  },
}))(BlankContentComp);

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
