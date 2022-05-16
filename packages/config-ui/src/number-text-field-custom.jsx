import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import isFinite from 'lodash/isFinite';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Remove from '@material-ui/icons/Remove';
import Add from '@material-ui/icons/Add';

const styles = theme => ({
  input: {
    '& input[type=number]': {
      '-moz-appearance': 'textfield'
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  },
  iconButton: {
    padding: '2px'
  }
});

const fallbackNumber = (min, max) => {
  if (!isFinite(min) && !isFinite(max)) {
    return 0;
  }

  if (!isFinite(min) && isFinite(max)) {
    return max;
  }

  if (isFinite(min)) {
    return min;
  }
};

export class NumberTextFieldCustom extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    inputClassName: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onlyIntegersAllowed: PropTypes.bool,
    value: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    label: PropTypes.string,
    disableUnderline: PropTypes.bool,
    variant: PropTypes.string
  };

  static defaultProps = {
    step: 1,
    textAlign: 'center',
    variant: 'standard',
    onlyIntegersAllowed: false
  };

  constructor(props) {
    super(props);

    const value = this.clamp(props.value);

    this.state = {
      value
    };

    if (value !== props.value) {
      this.props.onChange({}, value);
    }

    this.onChange = this.onChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps(props) {
    const value = this.clamp(props.value);

    this.setState({ value });
  }

  clamp(value) {
    const { min, max } = this.props;

    if (!isFinite(value)) {
      return fallbackNumber(min, max);
    }

    if (isFinite(max)) {
      value = Math.min(value, max);
    }

    if (isFinite(min)) {
      value = Math.max(value, min);
    }

    return value;
  }

  onBlur = event => {
    const { onlyIntegersAllowed } = this.props;
    const { value } = event.target;
    const rawNumber = onlyIntegersAllowed ? parseInt(value) : parseFloat(value);
    const number = this.clamp(rawNumber);

    if (number !== this.state.value) {
      this.setState({ value: number.toString() }, () => this.props.onChange(event, number));
    }
  };

  onChange(event) {
    const { value } = event.target;

    this.setState({ value });
  }

  changeValue(event, sign = 1, shouldUpdate = false) {
    event.preventDefault();

    const { step, onlyIntegersAllowed, onChange } = this.props;
    const { value } = this.state;
    const rawNumber = onlyIntegersAllowed ? parseInt(value) : parseFloat(value);
    const updatedValue = (rawNumber * 10000 + step * sign * 10000) / 10000;
    const number = this.clamp(updatedValue);

    this.setState({ value: number.toString() }, () => {
      if (shouldUpdate) {
        onChange(event, number);
      }
    });
  }

  render() {
    const {
      className,
      classes,
      label,
      disabled,
      error,
      min,
      max,
      inputClassName,
      disableUnderline,
      helperText,
      variant,
      textAlign
    } = this.props;
    const { value } = this.state;
    const names = classNames(className, classes.input);

    return (
      <TextField
        variant={variant}
        inputRef={ref => (this.inputRef = ref)}
        disabled={disabled}
        label={label}
        value={value}
        error={error}
        helperText={helperText}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onKeyPress={e => {
          // once the Enter key is pressed, we force input blur
          if (e.key === 'Enter' && this.inputRef) {
            this.inputRef.blur();
          }
        }}
        onKeyDown={e => {
          if (e.key === 'ArrowUp') {
            this.changeValue(e);
          }

          if (e.key === 'ArrowDown') {
            this.changeValue(e, -1);
          }
        }}
        type="number"
        className={names}
        InputProps={{
          className: inputClassName,
          disableUnderline: disableUnderline,
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                className={classes.iconButton}
                disabled={disabled}
                onClick={e => this.changeValue(e, -1, true)}
              >
                <Remove fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                className={classes.iconButton}
                disabled={disabled}
                onClick={e => this.changeValue(e, 1, true)}
              >
                <Add fontSize="small" />
              </IconButton>
            </InputAdornment>
          )
        }}
        inputProps={{
          style: { textAlign },
          min,
          max
        }}
      />
    );
  }
}

export default withStyles(styles)(NumberTextFieldCustom);
