import {
  AbsoluteValue,
  Approx,
  Degree,
  Fraction,
  GreaterThan,
  GreaterThanEqual,
  LessThan,
  LessThanEqual,
  NotEqual,
  SameOrder,
  NotSameOrder,
  NotApprox,
  Cong,
  NotCong,
  NthRoot,
  Parenthesis,
  Percent,
  SquareRoot,
  Subscript,
  Superscript,
  X,
  Y,
  // Geometry
  RightArrow,
  LeftRightArrow,
  Segment,
  Parallel,
  Perpendicular,
  Angle,
  MeasuredAngle,
  Triangle,
  Parallelogram,
  CircledDot
} from './icons';
import { OverrideIconButton, buttonStyle } from './styles';
import PropTypes from 'prop-types';

import React from 'react';
import merge from 'lodash/merge';
import { withStyles } from '@material-ui/core/styles';

// Subscript/Superscript section
const subscript = {
  name: 'Subscript',
  icon: Subscript,
  symbol: 'x_n',
  logic: 'command',
  command: '_',
  shortcut: '',
  category: 'sub-sup'
}; //<sub>n</sub>
const superscript = {
  name: 'Superscript',
  icon: Superscript,
  symbol: 'x^n',
  logic: 'command',
  command: '^',
  shortcut: '',
  category: 'sub-sup'
}; //<sup>n</sup>
const fraction = {
  name: 'Fraction',
  icon: Fraction,
  symbol: 'x/n',
  logic: 'command',
  command: '\\frac',
  shortcut: '',
  category: 'fraction'
};
const percentage = {
  name: 'Percentage',
  icon: Percent,
  symbol: '%',
  logic: 'command',
  command: '%',
  shortcut: '',
  category: 'misc'
};
const sqrt = {
  name: 'Square root',
  icon: SquareRoot,
  symbol: '&#870',
  logic: 'command',
  command: '\\sqrt',
  shortcut: '',
  category: 'root'
};
const root = {
  name: 'Nth root',
  icon: NthRoot,
  symbol: 'n&#830',
  logic: 'write',
  command: '\\sqrt[{}]{}',
  shortcut: '',
  category: 'root'
};
const absoluteValue = {
  name: 'Absolute Value',
  icon: AbsoluteValue,
  symbol: '| |',
  logic: 'command',
  command: '|',
  shortcut: '',
  category: 'misc'
};
const parenthesis = {
  name: 'Parenthesis',
  icon: Parenthesis,
  symbol: '( )',
  logic: 'command',
  command: '(',
  shortcut: '',
  category: 'misc'
};
const lt = {
  name: 'Less than',
  icon: LessThan,
  symbol: '<',
  logic: 'command',
  command: '<',
  shortcut: '',
  category: 'comparison'
};
const gt = {
  name: 'Greater than',
  icon: GreaterThan,
  symbol: '>',
  logic: 'command',
  command: '>',
  shortcut: '',
  category: 'comparison'
};
const degree = {
  name: 'Degree',
  icon: Degree,
  symbol: '°',
  logic: 'command',
  command: '°',
  shortcut: '',
  category: 'misc'
};
const approx = {
  name: 'Approx',
  icon: Approx,
  symbol: '&asyp;',
  logic: 'write',
  command: '\\approx',
  shortcut: '',
  category: 'number'
};
const notApprox = {
  name: 'Not Approx',
  icon: NotApprox,
  symbol: '&nap;',
  logic: 'write',
  command: '\\napprox',
  shortcut: '',
  category: 'number'
};
const notEqual = {
  name: 'Not Equal',
  icon: NotEqual,
  symbol: '&ne;',
  logic: 'write',
  command: '\\ne',
  shortcut: '',
  category: 'number'
};
const sameOrder = {
  name: 'Same Order',
  icon: SameOrder,
  symbol: '&tilde;',
  logic: 'write',
  command: '\\sim',
  shortcut: '',
  category: 'number'
};
const notSameOrder = {
  name: 'Not Same Order',
  icon: NotSameOrder,
  symbol: '&#8769;',
  logic: 'write',
  command: '\\nsim',
  shortcut: '',
  category: 'number'
};
const cong = {
  name: 'Cong',
  icon: Cong,
  symbol: '&cong;',
  logic: 'write',
  command: '\\cong',
  shortcut: '',
  category: 'number'
};
const notCong = {
  name: 'Not Cong',
  icon: NotCong,
  symbol: '&ncong;',
  logic: 'write',
  command: '\\ncong',
  shortcut: '',
  category: 'number'
};
const le = {
  name: 'Less than or equal',
  icon: LessThanEqual,
  symbol: '<=',
  logic: 'command',
  command: '\\le',
  shortcut: '',
  category: 'comparison'
};
const ge = {
  name: 'Greater than or equal',
  icon: GreaterThanEqual,
  symbol: '>=',
  logic: 'command',
  command: '\\ge',
  shortcut: '',
  category: 'comparison'
};
const x = {
  name: 'X',
  icon: X,
  symbol: 'x',
  logic: 'command',
  command: 'x',
  shortcut: '',
  category: 'vars'
}; //<sub>n</sub>
const y = {
  name: 'Y',
  icon: Y,
  symbol: 'y',
  logic: 'command',
  command: 'y',
  shortcut: '',
  category: 'vars'
}; //<sup>n</sup>
// Geometry
const rightArrow = {
  name: 'Right Arrow',
  icon: RightArrow,
  symbol: '&xrarr;',
  logic: 'write',
  command: '\\rightarrow',
  shortcut: '',
  category: 'geometry'
};
const leftRightArrow = {
  name: 'Left Right Arrow',
  icon: LeftRightArrow,
  symbol: '&xharr;',
  logic: 'write',
  command: '\\leftrightarrow',
  shortcut: '',
  category: 'geometry'
};
const segment = {
  name: 'Segment',
  icon: Segment,
  symbol: 'AB',
  logic: 'write',
  command: '\\overline{AB}',
  shortcut: '',
  category: 'geometry'
};
const parallel = {
  name: 'Parallel',
  icon: Parallel,
  symbol: '&par;',
  logic: 'write',
  command: '\\parallel',
  shortcut: '',
  category: 'geometry'
};
const perpendicular = {
  name: 'Perpendicular',
  icon: Perpendicular,
  symbol: '&perp;',
  logic: 'write',
  command: '\\perpendicular',
  shortcut: '',
  category: 'geometry'
};
const angle = {
  name: 'Angle',
  icon: Angle,
  symbol: '&angle;',
  logic: 'write',
  command: '\\angle',
  shortcut: '',
  category: 'geometry'
};
const measuredAngle = {
  name: 'Measure Of Angle',
  icon: MeasuredAngle,
  symbol: '&angmsd; ',
  logic: 'write',
  command: '\\measuredangle',
  shortcut: '',
  category: 'geometry'
};
const triangle = {
  name: 'Triangle',
  icon: Triangle,
  symbol: '&triangle;',
  logic: 'write',
  command: '\\triangle',
  shortcut: '',
  category: 'geometry'
};
const parallelogram = {
  name: 'Parallelogram',
  icon: Parallelogram,
  symbol: '&fltns;',
  logic: 'write',
  command: '\\parallelogram',
  shortcut: '',
  category: 'geometry'
};
const circledDot = {
  name: 'Circled Dot',
  icon: CircledDot,
  symbol: '&odot;',
  logic: 'write',
  command: '\\odot',
  shortcut: '',
  category: 'geometry'
};

const buttons = [
  superscript,
  subscript,
  fraction,
  percentage,
  sqrt,
  root,
  absoluteValue,
  parenthesis,
  lt,
  gt,
  degree,
  approx,
  notApprox,
  notEqual,
  cong,
  notCong,
  sameOrder,
  notSameOrder,
  le,
  ge,
  x,
  y,
  // Geometry
  rightArrow,
  leftRightArrow,
  segment,
  parallel,
  perpendicular,
  angle,
  measuredAngle,
  triangle,
  parallelogram,
  circledDot
];

const specialStyle = merge({}, buttonStyle(), {
  root: {
    display: 'block'
  },
  label: {
    position: 'absolute',
    left: '0px',
    top: '0px',
    right: '0px',
    bottom: '0px'
  }
});

const Special = withStyles(specialStyle, { name: 'Special' })(
  OverrideIconButton
);

class B extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    onClick: PropTypes.func
  };
  render() {
    const { className, children, onClick } = this.props;

    return (
      <div className={className} onClick={onClick}>
        <Special ref={r => (this.button = r)}>{children}</Special>
      </div>
    );
  }
}

export class Extras extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func
  };

  render() {
    const { classes, onClick } = this.props;
    return (
      <div className={classes.root}>
        {buttons.map((b, index) => {
          const Icon = b.icon ? b.icon : 'div';
          return (
            <B
              key={index}
              tabIndex={'-1'}
              className={classes.holder}
              onClick={() => onClick({ value: b.command, type: b.logic })}
            >
              <Icon />
            </B>
          );
        })}
      </div>
    );
  }
}

export default withStyles({
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
