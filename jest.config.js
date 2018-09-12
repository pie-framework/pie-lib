module.exports = {
  testRegex: '(/__tests__/.*\\.test.jsx|(\\.|/)(test|spec))\\.jsx?$',
  setupFiles: ['./jest.setup.js'],
  verbose: false,
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testURL: 'http://localhost'
};
