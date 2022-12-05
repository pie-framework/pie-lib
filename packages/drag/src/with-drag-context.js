import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { DndProvider } from 'react-dnd';

// https://github.com/react-dnd/react-dnd/issues/3257
export default (Component) => (props) => (
  <DndProvider backend={HTML5Backend} context={window}>
    <Component {...props} />
  </DndProvider>
);
