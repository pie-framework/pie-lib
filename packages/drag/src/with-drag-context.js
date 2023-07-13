import React from 'react';
import MultiBackend, { TouchTransition, Preview } from 'react-dnd-multi-backend';
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
      preview: true,
      transition: TouchTransition,
      skipDispatchOnTransition: true,
    },
  ],
};

const PreviewComponent = ({ itemType, item, style }) => {
  console.log('itemType:', itemType);
  console.log('style:', style);
  // Default style
  let customStyle = { ...style };

  // Additional style if itemType is 'blank'
  if (itemType === 'MaskBlank') {
    customStyle = {
      ...customStyle,
      border: '1px solid black',
      color: 'black',
      minWidth: '90px',
      minHeight: '32px',
      height: 'auto',
      maxWidth: '374px',
      display: 'flex',
      padding: '4px',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '16px',
    };
  }

  return <div style={customStyle} dangerouslySetInnerHTML={{ __html: item.choice.value }} />;
};

export default (Component) => (props) => (
  <DndProvider backend={MultiBackend} options={HTML5toTouch} context={window}>
    <Component {...props} />
    <Preview generator={PreviewComponent} {...props} />
  </DndProvider>
);
