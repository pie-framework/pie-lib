import React from 'react';
import PropTypes from 'prop-types';
import Choices from './choices';
import Blank from './components/blank';
import { withMask } from './with-mask';

const Masked = withMask('blank', props => (node, data, onChange) => {
  const dataset = node.data ? node.data.dataset || {} : {};
  if (dataset.component === 'blank') {
    const { feedback } = props;
    return (
      <Blank
        key={`${node.type}-${dataset.id}`}
        correct={feedback && feedback[dataset.id] && feedback[dataset.id].correct}
        disabled={props.disabled}
        value={data[dataset.id]}
        id={dataset.id}
        onChange={onChange}
      />
    );
  }
});

export default class DragInTheBlank extends React.Component {
  static propTypes = {
    markup: PropTypes.string,
    layout: PropTypes.object,
    choices: PropTypes.arrayOf(
      PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
    ),
    value: PropTypes.object,
    onChange: PropTypes.func,
    disabled: PropTypes.bool
  };

  render() {
    const { markup, layout, value, onChange, choices, disabled } = this.props;

    return (
      <div>
        <Choices value={choices} disabled={disabled} />
        <Masked markup={markup} layout={layout} value={value} onChange={onChange} />
      </div>
    );
  }
}
