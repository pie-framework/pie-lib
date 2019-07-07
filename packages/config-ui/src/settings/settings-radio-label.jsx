import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

export default withStyles({
  label: {
    color: 'rgba(0, 0, 0, 0.89)',
    fontSize: '12px',
    left: '-5px',
    position: 'relative'
  }
})(({ label, value, checked, onChange, classes }) => (
  <FormControlLabel
    value={value}
    classes={classes}
    control={<Radio checked={checked} onChange={onChange} />}
    label={label}
  />
));
