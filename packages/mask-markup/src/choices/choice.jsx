// choices/Choice.js
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDraggable } from '@dnd-kit/core';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import classnames from 'classnames';
import { renderMath } from '@pie-lib/math-rendering';
import { color } from '@pie-lib/render-ui';

export const DRAG_TYPE = 'MaskBlank';

const StyledChoice = styled('span')(({ theme }) => ({
  border: `solid 0px ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(2),
  margin: theme.spacing(0.5),
  transform: 'translate(0, 0)',
  display: 'inline-flex',
  '&.disabled': { opacity: 0.6 },
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
  pointerEvents: 'none',
  borderRadius: '3px',
  paddingTop: '12px',
  paddingBottom: '12px',
}));

export default function Choice({ choice, disabled, instanceId }) {
  const rootRef = useRef(null);

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `choice-${choice.id}`,
    data: { choice, instanceId, fromChoice: true, type: DRAG_TYPE },
    disabled,
  });

  useEffect(() => {
    if (rootRef.current) renderMath(rootRef.current);
  });

  return (
    <StyledChoice ref={setNodeRef} className={classnames({ disabled })} {...listeners} {...attributes}>
      <StyledChip
        clickable={false}
        disabled
        ref={rootRef}
        label={choice.value}
      />
    </StyledChoice>
  );
}

Choice.propTypes = {
  choice: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  instanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
