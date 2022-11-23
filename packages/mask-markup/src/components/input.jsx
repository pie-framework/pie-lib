import React from 'react';
import PropTypes from 'prop-types';
import CorrectInput from './correct-input';

const Input = ({
  disabled,
  correct,
  charactersLimit,
  id,
  isConstructedResponse,
  value,
  onChange,
  showCorrectAnswer,
  spellCheck,
  width,
}) => {
  return (
    <CorrectInput
      disabled={disabled}
      correct={showCorrectAnswer || correct}
      charactersLimit={charactersLimit}
      variant="outlined"
      value={value}
      isConstructedResponse={isConstructedResponse}
      spellCheck={spellCheck}
      isBox={true}
      width={width}
      onChange={(e) => {
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
  spellCheck: PropTypes.bool,
  correct: PropTypes.bool,
  showCorrectAnswer: PropTypes.bool,
};

export default Input;
