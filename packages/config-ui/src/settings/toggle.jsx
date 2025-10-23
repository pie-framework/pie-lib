import React from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { color } from '@pie-lib/render-ui';

const StyledToggle = styled('div')(() => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
}));

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
  color: 'rgba(0, 0, 0, 0.89)',
  fontSize: theme.typography.fontSize,
  paddingTop: theme.spacing(2),
}));

const StyledSwitch = styled(Switch)(({ checked }) => ({
  '&.Mui-checked .MuiSwitch-thumb': {
    color: `${color.tertiary()} !important`,
  },
  '&.Mui-checked .MuiSwitch-track': {
    backgroundColor: `${color.tertiaryLight()} !important`,
  },
  '& .MuiSwitch-track': {
    backgroundColor: checked ? `${color.tertiaryLight()} !important` : undefined,
  },
}));

const Toggle = ({ checked, disabled, label, toggle }) => (
  <StyledToggle>
    <StyledInputLabel>{label}</StyledInputLabel>
    <StyledSwitch
      checked={checked}
      disabled={disabled}
      onChange={(e) => toggle(e.target.checked)}
    />
  </StyledToggle>
);

Toggle.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Toggle;
