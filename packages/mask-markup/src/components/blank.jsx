import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { renderMath } from '@pie-lib/math-rendering';
import debug from 'debug';
import { DragSource, DropTarget } from '@pie-lib/drag';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import classnames from 'classnames';
const log = debug('pie-lib:mask-markup:blank');
export const DRAG_TYPE = 'MaskBlank';

const useStyles = withStyles(theme => ({
  content: {
    border: `solid 0px ${theme.palette.primary.main}`,
    minWidth: '200px'
  },
  chip: {
    minWidth: '90px'
  },
  correct: {
    border: 'solid 1px green'
  },
  incorrect: {
    border: 'solid 1px red'
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

  componentDidUpdate() {
    renderMath(this.rootRef);
  }

  render() {
    const { disabled, choice, classes, isOver, dragItem, correct } = this.props;
    const label = dragItem && isOver ? dragItem.choice.value : choice && choice.value;

    return (
      <Chip
        ref={ref => {
          //eslint-disable-next-line
          this.rootRef = ReactDOM.findDOMNode(ref);
        }}
        component="span"
        label={
          <span
            ref={ref => {
              if (ref) {
                ref.innerHTML = label || '';
              }
            }}
          />
        }
        className={classnames(classes.chip, {
          [classes.correct]: correct !== undefined && correct,
          [classes.incorrect]: correct !== undefined && !correct
        })}
        variant={disabled ? 'outlined' : undefined}
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
