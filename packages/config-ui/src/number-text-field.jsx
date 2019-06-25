import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import debug from 'debug';
import isFinite from 'lodash/isFinite';
import InputAdornment from '@material-ui/core/InputAdornment';
const log = debug('@pie-lib:config-ui:number-text-field');

const styles = theme => ({
  root: { marginRight: theme.spacing.unit }
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

export class NumberTextField extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    inputClassName: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    label: PropTypes.string,
    suffix: PropTypes.string,
    showErrorWhenOutsideRange: PropTypes.bool,
    disableUnderline: PropTypes.bool,
    variant: PropTypes.string
  };

  static defaultProps = {
    showErrorWhenOutsideRange: false
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
    if (!isFinite(value)) {
      return fallbackNumber(this.props.min, this.props.max);
    }

    const { min, max } = this.props;

    if (isFinite(max)) {
      value = Math.min(value, max);
    }
    if (isFinite(min)) {
      value = Math.max(value, min);
    }
    return value;
  }

  /**
   * on Blur (this can be triggered by pressing Enter, see below)
   * we check the entered value and reset it if needed
   */
  onBlur = event => {
    const value = event.target.value;

    const rawNumber = parseFloat(value);
    log('rawNumber: ', rawNumber);

    const number = this.clamp(rawNumber);
    log('number: ', number);

    if (number !== this.state.value) {
      log('trigger update...');
      this.setState({ value: number.toString() }, () => {
        this.props.onChange(event, number);
      });
    }
  };

  onChange(event) {
    const value = event.target.value;
    this.setState({ value });
  }

  errorMessage = () => {
    const { min, max } = this.props;
    if (min && max) {
      return `The value must be between ${min} and ${max}`;
    }
    if (min) {
      return `The value must be greater than ${min}`;
    }
    if (max) {
      return `The value must be less than ${max}`;
    }
  };

  /**
   * if the input has to show error when outside range,
   * and the entered value is not matching the requirements
   * we display error message
   */

  getError = () => {
    const { value } = this.state;
    const float = parseFloat(value);
    const clamped = this.clamp(float);
    if (clamped !== float) {
      return this.errorMessage();
    }
  };

  render() {
    const {
      className,
      classes,
      label,
      disabled,
      suffix,
      min,
      max,
      inputClassName,
      disableUnderline,
      showErrorWhenOutsideRange,
      variant
    } = this.props;
    const names = classNames(classes.root, className);

    const error = showErrorWhenOutsideRange && this.getError();
    return (
      <TextField
        variant={variant || 'standard'}
        inputRef={ref => {
          this.inputRef = ref;
        }}
        disabled={disabled}
        label={label}
        value={this.state.value}
        error={!!error}
        helperText={error}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onKeyPress={e => {
          // once the Enter key is pressed, we force input blur
          if (e.key === 'Enter' && this.inputRef) {
            this.inputRef.blur();
          }
        }}
        type="number"
        className={names}
        InputLabelProps={{
          shrink: true
        }}
        InputProps={{
          endAdornment: suffix && <InputAdornment position="end">{suffix}</InputAdornment>,
          className: inputClassName,
          disableUnderline: disableUnderline
        }}
        inputProps={{
          min,
          max
        }}
        margin="normal"
      />
    );
  }
}

export default withStyles(styles)(NumberTextField);
