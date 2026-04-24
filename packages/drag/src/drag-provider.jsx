import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

export function DragProvider({ children, onDragEnd, onDragStart, collisionDetection, modifiers, autoScroll }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    if (onDragStart) {
      onDragStart(event);
    }
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
      collisionDetection={collisionDetection}
      modifiers={modifiers}
      autoScroll={autoScroll}
    >
      {children}
    </DndContext>
  );
}

DragProvider.propTypes = {
  children: PropTypes.node.isRequired,
  onDragEnd: PropTypes.func,
  onDragStart: PropTypes.func,
  collisionDetection: PropTypes.func,
  modifiers: PropTypes.arrayOf(PropTypes.func),
  autoScroll: PropTypes.object,
};

export default DragProvider;
