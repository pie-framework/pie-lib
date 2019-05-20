const _ = require('lodash');

const yVal = (amplitude, freq) => x => {
  return amplitude + Math.sin(x / freq);
};
_.range(0, 10, 0.1).forEach(v => {
  const y = yVal(1, 1)(v);
  console.log('v:', v.toFixed(2), 'y sin:', y.toFixed(4));
});
