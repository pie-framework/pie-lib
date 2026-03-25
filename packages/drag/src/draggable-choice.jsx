import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useDraggable } from '@dnd-kit/core';
import { grey } from '@mui/material/colors';

export const DRAG_TYPE = 'CHOICE';

const StyledChoice = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `solid 1px ${grey[400]}`,
  padding: theme.spacing(1),
  minHeight: '30px',
  minWidth: theme.spacing(20),
  maxWidth: theme.spacing(75),
  cursor: 'grab',
  '& p': {
    margin: 0,
  },
  '& p *': {
    margin: 0,
  },
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
  onRemoveChoice,
  type,
  id,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id || choice.id, // id to be used for dnd-kit
    disabled: disabled,
    categoryId: category?.id,
    alternateResponseIndex,
    data: {
      id: choice.id,
      value: choice.value,
      choiceId: choice.id,
      from: category?.id,
      categoryId: category?.id,
      alternateResponseIndex,
      choiceIndex,
      onRemoveChoice,
      type,
    },
  });

  return (
    <StyledChoice ref={setNodeRef} className={className} isDragging={isDragging} {...attributes} {...listeners}>
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
  type: PropTypes.string,
  id: PropTypes.string,
};

export default DraggableChoice;
