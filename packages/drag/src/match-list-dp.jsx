import React from 'react';
import PropTypes from 'prop-types';
import { DroppablePlaceholder } from './droppable-placeholder';

// With @dnd-kit, the drop logic is handled in the DragProvider's onDragEnd callback
// This component now just wraps DroppablePlaceholder with match-list specific logic

export function MatchListDroppable({ 
  id, 
  children, 
  disabled, 
  onRemoveAnswer,
  ...rest 
}) {
  // The actual drop handling will be managed by the parent component
  // through the DragProvider's onDragEnd callback
  // The onRemoveAnswer logic should be handled in the parent's onDragEnd:
  // 
  // const handleDragEnd = (event) => {
  //   if (event.over && event.active) {
  //     const item = event.active.data.current;
  //     if (onRemoveAnswer) {
  //       onRemoveAnswer(item.promptId);
  //     }
  //   }
  // };
  
  return (
    <DroppablePlaceholder
      id={id}
      disabled={disabled}
      {...rest}
    >
      {children}
    </DroppablePlaceholder>
  );
}

MatchListDroppable.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onRemoveAnswer: PropTypes.func,
};

export default MatchListDroppable;
