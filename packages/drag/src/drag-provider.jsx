import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

export function DragProvider({
  children,
  onDragEnd,
  onDragStart,
  onDragCancel,
  collisionDetection,
  modifiers,
  autoScroll,
  keyboardCoordinateGetter,
  keyboardCodes,
  accessibility,
}) {
  const [activeId, setActiveId] = useState(null);

  // Only build a keyboard sensor options object when a consumer actually customizes
  // it, so consumers that don't pass these props get dnd-kit's own defaults exactly
  // as before (arrow-key nudging, Tab ends the drag, etc.).
  const keyboardSensorOptions =
    keyboardCoordinateGetter || keyboardCodes ? { coordinateGetter: keyboardCoordinateGetter, keyboardCodes } : undefined;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, keyboardSensorOptions),
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

  const handleDragCancel = (event) => {
    setActiveId(null);
    if (onDragCancel) {
      onDragCancel(event);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={collisionDetection}
      modifiers={modifiers}
      autoScroll={autoScroll}
      accessibility={accessibility}
    >
      {children}
    </DndContext>
  );
}

DragProvider.propTypes = {
  children: PropTypes.node.isRequired,
  onDragEnd: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragCancel: PropTypes.func,
  collisionDetection: PropTypes.func,
  modifiers: PropTypes.arrayOf(PropTypes.func),
  autoScroll: PropTypes.object,
  // Custom dnd-kit KeyboardSensor coordinateGetter (e.g. for Tab/Shift+Tab-based placement).
  // Omit to keep dnd-kit's default keyboard-dragging behavior.
  keyboardCoordinateGetter: PropTypes.func,
  // Overrides for dnd-kit's KeyboardSensor keyboardCodes (start/cancel/end).
  // Omit to keep dnd-kit's defaults.
  keyboardCodes: PropTypes.shape({
    start: PropTypes.arrayOf(PropTypes.string),
    cancel: PropTypes.arrayOf(PropTypes.string),
    end: PropTypes.arrayOf(PropTypes.string),
  }),
  // Passed straight through to dnd-kit's DndContext (screenReaderInstructions,
  // announcements, container). Omit to keep dnd-kit's defaults.
  accessibility: PropTypes.object,
};

export default DragProvider;
