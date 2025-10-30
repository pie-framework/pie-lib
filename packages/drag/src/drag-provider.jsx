import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';

export function DragProvider({ children, onDragEnd }) {
  const [activeId, setActiveId] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 }}),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    if (onDragEnd) {
      onDragEnd(event);
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
}

DragProvider.propTypes = {
  children: PropTypes.node.isRequired,
  onDragEnd: PropTypes.func,
};

export default DragProvider;