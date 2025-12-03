import React from 'react';
import PropTypes from 'prop-types';
import { renderMath } from '@pie-lib/math-rendering';
import { DragProvider } from '@pie-lib/drag';
import { DragOverlay, closestCenter } from '@dnd-kit/core';

import Choices from './choices';
import Choice from './choices/choice';
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
      isDragging
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
        isDragging={isDragging}
      />
    );
  }
});

export default class DragInTheBlank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDragItem: null,
    };
  }

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

  handleDragStart = (event) => {
    console.log('Drag Started:', event);
    const { active } = event;

    if (active?.data?.current) {
      this.setState({
        activeDragItem: active.data.current,
      });
    }
  };

  renderDragOverlay = () => {
    const { activeDragItem } = this.state;
    if (!activeDragItem) return null;

    if (activeDragItem.type === 'MaskBlank') {
      return (
        <Choice
          disabled={activeDragItem.disabled}
          choice={activeDragItem.choice}
          instanceId={activeDragItem.instanceId}
        />
      );
    }

    return null;
  };

  handleDragEnd = (event) => {
    const { active, over } = event;
    const { onChange, value } = this.props;

    if (!over || !active || !onChange) {
      return;
    }

    const draggedData = active.data.current;
    const dropData = over.data.current;

    if (draggedData?.type === 'MaskBlank' && dropData?.accepts?.includes('MaskBlank')) {
      const draggedItem = draggedData;
      const targetId = dropData.id;

      // drop from choice to blank (placing choice into response)
      if (draggedItem.fromChoice === true) {
        const newValue = { ...value };
        newValue[targetId] = draggedItem.choice.id;
        onChange(newValue);
      } else if (dropData.toChoiceBoard === true) {
        // handle drop from blank to choice board (removal from blank)
        const newValue = { ...value };
        delete newValue[draggedItem.id];
        onChange(newValue);
      }
      // handle drop from blank to blank (changing position)
      else if (draggedItem.id !== targetId) {
        const newValue = { ...value };
        newValue[targetId] = draggedItem.choice.id;
        delete newValue[draggedItem.id];
        onChange(newValue);
      }
    }
    this.setState({ activeDragItem: null });
  };

  componentDidMount() {
    if (this.rootRef) renderMath(this.rootRef);
  }

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
      <DragProvider
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
        collisionDetection={closestCenter}
      >
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
            isDragging={!!this.state.activeDragItem}
          />
          <DragOverlay style={{ pointerEvents: "none" }}>
            {this.renderDragOverlay()}
          </DragOverlay>
        </div>
      </DragProvider>
    );
  }
}
