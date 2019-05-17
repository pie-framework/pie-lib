import React from 'react';
import PropTypes from 'prop-types';
import { renderMath } from '@pie-lib/math-rendering';
import Choices from './choices';
import Blank from './components/blank';
import { withMask } from './with-mask';

const Masked = withMask('blank', props => (node, data, onChange) => {
  const dataset = node.data ? node.data.dataset || {} : {};
  if (dataset.component === 'blank') {
    const { feedback } = props;
    const choiceId = data[dataset.id];
    const choice = props.choices.find(c => c.id === choiceId);

    return (
      <Blank
        key={`${node.type}-${dataset.id}`}
        correct={feedback && feedback[dataset.id] && feedback[dataset.id].correct}
        disabled={props.disabled}
        value={choice && choice.value}
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
    disabled: PropTypes.bool,
    feedback: PropTypes.object
  };

  componentDidUpdate() {
    renderMath(this.rootRef);
  }

  render() {
    const { markup, layout, value, onChange, choices, disabled, feedback } = this.props;

    return (
      <div ref={ref => ref && (this.rootRef = ref)}>
        <Choices value={choices} disabled={disabled} />
        <Masked
          markup={markup}
          layout={layout}
          value={value}
          choices={choices}
          onChange={onChange}
          disabled={disabled}
          feedback={feedback}
        />
      </div>
    );
  }
}
