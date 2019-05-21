import * as keys from './index';
import * as comparison from './comparison';
import * as vars from './vars';
import * as fractions from './fractions';
import * as exponent from './exponent';
import * as misc from './misc';
import * as constants from './constants';
import * as trigonometry from './trigonometry';
import * as geometry from './geometry';
import * as logic from './logic';
import * as matrices from './matrices';
import * as operators from './operators';
import * as log from './log';
import * as subSup from './sub-sup';
import * as statistics from './statistics';

const hs = [
  [vars.x, vars.y, exponent.squared, exponent.squareRoot, vars.theta],
  [fractions.xOverBlank, subSup.subscript, exponent.xToPowerOfN, exponent.nthRoot],
  [comparison.lessThanEqual, comparison.greaterThanEqual, misc.plusMinus, misc.absValue],
  [constants.pi, { name: 'i', latex: 'i', write: 'i' }, misc.parenthesis, misc.brackets],
  [trigonometry.sin, trigonometry.cos, trigonometry.tan, geometry.degree]
];

const advancedAlgebra = (() => {
  const out = [...hs.map(arr => [...arr])];

  out[1].push(log.log);
  out[2].push(log.logSubscript);
  out[3].push(log.ln);
  out[4].push(constants.eulers);
  return out;
})();

const statisticsSet = (() => {
  const out = [...hs.map(arr => [...arr])];
  out[0][out[0].length - 1] = subSup.subscript;
  out[1].push(statistics.mu);
  out[2].push(statistics.xBar);
  out[3].push(statistics.yBar);
  out[4].push(statistics.sigma);
  return out;
})();

const gradeSets = [
  {
    predicate: n => n >= 3 && n <= 5,
    set: [
      [comparison.lessThan, comparison.greaterThan],
      [fractions.xOverBlank, fractions.xBlankBlank],
      [vars.x]
    ]
  },
  {
    predicate: n => n === 6 || n === 7,
    set: [
      [vars.x, vars.y, exponent.squared, exponent.squareRoot, operators.circleDot],
      [fractions.xOverBlank, fractions.xBlankBlank, exponent.xToPowerOfN, exponent.nthRoot],
      [comparison.lessThan, comparison.greaterThan, misc.plusMinus, misc.absValue],
      [comparison.lessThanEqual, comparison.greaterThanEqual, misc.parenthesis, constants.pi],
      [trigonometry.sin, trigonometry.cos, trigonometry.tan, geometry.degree]
    ]
  },
  {
    predicate: n => n >= 8 || n === 'HS',
    set: [
      [vars.x, vars.y, exponent.squared, exponent.squareRoot, operators.circleDot],
      [
        fractions.xOverBlank,
        subSup.subscript,
        exponent.xToPowerOfN,
        exponent.nthRoot,
        subSup.subscript
      ],
      [
        comparison.lessThanEqual,
        comparison.greaterThanEqual,
        misc.plusMinus,
        misc.absValue
        // matrices.singleCellMatrix
      ],
      [
        constants.pi,
        { name: 'i', latex: 'i', write: 'i' },
        misc.parenthesis,
        misc.brackets
        // matrices.doubleCellMatrix
      ],
      [trigonometry.sin, trigonometry.cos, trigonometry.tan, geometry.degree]
    ]
  },
  {
    predicate: 'geometry',
    set: [
      [
        geometry.degree,
        geometry.primeArcminute,
        geometry.doublePrimeArcSecond,
        geometry.triangle,
        fractions.xOverBlank
      ],
      [
        geometry.angle,
        geometry.measureOfAngle,
        geometry.similarTo,
        geometry.congruentTo,
        exponent.squareRoot
      ],
      [trigonometry.sin, trigonometry.cos, trigonometry.tan, trigonometry.sec, exponent.nthRoot],
      [trigonometry.csc, trigonometry.cot, exponent.xToPowerOfN, constants.pi, subSup.subscript],
      [
        geometry.overline,
        geometry.overRightArrow,
        geometry.overLeftRightArrow,
        geometry.overArc,
        vars.theta
      ]
    ]
  },
  {
    predicate: 'everything',
    set: [
      [
        subSup.superscript,
        subSup.subscript,
        fractions.blankOverBlank,
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
    ]
  },
  {
    predicate: 'advanced-algebra',
    set: advancedAlgebra
  },
  {
    predicate: 'statistics',
    set: statisticsSet
  }
];

export const keysForGrade = n => {
  if (!n) {
    return [];
  }

  const match = gradeSets.find(gs => {
    if (typeof gs.predicate === 'string') {
      return gs.predicate === n;
    } else {
      return gs.predicate(n);
    }
  });
  if (match) {
    return match.set || [];
  }
};
