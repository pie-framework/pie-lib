import React from 'react';
import Input from './components/input';
import { withMask } from './with-mask';

export default withMask('input', props => (node, data, onChange) => {
  const dataset = node.data ? node.data.dataset || {} : {};
  if (dataset.component === 'input') {
    const { feedback, disabled } = props;
    return (
      <Input
        key={`${node.type}-input-${dataset.id}`}
        correct={feedback && feedback[dataset.id] && feedback[dataset.id].correct}
        disabled={disabled}
        value={data[dataset.id]}
        id={dataset.id}
        onChange={onChange}
      />
    );
  }
});
