import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { color } from '../../render-ui';

export default withStyles((theme) => ({
  label: {
    color: 'rgba(0, 0, 0, 0.89)',
    fontSize: theme.typography.fontSize - 2,
    left: '-5px',
    position: 'relative',
  },
  customColor: {
    color: `${color.tertiary()} !important`
  },
}))(({ label, value, checked, onChange, classes }) => (
  <FormControlLabel
    value={value}
    classes={{ label: classes.label }}
    control={
    <Radio
        className={classes.customColor}
        checked={checked}
        onChange={onChange}
    />
  }
    label={label}
  />
));
