import head from 'lodash/head';
import tail from 'lodash/tail';
import { utils } from '@pie-lib/plot';
import invariant from 'invariant';
import isEqual from 'lodash/isEqual';

export const tickCount = utils.tickCount;
export const bounds = utils.bounds;
export const point = utils.point;

export const getAngleDeg = (cx, cy, ex, ey) => {
  let dy = ey - cy;
  let dx = ex - cx;
  let theta = Math.atan2(dy, dx);
  theta *= 180 / Math.PI;
  return theta;
};

//TODO: This can be removed?
export const arrowDimensions = () => 0;

export const getTickValues = prop => {
  const tickValues = [];
  let tickVal = 0;

  while (tickVal >= prop.min && tickValues.indexOf(tickVal) < 0) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal - prop.step) * 100) / 100;
  }

  tickVal = Math.round(prop.step * 100) / 100;

  while (tickVal <= prop.max && tickValues.indexOf(tickVal) < 0) {
    tickValues.push(tickVal);
    tickVal = Math.round((tickVal + prop.step) * 100) / 100;
  }

  // return only ticks that are inside the min-max interval
  if (tickValues) {
    return tickValues.filter(tV => tV >= prop.min && tV <= prop.max);
  }

  return [];
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
