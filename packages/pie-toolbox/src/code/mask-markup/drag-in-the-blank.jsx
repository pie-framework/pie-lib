import React from 'react';
import PropTypes from 'prop-types';
import { renderMath } from '../math-rendering-accessible';
import Choices from './choices';
import Blank from './components/blank';
import { withMask } from './with-mask';

// eslint-disable-next-line react/display-name
const Masked = withMask('blank', (props) => (node, data, onChange) => {
  const dataset = node.data ? node.data.dataset || {} : {};
  if (dataset.component === 'blank') {
    // eslint-disable-next-line react/prop-types
    const {
      disabled,
      duplicates,
      correctResponse,
      feedback,
      showCorrectAnswer,
      emptyResponseAreaWidth,
      emptyResponseAreaHeight,
    } = props;
    const choiceId = showCorrectAnswer ? correctResponse[dataset.id] : data[dataset.id];
    // eslint-disable-next-line react/prop-types
    const choice = choiceId && props.choices.find((c) => c.id === choiceId);

    return (
      <Blank
        key={`${node.type}-${dataset.id}`}
        correct={showCorrectAnswer || (feedback && feedback[dataset.id])}
        disabled={disabled}
        duplicates={duplicates}
        choice={choice}
        id={dataset.id}
        emptyResponseAreaWidth={emptyResponseAreaWidth}
        emptyResponseAreaHeight={emptyResponseAreaHeight}
        onChange={onChange}
      />
    );
  }
});

export default class DragInTheBlank extends React.Component {
  static propTypes = {
    markup: PropTypes.string,
    layout: PropTypes.object,
    choicesPosition: PropTypes.string,
    choices: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })),
    value: PropTypes.object,
    onChange: PropTypes.func,
    duplicates: PropTypes.bool,
    disabled: PropTypes.bool,
    feedback: PropTypes.object,
    correctResponse: PropTypes.object,
    showCorrectAnswer: PropTypes.bool,
    emptyResponseAreaWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    emptyResponseAreaHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  UNSAFE_componentWillReceiveProps() {
    if (this.rootRef) {
      renderMath(this.rootRef);
    }
  }

  componentDidUpdate() {
    renderMath(this.rootRef);
  }

  getPositionDirection = (choicePosition) => {
    let flexDirection;
    let justifyContent;
    let alignItems;

    switch (choicePosition) {
      case 'left':
        flexDirection = 'row';
        alignItems = 'center';
        break;
      case 'right':
        flexDirection = 'row-reverse';
        justifyContent = 'flex-end';
        alignItems = 'center';
        break;
      case 'below':
        flexDirection = 'column-reverse';
        break;
      default:
        // above
        flexDirection = 'column';
        break;
    }

    return { flexDirection, justifyContent, alignItems };
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
      showCorrectAnswer,
      emptyResponseAreaWidth,
      emptyResponseAreaHeight,
    } = this.props;

    const choicePosition = choicesPosition || 'below';
    const style = {
      display: 'flex',
      minWidth: '100px',
      ...this.getPositionDirection(choicePosition),
    };

    return (
      <div ref={(ref) => ref && (this.rootRef = ref)} style={style}>
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
          emptyResponseAreaWidth={emptyResponseAreaWidth}
          emptyResponseAreaHeight={emptyResponseAreaHeight}
        />
      </div>
    );
  }
}
