import head from 'lodash/head';
import tail from 'lodash/tail';
import { utils } from '@pie-lib/plot';
import invariant from 'invariant';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';

export const tickCount = utils.tickCount;
export const bounds = utils.bounds;
export const point = utils.point;

//TODO: This can be removed?
export const getAngleDeg = () => 0;
//TODO: This can be removed?
export const arrowDimensions = () => 0;

export const getTickValues = prop => {
  const tickValues = [];
  let tickVal = 0;

  while (tickVal >= prop.min && tickValues.indexOf(tickVal) < 0) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal - prop.step) * 1000) / 1000;
  }

  tickVal = Math.round(prop.step * 1000) / 1000;

  while (tickVal <= prop.max && tickValues.indexOf(tickVal) < 0) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal + prop.step) * 1000) / 1000;
  }

  // return only ticks that are inside the min-max interval
  if (tickValues) {
    return tickValues.filter(tV => tV >= prop.min && tV <= prop.max);
  }

  return [];
};

export const countWords = label => {
  if (label == null || isEmpty(label)) {
    return 1;
  }

  const words = label.split(' ');
  return words.length;
};

// findLongestWord is also used in plot
export const findLongestWord = label => {
  let longestWord = (label || '')
    .replace(/<[^>]+>/g, '')
    .split(' ')
    .sort((a, b) => b.length - a.length);

  return longestWord[0].length;
};

// amountToIncreaseWidth is also used in plot
export const amountToIncreaseWidth = longestWord => {
  if (!longestWord) {
    return 0;
  }

  return longestWord * 10;
};

export const polygonToArea = points => {
  const h = head(points);
  const area = {
    left: h.x,
    top: h.y,
    bottom: h.y,
    right: h.x
  };
  return tail(points).reduce((a, p) => {
    a.left = Math.min(a.left, p.x);
    a.top = Math.max(a.top, p.y);
    a.bottom = Math.min(a.bottom, p.y);
    a.right = Math.max(a.right, p.x);
    return a;
  }, area);
};

export const lineToArea = (from, to) => pointsToArea(from, to);

export const pointsToArea = (a, b) => {
  invariant(!!a && !!b, 'a or b is undefined');
  const left = Math.min(a.x, b.x);
  const top = Math.max(a.y, b.y);
  const bottom = Math.min(a.y, b.y);
  const right = Math.max(a.x, b.x);
  return { left, top, bottom, right };
};

export const isDomainRangeEqual = (graphProps, nextGraphProps) => {
  return (
    isEqual(graphProps.domain, nextGraphProps.domain) &&
    isEqual(graphProps.range, nextGraphProps.range)
  );
};

export const getRightestPoints = points => {
  const sortedPoints = cloneDeep(points);
  sortedPoints.sort((a, b) => b.x - a.x);

  return { a: sortedPoints[0], b: sortedPoints[1] };
};

export const getMiddleOfTwoPoints = (a, b) => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2
});

const roundNumber = number => parseFloat(number.toFixed(3));

export const sameAxes = (p1, p2) =>
  p1 && p2 && (roundNumber(p1.x) === roundNumber(p2.x) || roundNumber(p1.y) === roundNumber(p2.y));

export const equalPoints = (p1, p2) =>
  p1 &&
  p2 &&
  isEqual(
    {
      x: roundNumber(p1.x),
      y: roundNumber(p1.y)
    },
    {
      x: roundNumber(p2.x),
      y: roundNumber(p2.y)
    }
  );
