import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const out = DragDropContext(HTML5Backend);

/**
 * Provides a single point of access for the html5 backend.
 */
export default out;
