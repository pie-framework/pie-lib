import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { color } from '@pie-lib/render-ui';
import { renderMath } from '@pie-lib/math-rendering';
import { styled } from '@mui/material/styles';
import classnames from 'classnames';

import { GripIcon } from '../../icons/RespArea';

const StyledContent = styled('span')(({ theme }) => ({
  border: `solid 0px ${theme.palette.primary.main}`,
  '& mjx-frac': {
    fontSize: '120% !important',
  },
}));

export function BlankContent({ n, children, isDragging, isOver, dragItem, value, selected }) {
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
  }, [value?.value, isOver, dragItem?.value?.value]);

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

  const borderStyle = selected
    ? `2px solid ${color.primaryDark()}`
    : isPreview
      ? `1px solid ${color.defaults.BORDER_DARK}`
      : `1px solid ${color.defaults.BORDER_LIGHT}`;

  return (
    <div
      ref={elementRef}
      className={selected ? 'selected' : undefined}
      style={{
        display: 'inline-flex',
        minWidth: '178px',
        minHeight: '36px',
        background: isPreview ? `${color.defaults.BORDER_LIGHT}` : `${color.defaults.WHITE}`,
        border: borderStyle,
        boxSizing: 'border-box',
        borderRadius: '3px',
        overflow: 'hidden',
        position: 'relative',
        padding: '8px 8px 8px 35px',
        width: hoveredElementSize ? hoveredElementSize.width : undefined,
        height: hoveredElementSize ? hoveredElementSize.height : undefined,
      }}
      data-key={n.index}
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
  children: PropTypes.node,
  isDragging: PropTypes.bool,
  isOver: PropTypes.bool,
  dragItem: PropTypes.object,
  value: PropTypes.object,
  selected: PropTypes.bool,
};

function DragDropChoice({
  value,
  disabled,
  instanceId,
  children,
  n,
  onChange,
  removeResponse,
  duplicates,
  pos,
  selected,
}) {
  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: setDragNodeRef,
    isDragging,
  } = useDraggable({
    id: `drag-${n.index}`,
    disabled: disabled || !value?.value,
    data: {
      id: `drag-${n.index}`,
      value,
      instanceId,
      n,
      pos,
      opts: { duplicates },
      type: 'drag-in-the-blank-placed-choice',
      fromChoice: !value,
      onRemove: (draggedData) => removeResponse(draggedData),
      onDrop: (draggedData, dropData) => {
        // check if we're dropping into a blank
        const isValidBlank = dropData?.type === 'drag-in-the-blank-drop-choice';

        if (!isValidBlank) return;

        // place into blank
        onChange(draggedData);

        if (!duplicates && draggedData.fromChoice) {
          removeResponse(draggedData);
        }
      },
    },
  });

  const {
    setNodeRef: setDropNodeRef,
    isOver,
    active: dragItem,
  } = useDroppable({
    id: `drop-${n.index}`,
    data: {
      type: 'drag-in-the-blank-drop-choice',
      accepts: ['drag-in-the-blank-choice', 'drag-in-the-blank-placed-choice'],
      instanceId: instanceId,
      value: value,
      id: `drop-${n.index}`,
      pos,
      n,
      opts: { duplicates },
      onDrop: (draggedData, dropData) => {
        // check if we're dropping into a blank
        const isValidBlank = dropData?.type === 'drag-in-the-blank-drop-choice';

        if (!isValidBlank) return;

        // if the dragged and dropped data are the same, do nothing
        if (draggedData.value.id === dropData.value.id) return;

        if (draggedData.type === 'drag-in-the-blank-choice') {
          // place into blank
          onChange(draggedData);

          if (!duplicates && draggedData.fromChoice) {
            removeResponse(draggedData);
          }
          return;
        }

        // moving placed choice between blanks
        if (draggedData.type === 'drag-in-the-blank-placed-choice') {
          // clear target blank
          removeResponse(dropData);

          // set new blank value
          onChange(draggedData);

          // clear original blank - slight delay to ensure state updates correctly
          setTimeout(() => removeResponse(draggedData), 10);
        }
      },
    },
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
      selected={selected}
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

  const content = <StyledContent className={classnames(isOver && 'over')}>{dragEl}</StyledContent>;

  return content;
}

DragDropChoice.propTypes = {
  value: PropTypes.object,
  disabled: PropTypes.bool,
  instanceId: PropTypes.string,
  children: PropTypes.node,
  n: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  removeResponse: PropTypes.func.isRequired,
  duplicates: PropTypes.bool,
  selected: PropTypes.bool,
};

export default DragDropChoice;
