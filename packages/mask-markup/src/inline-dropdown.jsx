import React from 'react';
import Dropdown from './components/dropdown';
import { withMask } from './with-mask';

export default withMask('dropdown', props => (node, data, onChange) => {
  const dataset = node.data ? node.data.dataset || {} : {};
  if (dataset.component === 'dropdown') {
    const { feedback } = props;
    return (
      <Dropdown
        key={`${node.type}-dropdown-${dataset.id}`}
        correct={feedback && feedback[dataset.id] && feedback[dataset.id].correct}
        disabled={props.disabled}
        value={data[dataset.id]}
        id={dataset.id}
        onChange={onChange}
        choices={props.choices[dataset.id]}
      />
    );
  }
});
