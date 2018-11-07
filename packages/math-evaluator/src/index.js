import mathjs from 'mathjs';
// import jsesc from 'jsesc';
import mathExpressions from 'math-expressions';

// const escape = s => jsesc(s);

function prepareExpression(string, isLatex) {
  let returnValue = string ? string.trim() : '';
  // returnValue = isLatex ? escape(returnValue) : returnValue;

  return isLatex ? mathExpressions.fromLatex(`${returnValue}`).toString() : mathExpressions.fromText(`${returnValue}`).toString();
}

function canExpressionBeRationalized(expression) {
  return !['sin', 'cos', 'tan', 'ctg'].some(trigFunc => expression.includes(trigFunc));
}

export default function areValuesEqual(valueOne, valueTwo, options = {}) {
  const {
    isLatex, // if the passed in values are latex, they need to be escaped
    inverse // returns inverse for the comparison result
  } = options;

  const preparedValueOne = prepareExpression(valueOne, isLatex);
  const preparedValueTwo = prepareExpression(valueTwo, isLatex);

  let one = canExpressionBeRationalized(preparedValueOne) ? mathjs.rationalize(preparedValueOne) : preparedValueOne;
  let two = canExpressionBeRationalized(preparedValueTwo) ? mathjs.rationalize(preparedValueTwo) : preparedValueTwo;

  one = mathjs.simplify(one);
  two = mathjs.simplify(two);

  const equals = one.equals(two);

  return inverse ? !equals : equals;
}
