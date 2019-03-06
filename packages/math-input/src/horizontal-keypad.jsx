import React from 'react';
import PropTypes from 'prop-types';
import { keysForGrade } from './keys/grades';
import Keypad from './keypad';

const toOldModel = d => {
  if (d.command) {
    return { value: d.command, type: 'command' };
  } else if (d.write) {
    return { value: d.write };
  } else if (d.keystroke) {
    return { type: 'cursor', value: d.keystroke };
  }
};

export default class HorizontalKeypad extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    mode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClick: PropTypes.func.isRequired,
    onFocus: PropTypes.func
  };

  static defaultProps = {
    mode: 'scientific'
  };

  keypadPress = data => {
    const { onClick } = this.props;

    onClick(toOldModel(data));
  };

  render() {
    const { mode, onFocus, className } = this.props;
    return (
      <Keypad
        className={className}
        onFocus={onFocus}
        additionalKeys={keysForGrade(mode)}
        onPress={this.keypadPress}
      />
    );
  }
}
