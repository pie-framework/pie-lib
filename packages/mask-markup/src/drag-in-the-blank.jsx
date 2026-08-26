import React from 'react';
import PropTypes from 'prop-types';
import { DragProvider } from '@pie-lib/drag';
import { DragOverlay, rectIntersection } from '@dnd-kit/core';
import Choices from './choices';
import Choice from './choices/choice';
import Blank from './components/blank';
import { withMask } from './with-mask';
import { closestDroppableKeyboardCoordinates } from './keyboard-coordinates';

// A click that lands right after a real drag gesture ends (pointer drag-and-drop, or
// the browser's own synthetic click for a keyboard Space/Enter) must be ignored by the
// click-to-select/click-to-place handlers below, or it would immediately reopen or
// re-trigger a selection for a drag that just completed.
const CLICK_AFTER_DRAG_GUARD_MS = 250;

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
      isDragging,
      selectedItem,
      onSelectClick,
      onPlacementClick,
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
        selectedItem={selectedItem}
        onSelectClick={onSelectClick}
        onPlacementClick={onPlacementClick}
      />
    );
  }
});

export default class DragInTheBlank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDragItem: null,
      dropAnimation: undefined,
      selectedItem: null,
    };
    this.lastDragEndAt = 0;
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
    const { active } = event;

    if (active?.data?.current) {
      this.setState({
        activeDragItem: active.data.current,
        dropAnimation: undefined, // default during drag
        selectedItem: active.data.current,
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

  // Shared placement logic for both the drag-end path and the click-to-place path, so
  // neither reimplements the other's mutation rules.
  //
  // `targetId === undefined` means "the choice board" — placing there removes the item
  // from wherever it currently is (mirroring image-cloze-association's
  // `containerIndex === undefined` convention for its own choices pool).
  commitPlacement = (draggedItem, targetId) => {
    const { onChange, value } = this.props;

    if (!onChange) return;

    if (targetId === undefined) {
      if (!draggedItem.fromChoice && draggedItem.id) {
        const newValue = { ...value };
        delete newValue[draggedItem.id];
        onChange(newValue);
      }
      return;
    }

    if (draggedItem.fromChoice === true) {
      const newValue = { ...value };
      newValue[targetId] = draggedItem.choice.id;
      onChange(newValue);
    } else if (draggedItem.id && draggedItem.id !== targetId) {
      const newValue = { ...value };
      newValue[targetId] = draggedItem.choice.id;
      delete newValue[draggedItem.id];
      onChange(newValue);
    }
  };

  handleDragEnd = (event) => {
    const { active, over } = event;

    const draggedData = active?.data?.current;
    const dropData = over?.data?.current;

    const isValidDrop =
      !!active && !!over && draggedData?.type === 'MaskBlank' && dropData?.accepts?.includes('MaskBlank');

    // Only animate back when drop is invalid
    this.setState({
      activeDragItem: null,
      dropAnimation: isValidDrop ? null : undefined,
    });

    this.cancelSelection();
    this.lastDragEndAt = Date.now();

    if (!isValidDrop) return;

    const targetId = dropData.toChoiceBoard === true ? undefined : dropData.id;

    this.commitPlacement(draggedData, targetId);
  };

  onDragCancel = () => {
    this.setState({ activeDragItem: null, dropAnimation: undefined });
    this.cancelSelection();
    this.lastDragEndAt = Date.now();
  };

  isSameItem = (a, b) => {
    if (!a || !b || a.fromChoice !== b.fromChoice) return false;
    return a.fromChoice ? a.choice.id === b.choice.id : a.id === b.id;
  };

  // Click-to-select semantics: selecting the currently-selected item again clears the
  // selection instead of re-selecting it.
  toggleItemSelection = (data) => {
    this.setState((state) => ({
      selectedItem: this.isSameItem(state.selectedItem, data) ? null : data,
    }));
  };

  cancelSelection = () => {
    this.setState({ selectedItem: null });
  };

  // If a real dnd-kit drag (started via keyboard Space/Enter) is still live when a
  // click completes the placement below, it needs to be cleanly ended — otherwise
  // dnd-kit would still think a drag is in progress. Escape is already configured as
  // this sensor's cancel key (see the keyboardCodes passed to DragProvider below), and
  // dispatching it as a real DOM KeyboardEvent is how dnd-kit's own document-level
  // listener is reached from outside its sensor.
  //
  // Only dispatch when a drag is actually live — this is a synthetic Escape keydown on
  // `document`, so an unconditional dispatch would also be observed by any other
  // document-level Escape listener (host player modals/dialogs, or another mounted
  // instance of this same component) even when nothing here actually needed cancelling.
  endAnyLiveKeyboardDrag = () => {
    if (!this.state.activeDragItem) return;

    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape', bubbles: true, cancelable: true }));
  };

  placeSelectedItem = (targetId) => {
    const { selectedItem } = this.state;

    if (!selectedItem) return;

    this.commitPlacement(selectedItem, targetId);
    this.cancelSelection();
    this.endAnyLiveKeyboardDrag();
  };

  isClickSoonAfterDragEnd = () => Date.now() - this.lastDragEndAt < CLICK_AFTER_DRAG_GUARD_MS;

  onItemClick = (data) => {
    if (this.isClickSoonAfterDragEnd()) return;

    // End any still-live keyboard drag BEFORE toggling the new selection: ending it
    // also cancels the current selection as a side effect (see onDragCancel above), so
    // doing it before — not after — lets this click's own selection be the one that
    // sticks.
    this.endAnyLiveKeyboardDrag();
    this.toggleItemSelection(data);
  };

  onPlacementClick = (targetId) => {
    if (this.isClickSoonAfterDragEnd()) return;

    this.placeSelectedItem(targetId);
  };

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
      instanceId,
    } = this.props;

    const choicePosition = choicesPosition || 'below';
    const style = { display: 'flex', minWidth: '100px', ...this.getPositionDirection(choicePosition) };

    return (
      <DragProvider
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
        onDragCancel={this.onDragCancel}
        collisionDetection={rectIntersection}
        keyboardCoordinateGetter={closestDroppableKeyboardCoordinates}
        keyboardCodes={{ start: ['Space', 'Enter'], cancel: ['Escape'], end: ['Space', 'Enter'] }}
      >
        <div ref={(ref) => (this.rootRef = ref)} style={style}>
          <Choices
            choicePosition={choicePosition}
            choices={choices}
            value={value}
            duplicates={duplicates}
            disabled={disabled}
            instanceId={instanceId}
            selectedItem={this.state.selectedItem}
            onSelectClick={this.onItemClick}
            onPlacementClick={this.onPlacementClick}
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
            selectedItem={this.state.selectedItem}
            onSelectClick={this.onItemClick}
            onPlacementClick={this.onPlacementClick}
          />
          <DragOverlay style={{ pointerEvents: 'none' }} dropAnimation={this.state.dropAnimation}>
            {this.renderDragOverlay()}
          </DragOverlay>
        </div>
      </DragProvider>
    );
  }
}
