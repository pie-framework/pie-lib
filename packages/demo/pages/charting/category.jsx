import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Nt from './nt';
import PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';

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
    interactive: PropTypes.boolean,
    onChange: PropTypes.func,
    classes: PropTypes.object
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

  changeInteractive = event => {
    const { onChange, label, value } = this.props;
    onChange(label, value, event.target.checked);
  };

  render() {
    const { value, label, interactive, classes } = this.props;

    return (
      <div className={classes.category}>
        <TextField
          value={label}
          variant="outlined"
          label="Label"
          inputRef={r => (this.tf = r)}
          onChange={this.changeLabel}
        />
        <Nt value={value} label="Value" onChange={this.changeValue} className={classes.ntt} />
        <Switch checked={interactive} onChange={this.changeInteractive} value={interactive} />
      </div>
    );
  }
}

export default withStyles(styles)(RawCategory);
