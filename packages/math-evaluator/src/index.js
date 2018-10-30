import mathjs from 'mathjs';

function prepareExpression(string) {
  return string ? string.trim() : '';
}

function canExpressionBeRationalized(expression) {
  return !['sin', 'cos', 'tan', 'ctg'].some(trigFunc => expression.includes(trigFunc));
}

export default function areValuesEqual(valueOne, valueTwo, options = {}) {
  const {
    inverse // returns inverse for the comparison result
  } = options;

  const preparedValueOne = prepareExpression(valueOne);
  const preparedValueTwo = prepareExpression(valueTwo);

  let one = canExpressionBeRationalized(preparedValueOne) ? mathjs.rationalize(preparedValueOne) : preparedValueOne;
  let two = canExpressionBeRationalized(preparedValueTwo) ? mathjs.rationalize(preparedValueTwo) : preparedValueTwo;

  one = mathjs.simplify(one);
  two = mathjs.simplify(two);

  const equals = one.equals(two);

  return inverse ? !equals : equals;
}
