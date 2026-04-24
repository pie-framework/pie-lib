import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';
import React from 'react';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: 0,
  padding: 0,
  flex: '1 0 auto',
  minWidth: theme.spacing(4),
}));

const StyledInputLabel = styled(InputLabel)(() => ({
  fontSize: 'inherit',
  whiteSpace: 'nowrap',
  margin: 0,
  padding: 0,
  alignSelf: 'flex-start',
  position: 'absolute',
  top: 0,
  left: 0,
  transformOrigin: 'top left',
  pointerEvents: 'none',
  // override MUI's default transform styles
  '&.MuiInputLabel-shrink': {
    transform: 'scale(0.75) translate(0, -0.75em)',
  },
  '&:not(.MuiInputLabel-shrink)': {
    transform: 'translate(0, 0)',
  },
}));

const InputContainer = ({ label, className, children }) => (
  <StyledFormControl className={className}>
    <StyledInputLabel shrink>{label}</StyledInputLabel>
    {children}
  </StyledFormControl>
);

InputContainer.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default InputContainer;
