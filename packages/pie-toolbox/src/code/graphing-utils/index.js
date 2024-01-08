import debug from 'debug';
import Point from '@mapbox/point-geometry';
import _ from 'lodash';
const log = debug('pie-lib:graphing:tools:utils');

export const FREQ_DIVIDER = 16;

export const getAmplitudeAndFreq = (root, edge) => {
  if (!edge) {
    return { freq: 0, amplitude: 0 };
  }

  if (root.x == edge.x) {
    return { freq: 0, amplitude: 0 };
  }

  const r = new Point(root.x, root.y);
  const e = new Point(edge.x, edge.y);
  const d = e.sub(r);
  // edge point describes 1/4 of the freq
  return { freq: d.x * 4, amplitude: d.y };
};

/**
 * build the x points with root as the anchor.
 */
export const xPoints = (root, freq, min, max) => {
  freq = Math.abs(freq);
  log('[xPoints] root:', root, 'freq:', freq, ' min:', min, ' max:', max);
  const leftpoints = _.rangeRight(root, min - freq, freq * -1);
  const rightpoints = _.range(root + freq, max + freq, freq);

  return _.concat(leftpoints, rightpoints);
};

/**
 * Calculate y for x value using amp, freq and shift
 * https://www.desmos.com/calculator/f1psfoiiv6
 */
export const sinY = (amplitude, freq, shift) => (x) => {
  shift = { phase: 0, vertical: 0, ...shift };
  const TWO_PI = Math.PI * 2;
  const num = TWO_PI * (x - shift.phase);
  const frac = num / freq;
  const sin = Math.sin(frac);
  const sinFloat = parseFloat(sin).toFixed(10);
  return amplitude * sinFloat + shift.vertical;
};

/**
 * You need three points for the quadratic eq, so we mirror the edge point
 * https://www.desmos.com/calculator/xhz1xqgpca
 */
export const parabolaFromTwoPoints = (root, edge) => {
  edge = edge || { ...root };
  const mirrorEdge = { x: root.x - (edge.x - root.x), y: edge.y };
  return parabolaFromThreePoints(root, edge, mirrorEdge);
};

export const parabolaFromThreePoints = (one, two, three) => {
  log(one, two, three);
  const { a, b, c } = pointsToABC(one, two, three);
  log(a, b, c);
  return parabola(a, b, c);
};
/** derive a,b,c from the 3 points */
export const pointsToABC = (one, two, three) => {
  const a1 = Math.pow(one.x, 2) * -1 + Math.pow(two.x, 2);
  const b1 = one.x * -1 + two.x;
  const d1 = one.y * -1 + two.y;
  const a2 = Math.pow(two.x, 2) * -1 + Math.pow(three.x, 2);
  const b2 = two.x * -1 + three.x;
  const d2 = two.y * -1 + three.y;
  const bMult = (b2 / b1) * -1;
  const a3 = bMult * a1 + a2;
  const d3 = bMult * d1 + d2;
  const a = d3 / a3;
  const b = (d1 - a1 * a) / b1;
  const c = one.y - a * Math.pow(one.x, 2) - b * one.x;
  return { a, b, c };
};

/**
 * y=ax^2+bx+c
 */
export const parabola = (a, b, c) => (x) => a * Math.pow(x, 2) + b * x + c;

/**
 * Absolute value from two points Root (Vertex) the point where the two rays intersect and edge One point on a ray.
 * @param root 1st point selected on graph
 * @param edge 2nd point selected on graph
 * https://www.desmos.com/calculator/rarxiatpip
 */
export const absoluteFromTwoPoints = (root, edge) => {
  edge = edge || { ...root };
  const a = pointsToAForAbsolute(root, edge);
  return absolute(a, root.x, root.y);
};

/*
 * Finds value of a in y=a*abs(x-h)+k function
 * @param one 1st point
 * @param two 2nd point
 * */
export const pointsToAForAbsolute = (one, two) => {
  const y1 = two.y - one.y;
  const x1 = two.x - one.x;
  let a = y1 / x1;
  if (two.x < one.x) {
    a = a * -1;
  }
  return a;
};

/**
 * y=a*abs(x-h)+k
 */
export const absolute = (a, h, k) => (x) => a * Math.abs(x - h) + k;

/**
 * Exponential from two points on exponential graph.
 * @param root 1st point selected on graph
 * @param edge 2nd point selected on graph
 * https://www.desmos.com/calculator/3fisjexbvp
 */
export const exponentialFromTwoPoints = (root, edge) => {
  edge = edge || { ...root };
  const { a, b } = pointsToABForExponential(root, edge);
  return exponential(a, b);
};

/*
 * Finds value of a and b in y=a*(b)^x function
 * @param one 1st point
 * @param two 2nd point
 * */
export const pointsToABForExponential = (one, two) => {
  const p = one.y / two.y;
  const r = 1 / (one.x - two.x);
  const b = Math.pow(p, r);
  const a = one.y / Math.pow(b, one.x);
  return { a, b };
};

/**
 * y=a*(b)^x
 */
export const exponential = (a, b) => (x) => a * Math.pow(b, x);

/**
 * Generate a set of data points, add spacing before min and after max if there is space between minx + min and maxX and max
 * @param {*} domain
 * @param {*} range
 * @param {*} root
 * @param {*} edge
 * @param {*} yFn
 * @param {*} excludeOutsidePoints
 */
export const buildDataPoints = (domain, range, root, edge, yFn, excludeOutsidePoints = false) => {
  log('[buildDataPoints] domain:', domain, 'range:', range, 'root:', root, 'edge:', edge);

  domain = { min: 0, max: 0, step: 1, ...domain };
  range = { min: 0, max: 0, step: 1, ...range };
  edge = edge ? edge : { ...root };

  const minX = Math.min(root.x, edge.x);
  const xPts = xPoints(minX, domain.step, domain.min - domain.step, domain.max + domain.step);

  log('[buildDataPoints]:xPts:', xPts);

  let startIndex = -1;
  let endIndex = -1;

  // generate points based on the yFn
  const points = xPts.map((v) => new Point(v, yFn(v)));

  if (!excludeOutsidePoints) {
    return points;
  }

  // exclude the points with y outside range min and max
  const filteredPoints = points.reduce((acc, val, index) => {
    if (val.y >= range.min - range.step && val.y <= range.max + range.step) {
      if (startIndex === -1) {
        startIndex = index;
      }

      if (endIndex < index) {
        endIndex = index;
      }

      return [...acc, val];
    }

    return acc;
  }, []);

  // add the first value outside range min and max smaller than range.min if exists
  if (startIndex - 1 >= 0) {
    filteredPoints.unshift(points[startIndex - 1]);
  }

  // add the first value outside range min and max greater than range.min if exists
  if (endIndex + 1 <= points.length - 1) {
    filteredPoints.push(points[endIndex + 1]);
  }

  return points;
};

export default {
  FREQ_DIVIDER,
  getAmplitudeAndFreq,
  xPoints,
  sinY,
  parabolaFromTwoPoints,
  parabolaFromThreePoints,
  pointsToABC,
  parabola,
  absoluteFromTwoPoints,
  pointsToAForAbsolute,
  absolute,
  exponentialFromTwoPoints,
  pointsToABForExponential,
  exponential,
  buildDataPoints,
};
