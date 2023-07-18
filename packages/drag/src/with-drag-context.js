import React, { useEffect, useRef } from 'react';
import MultiBackend, { TouchTransition, usePreview } from 'react-dnd-multi-backend';
import { PreviewPrompt } from '@pie-lib/render-ui';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { renderMath } from '@pie-lib/math-rendering';

const backends = [
  { backend: HTML5Backend },
  {
    backend: TouchBackend,
    options: { enableMouseEvents: true },
    preview: true,
    transition: TouchTransition,
    skipDispatchOnTransition: true,
  },
];

const MaskBlankStyle = {
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

const PreviewComponent = () => {
  let root = useRef(null);
  const preview = usePreview();

  useEffect(() => {
    if (preview?.display && root.current) {
      renderMath(root.current);
    }
  }, [preview?.display, preview?.item?.choice?.value]);

  if (!preview.display) {
    return null;
  }

  const { itemType, item, style } = preview;
  const customStyle = {
    ...style,
    ...(itemType === 'MaskBlank' ? MaskBlankStyle : {}),
  };

  return (
    <div ref={root} style={customStyle}>
      <PreviewPrompt className="label" prompt={item.choice.value} tagName="span" />
    </div>
  );
};

export default (Component) => (props) => (
  <DndProvider backend={MultiBackend} options={{ backends }} context={window}>
    <Component {...props} />
    <PreviewComponent />
  </DndProvider>
);
