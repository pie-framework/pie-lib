import React from 'react';
import PropTypes from 'prop-types';
import CorrectInput from './correct-input';

const Input = ({ disabled, correct, id, value, onChange, showCorrectAnswer, maxLength }) => {
  return (
    <CorrectInput
      disabled={disabled}
      correct={showCorrectAnswer || correct}
      variant="outlined"
      value={value}
      isBox={true}
      maxLength={maxLength}
      onChange={e => {
        onChange(id, e.target.value);
      }}
    />
  );
};
Input.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  correct: PropTypes.bool,
  showCorrectAnswer: PropTypes.bool
};

export default Input;
