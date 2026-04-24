import React from 'react';
import PropTypes from 'prop-types';
import PlaceHolder from './placeholder';
import { useDroppable } from '@dnd-kit/core';
import { styled } from '@mui/material/styles';

// With @dnd-kit, the drop logic is handled in the DragProvider's onDragEnd callback
// This component now just wraps DroppablePlaceholder with drag-in-the-blank specific logic

const DroppablePlaceholderContainer = styled('div')({
  minHeight: '100px',
});

export function DragInTheBlankDroppable({
  children,
  disabled,
  classes,
  isVerticalPool,
  minHeight,
  instanceId,
  ...rest
}) {
  // The actual drop handling will be managed by the parent component
  // through the DragProvider's onDragEnd callback
  const { setNodeRef, isOver } = useDroppable({
    id: 'drag-in-the-blank-droppable',
    data: {
      type: 'MaskBlank',
      accepts: ['MaskBlank'],
      id: 'drag-in-the-blank-droppable',
      toChoiceBoard: true,
      instanceId,
    },
  });

  return (
    <div ref={setNodeRef}>
      <DroppablePlaceholderContainer>
        <PlaceHolder
          isOver={isOver}
          choiceBoard={true}
          className={classes}
          isVerticalPool={isVerticalPool}
          extraStyles={{
            width: '100%',
            minHeight: minHeight || 100,
            height: 'auto',
          }}
        >
          {children}
        </PlaceHolder>
      </DroppablePlaceholderContainer>
    </div>
  );
}

DragInTheBlankDroppable.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onDrop: PropTypes.func,
  instanceId: PropTypes.string,
};

export default DragInTheBlankDroppable;
