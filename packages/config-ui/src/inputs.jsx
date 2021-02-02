import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import { InputContainer, color } from '@pie-lib/render-ui';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';

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

const RawInputCheckbox = props => {
  const { classes, className, label, checked, onChange, disabled } = props;

  return (
    <InputContainer className={className} label={label}>
      <Checkbox
        classes={{
          root: classes.checkboxRoot,
          checked: classes.checkboxChecked
        }}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
    </InputContainer>
  );
};

RawInputCheckbox.propTypes = { ...InputTypes };

const RawInputRadio = props => {
  const { classes, className, label, checked, onChange, disabled } = props;

  return (
    <InputContainer className={className} label={label}>
      <Radio
        classes={{
          root: classes.radioRoot,
          checked: classes.radioChecked
        }}
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
  },
  checkboxChecked: {
    color: `${color.primary()} !important`
  }
})(RawInputCheckbox);

const InputRadio = withStyles(() => ({
  radioRoot: {
    transform: 'translate(-20%, 20%)'
  },
  radioChecked: {
    color: `${color.primary()} !important`
  }
}))(RawInputRadio);

export { InputSwitch, InputCheckbox, InputRadio };
