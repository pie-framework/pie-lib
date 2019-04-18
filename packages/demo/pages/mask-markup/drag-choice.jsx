import React from 'react';
import debug from 'debug';
import { DragSource, DropTarget } from 'react-dnd';
import { withDragContext } from '@pie-lib/drag';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
const log = debug('pie-lib:mask-markup:drag-blank');

export const DRAG_TYPE = 'MaskBlank';

const BlankContent = withStyles(theme => ({
  choice: {
    border: `solid 0px ${theme.palette.primary.main}`
  }
}))(props => {
  const { connectDragSource, connectDropTarget, classes } = props;
  return connectDragSource(
    <span className={classes.choice}>
      <Chip label={props.value} />
    </span>,
    {}
  );
});

const tileSource = {
  canDrag(props) {
    return !props.disabled;
  },
  beginDrag(props) {
    return {
      id: props.targetId,
      value: props.value,
      instanceId: props.instanceId
    };
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      if (props.type === 'target') {
        props.onRemoveChoice(monitor.getItem());
      }
    }
  }
};

const DragDropTile = DragSource(DRAG_TYPE, tileSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(BlankContent);

export default DragDropTile;
