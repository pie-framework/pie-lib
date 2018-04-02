import * as utils from '../utils';

const point = (x, y, label) => ({ x, y, label });

const pointString = v => {
  if (!v) {
    return '';
  }

  if (v.x === undefined || v.y === undefined) {
    return v.toString();
  }
  if (v.label) {
    return `(${v.x},${v.y},${v.label})`;
  } else {
    return `(${v.x},${v.y})`;
  }
};

const simple = i => {
  if (Array.isArray(i)) {
    return '[' + i.map(a => pointString(a)).join(',') + ']';
  } else {
    return pointString(i);
  }
};

const defaultPoints = () => [point(0, 0, 'a'), point(1, 1, 'b')];

const s = function(strings, ...values) {
  return strings.reduce((p, c, index) => {
    p += c + simple(values[index]);
    return p;
  }, '');
};

describe('addPoint', () => {
  const labels = ['a', 'b', 'c', 'd'];

  const assertAdd = (input, expected, points) => {
    points = points || defaultPoints();
    it(s`${input} in ${points} == ${expected}`, () => {
      const result = utils.addPoint(points, input, labels);
      expect(result).toEqual(expected);
    });
  };

  assertAdd(point(0, 0), defaultPoints());
  assertAdd(point(1, 1), defaultPoints());
  assertAdd(point(2, 2), defaultPoints().concat(point(2, 2, 'c')));

  assertAdd(
    point(2, 2),
    [point(0, 0, 'a'), point(2, 2, 'b')],
    [point(0, 0, 'a')]
  );

  assertAdd(
    point(2, 2),
    [point(1, 1, 'b'), point(2, 2, 'a')],
    [point(1, 1, 'b')]
  );
});

describe('swapPoint', () => {
  const assertSwap = (from, to, expected, points) => {
    points = points || defaultPoints();
    it(s`${from} -> ${to} in ${points} == ${expected}`, () => {
      points = points || defaultPoints();
      const result = utils.swapPoint(points, from, to);
      expect(result).toEqual(expected);
    });
  };

  assertSwap(point(0, 0), point(2, 2), [point(2, 2, 'a'), point(1, 1, 'b')]);
  assertSwap(point(1, 1), point(2, 2), [point(0, 0, 'a'), point(2, 2, 'b')]);
  assertSwap(point(3, 3), point(2, 2), defaultPoints());
});

describe('removePoints', () => {
  const assertRemove = (point, expected, points) => {
    points = points || defaultPoints();
    it(s`${point} in ${points} = ${expected}`, () => {
      const result = utils.removePoints(points, point);
      expect(result).toEqual(expected);
    });
  };
  assertRemove(point(0, 0), [point(1, 1, 'b')]);
});

const ss = v => JSON.stringify(v);

describe('bounds', () => {
  const assertBounds = (p, domain, range, expected) => {
    it(`${p.x},${p.y}, ${ss(domain)}, ${ss(range)} == ${ss(expected)}`, () => {
      const out = utils.bounds(p, domain, range);
      expect(out).toEqual(expected);
    });
  };

  assertBounds(
    { x: -1, y: 1 },
    { min: -1, max: 1 },
    { min: -1, max: 1 },
    {
      left: 0,
      right: 2,
      top: 0,
      bottom: -2
    }
  );
  assertBounds(
    { x: 0, y: 0 },
    { min: -1, max: -1 },
    { min: -1, max: -1 },
    {
      left: -1,
      right: 1,
      top: 1,
      bottom: -1
    }
  );
});
