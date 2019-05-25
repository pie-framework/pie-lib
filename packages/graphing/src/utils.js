import head from 'lodash/head';
import tail from 'lodash/tail';
import { utils } from '@pie-lib/plot';

export const tickCount = utils.tickCount;
export const bounds = utils.bounds;
export const point = utils.point;

// export { * from utils}
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

export const lineToArea = (from, to) => {
  const left = Math.min(from.x, to.x);
  const top = Math.max(from.y, to.y);
  const bottom = Math.min(from.y, to.y);
  const right = Math.max(from.x, to.x);
  return { left, top, bottom, right };
};

/**
 * Returns the angle that one line creates (line is determined from point A and point B)
 * @param ax - number - coordinate of X axis for point A
 * @param ay - number - coordinate of Y axis for point A
 * @param bx - number - coordinate of X axis for point B
 * @param by - number - coordinate of Y axis for point B
 * @returns {number}
 */
export const getAngleDeg = (ax, ay, bx, by) => {
  if (ax === bx) {
    if (ay < by) {
      angleDeg = 0;
    } else {
      angleDeg = 180;
    }

    return angleDeg;
  }

  if (ay === by) {
    if (ax < bx) {
      angleDeg = 90;
    } else {
      angleDeg = 270;
    }

    return angleDeg;
  }

  const angleRad = Math.atan((ay - by) / (ax - bx));
  let angleDeg = (angleRad * 180) / Math.PI;

  if (ax > bx) {
    angleDeg = 270 - angleDeg;
  } else {
    angleDeg = 90 - angleDeg;
  }

  return angleDeg;
};

/**
 * Returns third point on a line, that meets the borders of the graph
 * @param pointA - object with x and y
 * @param pointB - object with x and y
 * @param graphProps - object with domain and range, both having min and max values
 * these values define the borders for the graph
 * @returns {{x: number, y: number}}
 */
export const calculateThirdPointOnLine = (pointA, pointB, graphProps) => {
  const angle = getAngleDeg(pointA.x, pointA.y, pointB.x, pointB.y);
  let x;
  let y;
  const { domain, range } = graphProps;
  const { min: domainMin, max: domainMax } = domain;
  const { min: rangeMin, max: rangeMax } = range;

  const firstDial = angle >= 45 && angle < 135;
  const secondDial = angle >= 135 && angle < 225;
  const thirdDial = angle >= 225 && angle < 315;
  const fourthDial = angle >= 315 || angle < 45;

  const getY = x => ((x - pointA.x) * (pointB.y - pointA.y)) / (pointB.x - pointA.x) + pointA.y;
  const getX = y => ((pointB.x - pointA.x) * (y - pointA.y)) / (pointB.y - pointA.y) + pointA.x;

  const checkY = (x, y) => {
    if (y > rangeMax) {
      y = rangeMax;
      x = getX(y);
    }

    if (y < rangeMin) {
      y = rangeMin;
      x = getX(y);
    }

    return { x, y };
  };

  const checkX = (x, y) => {
    if (x > domainMax) {
      x = domainMax;
      y = getY(x);
    }

    if (x < domainMin) {
      x = domainMin;
      y = getY(x);
    }

    return { x, y };
  };

  let check;

  switch (true) {
    case firstDial: {
      x = domainMax;
      y = getY(x);
      check = checkY(x, y);
      x = check.x;
      y = check.y;

      break;
    }
    case secondDial: {
      y = rangeMin;
      x = getX(y);
      check = checkX(x, y);
      x = check.x;
      y = check.y;

      break;
    }
    case thirdDial: {
      x = domainMin;
      y = getY(x);
      check = checkY(x, y);
      x = check.x;
      y = check.y;

      break;
    }
    case fourthDial: {
      y = rangeMax;
      x = getX(y);
      check = checkX(x, y);
      x = check.x;
      y = check.y;

      break;
    }
    default:
      break;
  }

  return { x, y };
};

export const arrowDimensions = {
  none: 0,
  vector: 7,
  ray: 5,
  line: 5
};

/**
 * Returns a point that is between 'from' & 'to', closer to 'to'
 * The distance between 'to' and the returned point is defined by the 'type'
 * @param scale - object with x and y functions to scale a given number
 * @param from - object with x and y
 * @param to - object with x and y
 * @param type - undefined, 'vector', 'ray', 'line'
 * @returns {{x: number, y: number}}
 */
export const calculatePreviousNearestScaledPoint = (scale, from, to, type = 'none') => {
  const scaledFromX = scale.x(from.x);
  const scaledFromY = scale.y(from.y);
  let scaledToX = scale.x(to.x);
  let scaledToY = scale.y(to.y);
  let middlePoint;

  middlePoint = calculateThirdPointOnLine(
    { x: scaledToX, y: scaledToY },
    { x: scaledFromX, y: scaledFromY },
    {
      domain: {
        min: scale.x(to.x) - arrowDimensions[type],
        max: scale.x(to.x) + arrowDimensions[type]
      },
      range: {
        min: scale.y(to.y) - arrowDimensions[type],
        max: scale.y(to.y) + arrowDimensions[type]
      }
    }
  );

  if (middlePoint && isFinite(middlePoint.x) && isFinite(middlePoint.y)) {
    scaledToX = middlePoint.x;
    scaledToY = middlePoint.y;
  }

  return {
    x: scaledToX,
    y: scaledToY
  };
};
