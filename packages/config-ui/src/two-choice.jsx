import InputContainer from './input-container';
import PropTypes from 'prop-types';
import RadioWithLabel from './radio-with-label';
import React from 'react';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  group: {
    display: 'flex',
    paddingLeft: 0,
    marginTop: theme.spacing.unit
  },
  vertical: {
    flexDirection: 'column'
  }
});

class RawNChoice extends React.Component {
  static propTypes = {
    header: PropTypes.string.isRequired,
    className: PropTypes.string,
    opts: PropTypes.array.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    direction: PropTypes.oneOf(['horizontal', 'vertical']),
    classes: PropTypes.object.isRequired
  };

  handleChange = event => {
    this.props.onChange(event.currentTarget.value);
  };

  render() {
    const { header, className, classes, opts, value, direction } = this.props;

    return (
      <InputContainer label={header} className={className}>
        <div className={classNames(classes.group, classes[direction])}>
          {opts.map((o, index) => (
            <RadioWithLabel
              value={o.value}
              key={index}
              checked={o.value === value}
              onChange={this.handleChange}
              label={o.label}
            />
          ))}
        </div>
      </InputContainer>
    );
  }
}

export const NChoice = withStyles(styles)(RawNChoice);

class TwoChoice extends React.Component {
  static propTypes = {
    header: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    one: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }),
    two: PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }),
    className: PropTypes.string
  };

  render() {
    const { one, two, header, className, value, onChange } = this.props;
    const opts = [one, two];
    return (
      <NChoice
        header={header}
        className={className}
        opts={opts}
        value={value}
        onChange={onChange}
      />
    );
  }
}

export default withStyles(styles)(TwoChoice);
