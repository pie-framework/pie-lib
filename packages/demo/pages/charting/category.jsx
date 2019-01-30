import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Nt from './nt';
import PropTypes from 'prop-types';

const styles = theme => ({
  category: {
    display: 'flex',
    marginTop: theme.spacing.unit * 2
  },
  ntt: {
    marginTop: 0
  }
});

class RawCategory extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.number,
    onChange: PropTypes.func
  };
  changeLabel = event => {
    const { onChange, value } = this.props;
    const label = event.target.value;
    onChange(label, value);
    setTimeout(() => {
      if (this.tf) {
        console.log('_____________________ focus', this.tf);
        this.tf.focus();
      }
    }, 1000);
  };
  changeValue = value => {
    const { onChange, label } = this.props;
    onChange(label, value);
  };

  render() {
    const { value, label, classes } = this.props;

    return (
      <div className={classes.category}>
        <TextField
          value={label}
          variant="outlined"
          label="Label"
          inputRef={r => (this.tf = r)}
          onChange={this.changeLabel}
        />
        <Nt
          value={value}
          label="Value"
          onChange={this.changeValue}
          className={classes.ntt}
        />
      </div>
    );
  }
}

export default withStyles(styles)(RawCategory);
