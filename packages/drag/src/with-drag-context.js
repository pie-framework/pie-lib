import React from 'react';
import { MultiBackend } from 'react-dnd-multi-backend';
import { DndProvider } from 'react-dnd';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';

export default (Component) => (props) => (
  <DndProvider backend={MultiBackend} options={HTML5toTouch} debugMode="true">
    <Component {...props} />
  </DndProvider>
);
