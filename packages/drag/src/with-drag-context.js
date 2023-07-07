import React from 'react';
import MultiBackend, { TouchTransition } from 'react-dnd-multi-backend';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';

const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend,
    },
    {
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      // preview: true,
      transition: TouchTransition,
      skipDispatchOnTransition: true,
    },
  ],
};

export default (Component) => (props) => (
  <DndProvider backend={MultiBackend} options={HTML5toTouch} context={window}>
    <Component {...props} />
  </DndProvider>
);
