import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiCheckbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const Checkbox = ({ checked, onChange, value, label, classes }) => (
  <FormControlLabel
    classes={{
      label: classes.label
    }}
    control={
      <MuiCheckbox checked={checked} onChange={onChange} value={value} />
    }
    label={label}
  />
);

Checkbox.propTypes = {
  classes: PropTypes.object.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  label: PropTypes.string.isRequired
};

Checkbox.defaultProps = {
  value: ''
};

export default withStyles({
  label: {
    fontSize: '13px',
    transform: 'translate(-4%, 2%)',
    // fontStyle: 'italic',
    color: 'rgba(0,0,0,1.0)'
  }
})(Checkbox);
