import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { color } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';
import { styled } from '@mui/material/styles';

import { GripIcon } from '../icons';
import { onValueChange, onRemoveResponse } from './utils';

const StyledContent = styled('span')(({ theme }) => ({
  border: `solid 0px ${theme.palette.primary.main}`,
  '& mjx-frac': {
    fontSize: '120% !important',
  },
  '&.chip': {
    minWidth: '90px',
  },
  '&.correct': {
    border: `solid 1px ${color.correct()}`,
  },
  '&.incorrect': {
    border: `solid 1px ${theme.palette.error.main}`,
  },
  '&.selected': {
    border: `2px solid ${color.primaryDark()} !important`,
  },
}));

export function BlankContent({
  n,
  children,
  isDragging,
  isOver,
  dragItem,
  value,
  style: externalStyle
}) {
  const [hoveredElementSize, setHoveredElementSize] = useState(null);
  const elementRef = useRef(null);

  const handleClick = (event) => {
    if (!elementRef.current) return;

    if (elementRef.current.contains(event.target)) {
      elementRef.current.classList.add('selected');
    } else {
      elementRef.current.classList.remove('selected');
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    if (elementRef.current && typeof renderMath === 'function') {
      renderMath(elementRef.current);
    }
  });

  useEffect(() => {
    if (isOver && elementRef.current && !hoveredElementSize) {
      const node = elementRef.current;
      setHoveredElementSize({ width: node.offsetWidth, height: node.offsetHeight });
    } else if (!isOver && hoveredElementSize) {
      setHoveredElementSize(null);
    }
  }, [isOver, hoveredElementSize]);

  const label = dragItem && dragItem.value && isOver ? dragItem.value.value : value.value || '\u00A0';
  const finalLabel = isDragging ? '\u00A0' : label;
  const hasGrip = finalLabel !== '\u00A0';
  const isPreview = dragItem && isOver;

  return (
    <div
      ref={elementRef}
      style={{
        display: 'inline-flex',
        minWidth: '178px',
        minHeight: '36px',
        background: isPreview ? `${color.defaults.BORDER_LIGHT}` : `${color.defaults.WHITE}`,
        border: isPreview ? `1px solid  ${color.defaults.BORDER_DARK}` : `1px solid  ${color.defaults.BORDER_LIGHT}`,
        boxSizing: 'border-box',
        borderRadius: '3px',
        overflow: 'hidden',
        position: 'relative',
        padding: '8px 8px 8px 35px',
        width: hoveredElementSize ? hoveredElementSize.width : undefined,
        height: hoveredElementSize ? hoveredElementSize.height : undefined,
        ...externalStyle,
      }}
      data-key={n.key}
      contentEditable={false}
    >
      {hasGrip && (
        <GripIcon
          style={{
            position: 'absolute',
            top: '6px',
            left: '15px',
            color: '#9B9B9B',
          }}
          contentEditable={false}
        />
      )}
      <span
        dangerouslySetInnerHTML={{
          __html: finalLabel,
        }}
      />
      {children}
    </div>
  );
}

BlankContent.propTypes = {
  n: PropTypes.object,
  children: PropTypes.func,
  isDragging: PropTypes.bool,
  isOver: PropTypes.bool,
  dragItem: PropTypes.object,
  value: PropTypes.object,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

function DragDropChoice({
  value,
  disabled,
  instanceId,
  children,
  n,
  nodeProps,
  opts,
}) {
  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: setDragNodeRef,
    isDragging,
  } = useDraggable({
    id: `drag-${n.key}`,
    disabled: disabled || !value?.value,
    data: {
      id: `drag-${n.key}`,
      value,
      instanceId,
      nodeProps,
      n,
      opts,
      type: 'drag-in-the-blank-placed-choice',
      fromChoice: !value,
      onRemove: (draggedData) => onRemoveResponse(nodeProps, draggedData.value),
      onDrop: (draggedData, dropData) => {
        // check if we're dropping into a blank
        const isValidBlank =
          dropData?.type === "drag-in-the-blank-drop-choice";

        if (!isValidBlank) return;

        // place into blank
        onValueChange(nodeProps, n, draggedData.value);

        if (!opts.options.duplicates && draggedData.fromChoice) {
          onRemoveResponse(nodeProps, draggedData.value);
        }
      }
    }
  });

  const {
    setNodeRef: setDropNodeRef,
    isOver,
    active: dragItem,
  } = useDroppable({
    id: `drop-${n.key}`,
    data: {
      type: 'drag-in-the-blank-drop-choice',
      accepts: ['drag-in-the-blank-choice', 'drag-in-the-blank-placed-choice'],
      instanceId: instanceId,
      value: value,
      id: `drop-${n.key}`,
      nodeProps,
      n,
      opts,
      onDrop: (draggedData, dropData) => {
        // check if we're dropping into a blank
        const isValidBlank =
          dropData?.type === "drag-in-the-blank-drop-choice";

        if (!isValidBlank) return;

        // if the dragged and dropped data are the same, do nothing
        if (draggedData.value.id === dropData.value.id) return;

        if (draggedData.type === 'drag-in-the-blank-choice') {
          // place into blank
          onValueChange(nodeProps, n, draggedData.value);

          if (!opts.options.duplicates && draggedData.fromChoice) {
            onRemoveResponse(nodeProps, draggedData.value);
          }
          return;
        }

        // moving placed choice between blanks
        if (draggedData.type === 'drag-in-the-blank-placed-choice') {
          // clear target blank
          onRemoveResponse(nodeProps, dropData.value);

          // set new blank value
          onValueChange(nodeProps, n, draggedData.value);

          // clear original blank - slight delay to ensure state updates correctly
          setTimeout(() => onRemoveResponse(nodeProps, draggedData.value), 10);
        }
      }
    }
  });

  const setNodeRef = (node) => {
    setDragNodeRef(node);
    setDropNodeRef(node);
  };

  const dragContent = (
    <BlankContent
      n={n}
      isDragging={isDragging}
      isOver={isOver}
      dragItem={dragItem?.data?.current}
      value={value}
      disabled={disabled}
    >
      {children}
    </BlankContent>
  );

  const dragEl = !value ? (
    <span ref={setDropNodeRef}>{dragContent}</span>
  ) : (
    <span ref={setNodeRef} {...dragAttributes} {...dragListeners}>
      {dragContent}
    </span>
  );

  const content = (
    <StyledContent className={classnames(isOver && 'over')}>
      {dragEl}
    </StyledContent>
  );

  return content;
}

DragDropChoice.propTypes = {
  value: PropTypes.object,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  removeResponse: PropTypes.func,
  instanceId: PropTypes.string,
  targetId: PropTypes.string,
  duplicates: PropTypes.bool,
  n: PropTypes.object,
  children: PropTypes.node,
};

export default DragDropChoice;
