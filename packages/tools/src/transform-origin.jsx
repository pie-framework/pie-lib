const keyWordToPercent = v => {
  if (v === 'left' || v === 'top') {
    return 0;
  } else if (v === 'right' || v === 'bottom') {
    return 100;
  } else if (v === 'center') {
    return 50;
  } else if (v.endsWith('%')) {
    return parseFloat(v);
  } else {
    return v;
  }
};

const getValue = (s, length) => {
  if (s.endsWith('px')) {
    return parseFloat(s);
  } else {
    s = keyWordToPercent(s);
    const v = length * (s / 100);
    return v;
  }
};

const normalize = a => {
  if (a[0] === 'bottom' || a[0] === 'top' || a[1] === 'left' || a[1] === 'right') {
    return [a[1], a[0]];
  } else {
    return a;
  }
};

/**
 * Parse a transform origin string to x/y values.
 * @param {{width: number, height: number}} rect
 * @param {string} value
 * @returns {x:number, y:number}
 */
export const parse = (rect, value) => {
  if (!value) {
    return {
      x: rect.width / 2,
      y: rect.height / 2
    };
  }
  const arr = value.split(' ');
  if (arr.length === 1) {
    //1 val
    const x = getValue(arr[0], rect.width);
    const y = getValue('50%', rect.height);
    return { x, y };
  } else if (arr.length === 2) {
    const sorted = normalize(arr);
    const x = getValue(sorted[0], rect.width);
    const y = getValue(sorted[1], rect.height);
    return { x, y };
  } else if (arr.length === 3) {
    throw new Error('transform-origin values with 3 fields not supported.');
  }
};
