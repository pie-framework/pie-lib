import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import TextField from '@material-ui/core/TextField';

const Nt = withStyles(theme => ({
  nt: {
    marginTop: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit
  },
  thin: {
    // maxWidth: '100px'
  }
}))(({ className, label, value, onChange, classes, variant }) => (
  <TextField
    label={label}
    className={classNames(classes.nt, classes[variant], className)}
    type="number"
    variant="outlined"
    value={value}
    onChange={e => onChange(parseFloat(e.target.value || 0))}
  />
));

export default Nt;
