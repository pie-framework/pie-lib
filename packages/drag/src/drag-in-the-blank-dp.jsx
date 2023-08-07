import { DropTarget } from 'react-dnd';
import { DroppablePlaceholder } from '../lib/droppable-placeholder';
import dragType from './drag-type';

export const spec = {
  canDrop: (props) => {
    return !props.disabled;
  },
  drop: () => ({
    dropped: true,
  }),
};

const WithTarget = DropTarget(dragType.types.db, spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(DroppablePlaceholder);

export default WithTarget;
