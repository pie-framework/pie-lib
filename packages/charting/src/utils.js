import invariant from 'invariant';
import debug from 'debug';
import range from 'lodash/range';

const log = debug('pie-lib:charting:utils');

export const buildSizeArray = (size, padding) => {
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

  const closest = rng.reduce((prev, curr) => {
    const currentDistance = Math.abs(curr - value);
    const previousDistance = Math.abs(prev - value);
    return currentDistance <= previousDistance ? curr : prev;
  });

  return closest;
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
