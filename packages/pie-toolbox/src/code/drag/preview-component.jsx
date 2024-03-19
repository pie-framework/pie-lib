import React, { useEffect, useRef, useState, useCallback } from 'react';
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

const getCustomStyle = (itemType, item, touchPosition, style) => {
  const transform = `translate(${touchPosition.x}px, ${touchPosition.y}px)`;
  const top = style?.top || 0;
  const left = style?.left || 0;
  const position = style?.position || 'fixed';

  return {
    position,
    top,
    left,
    transform,
    ...(itemType === 'MaskBlank' ? styles.maskBlank : {}),
    ...(item?.itemType === 'categorize' ? styles.categorize : {}),
    ...(itemType === 'Answer' ? styles.matchList : {}),
    ...(itemType === 'Tile' ? styles.placementOrdering : {}),
    ...(itemType === 'react-dnd-response' ? styles.ica : {}),
  };
};

const PreviewComponent = () => {
  const preview = usePreview();
  const { itemType, item, style, display } = preview;
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleTouchMove = useCallback(
    (event) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        setTouchPosition({
          x: touch.clientX / zoomLevel,
          y: touch.clientY / zoomLevel,
        });
      }
    },
    [zoomLevel],
  );

  const root = useRef(null);

  useEffect(() => {
    if (display && root.current) {
      renderMath(root.current);

      // Adjusted for precise zoom level calculation in Online Testing, targeting the specific class pattern .asmt-zoomable.asmt-zoom-NR .asmt-question .padding
      const zoomAffectedElement = document.querySelector('.padding') || document.body;

      setZoomLevel(parseFloat(getComputedStyle(zoomAffectedElement).zoom) || 1);
    }
  }, [display, item?.choice?.value, item?.value, itemType, item]);

  useEffect(() => {
    const touchMoveListener = (event) => handleTouchMove(event);
    if (display) {
      window.addEventListener('touchmove', touchMoveListener);
    }
    return () => {
      window.removeEventListener('touchmove', touchMoveListener);
    };
  }, [display, handleTouchMove]);

  if (!display) {
    return null;
  }

  const customStyle = getCustomStyle(itemType, item, touchPosition, style);

  const prompt = getPrompt(itemType, item);

  return (
    <div ref={root} style={customStyle}>
      <PreviewPrompt className="label" prompt={prompt} tagName="span" />
    </div>
  );
};

export default PreviewComponent;
