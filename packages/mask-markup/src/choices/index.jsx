import React from 'react';
import PropTypes from 'prop-types';
import findKey from 'lodash/findKey';
import Choice from './choice';

export default class Choices extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    duplicates: PropTypes.bool,
    choices: PropTypes.arrayOf(
      PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
    ),
    value: PropTypes.object
  };

  render() {
    const { disabled, duplicates, choices, value } = this.props;
    const filteredChoices = choices.filter(c => duplicates || !findKey(value, v => v === c.id));

    return (
      <div>
        {filteredChoices.map((c, index) => (
          <Choice key={`${c.value}-${index}`} disabled={disabled} choice={c} />
        ))}
      </div>
    );
  }
}
