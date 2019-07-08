import React from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

const Toggle = withStyles(theme => ({
  toggle: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between'
  },
  label: {
    color: 'rgba(0, 0, 0, 0.89)',
    fontSize: '14px',
    paddingTop: theme.spacing.unit * 2
  }
}))(({ checked, label, toggle, classes }) => (
  <div className={classes.toggle}>
    <InputLabel className={classes.label}>{label}</InputLabel>
    <Switch checked={checked} onChange={e => toggle(e.target.checked)} />
  </div>
));

Toggle.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired
};

export default Toggle;
