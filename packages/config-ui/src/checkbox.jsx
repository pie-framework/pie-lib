import { FormControlLabel } from 'material-ui/Form';
import MuiCheckbox from 'material-ui/Checkbox';
import PropTypes from 'prop-types';
import React from 'react';
import { withStyles } from 'material-ui/styles';

const Checkbox = ({ checked, onChange, value, label, classes }) => (
  <FormControlLabel
    classes={{
      label: classes.label
    }}

    control={
      <MuiCheckbox
        checked={checked}
        onChange={onChange}
        value={value} />
    }
    label={label} />
);

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  label: PropTypes.string.isRequired
}

Checkbox.defaultProps = {
  value: ''
}

export default withStyles({
  label: {
    fontSize: '13px',
    transform: 'translate(-4%, 2%)',
    // fontStyle: 'italic',
    color: 'rgba(0,0,0,1.0)'
  }
})(Checkbox);