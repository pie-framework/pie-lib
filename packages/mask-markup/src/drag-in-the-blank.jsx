import React from 'react';
import PropTypes from 'prop-types';
import { renderMath } from '@pie-lib/math-rendering';
import { DragProvider } from '@pie-lib/drag';
import Choices from './choices';
import Blank from './components/blank';
import { withMask } from './with-mask';

const Masked = withMask('blank', (props) => (node, data, onChange) => {
  const dataset = node.data?.dataset || {};
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
      instanceId,
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
        onChange={(id, choiceId) => {
          const newData = { ...data };
          if (choiceId === undefined) {
            delete newData[id];
          } else {
            newData[id] = choiceId;
          }
          onChange(newData);
        }}
        instanceId={instanceId}
      />
    );
  }
});

export default class DragInTheBlank extends React.Component {
  static propTypes = {
    markup: PropTypes.string,
    layout: PropTypes.object,
    choicesPosition: PropTypes.string,
    choices: PropTypes.array,
    value: PropTypes.object,
    onChange: PropTypes.func,
    duplicates: PropTypes.bool,
    disabled: PropTypes.bool,
    feedback: PropTypes.object,
    correctResponse: PropTypes.object,
    showCorrectAnswer: PropTypes.bool,
    emptyResponseAreaWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    emptyResponseAreaHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    instanceId: PropTypes.string,
  };

  static defaultProps = {
    instanceId: 'drag-in-the-blank',
  };

  handleDragEnd = (event) => {
    console.log('Drag End Event:', event);
    const { active, over } = event;
    const { onChange, value } = this.props;

    if (!over || !active || !onChange) {
      console.log('Early return - missing data:', { over: !!over, active: !!active, onChange: !!onChange });
      return;
    }

    const draggedData = active.data.current;
    const dropData = over.data.current;

    console.log('Drag data:', draggedData);
    console.log('Drop data:', dropData);

    // Handle drop from choice to blank or blank to blank
    if (draggedData?.type === 'MaskBlank' && dropData?.accepts?.includes('MaskBlank')) {
      console.log('Valid drag/drop types');
      const draggedItem = draggedData;
      const targetId = dropData.id;

      if (draggedItem.instanceId === dropData.instanceId) {
        console.log('Instance IDs match');

        // Handle drop from choice to blank
        if (draggedItem.fromChoice === true) {
          console.log('Dropping from choice to blank:', targetId);
          const newValue = { ...value };
          newValue[targetId] = draggedItem.choice.id;
          onChange(newValue);
        }
        // Handle drop from blank to blank
        else if (draggedItem.id !== targetId) {
          console.log('Moving from blank to blank:', draggedItem.id, '->', targetId);
          const newValue = { ...value };
          newValue[targetId] = draggedItem.choice.id;
          delete newValue[draggedItem.id];
          onChange(newValue);
        }
      } else {
        console.log('Instance ID mismatch:', draggedItem.instanceId, 'vs', dropData.instanceId);
      }
    } else {
      console.log('Invalid drag/drop types:', draggedData?.type, dropData?.accepts);
    }
  };

  componentDidUpdate() {
    if (this.rootRef) renderMath(this.rootRef);
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
      layout,
      instanceId
    } = this.props;

    const choicePosition = choicesPosition || 'below';
    const style = { display: 'flex', minWidth: '100px', ...this.getPositionDirection(choicePosition) };

    return (
      <DragProvider onDragEnd={this.handleDragEnd}>
        <div ref={(ref) => (this.rootRef = ref)} style={style}>
          <Choices
            choicePosition={choicePosition}
            choices={choices}
            value={value}
            duplicates={duplicates}
            disabled={disabled}
            instanceId={instanceId}
          />
          <Masked
            elementType="drag-in-the-blank"
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
            instanceId={instanceId}
          />
        </div>
      </DragProvider>
    );
  }
}
