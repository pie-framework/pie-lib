/* eslint-disable no-console */
import * as mathjs from 'mathjs';
import me from '@pie-framework/math-expressions';

const decimalCommaRegex = /,/g;
const decimalRegex = /\.|,/g;
const decimalWithThousandSeparatorNumberRegex = /^(?!0+\.00)(?=.{1,9}(\.|$))(?!0(?!\.))\d{1,3}(,\d{3})*(\.\d+)?$/;

const rationalizeAllPossibleSubNodes = (expression) => rationalize(mathjs.parse(expression));
const rationalize = (tree) => {
  const transformedTree = tree.transform((node) => {
    try {
      const rationalizedNode = mathjs.rationalize(node);
      return rationalizedNode;
    } catch {
      return node;
    }
  });
  return transformedTree;
};

function prepareExpression(string, isLatex) {
  let returnValue = string ? string.trim() : '';

  returnValue = returnValue.replace(decimalCommaRegex, '.');

  returnValue = isLatex
    ? latexToText(`${returnValue}`)
    : textToMathText(`${returnValue}`, { unknownCommands: 'passthrough' }).toString();

  returnValue = returnValue.replace('=', '==');
  return rationalizeAllPossibleSubNodes(returnValue);
}

const latexToAstOpts = {
  missingFactor: (token, e) => {
    console.warn('missing factor for: ', token.token_type);
    if (token.token_type === 'NUMBER') {
      throw e;
    }
    return 0;
  },
  unknownCommandBehavior: 'passthrough',
};

const astToTextOpts = {
  unicode_operators: {
    ne: function(operands) {
      return operands.join(' != ');
    },
    '%': function(operands) {
      return `percent(${operands[0]})`;
    },
  },
};

export const latexToText = (latex, extraOtps = {}) => {
  const la = new me.converters.latexToAstObj({ ...latexToAstOpts, ...extraOtps });

  const at = new me.converters.astToTextObj({ ...astToTextOpts, ...extraOtps });

  const ast = la.convert(latex);

  return at.convert(ast);
};

export const textToMathText = (latex, extraOtps = {}) => {
  const la = new me.converters.textToAstObj({ ...latexToAstOpts, ...extraOtps });

  const at = new me.converters.astToTextObj({ ...astToTextOpts, ...extraOtps });

  const ast = la.convert(latex);

  return at.convert(ast);
};

function shouldRationalizeEntireTree(tree) {
  let shouldDoIt = true;

  // we need to iterate the entire tree to check for some conditions that might make rationalization impossible
  try {
    tree.traverse((node) => {
      // if we have a variable as an exponent for power operation, we should not rationalize
      // try to see if there are power operations with variable exponents
      if (node.type === 'OperatorNode' && node.fn === 'pow') {
        const exponent = node.args[1];

        // try to see if it can be compiled and evaluated - if it's a non-numerical value, it'll throw an error
        exponent.compile().eval();
      }

      // we cannot have variables for unresolved function calls either
      if (node.type === 'FunctionNode') {
        //try to see if the argument that the function is called with can be resolved as non-variable
        const functionParameter = node.args[0];

        // if it holds variables, this will throw an error
        functionParameter.compile().eval();
      }
    });

    mathjs.rationalize(tree);
  } catch {
    shouldDoIt = false;
  }

  return shouldDoIt;
}

function containsDecimal(expression = '') {
  return expression.match(decimalRegex);
}
const SIMPLIFY_RULES = [
  { l: 'n1^(1/n2)', r: 'nthRoot(n1, n2)' },
  { l: 'sqrt(n1)', r: 'nthRoot(n1, 2)' },
];

const simplify = (v) => mathjs.simplify(v, SIMPLIFY_RULES.concat(mathjs.simplify.rules)); //.concat(SIMPLIFY_RULES));

const areValuesEqual = (valueOne, valueTwo, options = {}) => {
  const {
    // if explicitly set to false, having a decimal value in either side will result in a false equality
    // regardless of mathematical correctness
    allowDecimals,
    isLatex, // if the passed in values are latex, they need to be escaped
    inverse, // returns inverse for the comparison result
  } = options;

  let valueOneToUse = valueOne;
  let valueTwoToUse = valueTwo;

  if (allowDecimals === false) {
    if (containsDecimal(valueOne) || containsDecimal(valueTwo)) {
      return false;
    }
  } else if (allowDecimals === true) {
    if (containsDecimal(valueOne) && decimalWithThousandSeparatorNumberRegex.test(valueOne)) {
      valueOneToUse = valueOne.replace(decimalCommaRegex, '');
    }

    if (containsDecimal(valueTwo) && decimalWithThousandSeparatorNumberRegex.test(valueTwo)) {
      valueTwoToUse = valueTwo.replace(decimalCommaRegex, '');
    }
  }

  const preparedValueOne = prepareExpression(valueOneToUse, isLatex, allowDecimals);
  const preparedValueTwo = prepareExpression(valueTwoToUse, isLatex, allowDecimals);

  let one = shouldRationalizeEntireTree(preparedValueOne) ? mathjs.rationalize(preparedValueOne) : preparedValueOne;
  let two = shouldRationalizeEntireTree(preparedValueTwo) ? mathjs.rationalize(preparedValueTwo) : preparedValueTwo;

  one = simplify(one);
  two = simplify(two);

  const equals = one.equals(two);

  return inverse ? !equals : equals;
};

export const ave = (a, b) => {
  const am = mathjs.parse(a);
  const bm = mathjs.parse(b);

  const arm = simplify(am);
  const brm = simplify(bm);
  return arm.equals(brm);
};

export default areValuesEqual;
