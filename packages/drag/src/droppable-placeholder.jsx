import React from 'react';
import PlaceHolder from './placeholder';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';

const preventInteractionStyle = {
  flex: 1,
};

export function DroppablePlaceholder({ 
  id,
  children, 
  disabled, 
  classes, 
  isVerticalPool, 
  minHeight 
}) {
  const { setNodeRef, isOver } = useDroppable({ 
    id,
    disabled 
  });

  return (
    <div ref={setNodeRef} style={preventInteractionStyle}>
      <PlaceHolder
        disabled={disabled}
        isOver={isOver}
        choiceBoard={true}
        className={classes}
        isVerticalPool={isVerticalPool}
        minHeight={minHeight}
      >
        {children}
      </PlaceHolder>
    </div>
  );
}

DroppablePlaceholder.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  disabled: PropTypes.bool,
  classes: PropTypes.object,
  isVerticalPool: PropTypes.bool,
  minHeight: PropTypes.number,
};

export default DroppablePlaceholder;
