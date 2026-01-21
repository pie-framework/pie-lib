import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDraggable } from '@dnd-kit/core';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { renderMath } from '@pie-lib/math-rendering';
import { color } from '@pie-lib/render-ui';

export const DRAG_TYPE = 'MaskBlank';

const StyledChoice = styled('span')(({ theme, disabled }) => ({
  border: `solid 0px ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(2),
  margin: theme.spacing(0.5),
  transform: 'translate(0, 0)',
  display: 'inline-flex',
  ...(disabled && {}),
}));

const StyledChip = styled(Chip)(() => ({
  backgroundColor: color.white(),
  border: `1px solid ${color.text()}`,
  color: color.text(),
  alignItems: 'center',
  display: 'inline-flex',
  height: 'initial',
  minHeight: '32px',
  fontSize: 'inherit',
  whiteSpace: 'pre-wrap',
  maxWidth: '374px',
  // Added for touch devices, for image content.
  // This will prevent the context menu from appearing and not allowing other interactions with the image.
  // If interactions with the image in the token will be requested we should handle only the context Menu.
  pointerEvents: 'none',
  borderRadius: '3px',
  paddingTop: '12px',
  paddingBottom: '12px',

  '&.Mui-disabled': {
    opacity: 1,
  },
}));

const StyledChipLabel = styled('span')(() => ({
  whiteSpace: 'normal',
  '& img': {
    display: 'block',
    padding: '2px 0',
  },
  '& mjx-frac': {
    fontSize: '120% !important',
  },
}));

export default function Choice({ choice, disabled, instanceId }) {
  const rootRef = useRef(null);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `choice-${choice.id}`,
    data: { choice, instanceId, fromChoice: true, type: DRAG_TYPE },
    disabled,
  });

  useEffect(() => {
    renderMath(rootRef.current);
  }, [choice.value]);

  return (
    <StyledChoice
      ref={setNodeRef}
      style={
        isDragging
          ? {
              width: rootRef.current?.offsetWidth,
              height: rootRef.current?.offsetHeight,
            }
          : {}
      }
      disabled={disabled}
      {...listeners}
      {...attributes}
    >
      <StyledChip
        clickable={false}
        disabled={disabled}
        ref={rootRef}
        label={<StyledChipLabel dangerouslySetInnerHTML={{ __html: choice.value }} />}
      />
    </StyledChoice>
  );
}

Choice.propTypes = {
  choice: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  instanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
