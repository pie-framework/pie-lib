import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CorrectInput from './correct-input';

class Dropdown extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    correct: PropTypes.bool,
    choices: PropTypes.arrayOf(
      PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
    ),
    showCorrectAnswer: PropTypes.bool
  };

  render() {
    const { id, correct, disabled, value, onChange, choices, showCorrectAnswer } = this.props;

    return (
      <Select
        disabled={disabled}
        value={value || ''}
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
            <span
              ref={ref => {
                if (ref) {
                  ref.innerHTML = c.label;
                }
              }}
            />
          </MenuItem>
        ))}
      </Select>
    );
  }
}

export default Dropdown;
