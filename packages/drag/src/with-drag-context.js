import React from 'react';
import MultiBackend from 'react-dnd-multi-backend';
import { DndProvider } from 'react-dnd';
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch';

export default (Component) => (props) => (
  <DndProvider backend={MultiBackend} options={HTML5toTouch} debugMode="true">
    <div>Drag and Drop</div>
    <Component {...props} />
  </DndProvider>
);
