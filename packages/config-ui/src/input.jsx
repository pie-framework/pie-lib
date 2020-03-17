import * as React from 'react';
import PropTypes from 'prop-types';
import { default as MaterialInput } from '@material-ui/core/Input';
import { InputContainer } from '@pie-lib/render-ui';

export default class Input extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
    error: PropTypes.func,
    noModelUpdateOnError: PropTypes.bool
  };

  static defaultProps = {
    type: 'text',
    error: (value, type) => (type === 'number' ? !value || isNaN(value) : !value),
    noModelUpdateOnError: false
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      value: newProps.value
    });
  }

  onChange = event => {
    const { type, onChange, error } = this.props;
    const value = event.target.value;

    if (error(value, type)) {
      this.setState({
        error: true,
        value: event.target.value
      });
    } else {
      this.setState({
        error: false,
        value: event.target.value
      });

      onChange(event);
    }
  };

  render() {
    const {
      label,
      type,
      noModelUpdateOnError, // eslint-disable-line no-unused-vars
      ...rest
    } = this.props;
    const { value, error } = this.state;

    return label ? (
      <InputContainer label={label}>
        <MaterialInput type={type} {...rest} value={value} onChange={this.onChange} error={error} />
      </InputContainer>
    ) : (
      <MaterialInput type={type} {...rest} value={value} onChange={this.onChange} error={error} />
    );
  }
}
