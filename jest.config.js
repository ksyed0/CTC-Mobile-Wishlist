// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/unit/**/*.test.js', '**/tests/services/**/*.test.ts', '**/tests/components/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/src/'],
  transform: {
    '^.+\\.tsx?$': ['babel-jest', { configFile: './babel.services.config.js' }],
  },
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$': '<rootDir>/tests/services/__mocks__/async-storage.js',
  },
  collectCoverageFrom: ['tools/lib/**/*.js', 'services/**/*.ts', 'utils/wishlistUtils.ts'],
  coverageReporters: ['text', 'lcov', 'json-summary'],
  coverageThreshold: {
    global: {
      lines: 80,
      branches: 70,
      functions: 80,
      statements: 80,
    },
  },
};
