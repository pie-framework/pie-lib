import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import debug from 'debug';
import isFinite from 'lodash/isFinite';

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
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    label: PropTypes.string
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

  componentWillReceiveProps(props) {
    const value = this.clamp(props.value);
    this.setState({ value });
  }

  clamp(value) {
    if (!isFinite(value)) {
      return fallbackNumber(this.props.min, this.props.max);
    }

    const { min, max } = this.props;

    if (max) {
      value = Math.min(value, max);
    }
    if (min) {
      value = Math.max(value, min);
    }
    return value;
  }

  onChange(event) {
    const value = event.target.value;

    log('value: ', value);

    if (!value || isNaN(value)) {
      log('not natural - return');
      return;
    }

    const rawNumber = parseFloat(value, 10);
    log('rawNumber: ', rawNumber);

    const number = this.clamp(rawNumber);
    log('number: ', number);

    if (number !== this.state.value) {
      log('trigger update...');
      this.setState({ value: number }, () => {
        this.props.onChange(event, number);
      });
    }
  }

  render() {
    const { className, classes, label, disabled } = this.props;
    const names = classNames(classes.root, className);
    return (
      <TextField
        disabled={disabled}
        label={label}
        value={this.state.value}
        onChange={this.onChange}
        type="number"
        className={names}
        InputLabelProps={{
          shrink: true
        }}
        margin="normal"
      />
    );
  }
}

export default withStyles(styles)(NumberTextField);
