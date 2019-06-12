import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CorrectInput from './correct-input';

const Dropdown = ({ id, correct, disabled, value, onChange, choices, showCorrectAnswer }) => {
  return (
    <Select
      disabled={disabled}
      value={value}
      input={<CorrectInput correct={showCorrectAnswer || correct} />}
      MenuProps={{
        keepMounted: true,
        disablePortal: true
      }}
      onChange={e => {
        onChange(id, e.target.value);
      }}
    >
      {(choices || []).map((c, index) => (
        <MenuItem key={`${c.label}-${index}`} value={c.value}>
          <span dangerouslySetInnerHTML={{ __html: c.label }} />
        </MenuItem>
      ))}
    </Select>
  );
};

Dropdown.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  correct: PropTypes.bool,
  choices: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string }))
};

export default Dropdown;
