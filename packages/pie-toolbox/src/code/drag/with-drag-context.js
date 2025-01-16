import React from 'react';
import MultiBackend, { TouchTransition, MouseTransition } from 'react-dnd-multi-backend';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';

import PreviewComponent from './preview-component';

const backends = [
  {
    backend: HTML5Backend,
    transition: MouseTransition,
  },
  {
    backend: TouchBackend,
    options: { enableMouseEvents: true, enableTouchEvents: true },
    preview: false,
    transition: TouchTransition,
    skipDispatchOnTransition: false,
  },
];

export default (Component) => (props) => (
  <DndProvider backend={MultiBackend} options={{ backends }} context={window}>
    <Component {...props} />
    <PreviewComponent />
  </DndProvider>
);
