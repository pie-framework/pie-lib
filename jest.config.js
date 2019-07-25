const ig = ['node_modules', '.*/lib/.*'];
module.exports = {
  testRegex: 'src/.*/?__tests__/.*.test\\.jsx?$',
  setupFiles: ['./jest.setup.js'],
  verbose: false,
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testURL: 'http://localhost',
  testPathIgnorePatterns: ig,
  transformIgnorePatterns: ig,
  moduleNameMapper: {
    '^dnd-core$': 'dnd-core/dist/cjs',
    '^react-dnd$': 'react-dnd/dist/cjs',
    '^react-dnd-html5-backend$': 'react-dnd-html5-backend/dist/cjs',
    '^react-dnd-touch-backend$': 'react-dnd-touch-backend/dist/cjs',
    '^react-dnd-test-backend$': 'react-dnd-test-backend/dist/cjs',
    '^react-dnd-test-utils$': 'react-dnd-test-utils/dist/cjs'
  }
};
