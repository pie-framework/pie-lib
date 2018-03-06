import { FormControlLabel } from 'material-ui/Form';
import Radio from 'material-ui/Radio';
import React from 'react';
import { withStyles } from 'material-ui/styles';

export default withStyles({
  label: {
    left: '-5px',
    position: 'relative'
  }
})(({ label, value, checked, onChange, classes }) => (
  <FormControlLabel
    value={value}
    classes={classes}
    control={<Radio
      checked={checked}
      onChange={onChange} />}
    label={label} />
));
