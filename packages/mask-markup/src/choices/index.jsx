import React from 'react';
import PropTypes from 'prop-types';
import findKey from 'lodash/findKey';
import Choice from './choice';

export default class Choices extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    duplicates: PropTypes.bool,
    choices: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })),
    value: PropTypes.object,
    choicePosition: PropTypes.string.isRequired,
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

  render() {
    const { disabled, duplicates, choices, value } = this.props;
    const filteredChoices = choices.filter((c) => {
      if (duplicates === true) {
        return true;
      }
      const foundChoice = findKey(value, (v) => v === c.id);
      return foundChoice === undefined;
    });
    const elementStyle = this.getStyleForWrapper();

    return (
      <div style={elementStyle}>
        {filteredChoices.map((c, index) => (
          <Choice key={`${c.value}-${index}`} disabled={disabled} choice={c} />
        ))}
      </div>
    );
  }
}
