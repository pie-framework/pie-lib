import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiCheckbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import grey from '@material-ui/core/colors/grey';

const Checkbox = ({ mini, checked, onChange, value, label, classes }) => (
  <FormControlLabel
    className={classNames(classes.mini)}
    classes={{
      label: classNames(classes.label, mini && classes.miniLabel)
    }}
    control={
      <MuiCheckbox
        checked={checked}
        onChange={onChange}
        value={value}
        className={classNames(mini && classes.miniCheckbox)}
      />
    }
    label={label}
  />
);

Checkbox.propTypes = {
  mini: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  label: PropTypes.string.isRequired
};

Checkbox.defaultProps = {
  value: '',
  mini: false
};

export default withStyles(theme => ({
  label: {
    fontSize: '13px',
    transform: 'translate(-4%, 2%)',
    color: 'rgba(0,0,0,1.0)'
  },
  miniCheckbox: {
    margin: 0,
    padding: 0,
    width: theme.spacing.unit * 3,
    height: theme.spacing.unit * 3
  },
  miniLabel: {
    marginLeft: theme.spacing.unit,
    color: grey[700],
    fontSize: '11px'
  },
  mini: {
    margin: 0,
    marginLeft: 0,
    padding: 0
  }
}))(Checkbox);
