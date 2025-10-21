import React from 'react';

import IconButton from '@mui/material/IconButton';
import Check from '@mui/icons-material/Check';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const StyledIconButton = styled(IconButton)({
  verticalAlign: 'top',
  width: '28px',
  height: '28px',
  color: 'var(--editable-html-toolbar-check, #00bb00)',
  padding: '4px',
});

export const RawDoneButton = ({ onClick, doneButtonRef }) => (
  <StyledIconButton
    aria-label="Done"
    buttonRef={doneButtonRef}
    onClick={onClick}
    size="large"
  >
    <Check />
  </StyledIconButton>
);

RawDoneButton.propTypes = {
  onClick: PropTypes.func,
  doneButtonRef: PropTypes.func,
};

export const DoneButton = RawDoneButton;
