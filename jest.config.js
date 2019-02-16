module.exports = {
  testRegex: 'src/.*/?__tests__/.*.test\\.jsx?$',
  setupFiles: ['./jest.setup.js'],
  verbose: false,
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testURL: 'http://localhost',
  transformIgnorePatterns: ['node_modules', '.*/lib/.*']
};
