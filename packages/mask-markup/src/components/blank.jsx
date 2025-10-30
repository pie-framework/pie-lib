import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { renderMath } from '@pie-lib/math-rendering';
import debug from 'debug';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import classnames from 'classnames';
import { color } from '@pie-lib/render-ui';
import { grey } from '@mui/material/colors';

const log = debug('pie-lib:mask-markup:blank');

const StyledContent = styled('span')(() => ({
  border: `solid 0px ${color.primary()}`,
  minWidth: '200px',
  touchAction: 'none',
  overflow: 'hidden',
  whiteSpace: 'nowrap', // Prevent line wrapping
  '&.over': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
}));

const StyledChip = styled(Chip)(() => ({
  backgroundColor: color.background(),
  border: `2px dashed ${color.text()}`,
  color: color.text(),
  fontSize: 'inherit',
  maxWidth: '374px',
  position: 'relative',
  borderRadius: '3px',
  '&.over': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  '&.parentOver': {
    border: `1px solid ${grey[500]}`,
    backgroundColor: `${grey[300]}`,
  },
  '&.correct': {
    border: `solid 1px ${color.correct()}`,
  },
  '&.incorrect': {
    border: `solid 1px ${color.incorrect()}`,
  },
}));

const StyledChipLabel = styled('span')(() => ({
  whiteSpace: 'normal',
  // Added for touch devices, for image content.
  // This will prevent the context menu from appearing and not allowing other interactions with the image.
  // If interactions with the image in the token will be requested we should handle only the context Menu.
  pointerEvents: 'none',
  '& img': {
    display: 'block',
    padding: '2px 0',
  },
  // Remove default <p> margins to ensure consistent spacing across all wrapped content (p, span, div, math)
  // Padding for top and bottom will instead be controlled by the container for consistent layout
  // Ensures consistent behavior with pie-api-browser, where marginTop is already removed by a Bootstrap stylesheet
  '& p': {
    marginTop: '0',
    marginBottom: '0',
  },
  '& mjx-frac': {
    fontSize: '120% !important',
  },
  '&.over': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  '&.hidden': {
    color: 'transparent',
    opacity: 0,
  },
  '&.dragged': {
    position: 'absolute',
    left: 16,
    maxWidth: '60px',
  },
}));

function BlankContent({ 
  disabled, 
  choice, 
  isOver, 
  dragItem, 
  correct,
  emptyResponseAreaWidth,
  emptyResponseAreaHeight,
}) {
  const rootRef = useRef(null);
  const spanRef = useRef(null);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  const handleImageLoad = () => {
    updateDimensions();
  };

  const handleElements = () => {
    const imageElement = spanRef.current?.querySelector('img');
    if (imageElement) {
      imageElement.onload = handleImageLoad;
    } else {
      setTimeout(() => {
        updateDimensions();
      }, 300);
    }
  };

  const updateDimensions = () => {
    if (spanRef.current && rootRef.current) {
      // Temporarily set rootRef width to 'auto' for natural measurement
      rootRef.current.style.width = 'auto';

      // Get the natural dimensions of the content
      const width = spanRef.current.offsetWidth || 0;
      const height = spanRef.current.offsetHeight || 0;

      const widthWithPadding = width + 24; // 12px padding on each side
      const heightWithPadding = height + 24; // 12px padding on top and bottom

      const responseAreaWidth = parseFloat(emptyResponseAreaWidth) || 0;
      const responseAreaHeight = parseFloat(emptyResponseAreaHeight) || 0;

      const adjustedWidth = widthWithPadding <= responseAreaWidth ? responseAreaWidth : widthWithPadding;
      const adjustedHeight = heightWithPadding <= responseAreaHeight ? responseAreaHeight : heightWithPadding;

      setDimensions(prevState => ({
        width: adjustedWidth > responseAreaWidth ? adjustedWidth : prevState.width,
        height: adjustedHeight > responseAreaHeight ? adjustedHeight : prevState.height,
      }));

      rootRef.current.style.width = `${adjustedWidth}px`;
      rootRef.current.style.height = `${adjustedHeight}px`;
    }
  };

  const addDraggableFalseAttributes = (parent) => {
    if (parent && parent.childNodes) {
      parent.childNodes.forEach((elem) => {
        if (elem instanceof Element || elem instanceof HTMLDocument) {
          elem.setAttribute('draggable', false);
        }
      });
    }
  };

  const getRootDimensions = () => {
    // Handle potential non-numeric values
    const responseAreaWidth = !isNaN(parseFloat(emptyResponseAreaWidth))
      ? parseFloat(emptyResponseAreaWidth)
      : 0;
    const responseAreaHeight = !isNaN(parseFloat(emptyResponseAreaHeight))
      ? parseFloat(emptyResponseAreaHeight)
      : 0;

    const rootStyle = {
      height: dimensions.height || responseAreaHeight,
      width: dimensions.width || responseAreaWidth,
    };

    // add minWidth, minHeight if width and height are not defined
    return {
      ...rootStyle,
      ...(responseAreaWidth ? {} : { minWidth: 90 }),
      ...(responseAreaHeight ? {} : { minHeight: 32 }),
    };
  };

  useEffect(() => {
    handleElements();
  }, []);

  useEffect(() => {
    if (rootRef.current) {
      renderMath(rootRef.current);
    }
  });

  useEffect(() => {
    if (JSON.stringify(choice) !== JSON.stringify(choice)) {
      if (!choice) {
        setDimensions({ height: 0, width: 0 });
        return;
      }
      handleElements();
    }
  }, [choice]);

  const draggedLabel = dragItem && isOver && dragItem.choice && dragItem.choice.value;
  const label = choice && choice.value;

  return (
    <StyledChip
      clickable={false}
      disabled={true}
      ref={rootRef}
      component="span"
      label={
        <React.Fragment>
          <StyledChipLabel
            className={classnames({
              over: isOver,
              hidden: draggedLabel,
            })}
            ref={(ref) => {
              if (ref) {
                spanRef.current = ref;
                ref.innerHTML = label || '';
                addDraggableFalseAttributes(ref);
              }
            }}
          >
            {' '}
          </StyledChipLabel>
          {draggedLabel && (
            <StyledChipLabel
              className={classnames({
                over: isOver,
                dragged: true,
              })}
              ref={(ref) => {
                if (ref) {
                  ref.innerHTML = draggedLabel || '';
                  addDraggableFalseAttributes(ref);
                }
              }}
            >
              {' '}
            </StyledChipLabel>
          )}
        </React.Fragment>
      }
      className={classnames({
        over: isOver,
        parentOver: isOver,
        correct: correct !== undefined && correct,
        incorrect: correct !== undefined && !correct,
      })}
      variant={disabled ? 'outlined' : undefined}
      style={{
        ...getRootDimensions(),
      }}
    />
  );
}

BlankContent.defaultProps = {
  emptyResponseAreaWidth: 0,
  emptyResponseAreaHeight: 0,
};

BlankContent.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  duplicates: PropTypes.bool,
  choice: PropTypes.object,
  isOver: PropTypes.bool,
  dragItem: PropTypes.object,
  correct: PropTypes.bool,
  onChange: PropTypes.func,
  emptyResponseAreaWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  emptyResponseAreaHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  instanceId: PropTypes.string,
};

// New functional component using @dnd-kit hooks
function DragDropBlank({ 
  id, 
  disabled, 
  duplicates, 
  choice, 
  correct, 
  onChange, 
  emptyResponseAreaWidth, 
  emptyResponseAreaHeight,
  instanceId 
}) {
  // Setup draggable functionality
  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: setDragNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `mask-blank-drag-${id}`,
    disabled: disabled || !choice,
    data: {
      id: id,
      choice: choice,
      instanceId: instanceId,
      fromChoice: false, // This is from a blank, not from choices
      type: 'MaskBlank',
    },
  });

  // Setup droppable functionality
  const {
    setNodeRef: setDropNodeRef,
    isOver,
    active: dragItem,
  } = useDroppable({
    id: `mask-blank-drop-${id}`,
    data: {
      id: id,
      accepts: ['MaskBlank'],
      instanceId: instanceId,
    },
  });

  // Combine refs for both drag and drop
  const setNodeRef = (node) => {
    setDragNodeRef(node);
    setDropNodeRef(node);
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <StyledContent 
      ref={setNodeRef}
      style={style}
      className={isOver ? 'over' : ''}
      {...dragAttributes}
      {...dragListeners}
    >
      <BlankContent
        id={id}
        disabled={disabled}
        duplicates={duplicates}
        choice={choice}
        isOver={isOver}
        dragItem={dragItem?.data?.current}
        correct={correct}
        onChange={onChange}
        emptyResponseAreaWidth={emptyResponseAreaWidth}
        emptyResponseAreaHeight={emptyResponseAreaHeight}
        instanceId={instanceId}
      />
    </StyledContent>
  );
}

DragDropBlank.defaultProps = {
  emptyResponseAreaWidth: 0,
  emptyResponseAreaHeight: 0,
};

DragDropBlank.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  duplicates: PropTypes.bool,
  choice: PropTypes.object,
  correct: PropTypes.bool,
  onChange: PropTypes.func,
  emptyResponseAreaWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  emptyResponseAreaHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  instanceId: PropTypes.string,
};

export default DragDropBlank;
