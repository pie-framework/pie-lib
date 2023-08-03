import { DropTarget } from 'react-dnd';
import { DroppablePlaceholder } from './droppable-placeholder';
import dragType from './drag-type';

export const spec = {
  canDrop: (props) => {
    return !props.disabled;
  },
  drop: (props, monitor) => {
    const item = monitor.getItem();

    if (props.onRemoveAnswer) {
      props.onRemoveAnswer(item);
    }
  },
};

const WithTarget = DropTarget(dragType.types.ica, spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(DroppablePlaceholder);

export default WithTarget;
