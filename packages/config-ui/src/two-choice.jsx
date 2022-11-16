import { InputContainer } from '@pie-lib/render-ui';
import PropTypes from 'prop-types';
import RadioWithLabel from './radio-with-label';
import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  group: {
    display: 'flex',
    flexWrap: 'wrap',
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
    customLabel: PropTypes.func,
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
    const { header, className, classes, customLabel, opts, value, direction } = this.props;

    const preppedOpts = opts.map(o => {
      return typeof o === 'string' ? { label: o, value: o } : o;
    });
    const LabelComponent = customLabel || RadioWithLabel;

    return (
      <InputContainer label={header} className={className}>
        <div className={classNames(classes.group, classes[direction])}>
          {preppedOpts.map((o, index) => (
            <LabelComponent
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

const labelValue = PropTypes.shape({ label: PropTypes.string, value: PropTypes.string });

class TwoChoice extends React.Component {
  static propTypes = {
    header: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    one: PropTypes.oneOfType([labelValue, PropTypes.string]),
    two: PropTypes.oneOfType([labelValue, PropTypes.string]),
    className: PropTypes.string,
    customLabel: PropTypes.func
  };

  render() {
    const { one, two, header, className, customLabel, value, onChange } = this.props;
    const opts = [one, two];

    return (
      <NChoice
        customLabel={customLabel}
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
