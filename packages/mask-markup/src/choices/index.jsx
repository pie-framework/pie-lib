import React from 'react';
import PropTypes from 'prop-types';
import Choice from './choice';

export default class Choices extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }))
  };

  render() {
    const { value, disabled } = this.props;
    return (
      <div>
        {value.map((v, index) => (
          <Choice
            disabled={disabled}
            key={`${v.value}-${index}`}
            value={v.value}
            id={v.id}
            targetId={'1'}
          />
        ))}
      </div>
    );
  }
}
