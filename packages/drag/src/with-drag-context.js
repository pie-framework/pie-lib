import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const out = window && window.__drag_drop_context_with_html5_backend || DragDropContext(HTML5Backend);

if (window) {
  window.__drag_drop_context_with_html5_backend = out;
}

/**
 * Provides a single point of access for the html5 backend.
 */
export default out;
