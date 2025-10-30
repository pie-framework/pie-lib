import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import isUndefined from 'lodash/isUndefined';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { color } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';
import { styled } from '@mui/material/styles';
import classnames from 'classnames';

import { GripIcon } from '../icons';

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
  disabled,
  style: externalStyle
}) {
  const [hoveredElementSize, setHoveredElementSize] = useState(null);
  const elementRef = useRef(null);

  const handleClick = (event) => {
    if (elementRef.current) {
      elementRef.current.className = elementRef.current.contains(event.target) ? 'selected' : '';
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

  const label = dragItem && isOver ? dragItem.value.value : value.value || '\u00A0';
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
  onChange, 
  removeResponse, 
  instanceId, 
  targetId, 
  duplicates,
  n,
  children 
}) {
  // Setup draggable functionality
  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: setDragNodeRef,
    transform: dragTransform,
    isDragging,
  } = useDraggable({
    id: `drag-${n.key}`,
    disabled: disabled || !value,
    data: {
      id: targetId,
      value: value,
      instanceId: instanceId,
      fromChoice: true,
    },
  });

  // Setup droppable functionality
  const {
    setNodeRef: setDropNodeRef,
    isOver,
    active: dragItem,
  } = useDroppable({
    id: `drop-${n.key}`,
    data: {
      accepts: ['drag-in-the-blank-choice'],
      instanceId: instanceId,
      value: value,
    },
  });

  // Combine refs for both drag and drop
  const setNodeRef = (node) => {
    setDragNodeRef(node);
    setDropNodeRef(node);
  };

  const dragStyle = {
    transform: CSS.Translate.toString(dragTransform),
    opacity: isDragging ? 0.5 : 1,
  };

  const dragContent = (
    <BlankContent
      n={n}
      isDragging={isDragging}
      isOver={isOver}
      dragItem={dragItem?.data?.current}
      value={value}
      disabled={disabled}
      style={dragStyle}
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
