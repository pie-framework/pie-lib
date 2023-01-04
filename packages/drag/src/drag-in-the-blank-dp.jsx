import { DropTarget } from 'react-dnd';
import { DroppablePlaceholder } from '../lib/droppable-placeholder';

const DRAG_TYPE = 'MaskBlank';

export const spec = {
  canDrop: (props) => {
    return !props.disabled;
  },
  drop: () => ({
    dropped: true,
  }),
};

const WithTarget = DropTarget(DRAG_TYPE, spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(DroppablePlaceholder);

export default WithTarget;
