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
    '^react-native-webview$': '<rootDir>/tests/services/__mocks__/react-native-webview.js',
    '^expo-asset$': '<rootDir>/tests/services/__mocks__/expo-asset.js',
    '^expo-file-system$': '<rootDir>/tests/services/__mocks__/expo-file-system.js',
    '^react-native$': '<rootDir>/tests/services/__mocks__/react-native.js',
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
