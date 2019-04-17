import React from 'react';
import debug from 'debug';
import { DragSource, DropTarget } from 'react-dnd';
const log = debug('pie-lib:mask-markup:drag-blank');

export const DRAG_TYPE = 'MaskBlank';

const BlankContent = props => {
  const { connectDragSource, connectDropTarget } = props;

  return connectDragSource(connectDropTarget(<div className={name}>DRAGGGGG</div>), {});
};

const tileTarget = {
  drop(props, monitor) {
    const draggedItem = monitor.getItem();
    log('props.instanceId', props.instanceId, 'draggedItem.instanceId:', draggedItem.instanceId);
    if (draggedItem.instanceId === props.instanceId) {
      props.onDropChoice(draggedItem, props.index);
    }
  },
  canDrop(props, monitor) {
    const draggedItem = monitor.getItem();
    const canDrop = draggedItem.instanceId === props.instanceId;
    return canDrop;
  }
};

const DropTile = DropTarget(DRAG_TYPE, tileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))(BlankContent);

const tileSource = {
  canDrag(props) {
    return props.draggable && !props.disabled;
  },
  beginDrag(props) {
    return {
      id: props.id,
      type: props.type,
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
}))(DropTile);

export default DragDropTile;

// const DragBlank = props => <span>{props.value}</span>;

// export default DragBlank;
