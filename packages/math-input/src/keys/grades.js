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
import * as logic from './logic';
import * as nav from './navigation';
import * as edit from './edit';

const hs = [
  [fractions.blankOverBlank, misc.percentage, vars.x, exponent.squared, exponent.squareRoot],
  [operators.circleDot, vars.y, subSup.subscript, exponent.xToPowerOfN, exponent.nthRoot],
  [
    misc.plusMinus,
    comparison.lessThan,
    comparison.greaterThan,
    comparison.lessThanEqual,
    comparison.greaterThanEqual
  ],
  [constants.pi, vars.theta, misc.parenthesis, misc.brackets, misc.absValue],
  [misc.notEqual, trigonometry.sin, trigonometry.cos, trigonometry.tan, geometry.degree]
];

const advancedAlgebra = (() => {
  const out = [...hs.map(arr => [...arr])];

  out[0].push({ name: 'i', latex: 'i', write: 'i' });
  out[1].push(log.log);
  out[2].push(log.logSubscript);
  out[3].push(log.ln);
  out[4].push(constants.eulers);
  return out;
})();

const statisticsSet = (() => {
  const out = [...hs.map(arr => [...arr])];
  out[0].push(statistics.mu);
  out[1].push(statistics.xBar);
  out[2].push(statistics.yBar);
  out[3].push(statistics.sigma);
  out[4].push(statistics.smallSigma);
  return out;
})();

export const gradeSets = [
  {
    predicate: n => n >= 3 && n <= 5,
    set: [
      [comparison.lessThan, comparison.greaterThan],
      [fractions.xOverBlank, fractions.xBlankBlank],
      [vars.x, logic.longDivision]
    ]
  },
  {
    predicate: n => n >= 6 && n <= 7,
    set: [
      [geometry.degree, comparison.lessThan, comparison.greaterThan],
      [operators.circleDot, comparison.lessThanEqual, comparison.greaterThanEqual],
      [vars.x, vars.y, exponent.squared, exponent.xToPowerOfN],
      [misc.plusMinus, fractions.xOverBlank, fractions.xBlankBlank, exponent.squareRoot],
      [constants.pi, misc.parenthesis, misc.absValue, exponent.nthRoot]
    ]
  },
  {
    predicate: n => n >= 8 || n === 'HS',
    set: hs
  },
  {
    predicate: 'non-negative-integers',
    set: [
      [digits.seven, digits.eight, digits.nine],
      [digits.four, digits.five, digits.six],
      [digits.one, digits.two, digits.three],
      [digits.zero, { name: '', latex: '', write: '' }, { name: '', latex: '', write: '' }],
      [nav.left, nav.right, edit.del]
    ]
  },
  {
    predicate: 'integers',
    set: [
      [digits.seven, digits.eight, digits.nine],
      [digits.four, digits.five, digits.six],
      [digits.one, digits.two, digits.three],
      [digits.zero, { name: '', latex: '', write: '' }, basicOperators.minus],
      [nav.left, nav.right, edit.del]
    ]
  },
  {
    predicate: 'decimals',
    set: [
      [digits.seven, digits.eight, digits.nine],
      [digits.four, digits.five, digits.six],
      [digits.one, digits.two, digits.three],
      [digits.zero, digits.decimalPoint, basicOperators.minus],
      [nav.left, nav.right, edit.del]
    ]
  },
  {
    predicate: 'fractions',
    set: [
      [digits.seven, digits.eight, digits.nine],
      [digits.four, digits.five, digits.six],
      [digits.one, digits.two, digits.three],
      [digits.zero, fractions.blankOverBlank, basicOperators.minus],
      [nav.left, nav.right, edit.del]
    ]
  },
  {
    predicate: 'geometry',
    set: [
      [
        fractions.blankOverBlank,
        geometry.degree,
        geometry.primeArcminute,
        geometry.doublePrimeArcSecond,
        geometry.congruentTo,
        geometry.similarTo
      ],
      [
        operators.circleDot,
        geometry.angle,
        geometry.measureOfAngle,
        geometry.triangle,
        geometry.notCongruentTo,
        misc.notSimilar
      ],
      [
        trigonometry.sin,
        trigonometry.cos,
        trigonometry.tan,
        constants.pi,
        exponent.squareRoot,
        exponent.nthRoot
      ],
      [
        trigonometry.csc,
        trigonometry.sec,
        trigonometry.cot,
        vars.theta,
        subSup.subscript,
        exponent.xToPowerOfN
      ],
      [
        geometry.overline,
        geometry.overRightArrow,
        geometry.overLeftRightArrow,
        geometry.overArc,
        geometry.perpindicular,
        geometry.parallel
      ]
    ]
  },
  // {
  //   predicate: 'miscellaneous',
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
  },
  {
    predicate: 'item-authoring',
    set: [
      [
        basicOperators.divide,
        fractions.blankOverBlank,
        logic.longDivision,
        constants.halfInfinity,
        exponent.squared,
        exponent.squareRoot,
        geometry.overline,
        geometry.overRightArrow,
        geometry.overLeftRightArrow,
        log.log
      ],
      [
        basicOperators.multiply,
        operators.circleDot,
        { name: '', latex: '', write: '' },
        subSup.subscript,
        exponent.xToPowerOfN,
        exponent.nthRoot,
        geometry.perpindicular,
        geometry.parallel,
        geometry.overArc,
        log.logSubscript
      ],
      [
        misc.plusMinus,
        constants.pi,
        vars.theta,
        geometry.degree,
        geometry.angle,
        geometry.leftArrow,
        geometry.rightArrow,
        geometry.triangle,
        geometry.square,
        log.ln
      ],
      [
        misc.notEqual,
        misc.absValue,
        statistics.smallSigma,
        statistics.mu,
        logic.therefore,
        statistics.sigma,
        geometry.leftrightArrow,
        trigonometry.sin,
        trigonometry.cos,
        trigonometry.tan
      ],
      [
        comparison.lessThanEqual,
        comparison.greaterThanEqual,
        { name: '', latex: '', write: '' },
        { name: '', latex: '', write: '' },
        constants.infinity,
        { name: '', latex: '', write: '' },
        { name: '', latex: '', write: '' },
        trigonometry.csc,
        trigonometry.sec,
        trigonometry.cot
      ]
    ]
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

    return !latex ? additionalkey : predefinedKey || additionalkey;
  });
};
