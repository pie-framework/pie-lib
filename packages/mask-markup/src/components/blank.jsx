import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { renderMath } from '@pie-lib/math-rendering';
import debug from 'debug';
import { DragSource, DropTarget } from '@pie-lib/drag';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import classnames from 'classnames';
import { color } from '@pie-lib/render-ui';
const log = debug('pie-lib:mask-markup:blank');
export const DRAG_TYPE = 'MaskBlank';

const useStyles = withStyles(() => ({
  content: {
    border: `solid 0px ${color.primary()}`,
    minWidth: '200px'
  },
  chip: {
    minWidth: '90px',
    fontSize: 'inherit',
    minHeight: '32px',
    maxWidth: '374px',
    position: 'relative'
  },
  chipLabel: {
    whiteSpace: 'pre-wrap',
    '& img': {
      display: 'block',
      padding: '2px 0'
    }
  },
  hidden: {
    color: 'transparent',
    opacity: 0
  },
  dragged: {
    position: 'absolute',
    left: 14,
    maxWidth: '60px'
  },
  correct: {
    border: `solid 1px ${color.correct()}`
  },
  incorrect: {
    border: `solid 1px ${color.incorrect()}`
  },
  over: {
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
}));

export class BlankContent extends React.Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    duplicates: PropTypes.bool,
    choice: PropTypes.object,
    classes: PropTypes.object,
    isOver: PropTypes.bool,
    dragItem: PropTypes.object,
    correct: PropTypes.bool,
    onChange: PropTypes.func
  };

  constructor() {
    super();
    this.state = {
      height: 0
    };
  }

  componentDidUpdate(prevProps) {
    renderMath(this.rootRef);
    const { choice: currentChoice } = this.props;
    const { choice: prevChoice } = prevProps;

    if (JSON.stringify(currentChoice) !== JSON.stringify(prevChoice)) {
      if (!currentChoice) {
        this.setState({
          height: 0
        });
        return;
      }
      setTimeout(() => {
        this.setState({
          height: this.spanRef.offsetHeight
        });
      }, 300);
    }
  }

  addDraggableFalseAttributes(parent) {
    parent.childNodes.forEach(elem => {
      if (elem instanceof Element || elem instanceof HTMLDocument) {
        elem.setAttribute('draggable', false);
      }
    });
  }

  render() {
    const { disabled, choice, classes, isOver, dragItem, correct } = this.props;
    const draggedLabel = dragItem && isOver && dragItem.choice.value;
    const label = choice && choice.value;

    return (
      <Chip
        ref={ref => {
          //eslint-disable-next-line
          this.rootRef = ReactDOM.findDOMNode(ref);
        }}
        component="span"
        label={
          <React.Fragment>
            <span
              className={classnames(classes.chipLabel, isOver && classes.over, {
                [classes.hidden]: draggedLabel
              })}
              ref={ref => {
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
                ref={ref => {
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
        className={classnames(classes.chip, isOver && classes.over, {
          [classes.correct]: correct !== undefined && correct,
          [classes.incorrect]: correct !== undefined && !correct
        })}
        variant={disabled ? 'outlined' : undefined}
        style={{
          ...(this.state.height ? { height: this.state.height } : {})
        }}
        classes={{
          label: isOver && classes.over
        }}
      />
    );
  }
}

const StyledBlankContent = useStyles(BlankContent);

const connectedBlankContent = useStyles(({ connectDragSource, connectDropTarget, ...props }) => {
  const { classes, isOver } = props;

  return connectDropTarget(
    connectDragSource(
      <span className={classnames(classes.content, isOver && classes.over)}>
        <StyledBlankContent {...props} />
      </span>
    )
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
      dropped: draggedItem.id !== props.id
    };
  },
  canDrop(props, monitor) {
    const draggedItem = monitor.getItem();

    return draggedItem.instanceId === props.instanceId;
  }
};

const DropTile = DropTarget(DRAG_TYPE, tileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  dragItem: monitor.getItem()
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
      fromChoice: true
    };
  },
  endDrag(props, monitor) {
    // this will be null if it did not drop
    const dropResult = monitor.getDropResult();

    if (!dropResult || (dropResult.dropped && !props.duplicates)) {
      const draggedItem = monitor.getItem();

      if (draggedItem.fromChoice) {
        props.onChange(props.id, undefined);
      }
    }
  }
};

const DragDropTile = DragSource(DRAG_TYPE, tileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(DropTile);

export default DragDropTile;
