import React from 'react';
import Input from './components/input';
import { withMask } from './with-mask';

export default withMask('input', props => (node, data, onChange) => {
  const dataset = node.data ? node.data.dataset || {} : {};
  if (dataset.component === 'input') {
    const { disabled, feedback, showCorrectAnswer } = props;
    // the first answer is the correct one
    const correctAnswer = ((props.choices && dataset && props.choices[dataset.id]) || [])[0];
    const finalValue = showCorrectAnswer
      ? correctAnswer && correctAnswer.label
      : data[dataset.id] || '';

    return (
      <Input
        key={`${node.type}-input-${dataset.id}`}
        correct={feedback && feedback[dataset.id] && feedback[dataset.id] === 'correct'}
        disabled={showCorrectAnswer || disabled}
        value={finalValue}
        id={dataset.id}
        onChange={onChange}
        showCorrectAnswer={showCorrectAnswer}
      />
    );
  }
});
