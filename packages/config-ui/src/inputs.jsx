import Checkbox from 'material-ui/Checkbox';
import Radio from 'material-ui/Radio';
import InputContainer from './input-container';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from 'material-ui/Switch';
import { withStyles } from 'material-ui/styles';

const InputTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool
};

const RawInputSwitch = ({ classes, className, label, checked, onChange }) => {
  return (
    <InputContainer className={className} label={label}>
      <Switch
        className={classes.switchRoot}
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
    </InputContainer>
  );
};

RawInputSwitch.propTypes = { ...InputTypes };

const InputSwitch = withStyles({
  switchRoot: {
    justifyContent: 'inherit',
    transform: 'translate(-20%, 20%)'
  }
})(RawInputSwitch);

const RawInputCheckbox = ({
  classes,
  className,
  label,
  checked,
  onChange,
  disabled
}) => {
  return (
    <InputContainer className={className} label={label}>
      <Checkbox
        className={classes.checkboxRoot}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
    </InputContainer>
  );
};

RawInputCheckbox.propTypes = { ...InputTypes };

const RawInputRadio = ({
  classes,
  className,
  label,
  checked,
  onChange,
  disabled
}) => {
  return (
    <InputContainer className={className} label={label}>
      <Radio
        className={classes.radioRoot}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
    </InputContainer>
  );
};

RawInputRadio.propTypes = { ...InputTypes };

const InputCheckbox = withStyles({
  checkboxRoot: {
    transform: 'translate(-25%, 20%)'
  }
})(RawInputCheckbox);

const InputRadio = withStyles(() => ({
  radioRoot: {
    transform: 'translate(-20%, 20%)'
  }
}))(RawInputRadio);

export { InputSwitch, InputCheckbox, InputRadio };
