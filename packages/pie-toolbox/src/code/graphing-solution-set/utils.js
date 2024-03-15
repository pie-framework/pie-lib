import head from 'lodash/head';
import tail from 'lodash/tail';
import { utils } from '../plot';
import invariant from 'invariant';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';

export const bounds = utils.bounds;
export const point = utils.point;

//TODO: This can be removed?
export const getAngleDeg = () => 0;
//TODO: This can be removed?
export const arrowDimensions = () => 0;

export const getTickValues = (prop) => {
  const tickValues = [];
  let tickVal = 0;

  while (tickVal >= prop.min && tickValues.indexOf(tickVal) < 0) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal - prop.step) * 10000) / 10000;
  }

  tickVal = Math.round(prop.step * 10000) / 10000;

  while (tickVal <= prop.max && tickValues.indexOf(tickVal) < 0) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal + prop.step) * 10000) / 10000;
  }

  // return only ticks that are inside the min-max interval
  if (tickValues) {
    return tickValues.filter((tV) => tV >= prop.min && tV <= prop.max);
  }

  return [];
};

export const countWords = (label) => {
  if (label == null || isEmpty(label)) {
    return 1;
  }

  const words = label.split(' ');
  return words.length;
};

// findLongestWord is also used in plot
export const findLongestWord = (label) => {
  let longestWord = (label || '')
    .replace(/<[^>]+>/g, '')
    .split(' ')
    .sort((a, b) => b.length - a.length);

  return longestWord[0].length;
};

// amountToIncreaseWidth is also used in plot
export const amountToIncreaseWidth = (longestWord) => {
  if (!longestWord) {
    return 0;
  }

  return longestWord * 10;
};

export const polygonToArea = (points) => {
  const h = head(points);
  const area = {
    left: h.x,
    top: h.y,
    bottom: h.y,
    right: h.x,
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

export const getRightestPoints = (points) => {
  const sortedPoints = cloneDeep(points);
  sortedPoints.sort((a, b) => b.x - a.x);

  return { a: sortedPoints[0], b: sortedPoints[1] };
};

export const getMiddleOfTwoPoints = (a, b) => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

export const roundNumber = (number) => parseFloat(number.toFixed(4));

export const sameAxes = (p1, p2) =>
  p1 && p2 && (roundNumber(p1.x) === roundNumber(p2.x) || roundNumber(p1.y) === roundNumber(p2.y));

export const equalPoints = (p1, p2) =>
  p1 &&
  p2 &&
  isEqual(
    {
      x: roundNumber(p1.x),
      y: roundNumber(p1.y),
    },
    {
      x: roundNumber(p2.x),
      y: roundNumber(p2.y),
    },
  );

const getDistanceBetweenTicks = (axis, size) => {
  const { min, max, step } = axis;
  const nbOfTicks = (max - min) / step;

  return size / nbOfTicks;
};

export const thinnerShapesNeeded = (graphProps) => {
  const {
    domain,
    range,
    size: { width, height },
  } = graphProps;

  // 14 is the default width of a point
  return getDistanceBetweenTicks(domain, width) < 14 || getDistanceBetweenTicks(range, height) < 14;
};

export const getAdjustedGraphLimits = (graphProps) => {
  const {
    domain,
    range,
    size: { width, height },
  } = graphProps;
  const domainTicksDistance = getDistanceBetweenTicks(domain, width);
  const rangeTicksDistance = getDistanceBetweenTicks(range, height);

  // 15 is the distance required for the arrow to extend the graph
  const domainPadding = domain.step / (domainTicksDistance / 15);
  const rangePadding = range.step / (rangeTicksDistance / 15);

  return {
    domain: {
      min: domain.min - domainPadding,
      max: domain.max + domainPadding,
    },
    range: {
      min: range.min - rangePadding,
      max: range.max + rangePadding,
    },
  };
};

const sortPoints = (array) => (array || []).sort((a, b) => a.x - b.x || a.y - b.y);

// check colliniarity of 3 points (source: https://www.geeksforgeeks.org/program-check-three-points-collinear/)
const checkCollinearity = (a, b, c) => (a.x - b.x) * (c.y - b.y) === (c.x - b.x) * (a.y - b.y);

// 2 lines are overlapping if all 4 points are collinear
const isSameLine = (markA, markB) =>
  checkCollinearity(markA.from, markB.from, markB.to) && checkCollinearity(markA.to, markB.from, markB.to);

export const isDuplicatedMark = (mark, marks, oldMark) => {
  const { type, building } = mark;

  if (building) {
    return false;
  }

  const filteredMarks = (marks || []).filter((m) => m.type === type && !m.building);
  const index = filteredMarks.findIndex((m) => isEqual(m, oldMark));

  if (index !== -1) {
    filteredMarks.splice(index, 1);
  }

  const duplicated = filteredMarks.find((m) => {
    if (type === 'line') {
      const { from, to } = mark;
      return (
        (equalPoints(from, m.from) && equalPoints(to, m.to)) ||
        (equalPoints(from, m.to) && equalPoints(to, m.from)) ||
        (type === 'line' && isSameLine(m, mark))
      );
    } else if (type === 'polygon') {
      return isEqual(sortPoints(cloneDeep(mark.points)), sortPoints(cloneDeep(m.points)));
    }
  });

  return !!duplicated;
};

export const areArraysOfObjectsEqual = (array1, array2) => {
  // Check if both arrays have the same length
  if (array1.length !== array2.length) {
    return false;
  }
  // Iterate through each object in the arrays
  for (let i = 0; i < array1.length; i++) {
    // Get the current objects in both arrays
    const obj1 = array1[i];
    const obj2 = array2[i];
    // Check if the objects have the same number of properties
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }
    // Iterate through each property in the objects
    for (const key in obj1) {
      // Check if the properties and their values are equal
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
  }
  // If all objects are equal, the arrays are the same
  return true;
};
