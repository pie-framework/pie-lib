import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { grey } from '@mui/material/colors';

export const DRAG_TYPE = 'CHOICE';

const StyledChoice = styled('div')(({ theme, isDragging }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `solid 1px ${grey[400]}`,
  padding: theme.spacing(1),
  minHeight: '30px',
  minWidth: theme.spacing(20),
  maxWidth: theme.spacing(75),
  cursor: 'grab',
  opacity: isDragging ? 0.5 : 1,
  '&:active': {
    cursor: 'grabbing',
  },
}));

export function DraggableChoice({ 
  choice, 
  children, 
  className,
  disabled,
  category,
  alternateResponseIndex,
  choiceIndex,
  onRemoveChoice
}) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    isDragging 
  } = useDraggable({
    id: choice.id,
    disabled: disabled,
    data: { 
      value: choice.value,
      choiceId: choice.id,
      from: category?.id,
      alternateResponseIndex,
      choiceIndex,
      onRemoveChoice
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <StyledChoice 
      ref={setNodeRef}
      style={style}
      className={className}
      isDragging={isDragging}
      {...attributes}
      {...listeners}
    >
      {children}
    </StyledChoice>
  );
}

DraggableChoice.propTypes = {
  choice: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    value: PropTypes.any,
  }).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  category: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  alternateResponseIndex: PropTypes.number,
  choiceIndex: PropTypes.number,
  onRemoveChoice: PropTypes.func,
};

export default DraggableChoice;
