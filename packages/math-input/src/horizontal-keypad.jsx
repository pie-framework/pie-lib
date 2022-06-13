import React from 'react';
import PropTypes from 'prop-types';
import { keysForGrade, normalizeAdditionalKeys } from './keys/grades';
import { extendKeySet } from './keys/utils';
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
    layoutForKeyPad: PropTypes.object,
    onClick: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    noDecimal: PropTypes.bool,
    additionalKeys: PropTypes.array
  };

  static defaultProps = {
    mode: 'scientific',
    noDecimal: false,
    additionalKeys: []
  };

  keypadPress = data => {
    const { onClick } = this.props;

    onClick(toOldModel(data));
  };

  render() {
    const { mode, onFocus, noDecimal, className, additionalKeys, layoutForKeyPad } = this.props;
    const normalizedKeys = normalizeAdditionalKeys(additionalKeys);

    return (
      <Keypad
        className={className}
        onFocus={onFocus}
        noDecimal={noDecimal}
        layoutForKeyPad={layoutForKeyPad}
        additionalKeys={extendKeySet(keysForGrade(mode), normalizedKeys)}
        onPress={this.keypadPress}
        mode={mode}
      />
    );
  }
}
