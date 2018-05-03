module.exports = {
  testRegex: '(/__tests__/.*\\.test.jsx|(\\.|/)(test|spec))\\.jsx?$',
  setupFiles: ['./jest.setup.js'],
  verbose: true,
  snapshotSerializers: ['enzyme-to-json/serializer']
};
