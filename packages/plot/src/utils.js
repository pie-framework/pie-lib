import invariant from 'invariant';
import range from 'lodash/range';
import Point from '@mapbox/point-geometry';
import head from 'lodash/head';
import tail from 'lodash/tail';
import isEqual from 'lodash/isEqual';

export const xy = (x, y) => ({ x, y });

export const buildSizeArray = (size, padding) => {
  padding = Number.isFinite(padding) ? Math.max(padding, 0) : 0;
  invariant(padding < size, 'padding must be less than size');
  const half = Math.round(padding * 0.5);
  return [half, size - half];
};

export const tickCount = (min, max, step) => {
  invariant(min < max, 'min must be less than max');
  const size = Math.abs(min - max);
  return Math.round(size / step);
};

export function getInterval(domain, ticks) {
  const { min, max } = domain;
  const { major, minor } = ticks;

  if (min >= max) {
    throw new Error(`min is > max: ${min} > ${max}`);
  }

  const distance = max - min;
  const minorTicks = minor > 0 ? minor + 1 : 1;
  const normalizedMajor = major - 1;

  if (isNaN(normalizedMajor)) {
    throw new Error('Tick Frequency must be 2 or higher');
  }

  if (normalizedMajor <= 0) {
    throw new Error('Tick Frequency must be 2 or higher');
  }

  const divider = normalizedMajor * minorTicks;
  const raw = distance / divider;
  return parseFloat(Number(raw).toFixed(4));
}

const mkRange = (min, max, interval) => {
  const raw = range(min, max, interval);
  /* Fix the last step due to rounding errors */
  raw.splice(raw.length, 1, max);
  return raw;
};

export function snapTo(min, max, interval, value) {
  if (value >= max) {
    return max;
  }

  if (value <= min) {
    return min;
  }

  let rng = mkRange(min, max, interval);

  rng = rng.filter(v => {
    return Math.abs(value - v) <= interval;
  });

  return (
    rng.length &&
    rng.reduce((prev, curr) => {
      const currentDistance = Math.abs(curr - value);
      const previousDistance = Math.abs(prev - value);
      return currentDistance <= previousDistance ? curr : prev;
    })
  );
}

export function buildTickModel(domain, ticks, interval, scaleFn) {
  const rng = mkRange(domain.min, domain.max, interval);

  return rng.map((r, index) => {
    const isMajor = index % (ticks.minor + 1) === 0;

    return {
      value: r,
      major: isMajor,
      x: scaleFn(r)
    };
  });
}

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

export const bounds = (area, domain, range) => {
  return {
    left: domain.min - area.left,
    right: Math.abs(area.right - domain.max),
    top: Math.abs(area.top - range.max),
    bottom: range.min - area.bottom
  };
};

export const point = o => new Point(o.x, o.y);
export const getDelta = (from, to) => {
  return point(to).sub(point(from));
};

export const bandKey = (d, index) => `${index}-${d.label || '-'}`;

export const isDomainRangeEqual = (graphProps, nextGraphProps) => {
  return (
    isEqual(graphProps.domain, nextGraphProps.domain) &&
    isEqual(graphProps.range, nextGraphProps.range)
  );
};

// findLongestWord is also used in grapghing
export const findLongestWord = label => {
  let longestWord = (label || '')
    .replace(/<[^>]+>/g, '')
    .split(' ')
    .sort((a, b) => b.length - a.length);

  return longestWord[0].length;
};

// amountToIncreaseWidth is also used in grapghing
export const amountToIncreaseWidth = longestWord => {
  if (!longestWord) {
    return 0;
  }

  return longestWord * 10;
};
