import FormControlLabel from '@mui/material/FormControlLabel';
import MuiCheckbox from '@mui/material/Checkbox';
import PropTypes from 'prop-types';
import React from 'react';
import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';
import { grey } from '@mui/material/colors';

const StyledFormControlLabel = styled(FormControlLabel)(({ theme, mini }) => ({
  margin: 0,
  marginLeft: 0,
  padding: 0,
  '& .MuiFormControlLabel-label': {
    fontSize: theme.typography.fontSize - 1,
    transform: 'translate(-4%, 2%)',
    color: 'rgba(0,0,0,1.0)',
    ...(mini && {
      marginLeft: theme.spacing(1),
      color: grey[700],
      fontSize: theme.typography.fontSize - 3,
    }),
  },
}));

const StyledCheckbox = styled(MuiCheckbox)(({ theme, mini, error }) => ({
  color: `${color.tertiary()} !important`,
  ...(mini && {
    margin: 0,
    padding: 0,
    width: theme.spacing(3),
    height: theme.spacing(3),
  }),
  ...(error && {
    color: `${theme.palette.error.main} !important`,
  }),
}));

const Checkbox = ({ mini, checked, onChange, value, label, error }) => (
  <StyledFormControlLabel
    mini={mini}
    control={
      <StyledCheckbox
        checked={checked}
        onChange={onChange}
        value={value}
        mini={mini}
        error={error}
      />
    }
    label={label}
  />
);

Checkbox.propTypes = {
  mini: PropTypes.bool,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  error: PropTypes.bool,
};

Checkbox.defaultProps = {
  value: '',
  mini: false,
  error: false,
};

export default Checkbox;
