import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import React from 'react';
import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    color: 'rgba(0, 0, 0, 0.89)',
    fontSize: theme.typography.fontSize - 2,
    left: '-5px',
    position: 'relative',
  },
}));

const StyledRadio = styled(Radio)(() => ({
  color: `${color.tertiary()} !important`,
}));

const SettingsRadioLabel = ({ label, value, checked, onChange }) => (
  <StyledFormControlLabel
    value={value}
    control={<StyledRadio checked={checked} onChange={onChange} />}
    label={label}
  />
);

export default SettingsRadioLabel;
