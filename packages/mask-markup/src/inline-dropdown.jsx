import React from 'react';
import Dropdown from './components/dropdown';
import { withMask } from './with-mask';

export default withMask('dropdown', (props) => (node, data, onChange) => {
  const dataset = node.data ? node.data.dataset || {} : {};
  if (dataset.component === 'dropdown') {
    const { choices, disabled, feedback, showCorrectAnswer } = props;
    const correctAnswer = choices && choices[dataset.id] && choices[dataset.id].find((c) => c.correct);
    const finalChoice = showCorrectAnswer ? correctAnswer && correctAnswer.value : data[dataset.id];

    return (
      <Dropdown
        key={`${node.type}-dropdown-${dataset.id}`}
        correct={feedback && feedback[dataset.id] && feedback[dataset.id] === 'correct'}
        disabled={disabled || showCorrectAnswer}
        value={finalChoice}
        id={dataset.id}
        onChange={onChange}
        choices={choices[dataset.id]}
        showCorrectAnswer={showCorrectAnswer}
      />
    );
  }
});
