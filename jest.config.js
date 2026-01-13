const ig = ['node_modules', '.*/lib/.*'];

module.exports = {
  testRegex: 'src/.*/?__tests__/.*.test\\.jsx?$',
  setupFilesAfterEnv: ['./jest.setup.js'],

  // Jest 29 requires explicit jsdom environment
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
  },

  verbose: false,
  testPathIgnorePatterns: ig,

  // Transform ES modules from these packages
  transformIgnorePatterns: [
    'node_modules/(?!(@mui|@emotion|@testing-library|@dnd-kit|@tiptap|d3-selection|d3-scale)(/|$))',
  ],

  // Custom resolver to handle node: protocol imports
  resolver: '<rootDir>/jest-resolver.js',

  moduleNameMapper: {
    // CSS/Style imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // Image imports
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',

    // Workspace packages - map to source
    '^@pie-lib/(.*)$': '<rootDir>/packages/$1/src',
  },

  // Collect coverage from source files
  collectCoverageFrom: [
    'packages/*/src/**/*.{js,jsx}',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/__tests__/**',
    '!packages/*/src/**/__mocks__/**',
  ],
};
