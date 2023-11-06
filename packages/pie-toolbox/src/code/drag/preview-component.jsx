import React, { useEffect, useRef } from 'react';
import { usePreview } from 'react-dnd-multi-backend';
import { PreviewPrompt, color } from '../render-ui';
import { renderMath } from '../math-rendering';

const styles = {
  maskBlank: {
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
  },
  ica: {
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
  },
  categorize: {
    color: color.text(),
    backgroundColor: color.background(),
    padding: '16px',
    borderRadius: '4px',
    border: '1px solid',
  },
  matchList: {
    color: color.text(),
    backgroundColor: color.background(),
    padding: '10px',
    boxSizing: 'border-box',
    border: '1px solid #D1D1D1',
  },
  placementOrdering: {
    padding: '10px',
    boxSizing: 'border-box',
    border: '1px solid #D1D1D1',
    backgroundColor: color.background(),
  },
};

const getPrompt = (itemType, item) => {
  switch (itemType) {
    // DRAG-IN-THE-BLANK
    case 'MaskBlank':
      return item?.choice?.value;
    // IMAGE-CLOZE-ASSOCIATION
    case 'react-dnd-response':
      return item?.value;
    // MATCH-LIST
    case 'Answer':
      return item?.value;
    // PLACEMENT-ORDERING
    case 'Tile':
      return item?.value;
    default:
      return item?.itemType === 'categorize' ? item?.value : undefined;
  }
};

const getCustomStyle = (itemType, item, style) => {
  const baseStyle = {
    ...style,
    ...(itemType === 'MaskBlank' ? styles.maskBlank : {}),
    ...(item?.itemType === 'categorize' ? styles.categorize : {}),
    ...(itemType === 'Answer' ? styles.matchList : {}),
    ...(itemType === 'Tile' ? styles.placementOrdering : {}),
    ...(itemType === 'react-dnd-response' ? styles.ica : {}),
  };

  return baseStyle;
};

const PreviewComponent = () => {
  const preview = usePreview();
  const { itemType, item, style, display } = preview;

  const root = useRef(null);

  useEffect(() => {
    if (display && root.current) {
      renderMath(root.current);
    }
  }, [display, item?.choice?.value, item?.value, itemType, item]);

  if (!display) {
    return null;
  }

  const customStyle = getCustomStyle(itemType, item, style);

  const prompt = getPrompt(itemType, item);

  return (
    <div ref={root} style={customStyle}>
      <PreviewPrompt className="label" prompt={prompt} tagName="span" />
    </div>
  );
};

export default PreviewComponent;
