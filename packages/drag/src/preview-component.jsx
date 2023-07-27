import React, { useEffect, useRef } from 'react';
import { usePreview } from 'react-dnd-multi-backend';
import { PreviewPrompt } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';
import { color } from '@pie-lib/render-ui';

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
    border: `1px solid ${color.text()}`,
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
    case 'Tile':
      return item?.value;
    default:
  }

  if (itemType && item?.itemType === 'categorize') {
    return item?.value;
  }
};

const PreviewComponent = () => {
  const preview = usePreview();
  const { itemType, item, style, display } = preview;

  console.log(itemType, 'itemType');
  console.log(item, 'item');
  let root = useRef(null);

  useEffect(() => {
    if (display && root.current) {
      renderMath(root.current);
    }
  }, [display, item?.choice?.value, item?.value, itemType, item]);

  if (!display) {
    return null;
  }

  const customStyle = {
    ...style,
    ...(itemType === 'MaskBlank' ? styles.maskBlank : {}),
    ...(item?.itemType === 'categorize' ? styles.categorize : {}),
    ...(itemType === 'Answer' ? styles.matchList : {}),
    ...(itemType === 'Tile' ? styles.placementOrdering : {}),
    // TODO: In the image-cloze-association component, there's a noticeable delay in the image rendering process. This results in a brief display of an empty image placeholder before the actual image appears after a few seconds. This issue also impacts the correct rendering of the preview feature, thereby negatively affecting the user experience. This needs to be addressed promptly.
    //...(itemType === 'react-dnd-response' ? styles.ica : {}),
  };

  const prompt = getPrompt(itemType, item);

  return (
    <div ref={root} style={customStyle}>
      <PreviewPrompt className="label" prompt={prompt} tagName="span" />
    </div>
  );
};

export default PreviewComponent;
