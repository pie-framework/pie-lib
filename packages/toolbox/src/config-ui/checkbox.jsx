import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiCheckbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import grey from '@material-ui/core/colors/grey';

const Checkbox = ({ mini, checked, onChange, value, label, classes, error }) => (
  <FormControlLabel
    className={classNames(classes.mini)}
    classes={{
      label: classNames(classes.label, { [classes.miniLabel]: mini }),
    }}
    control={
      <MuiCheckbox
        checked={checked}
        onChange={onChange}
        value={value}
        className={classNames({ [classes.miniCheckbox]: mini, [classes.error]: error })}
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
  label: PropTypes.string.isRequired,
};

Checkbox.defaultProps = {
  value: '',
  mini: false,
};

export default withStyles((theme) => ({
  label: {
    fontSize: theme.typography.fontSize - 1,
    transform: 'translate(-4%, 2%)',
    color: 'rgba(0,0,0,1.0)',
  },
  miniCheckbox: {
    margin: 0,
    padding: 0,
    width: theme.spacing.unit * 3,
    height: theme.spacing.unit * 3,
  },
  miniLabel: {
    marginLeft: theme.spacing.unit,
    color: grey[700],
    fontSize: theme.typography.fontSize - 3,
  },
  mini: {
    margin: 0,
    marginLeft: 0,
    padding: 0,
  },
  error: {
    color: theme.palette.error.main,
  },
}))(Checkbox);
