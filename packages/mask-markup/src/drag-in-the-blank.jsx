import React from 'react';
import PropTypes from 'prop-types';
import { renderMath } from '@pie-lib/math-rendering';
import Choices from './choices';
import Blank from './components/blank';
import { withMask } from './with-mask';

const Masked = withMask('blank', props => (node, data, onChange) => {
  const dataset = node.data ? node.data.dataset || {} : {};
  console.log(props, 'props in markup');
  if (dataset.component === 'blank') {
    const { disabled, duplicates, correctResponse, feedback, showCorrectAnswer } = props;
    const choiceId = showCorrectAnswer ? correctResponse[dataset.id] : data[dataset.id];
    const choice = choiceId && props.choices.find(c => c.id === choiceId);

    return <div>unde sunt</div>;
  }
});

export default class DragInTheBlank extends React.Component {
  static propTypes = {
    markup: PropTypes.string,
    layout: PropTypes.object,
    choicesPosition: PropTypes.string,
    choices: PropTypes.arrayOf(
      PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
    ),
    value: PropTypes.object,
    onChange: PropTypes.func,
    duplicates: PropTypes.bool,
    disabled: PropTypes.bool,
    feedback: PropTypes.object,
    correctResponse: PropTypes.object,
    showCorrectAnswer: PropTypes.bool
  };

  componentWillReceiveProps() {
    if (this.rootRef) {
      renderMath(this.rootRef);
    }
  }

  componentDidUpdate() {
    renderMath(this.rootRef);
  }

  getPositionDirection = choicePosition => {
    let flexDirection;

    switch (choicePosition) {
      case 'left':
        flexDirection = 'row';
        break;
      case 'right':
        flexDirection = 'row-reverse';
        break;
      case 'below':
        flexDirection = 'column-reverse';
        break;
      default:
        // above
        flexDirection = 'column';
        break;
    }

    return flexDirection;
  };

  render() {
    const {
      markup,
      duplicates,
      layout,
      value,
      onChange,
      choicesPosition,
      choices,
      correctResponse,
      disabled,
      feedback,
      showCorrectAnswer
    } = this.props;

    const choicePosition = choicesPosition || 'below';
    const style = {
      display: 'flex',
      flexDirection: this.getPositionDirection(choicePosition)
    };

    return (
      <div ref={ref => ref && (this.rootRef = ref)} style={style}>
        <Choices
          choicePosition={choicePosition}
          duplicates={duplicates}
          choices={choices}
          value={value}
          disabled={disabled}
        />
        <Masked
          markup={markup}
          layout={layout}
          value={value}
          choices={choices}
          onChange={onChange}
          disabled={disabled}
          duplicates={duplicates}
          feedback={feedback}
          correctResponse={correctResponse}
          showCorrectAnswer={showCorrectAnswer}
        />
      </div>
    );
  }
}
