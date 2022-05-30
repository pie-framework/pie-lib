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
    customValues: PropTypes.array,
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
    customValues: [],
    textAlign: 'center',
    variant: 'standard',
    onlyIntegersAllowed: false
  };

  constructor(props) {
    super(props);

    let value = this.clamp(props.value);
    let currentIndex = (props.customValues || []).findIndex(val => val === value);

    if ((props.customValues || []).length > 0 && currentIndex === -1) {
      const closestValue = this.getClosestValue(value);
      value = closestValue.value;
      currentIndex = closestValue.index;
    }

    this.state = {
      value,
      currentIndex
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
    const { min, max, customValues } = this.props;

    if ((customValues || []).length > 0) {
      return value;
    }

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

  getClosestValue = number => {
    const { customValues } = this.props;

    return customValues.reduce(
      (closest, value, index) =>
        Math.abs(value - number) < Math.abs(closest.value - number) ? { value, index } : closest,
      { value: customValues[0], index: 0 }
    );
  };

  onBlur = event => {
    const { customValues, onlyIntegersAllowed } = this.props;
    const { value } = event.target;
    const rawNumber = onlyIntegersAllowed ? parseInt(value) : parseFloat(value);
    let number = this.clamp(rawNumber);
    let updatedIndex = (customValues || []).findIndex(val => val === number);

    if (customValues.length > 0 && updatedIndex === -1) {
      const closestValue = this.getClosestValue(number);
      number = closestValue.value;
      updatedIndex = closestValue.index;
    }

    if (number !== this.state.value) {
      this.setState(
        {
          value: number.toString(),
          currentIndex: updatedIndex
        },
        () => this.props.onChange(event, number)
      );
    }
  };

  onChange(event) {
    const { value } = event.target;

    this.setState({ value });
  }

  changeValue(event, sign = 1, shouldUpdate = false) {
    event.preventDefault();

    const { customValues, step, onlyIntegersAllowed, onChange } = this.props;
    const { currentIndex, value } = this.state;
    const updatedIndex = currentIndex + sign * 1;
    let number;

    if (customValues.length > 0) {
      if (updatedIndex < 0 || updatedIndex >= customValues.length) {
        return;
      }

      number = customValues[updatedIndex];
    } else {
      const rawNumber = onlyIntegersAllowed ? parseInt(value) : parseFloat(value);
      const updatedValue = (rawNumber * 10000 + step * sign * 10000) / 10000;
      number = this.clamp(updatedValue);
    }

    this.setState(
      {
        value: number.toString(),
        currentIndex: updatedIndex
      },
      () => {
        if (shouldUpdate) {
          onChange(event, number);
        }
      }
    );
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
