import React, { useEffect, useRef, useState } from 'react';
import { DragOverlay, useDndContext } from '@dnd-kit/core';
import { PreviewPrompt, color } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';

const styles = {
  maskBlank: {
    // this style is applied only on small screens and for touch devices when dragging, for drag-in-the-blank.
    // It is styled to be identical to the drag-in-the-blank chip
    backgroundColor: color.white(),
    border: `1px solid ${color.text()}`,
    color: color.text(),
    alignItems: 'center',
    display: 'inline-flex',
    height: 'initial',
    minHeight: '32px',
    fontSize: 'inherit',
    whiteSpace: 'pre-wrap',
    maxWidth: '374px',
    borderRadius: '3px',
    padding: '12px',
  },
  ica: {
    backgroundColor: color.background(),
    border: `1px solid ${color.borderDark()}`,
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

const getPrompt = (dragData) => {
  if (!dragData) return undefined;

  // Handle different drag data structures based on the component type
  if (dragData.choiceId) {
    // DraggableChoice format
    return dragData.value;
  }
  
  // Legacy format support
  switch (dragData.itemType) {
    case 'MaskBlank':
      return dragData.choice?.value;
    case 'dnd-kit-response':
      return dragData.value;
    case 'Answer':
      return dragData.value;
    case 'Tile':
      return dragData.value;
    case 'categorize':
      return dragData.value;
    default:
      return dragData.value;
  }
};

const getCustomStyle = (dragData) => {
  if (!dragData) return {};

  const baseStyle = {
    cursor: 'grabbing',
    opacity: 0.8,
    transform: 'rotate(5deg)', // Slight rotation for visual feedback
  };

  // Apply specific styles based on item type
  if (dragData.itemType === 'MaskBlank') {
    return { ...baseStyle, ...styles.maskBlank };
  }
  if (dragData.itemType === 'categorize') {
    return { ...baseStyle, ...styles.categorize };
  }
  if (dragData.itemType === 'Answer') {
    return { ...baseStyle, ...styles.matchList };
  }
  if (dragData.itemType === 'Tile') {
    return { ...baseStyle, ...styles.placementOrdering };
  }
  if (dragData.itemType === 'dnd-kit-response') {
    return { ...baseStyle, ...styles.ica };
  }

  // Default style for choice items
  return { ...baseStyle, ...styles.categorize };
};

const PreviewComponent = () => {
  const { active } = useDndContext();
  const [zoomLevel, setZoomLevel] = useState(1);
  const root = useRef(null);

  const dragData = active?.data?.current;
  const isActive = !!active;

  useEffect(() => {
    if (isActive && root.current) {
      renderMath(root.current);

      // Adjusted for precise zoom level calculation in Online Testing, targeting the specific class pattern .asmt-zoomable.asmt-zoom-NR .asmt-question .padding
      const zoomAffectedElement = document.querySelector('.padding') || document.body;
      setZoomLevel(parseFloat(getComputedStyle(zoomAffectedElement).zoom) || 1);
    }
  }, [isActive, dragData]);

  const customStyle = getCustomStyle(dragData);
  const prompt = getPrompt(dragData);

  return (
    <DragOverlay>
      {isActive && prompt && (
        <div ref={root} style={customStyle}>
          <PreviewPrompt className="label" prompt={prompt} tagName="span" />
        </div>
      )}
    </DragOverlay>
  );
};

export default PreviewComponent;
