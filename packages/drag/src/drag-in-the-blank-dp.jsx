import React from 'react';
import PropTypes from 'prop-types';
import { DroppablePlaceholder } from './droppable-placeholder';

// With @dnd-kit, the drop logic is handled in the DragProvider's onDragEnd callback
// This component now just wraps DroppablePlaceholder with drag-in-the-blank specific logic

export function DragInTheBlankDroppable({ 
  id, 
  children, 
  disabled, 
  onDrop,
  ...rest 
}) {
  // The actual drop handling will be managed by the parent component
  // through the DragProvider's onDragEnd callback
  
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

DragInTheBlankDroppable.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onDrop: PropTypes.func,
};

export default DragInTheBlankDroppable;
