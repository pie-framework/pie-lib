import Draggable, { DraggableCore } from 'react-draggable';

/**
 * This used to subclass Draggable to zero its internal x/y drag offset on every prop
 * change. react-draggable v4 moved that position sync to a static getDerivedStateFromProps,
 * which React prefers over the legacy componentWillReceiveProps, so the override stopped
 * running. Nothing imports this Draggable - the drag handles all go through
 * gridDraggable/DraggableCore - so it is re-exported unchanged rather than reworked.
 */
export default Draggable;

export { DraggableCore };
