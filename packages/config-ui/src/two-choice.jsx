import { FormControl, FormControlLabel, FormLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';

import InputContainer from './input-container';
import InputLabel from 'material-ui/Input/InputLabel';
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
  }
});

class RawNChoice extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = (event) => {
      this.props.onChange(event.currentTarget.value)
    }
  }

  render() {

    const { header, className, classes, opts, value } = this.props;

    return <InputContainer
      label={header}
      className={className}>
      <div className={classes.group}>
        {opts.map((o, index) => <RadioWithLabel
          value={o.value}
          key={index}
          checked={o.value === value}
          onChange={this.handleChange}
          label={o.label}
        />)}
      </div>
    </InputContainer>

  }
}

export const NChoice = withStyles(styles)(RawNChoice);

NChoice.propTypes = {
  header: PropTypes.string.isRequired,
  className: PropTypes.string,
  opts: PropTypes.array.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

class TwoChoice extends React.Component {

  render() {
    const { one, two, header, className, value, onChange } = this.props;
    const opts = [one, two];
    return (
      <NChoice
        header={header}
        className={className}
        opts={opts}
        value={value}
        onChange={onChange} />
    );
  }
}



TwoChoice.propTypes = {
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
  })
};


export default withStyles(styles, { name: 'TwoChoice' })(TwoChoice);