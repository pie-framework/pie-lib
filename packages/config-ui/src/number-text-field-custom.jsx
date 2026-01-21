import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import isFinite from 'lodash/isFinite';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Remove from '@mui/icons-material/Remove';
import Add from '@mui/icons-material/Add';
import * as math from 'mathjs';

const StyledTextField = styled(TextField)(() => ({
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
  '& input[type=number]::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& input[type=number]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
}));

const StyledIconButton = styled(IconButton)(() => ({
  padding: '2px',
}));

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
    className: PropTypes.string,
    customValues: PropTypes.array,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    inputClassName: PropTypes.string,
    helperText: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onlyIntegersAllowed: PropTypes.bool,
    value: PropTypes.any,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    label: PropTypes.string,
    disableUnderline: PropTypes.bool,
    textAlign: PropTypes.string,
    variant: PropTypes.string,
    type: PropTypes.string,
  };

  static defaultProps = {
    step: 1,
    customValues: [],
    textAlign: 'center',
    variant: 'standard',
    onlyIntegersAllowed: false,
  };

  constructor(props) {
    super(props);

    const { value, currentIndex } = this.normalizeValueAndIndex(props.customValues, props.value);

    this.state = {
      value,
      currentIndex,
    };

    if (value !== props.value) {
      this.props.onChange({}, value);
    }

    this.onChange = this.onChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps(props) {
    const { value, currentIndex } = this.normalizeValueAndIndex(props.customValues, props.value, props.min, props.max);

    this.setState({ value, currentIndex });
  }

  clamp(value, min = this.props.min, max = this.props.max) {
    const { customValues } = this.props;

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

  normalizeValueAndIndex = (customValues, number, min, max) => {
    const { type } = this.props;
    const value = this.clamp(number, min, max);
    const currentIndex = (customValues || []).findIndex((val) => val === value);

    if ((customValues || []).length > 0 && currentIndex === -1) {
      const closestValue =
        type === 'text' ? this.getClosestFractionValue(customValues, value) : this.getClosestValue(customValues, value);

      return { value: closestValue.value, currentIndex: closestValue.index };
    }

    return { value, currentIndex };
  };

  getClosestValue = (customValues, number) =>
    customValues.reduce(
      (closest, value, index) =>
        Math.abs(value - number) < Math.abs(closest.value - number) ? { value, index } : closest,
      { value: customValues[0], index: 0 },
    );

  getClosestFractionValue = (customValues, number) =>
    customValues.reduce(
      (closest, value, index) =>
        Math.abs(math.number(math.fraction(value)) - math.number(math.fraction(number))) <
        Math.abs(math.number(math.fraction(closest.value)) - math.number(math.fraction(number)))
          ? { value, index }
          : closest,
      { value: customValues[0], index: 0 },
    );

  getValidFraction = (value) => {
    if (this.isPositiveInteger(value.trim())) {
      return value.trim();
    }
    if (value.trim() === '' || value.trim().split('/').length !== 2) {
      return false;
    }
    let [numerator, denominator] = value.trim().split('/');
    if (isNaN(numerator) || isNaN(denominator)) {
      return false;
    }
    numerator = parseFloat(numerator);
    denominator = parseFloat(denominator);
    if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) {
      return false;
    }
    if (numerator < 0 || denominator < 1) {
      return false;
    }
    return numerator + '/' + denominator;
  };

  isPositiveInteger = (n) => {
    return n >>> 0 === parseFloat(n);
  };

  onBlur = (event) => {
    const { customValues, onlyIntegersAllowed, type } = this.props;
    let { value } = event.target;
    if (type === 'text') {
      let tempValue = this.getValidFraction(value);
      if (tempValue) {
        value = tempValue;
      } else {
        value = this.props.value;
      }
    }
    let rawNumber = onlyIntegersAllowed ? Math.round(parseFloat(value)) : parseFloat(value);
    if (type === 'text') {
      rawNumber = value.trim();
    }
    const { value: number, currentIndex } = this.normalizeValueAndIndex(customValues, rawNumber);
    this.setState(
      {
        value: number.toString(),
        currentIndex,
      },
      () => this.props.onChange(event, number),
    );
  };

  onChange(event) {
    const { type } = this.props;
    const { value } = event.target;
    if (type !== 'text' && typeof value === 'string' && value.trim() === '') {
      return;
    }
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
        currentIndex: updatedIndex,
      },
      () => {
        if (shouldUpdate) {
          onChange(event, number);
        }
      },
    );
  }

  render() {
    const {
      className,
      label,
      disabled,
      error,
      min,
      max,
      customValues,
      inputClassName,
      disableUnderline,
      helperText,
      variant,
      textAlign,
      type = 'number',
    } = this.props;
    const { value } = this.state;
    const names = className;
    //Logic to disable the increment and decrement buttons
    let disabledStart = false;
    let disabledEnd = false;
    if (customValues.length > 0) {
      disabledStart = value === customValues[0];
      disabledEnd = value === customValues[customValues.length - 1];
    } else if (isFinite(min) && isFinite(max)) {
      disabledStart = value === min;
      disabledEnd = value === max;
    }

    return (
      <StyledTextField
        variant={variant}
        inputRef={(ref) => (this.inputRef = ref)}
        disabled={disabled}
        label={label}
        value={value}
        error={error}
        helperText={helperText}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onKeyPress={(e) => {
          // once the Enter key is pressed, we force input blur
          if (e.key === 'Enter' && this.inputRef) {
            this.inputRef.blur();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') {
            this.changeValue(e);
          }

          if (e.key === 'ArrowDown') {
            this.changeValue(e, -1);
          }
        }}
        title={''}
        type={type}
        className={names}
        InputProps={{
          className: inputClassName,
          disableUnderline: disableUnderline,
          startAdornment: (
            <InputAdornment position="start">
              <StyledIconButton
                disabled={disabled ? disabled : disabledStart}
                onClick={(e) => this.changeValue(e, -1, true)}
                size="large">
                <Remove fontSize="small" />
              </StyledIconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <StyledIconButton
                disabled={disabled ? disabled : disabledEnd}
                onClick={(e) => this.changeValue(e, 1, true)}
                size="large">
                <Add fontSize="small" />
              </StyledIconButton>
            </InputAdornment>
          ),
        }}
        inputProps={{
          style: { textAlign },
          min,
          max,
        }}
      />
    );
  }
}

export default NumberTextFieldCustom;
