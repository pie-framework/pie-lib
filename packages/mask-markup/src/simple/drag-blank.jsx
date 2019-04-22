import React from 'react';
import debug from 'debug';
import { DropTarget, DragDropContext } from 'react-dnd';
// import { withDragContext } from '@pie-lib/drag';
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import classnames from 'classnames';
const log = debug('pie-lib:mask-markup:drag-blank');

export const DRAG_TYPE = 'MaskBlank';

const BlankContent = withStyles(theme => ({
  content: {
    border: `solid 0px ${theme.palette.primary.main}`,
    minWidth: '200px',
    padding: theme.spacing.unit
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
}))(props => {
  const { disabled, value, connectDropTarget, classes, isOver, dragItem, correct } = props;

  const label = dragItem && isOver ? dragItem.value : value;
  return connectDropTarget(
    <span className={classnames(classes.content, isOver && classes.over)}>
      <Chip
        label={label}
        className={classnames(
          classes.chip,
          classes[correct !== undefined ? (correct ? 'correct' : 'incorrect') : undefined],
          disabled && classes.chipDisabled
        )}
        variant={disabled ? 'outlined' : undefined}
        onDelete={value && !disabled ? () => props.onChange(props.id, undefined) : undefined}
      />
    </span>
  );
});

const tileTarget = {
  drop(props, monitor) {
    const draggedItem = monitor.getItem();
    log('props.instanceId', props.instanceId, 'draggedItem.instanceId:', draggedItem.instanceId);
    props.onChange(props.id, draggedItem.value);
  },
  canDrop(props, monitor) {
    const draggedItem = monitor.getItem();
    const canDrop = draggedItem.instanceId === props.instanceId;
    return canDrop;
  }
};

const DropTile = DropTarget(DRAG_TYPE, tileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  dragItem: monitor.getItem()
}))(BlankContent);

const withDragContext = Comp => DragDropContext(MultiBackend(HTML5toTouch))(Comp);

export default withDragContext(DropTile);
