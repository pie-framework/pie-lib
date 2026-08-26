import React from 'react';
import PropTypes from 'prop-types';
import { findKey } from 'lodash-es';
import Choice from './choice';
import { DragDroppablePlaceholder } from '@pie-lib/drag';

export default class Choices extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    duplicates: PropTypes.bool,
    choices: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })),
    value: PropTypes.object,
    choicePosition: PropTypes.string.isRequired,
    instanceId: PropTypes.string, // Added for drag isolation
    selectedItem: PropTypes.object,
    onSelectClick: PropTypes.func,
    onPlacementClick: PropTypes.func,
  };

  getStyleForWrapper = () => {
    const { choicePosition } = this.props;

    switch (choicePosition) {
      case 'above':
        return {
          margin: '0 0 40px 0',
        };

      case 'below':
        return {
          margin: '40px 0 0 0',
        };

      case 'right':
        return {
          margin: '0 0 0 40px',
        };

      default:
        return {
          margin: '0 40px 0 0',
        };
    }
  };

  handlePoolClick = () => {
    const { disabled, selectedItem, onPlacementClick } = this.props;

    if (disabled) return;

    if (selectedItem) {
      // `undefined` targetId means "the choice board" — drag-in-the-blank.jsx's
      // commitPlacement routes it to removing the item from wherever it currently is.
      onPlacementClick?.(undefined);
    }

    // Pool background clicked with nothing selected: nothing to place.
  };

  render() {
    const { disabled, duplicates, choices, value, instanceId, selectedItem, onSelectClick } = this.props;
    const filteredChoices = choices.filter((c) => {
      if (duplicates === true) {
        return true;
      }
      const foundChoice = findKey(value, (v) => v === c.id);
      return foundChoice === undefined;
    });
    const elementStyle = { ...this.getStyleForWrapper(), minWidth: '100px' };

    return (
      <div style={elementStyle} onClick={this.handlePoolClick}>
        <DragDroppablePlaceholder disabled={disabled} instanceId={instanceId}>
          {filteredChoices.map((c, index) => (
            <Choice
              key={`${c.value}-${index}`}
              disabled={disabled}
              choice={c}
              instanceId={instanceId}
              selectedItem={selectedItem}
              onSelectClick={onSelectClick}
            />
          ))}
        </DragDroppablePlaceholder>
      </div>
    );
  }
}
