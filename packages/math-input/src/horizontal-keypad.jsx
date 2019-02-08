import React from 'react';
import PropTypes from 'prop-types';
import * as exponent from './keys/exponent';
import * as misc from './keys/misc';
import * as fractions from './keys/fractions';
import * as comparison from './keys/comparison';
import * as geometry from './keys/geometry';
import * as vars from './keys/vars';
import Keypad from './keypad';

const additionalKeys = [
  [
    misc.superscript,
    misc.subscript,
    fractions.xOverBlank,
    misc.percentage,
    geometry.segment,
    geometry.parallel
  ],
  [
    exponent.squareRoot,
    exponent.nthRoot,
    misc.absValue,
    misc.parenthesis,
    geometry.perpindicular,
    geometry.angle
  ],
  [
    comparison.lessThan,
    comparison.greaterThan,
    geometry.degree,
    misc.approx,
    geometry.measureOfAngle,
    geometry.triangle
  ],
  [
    misc.nApprox,
    misc.notEqual,
    geometry.congruentTo,
    geometry.notCongruentTo,
    geometry.parallelogram,
    geometry.circledDot
  ],
  [
    misc.similar,
    misc.notSimilar,
    comparison.lessThanEqual,
    comparison.greaterThanEqual,
    vars.x,
    vars.y
  ]
];

const toOldModel = d => {
  if (d.command) {
    return { value: d.command, type: 'command' };
  } else if (d.write) {
    return { value: d.write };
  }
};

export default class HorizontalKeypad extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    mode: PropTypes.string,
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
        additionalKeys={mode === 'scientific' ? additionalKeys : []}
        onPress={this.keypadPress}
      />
    );
  }
}
