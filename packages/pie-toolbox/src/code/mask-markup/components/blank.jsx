import grey from '@material-ui/core/colors/grey';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { renderMath } from '../../math-rendering';
import debug from 'debug';
import { DragSource, DropTarget } from '../../drag';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import classnames from 'classnames';
import { color } from '../../render-ui';

const log = debug('pie-lib:mask-markup:blank');
export const DRAG_TYPE = 'MaskBlank';

const useStyles = withStyles(() => ({
  content: {
    border: `solid 0px ${color.primary()}`,
    minWidth: '200px',
    touchAction: 'none',
    overflow: 'hidden',
    whiteSpace: 'nowrap', // Prevent line wrapping
  },
  chip: {
    backgroundColor: color.background(),
    border: `2px dashed ${color.text()}`,
    color: color.text(),
    fontSize: 'inherit',
    maxWidth: '374px',
    position: 'relative',
    borderRadius: '3px',
  },
  chipLabel: {
    whiteSpace: 'normal',
    // Added for touch devices, for image content.
    // This will prevent the context menu from appearing and not allowing other interactions with the image.
    // If interactions with the image in the token will be requested we should handle only the context Menu.
    pointerEvents: 'none',
    '& img': {
      display: 'block',
      padding: '2px 0',
    },
    // Remove default <p> margins to ensure consistent spacing across all wrapped content (p, span, div, math)
    // Padding for top and bottom will instead be controlled by the container for consistent layout
    // Ensures consistent behavior with pie-api-browser, where marginTop is already removed by a Bootstrap stylesheet
    '& p': {
      marginTop: '0',
      marginBottom: '0',
    },
    '& mjx-frac': {
      fontSize: '120% !important',
    },
  },
  hidden: {
    color: 'transparent',
    opacity: 0,
  },
  dragged: {
    position: 'absolute',
    left: 16,
    maxWidth: '60px',
  },
  correct: {
    border: `solid 1px ${color.correct()}`,
  },
  incorrect: {
    border: `solid 1px ${color.incorrect()}`,
  },
  over: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  parentOver: {
    border: `1px solid ${grey[500]}`,
    backgroundColor: `${grey[300]}`,
  },
}));

export class BlankContent extends React.Component {
  constructor() {
    super();
    this.state = {
      height: 0,
      width: 0,
    };
  }

  handleImageLoad = () => {
    this.updateDimensions();
  };

  handleElements() {
    const imageElement = this.spanRef?.querySelector('img');

    if (imageElement) {
      imageElement.onload = this.handleImageLoad;
    } else {
      setTimeout(() => {
        this.updateDimensions();
      }, 300);
    }
  }

  componentDidMount() {
    this.handleElements();
    if (this.rootRef) {
      this.rootRef.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    }
  }

  componentDidUpdate(prevProps) {
    renderMath(this.rootRef);
    const { choice: currentChoice } = this.props;
    const { choice: prevChoice } = prevProps;

    if (JSON.stringify(currentChoice) !== JSON.stringify(prevChoice)) {
      if (!currentChoice) {
        this.setState({
          height: 0,
          width: 0,
        });
        return;
      }
      this.handleElements();
    }
  }

  componentWillUnmount() {
    if (this.rootRef) {
      this.rootRef.removeEventListener('touchstart', this.handleTouchStart);
    }
  }

  handleTouchStart = (e) => {
    e.preventDefault();
    this.touchStartTimer = setTimeout(() => {
      this.startDrag();
    }, 300); // Start drag after 300ms (touch and hold duration)
  };

  startDrag = () => {
    const { connectDragSource, disabled } = this.props;
    if (!disabled) {
      connectDragSource(this.rootRef);
    }
  };

  updateDimensions() {
    if (this.spanRef && this.rootRef) {
      // Temporarily set rootRef width to 'auto' for natural measurement
      this.rootRef.style.width = 'auto';

      // Get the natural dimensions of the content
      const width = this.spanRef.offsetWidth || 0;
      const height = this.spanRef.offsetHeight || 0;

      const widthWithPadding = width + 24; // 12px padding on each side
      const heightWithPadding = height + 24; // 12px padding on top and bottom

      const responseAreaWidth = parseFloat(this.props.emptyResponseAreaWidth) || 0;
      const responseAreaHeight = parseFloat(this.props.emptyResponseAreaHeight) || 0;

      const adjustedWidth = widthWithPadding <= responseAreaWidth ? responseAreaWidth : widthWithPadding;
      const adjustedHeight = heightWithPadding <= responseAreaHeight ? responseAreaHeight : heightWithPadding;

      this.setState((prevState) => ({
        width: adjustedWidth > responseAreaWidth ? adjustedWidth : prevState.width,
        height: adjustedHeight > responseAreaHeight ? adjustedHeight : prevState.height,
      }));

      this.rootRef.style.width = `${adjustedWidth}px`;
      this.rootRef.style.height = `${adjustedHeight}px`;
    }
  }

  addDraggableFalseAttributes(parent) {
    parent.childNodes.forEach((elem) => {
      if (elem instanceof Element || elem instanceof HTMLDocument) {
        elem.setAttribute('draggable', false);
      }
    });
  }

  getRootDimensions() {
    // Handle potential non-numeric values
    const responseAreaWidth = !isNaN(parseFloat(this.props.emptyResponseAreaWidth))
      ? parseFloat(this.props.emptyResponseAreaWidth)
      : 0;
    const responseAreaHeight = !isNaN(parseFloat(this.props.emptyResponseAreaHeight))
      ? parseFloat(this.props.emptyResponseAreaHeight)
      : 0;

    const rootStyle = {
      height: this.state.height || responseAreaHeight,
      width: this.state.width || responseAreaWidth,
    };

    // add minWidth, minHeight if width and height are not defined
    // minWidth, minHeight will be also in model in the future
    return {
      ...rootStyle,
      ...(responseAreaWidth ? {} : { minWidth: 90 }),
      ...(responseAreaHeight ? {} : { minHeight: 32 }),
    };
  }

  render() {
    const { disabled, choice, classes, isOver, dragItem, correct } = this.props;
    const draggedLabel = dragItem && isOver && dragItem.choice.value;
    const label = choice && choice.value;

    return (
      // TODO the Chip element is causing drag problems on touch devices. Avoid using Chip and consider refactoring the code. Keep in mind that Chip is a span with a button role, which interferes with seamless touch device dragging.
      <Chip
        clickable={false}
        disabled={true}
        ref={(ref) => {
          //eslint-disable-next-line
          this.rootRef = ReactDOM.findDOMNode(ref);
        }}
        component="span"
        label={
          <React.Fragment>
            <span
              className={classnames(classes.chipLabel, isOver && classes.over, {
                [classes.hidden]: draggedLabel,
              })}
              ref={(ref) => {
                if (ref) {
                  //eslint-disable-next-line
                  this.spanRef = ReactDOM.findDOMNode(ref);
                  ref.innerHTML = label || '';
                  this.addDraggableFalseAttributes(ref);
                }
              }}
            >
              {' '}
            </span>
            {draggedLabel && (
              <span
                className={classnames(classes.chipLabel, isOver && classes.over, classes.dragged)}
                ref={(ref) => {
                  if (ref) {
                    //eslint-disable-next-line
                    this.spanRef = ReactDOM.findDOMNode(ref);
                    ref.innerHTML = draggedLabel || '';
                    this.addDraggableFalseAttributes(ref);
                  }
                }}
              >
                {' '}
              </span>
            )}
          </React.Fragment>
        }
        className={classnames(classes.chip, isOver && classes.over, isOver && classes.parentOver, {
          [classes.correct]: correct !== undefined && correct,
          [classes.incorrect]: correct !== undefined && !correct,
        })}
        variant={disabled ? 'outlined' : undefined}
        style={{
          ...this.getRootDimensions(),
        }}
      />
    );
  }
}

BlankContent.defaultProps = {
  emptyResponseAreaWidth: 0,
  emptyResponseAreaHeight: 0,
};

BlankContent.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  duplicates: PropTypes.bool,
  choice: PropTypes.object,
  classes: PropTypes.object,
  isOver: PropTypes.bool,
  dragItem: PropTypes.object,
  correct: PropTypes.bool,
  onChange: PropTypes.func,
  emptyResponseAreaWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  emptyResponseAreaHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const StyledBlankContent = useStyles(BlankContent);

const connectedBlankContent = useStyles(({ connectDragSource, connectDropTarget, ...props }) => {
  const { classes, isOver } = props;

  return connectDropTarget(
    connectDragSource(
      <span className={classnames(classes.content, isOver && classes.over)}>
        <StyledBlankContent {...props} />
      </span>,
    ),
  );
});

const tileTarget = {
  drop(props, monitor) {
    const draggedItem = monitor.getItem();

    log('props.instanceId', props.instanceId, 'draggedItem.instanceId:', draggedItem.instanceId);

    if (draggedItem.id !== props.id) {
      props.onChange(props.id, draggedItem.choice.id);
    }

    return {
      dropped: draggedItem.id !== props.id,
    };
  },
  canDrop(props, monitor) {
    const draggedItem = monitor.getItem();

    return draggedItem.instanceId === props.instanceId;
  },
};

const DropTile = DropTarget(DRAG_TYPE, tileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  dragItem: monitor.getItem(),
}))(connectedBlankContent);

const tileSource = {
  canDrag(props) {
    return !props.disabled && !!props.choice;
  },
  beginDrag(props) {
    return {
      id: props.id,
      choice: props.choice,
      instanceId: props.instanceId,
      fromChoice: true,
    };
  },
  endDrag(props, monitor) {
    // this will be null if it did not drop
    const dropResult = monitor.getDropResult();

    if (!dropResult || dropResult.dropped) {
      const draggedItem = monitor.getItem();

      if (draggedItem.fromChoice) {
        props.onChange(props.id, undefined);
      }
    }
  },
};

const DragDropTile = DragSource(DRAG_TYPE, tileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(DropTile);

export default DragDropTile;
