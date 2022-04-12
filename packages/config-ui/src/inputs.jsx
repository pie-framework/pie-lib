import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import { InputContainer } from '@pie-lib/render-ui';
import PropTypes from 'prop-types';
import React from 'react';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const InputTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.string
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
  const { classes, className, label, checked, onChange, disabled, error } = props;

  return (
    <InputContainer className={className} label={label}>
      <Checkbox
        className={classNames(classes.checkboxRoot, error && classes.error)}
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
  const { classes, className, label, checked, onChange, disabled, error } = props;

  return (
    <InputContainer className={className} label={label}>
      <Radio
        className={classNames(classes.radioRoot, error && classes.error)}
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
  error: {
    color: 'red'
  }
})(RawInputCheckbox);

const InputRadio = withStyles(() => ({
  radioRoot: {
    transform: 'translate(-20%, 20%)'
  },
  error: {
    color: 'red'
  }
}))(RawInputRadio);

export { InputSwitch, InputCheckbox, InputRadio };
