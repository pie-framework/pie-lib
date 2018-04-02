const point = (x, y, label) => ({ x, y, label });

const pointString = v => {
  if (v === undefined) {
    return '';
  }

  if (v.x === undefined || v.y === undefined) {
    return JSON.stringify(v);
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

export const s = function(strings, ...values) {
  return strings.reduce((p, c, index) => {
    p += c + simple(values[index]);
    return p;
  }, '');
};
