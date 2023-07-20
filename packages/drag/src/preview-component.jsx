import React, { useEffect, useRef } from 'react';
import { usePreview } from 'react-dnd-multi-backend';
import { PreviewPrompt } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';
import { color } from '@pie-lib/render-ui';

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

const ICAStyle = {
  backgroundColor: color.background(),
  border: `1px solid ${color.primary()}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '28px',
  padding: '0 3px',
  marginLeft: 2,
  marginTop: 2,
  width: 'fit-content',
  touchAction: 'none',
  overflow: 'hidden',
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
    ...(itemType === 'react-dnd-response' ? ICAStyle : {}),
  };

  let prompt;

  // DRAG-IN-THE-BLANK
  if (itemType === 'MaskBlank') {
    prompt = item?.choice?.value;
    // IMAGE-CLOZE-ASSOCIATION
  } else if (itemType === 'react-dnd-response') {
    prompt = item?.value;
  }

  return (
    <div ref={root} style={customStyle}>
      <PreviewPrompt className="label" prompt={prompt} tagName="span" />
    </div>
  );
};

export default PreviewComponent;
