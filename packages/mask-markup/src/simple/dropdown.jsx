import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const Comp = props => (
  <Select
    value={props.value}
    onChange={e => {
      props.onChange(props.id, e.target.value);
    }}
  >
    {(props.choices || []).map((c, index) => (
      <MenuItem key={`${c.label}-${index}`} value={c.value}>
        {c.label}
      </MenuItem>
    ))}
  </Select>
);

Comp.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  choices: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string }))
};
export default Comp;
