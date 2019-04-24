import React from 'react';
import debug from 'debug';
import { DropTarget } from '@pie-lib/drag';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import classnames from 'classnames';
const log = debug('pie-lib:mask-markup:blank');
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
  const { disabled, value, classes, isOver, dragItem, correct, connectDropTarget } = props;

  const label = dragItem && isOver ? dragItem.value : value;
  return connectDropTarget(
    <span className={classnames(classes.content, isOver && classes.over)}>
      <Chip
        component="span"
        label={label}
        className={classnames(
          classes.chip,
          classes[correct !== undefined ? (correct ? 'correct' : 'incorrect') : undefined]
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

// export default () => <div>hi</div>;
export default DropTile;
