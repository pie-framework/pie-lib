import React from 'react';
import MultiBackend, { TouchTransition } from 'react-dnd-multi-backend';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';

console.log('HTML5Backend:', HTML5Backend);
console.log('TouchBackend:', TouchBackend);

const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend,
      transition: TouchTransition,
    },
    {
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

export default (Component) => (props) => (
  <DndProvider backend={MultiBackend} options={HTML5toTouch} context={window}>
    <Component {...props} />
  </DndProvider>
);
