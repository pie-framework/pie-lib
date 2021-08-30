import * as comparison from './comparison';
import * as vars from './vars';
import * as fractions from './fractions';
import * as exponent from './exponent';
import * as misc from './misc';
import * as constants from './constants';
import * as trigonometry from './trigonometry';
import * as geometry from './geometry';
import * as operators from './operators';
import * as log from './log';
import * as subSup from './sub-sup';
import * as statistics from './statistics';
import * as basicOperators from './basic-operators';
import * as matrices from './matrices';
import digits from './digits';

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
  out[1].push(statistics.mu);
  out[2].push(statistics.xBar);
  out[3].push(statistics.yBar);
  out[4].push(statistics.sigma);
  return out;
})();

export const gradeSets = [
  {
    predicate: n => n >= 3 && n <= 5,
    set: [
      [comparison.lessThan, comparison.greaterThan],
      [fractions.xOverBlank, fractions.xBlankBlank],
      [vars.x]
    ]
  },
  {
    predicate: n => n >= 6 && n <= 7,
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
      [fractions.xOverBlank, subSup.subscript, exponent.xToPowerOfN, exponent.nthRoot],
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
    predicate: 'miscellaneous',
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
  // {
  //   predicate: 'everything',
  //   set: [
  //     [
  //       subSup.superscript,
  //       subSup.subscript,
  //       fractions.blankOverBlank,
  //       misc.percentage,
  //       geometry.segment,
  //       geometry.parallel
  //     ],
  //     [
  //       exponent.squareRoot,
  //       exponent.nthRoot,
  //       misc.absValue,
  //       misc.parenthesis,
  //       geometry.perpindicular,
  //       geometry.angle
  //     ],
  //     [
  //       comparison.lessThan,
  //       comparison.greaterThan,
  //       geometry.degree,
  //       misc.approx,
  //       geometry.measureOfAngle,
  //       geometry.triangle
  //     ],
  //     [
  //       misc.nApprox,
  //       misc.notEqual,
  //       geometry.congruentTo,
  //       geometry.notCongruentTo,
  //       geometry.parallelogram,
  //       geometry.circledDot
  //     ],
  //     [
  //       misc.similar,
  //       misc.notSimilar,
  //       comparison.lessThanEqual,
  //       comparison.greaterThanEqual,
  //       vars.x,
  //       vars.y
  //     ]
  //   ]
  // },
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
  const number = parseInt(n, 10);
  n = isNaN(number) ? n : number;
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

const ALL_KEYS = [
  ...Object.values(basicOperators),
  ...Object.values(comparison),
  ...Object.values(constants),
  ...Object.values(digits),
  ...Object.values(exponent),
  ...Object.values(fractions),
  ...Object.values(geometry),
  ...Object.values(log),
  ...Object.values(matrices),
  ...Object.values(misc),
  ...Object.values(operators),
  ...Object.values(statistics),
  ...Object.values(subSup),
  ...Object.values(trigonometry),
  ...Object.values(vars)
];

export const normalizeAdditionalKeys = additionalKeys => {
  return (additionalKeys || []).map(additionalkey => {
    const { latex } = additionalkey;
    const predefinedKey = (ALL_KEYS || []).find(
      key =>
        latex === key.latex ||
        latex === key.write ||
        latex === key.command ||
        latex === key.otherNotation
    );

    return predefinedKey || additionalkey;
  });
};
