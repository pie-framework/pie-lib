import React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const StyledTextField = styled(TextField)(({ theme, styleVariant }) => ({
  marginTop: theme.spacing(2),
  paddingRight: theme.spacing(1),
  // Add variant-specific styles if needed
  ...(styleVariant === 'thin' &&
    {
      // maxWidth: '100px'
    }),
}));

const Nt = ({ className, label, value, onChange, variant }) => (
  <StyledTextField
    label={label}
    className={className}
    type="number"
    variant="outlined"
    value={value}
    onChange={(e) => onChange(parseFloat(e.target.value || 0))}
    styleVariant={variant}
  />
);

export default Nt;
