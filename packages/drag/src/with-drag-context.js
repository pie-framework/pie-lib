import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import { DndProvider } from 'react-dnd';

const isTouchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

// https://github.com/react-dnd/react-dnd/issues/3257
export default (Component) => (props) => (
  <DndProvider backend={isTouchEnabled ? TouchBackend : HTML5Backend} context={window}>
    <Component {...props} />
  </DndProvider>
);
