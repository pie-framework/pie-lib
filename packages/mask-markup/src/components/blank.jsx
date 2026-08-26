import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { renderMath } from '@pie-lib/math-rendering';
import debug from 'debug';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import classnames from 'classnames';
import { color } from '@pie-lib/render-ui';
import { grey } from '@mui/material/colors';

const log = debug('pie-lib:mask-markup:blank');

const StyledContent = styled('span')(({ dragged, over, selected, showsPointerCursor }) => ({
  border: `solid 0px ${color.primary()}`,
  minWidth: '200px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  opacity: 1,
  cursor: 'default',
  ...(over && {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }),
  ...((dragged || selected) && {
    opacity: 0.5,
  }),
  ...(showsPointerCursor && {
    '&:hover': {
      cursor: 'pointer',
    },
  }),
}));

const StyledDragHandle = styled('span')({
  display: 'inline-flex',
  touchAction: 'none',
});

const StyledChip = styled(Chip)(() => ({
  backgroundColor: color.background(),
  border: `2px dashed ${color.text()}`,
  touchAction: 'none',
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
  '&.Mui-disabled': {
    opacity: 1,
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
  '& mjx-mn:has(~ mjx-mfrac), mjx-mfrac ~ mjx-mn': {
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
    top: '50%',
    transform: 'translateY(-50%)',
  },
}));

function BlankContent({
  disabled,
  choice,
  isOver,
  isDragging,
  dragItem,
  correct,
  emptyResponseAreaWidth,
  emptyResponseAreaHeight,
}) {
  const rootRef = useRef(null);
  const spanRef = useRef(null);
  const frozenRef = useRef(null); // to use during dragging to prevent flickering
  const measuringRef = useRef(false); // guard against ResizeObserver feedback loops
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

  const getMeasureNode = () => {
    if (!spanRef.current) {
      return null;
    }

    const mjx = spanRef.current.querySelector('mjx-container');

    if (mjx && spanRef.current.parentElement) {
      return spanRef.current.parentElement;
    }

    const img = spanRef.current.querySelector('img');

    if (img) {
      // If there's text alongside the image, measure the full span to capture both dimensions
      const hasTextContent = spanRef.current.textContent.trim().length > 0;

      return hasTextContent ? spanRef.current : img;
    }

    return spanRef.current;
  };

  const updateDimensions = () => {
    if (spanRef.current && rootRef.current && !measuringRef.current) {
      measuringRef.current = true;
      // Temporarily set rootRef width to 'auto' for natural measurement
      rootRef.current.style.width = 'auto';
      rootRef.current.style.height = 'auto';
      rootRef.current.offsetHeight;

      const measureNode = getMeasureNode();
      const node = measureNode || spanRef.current;
      const rect = node.getBoundingClientRect();
      const width = node.offsetWidth || rect.width || 0;
      const height = Math.max(
        node.offsetHeight || 0,
        rect.height || 0,
        node.scrollHeight || 0,
        spanRef.current.scrollHeight || 0,
      );

      const PADDING = 12;
      const BORDER_WIDTH = 2;
      const ADDITIONAL_SPACE = 1;
      // padding and border on each side
      const widthWithPadding = width + 2 * PADDING + 2 * BORDER_WIDTH + ADDITIONAL_SPACE;
      // padding and border on top and bottom
      const heightWithPadding = height + 2 * PADDING + 2 * BORDER_WIDTH + ADDITIONAL_SPACE;

      const responseAreaWidth = parseFloat(emptyResponseAreaWidth) || 0;
      const responseAreaHeight = parseFloat(emptyResponseAreaHeight) || 0;

      const adjustedWidth = widthWithPadding <= responseAreaWidth ? responseAreaWidth : widthWithPadding;
      const adjustedHeight = heightWithPadding <= responseAreaHeight ? responseAreaHeight : heightWithPadding;

      setDimensions((prevState) => ({
        width: adjustedWidth > responseAreaWidth ? adjustedWidth : prevState.width,
        height: adjustedHeight > responseAreaHeight ? adjustedHeight : prevState.height,
      }));

      const nextWidth = `${adjustedWidth}px`;
      const nextHeight = `${adjustedHeight}px`;
      if (rootRef.current.style.width !== nextWidth) {
        rootRef.current.style.width = nextWidth;
      }
      if (rootRef.current.style.height !== nextHeight) {
        rootRef.current.style.height = nextHeight;
      }
      measuringRef.current = false;
    }
  };

  const getRootDimensions = () => {
    // Handle potential non-numeric values
    const responseAreaWidth = !isNaN(parseFloat(emptyResponseAreaWidth)) ? parseFloat(emptyResponseAreaWidth) : 0;
    const responseAreaHeight = !isNaN(parseFloat(emptyResponseAreaHeight)) ? parseFloat(emptyResponseAreaHeight) : 0;

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

  // Re-measure when the element first becomes visible — covers the tabbed-view case
  // where the initial measurement happened while the tab was hidden (size 0).
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !rootRef.current) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) updateDimensions();
      },
      { threshold: 0 },
    );
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  // Render math for the placeholder/preview when dragging over
  useEffect(() => {
    if (rootRef.current) {
      renderMath(rootRef.current);
    }
  }, [correct, isOver, dragItem?.choice?.value]);

  useEffect(() => {
    if (!choice) {
      setDimensions({ height: 0, width: 0 });
      return;
    }
    handleElements();
  }, [choice?.value]);

  useEffect(() => {
    if (!isOver && !isDragging) {
      frozenRef.current = {
        width: rootRef.current.offsetWidth,
        height: rootRef.current.offsetHeight,
      };
    }
  }, [choice, isOver, isDragging]);

  const draggedLabel = dragItem && isOver && dragItem.choice && dragItem.choice.value;
  const label = choice && choice.value;
  const style =
    isOver || isDragging
      ? {
          width: frozenRef.current?.width,
          height: frozenRef.current?.height,
        }
      : getRootDimensions();

  return (
    <StyledChip
      clickable={false}
      disabled={disabled}
      ref={rootRef}
      component="span"
      label={
        <React.Fragment>
          <StyledChipLabel
            ref={spanRef}
            draggable={true}
            className={classnames({
              over: isOver,
              hidden: draggedLabel,
            })}
            dangerouslySetInnerHTML={{ __html: label || '' }}
          />
          {draggedLabel && (
            <StyledChipLabel
              draggable={true}
              className={classnames({
                over: isOver,
                dragged: true,
              })}
              dangerouslySetInnerHTML={{ __html: draggedLabel || '' }}
            />
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
      style={style}
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
  instanceId,
  selectedItem,
  onSelectClick,
  onPlacementClick,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const dragData = {
    id,
    choice,
    instanceId,
    fromChoice: false, // This is from a blank, not from choices
    type: 'MaskBlank',
  };

  // Setup draggable functionality
  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: setDragNodeRef,
    isDragging,
  } = useDraggable({
    id: `mask-blank-drag-${id}`,
    disabled: disabled || !choice,
    data: dragData,
    // dnd-kit's own `attributes` default tabIndex to 0 unconditionally, even when
    // `disabled` — so a non-draggable (empty) blank stays a native Tab stop of its own.
    // For a drop-zone (droppable blank), that duplicates the outer wrapper's own tab stop
    // (see isNativeTabStop below) at the exact same position, so Tab/Shift+Tab has to
    // pass through both to move anywhere visibly, making every other press look like a
    // no-op. Drop it out of the tab order here whenever it isn't independently
    // reachable/interactive, leaving the outer wrapper (for an empty blank) or
    // nothing (for a disabled blank) as the sole stop.
    attributes: {
      tabIndex: choice && !disabled ? 0 : -1,
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

  const isSelected = !!selectedItem && selectedItem.fromChoice === false && selectedItem.id === id;

  const handleClick = () => {
    if (disabled) return;

    if (isSelected) {
      // Clicking this blank's already-selected content again deselects it.
      onSelectClick?.(dragData);
    } else if (selectedItem) {
      // Something else is selected — place it here, whether this blank is currently
      // empty or already filled (the same commitPlacement logic drag-and-drop uses).
      onPlacementClick?.(id);
    } else if (choice) {
      // Nothing selected yet, and this blank holds an answer — select it for moving
      // elsewhere, the same way Tab+Space/Enter does.
      onSelectClick?.(dragData);
    }

    // Empty blank clicked with nothing selected: nothing to place or select.
  };

  // An empty blank isn't draggable, so dnd-kit's own attributes (only applied to the
  // inner node, and only when draggable) never make it tabbable — this outer wrapper
  // needs its own focus/activation handling so "select a choice, then Tab to a blank
  // and press Space/Enter" works even when the blank is empty. This is independent of,
  // and doesn't change, the existing in-drag Tab-cycling (that's driven by an active
  // dnd-kit drag, not native focus).
  //
  // Only made a native Tab stop when NOT draggable (i.e. empty): when the blank is
  // filled, the inner node is already independently tabbable via dnd-kit's own
  // attributes for the existing pick-up-to-move gesture, and adding a second, outer Tab
  // stop for the same visual chip would add an extra stop to the existing Tab order —
  // the same double-tab-stop bug already found and fixed once in match-list/image-
  // cloze-association's equivalent code.
  const isNativeTabStop = !choice && !disabled;
  const isInnerDraggable = !!choice && !disabled;

  const handleKeyDown = (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  const hasSelection = !!selectedItem;
  const showsHoverEffect = isOver || (hasSelection && isHovered && !disabled);

  return (
    <StyledContent
      ref={setDropNodeRef}
      role={isNativeTabStop ? 'button' : undefined}
      tabIndex={isNativeTabStop ? 0 : -1}
      onClick={handleClick}
      onKeyDown={isNativeTabStop ? handleKeyDown : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dragged={isDragging}
      over={showsHoverEffect}
      selected={isSelected}
      showsPointerCursor={hasSelection && !disabled}
    >
      <StyledDragHandle ref={setDragNodeRef} {...(isInnerDraggable ? dragAttributes : {})} {...dragListeners}>
        <BlankContent
          id={id}
          disabled={disabled}
          duplicates={duplicates}
          choice={choice}
          isOver={showsHoverEffect}
          dragItem={dragItem?.data?.current}
          correct={correct}
          onChange={onChange}
          emptyResponseAreaWidth={emptyResponseAreaWidth}
          emptyResponseAreaHeight={emptyResponseAreaHeight}
          instanceId={instanceId}
        />
      </StyledDragHandle>
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
  selectedItem: PropTypes.object,
  onSelectClick: PropTypes.func,
  onPlacementClick: PropTypes.func,
};

export default DragDropBlank;
