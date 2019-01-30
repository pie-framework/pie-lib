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
