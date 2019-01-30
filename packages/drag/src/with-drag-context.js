import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

let context = null;

if (typeof window !== 'undefined') {
  context =
    window.__drag_drop_context_with_html5_backend ||
    DragDropContext(HTML5Backend);
  window.__drag_drop_context_with_html5_backend = context;
}

/**
 * Provides a single point of access for the html5 backend.
 */
export default context;
