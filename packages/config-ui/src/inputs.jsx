import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import { InputContainer } from '@pie-lib/render-ui';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { color } from '@pie-lib/render-ui';

const InputTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.string,
};

const StyledSwitch = styled(Switch)(() => ({
  justifyContent: 'inherit',
  transform: 'translate(-20%, 20%)',
}));

const InputSwitch = ({ className, label, checked, onChange }) => {
  return (
    <InputContainer className={className} label={label}>
      <StyledSwitch checked={checked} onChange={onChange} aria-label={label} />
    </InputContainer>
  );
};

InputSwitch.propTypes = { ...InputTypes };

const StyledCheckbox = styled(Checkbox)(({ theme, error }) => ({
  transform: 'translate(-25%, 20%)',
  color: `${color.tertiary()} !important`,
  ...(error && {
    color: `${theme.palette.error.main} !important`,
  }),
}));

const InputCheckbox = ({ className, label, checked, onChange, disabled, error }) => {
  return (
    <InputContainer className={className} label={label}>
      <StyledCheckbox
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        aria-label={label}
        error={error}
      />
    </InputContainer>
  );
};

InputCheckbox.propTypes = { ...InputTypes };

const StyledRadio = styled(Radio)(({ theme, error }) => ({
  transform: 'translate(-20%, 20%)',
  color: `${color.tertiary()} !important`,
  ...(error && {
    color: `${theme.palette.error.main} !important`,
  }),
}));

const InputRadio = ({ className, label, checked, onChange, disabled, error }) => {
  return (
    <InputContainer className={className} label={label}>
      <StyledRadio
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        aria-label={label}
        error={error}
      />
    </InputContainer>
  );
};

InputRadio.propTypes = { ...InputTypes };

export { InputSwitch, InputCheckbox, InputRadio };
