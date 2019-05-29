import debug from 'debug';
// import { swap } from '../point/utils';

const log = debug('pie-lib:charting:line:utils');

const lineExpressionRegex = new RegExp(/([+|-]?\d+)?(x)?([+|-]\d+)?/i);

export class Expression {
  constructor(multiplier, b) {
    this.multiplier = multiplier;
    this.isVerticalLine = Math.abs(this.multiplier) === Infinity;
    this.b = this.isVerticalLine ? undefined : b;
  }

  expr() {
    return this.isVerticalLine ? 'x' : `${this.multiplier}x + ${this.b}`;
  }

  getY(x) {
    return this.isVerticalLine ? x : this.multiplier * x + this.b;
  }

  getX(y) {
    return this.isVerticalLine ? y : (y - this.b) / this.multiplier;
  }

  equals(other) {
    return this.multiplier === other.multiplier && this.b === other.b;
  }
}

export const pointsHaveSameExpression = (a, b) => {
  const expressionA = expression(a.from, a.to);
  const expressionB = expression(b.from, b.to);
  return expressionA.equals(expressionB);
};
/**
 * Create a linear expression from 2 points
 */

export const expression = (from, to) => {
  log('[expression] from: ', from, 'to: ', to);
  const multiplier = (to.y - from.y) / (to.x - from.x);
  const zeroedY = multiplier * from.x;
  const b = from.y - zeroedY;
  return new Expression(multiplier, b);
};

export const point = (x, y) => ({ x, y });

export const pointsFromExpression = expression => {
  const to = point(0, expression.b);
  const huh = expression.getX(0);
  const from = point(huh, 0);

  return {
    from,
    to
  };
};

export const expressionFromDescriptor = descriptor => {
  const lineDescriptor = descriptor.match(lineExpressionRegex);
  const maybeB = parseInt(lineDescriptor[3], 10);
  const maybeMultiplier = parseInt(lineDescriptor[1], 10);
  let multiplier = isNaN(maybeMultiplier)
    ? lineDescriptor[2] === undefined
      ? 0
      : 1
    : maybeMultiplier;
  let b = isNaN(maybeB) ? 0 : maybeB;

  // it's a constant, no variable found
  if (lineDescriptor[2] === undefined) {
    b = multiplier;
    multiplier = 0;
  }

  return new Expression(multiplier, b);
};

export const hasLine = (lines, line) => lineIndex(lines, line) !== -1;

export const removeLine = (lines, line) => {
  const index = lineIndex(lines, line);
  if (index === -1) {
    return lines;
  }
  const out = lines.slice();
  out.splice(index, 1);
  return out;
};

export const removeLines = (lines, toRemove) => {
  log('[removeLines] points: ', lines, toRemove);
  toRemove = Array.isArray(toRemove) ? toRemove : [toRemove];
  const out = lines.filter(p => !hasLine(toRemove, p));
  log('[removePoints] points: ', out);
  return out;
};

export const pointsEqual = (a, b) => a.x == b.x && a.y == b.y;

export const linesEqual = (a, b) => pointsEqual(a.from, b.from) && pointsEqual(a.to, b.to);

export const lineIndex = (lines, line) => lines.findIndex(l => linesEqual(l, line));

// export const swapLine = (lines, from, to) => swap(lines, from, to, lineIndex);
