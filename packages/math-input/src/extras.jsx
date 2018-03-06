import {
  AbsoluteValue,
  Approx,
  Degree,
  Fraction,
  GreaterThan,
  GreaterThanEqual,
  LessThan,
  LessThanEqual,
  NthRoot,
  Parenthesis,
  Percent,
  SquareRoot,
  Subscript,
  Superscript,
  X,
  Y
} from './icons';
import { OverrideIconButton, buttonStyle } from './styles';

import React from 'react';
import chunk from 'lodash/chunk';
import merge from 'lodash/merge';
import { withStyles } from 'material-ui/styles';

// Subscript/Superscript section
const subscript = { name: 'Subscript', icon: Subscript, symbol: 'x_n', logic: 'command', command: '_', shortcut: '', category: 'sub-sup' }; //<sub>n</sub>
const superscript = { name: 'Superscript', icon: Superscript, symbol: 'x^n', logic: 'command', command: '^', shortcut: '', category: 'sub-sup' };//<sup>n</sup>
const fraction = { name: 'Fraction', icon: Fraction, symbol: 'x/n', logic: 'command', command: '\\frac', shortcut: '', category: 'fraction' };
const percentage = { name: 'Percentage', icon: Percent, symbol: '%', logic: 'command', command: '%', shortcut: '', category: 'misc' };
const sqrt = { name: 'Square root', icon: SquareRoot, symbol: '&#870', logic: 'command', command: '\\sqrt', shortcut: '', category: 'root' };
const root = { name: 'Nth root', icon: NthRoot, symbol: 'n&#830', logic: 'write', command: '\\sqrt[{}]{}', shortcut: '', category: 'root' };
const absoluteValue = { name: 'Absolute Value', icon: AbsoluteValue, symbol: '| |', logic: 'command', command: '|', shortcut: '', category: 'misc' };
const parenthesis = { name: 'Parenthesis', icon: Parenthesis, symbol: '( )', logic: 'command', command: '(', shortcut: '', category: 'misc' };
const lt = { name: 'Less than', icon: LessThan, symbol: '<', logic: 'command', command: '<', shortcut: '', category: 'comparison' };
const gt = { name: 'Greater than', icon: GreaterThan, symbol: '>', logic: 'command', command: '>', shortcut: '', category: 'comparison' };
const degree = { name: 'Degree', icon: Degree, symbol: '°', logic: 'command', command: '°', shortcut: '', category: 'misc' };
const approx = { name: 'Approx', icon: Approx, symbol: '&asyp;', logic: 'write', command: '\\approx', shortcut: '', category: 'number' };
const le = { name: 'Less than or equal', icon: LessThanEqual, symbol: '<=', logic: 'command', command: '\\le', shortcut: '', category: 'comparison' };
const ge = { name: 'Greater than or equal', icon: GreaterThanEqual, symbol: '>=', logic: 'command', command: '\\ge', shortcut: '', category: 'comparison' };
const x = { name: 'X', icon: X, symbol: 'x', logic: 'command', command: 'x', shortcut: '', category: 'vars' }; //<sub>n</sub>
const y = { name: 'Y', icon: Y, symbol: 'y', logic: 'command', command: 'y', shortcut: '', category: 'vars' };//<sup>n</sup>

const buttons = [
  superscript, subscript, fraction, percentage,
  sqrt, root, absoluteValue, parenthesis,
  lt, gt, degree, approx,
  le, ge, x, y
];

const specialStyle = merge({}, buttonStyle(), {
  root: {
    display: 'block',
  },
  label: {
    position: 'absolute',
    left: '0px',
    top: '0px',
    right: '0px',
    bottom: '0px'

  }
});

const Special = withStyles(specialStyle, { name: 'Special' })(OverrideIconButton);

class B extends React.Component {

  render() {
    const { className, children, onClick } = this.props;

    return <div className={className} onClick={onClick}>
      <Special ref={r => this.button = r}>{children}</Special>
    </div>;
  }
}


export class Extras extends React.Component {

  render() {
    const { classes, onClick } = this.props;
    const rows = chunk(buttons, 4);
    return <div className={classes.root}>
      {buttons.map((b, index) => {
        const Icon = b.icon ? b.icon : 'div';
        return <B
          key={index}
          tabIndex={'-1'}
          className={classes.holder}
          onClick={() => onClick({ value: b.command, type: b.logic })}
        ><Icon /></B>
      })}
    </div>
  }
}

export default withStyles(
  {
    root: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridRowGap: '0px',
      gridColumnGap: '0px'
    },
    holder: {
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: '#cceeff'
    }
  })(Extras);
