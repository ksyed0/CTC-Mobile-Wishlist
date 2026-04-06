// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/unit/**/*.test.js',
    '**/tests/services/**/*.test.ts',
    '**/tests/components/**/*.test.ts',
    '**/tests/components/**/*.test.tsx',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/src/'],
  watchPathIgnorePatterns: [],
  modulePathIgnorePatterns: [],
  transform: {
    '^.+\\.tsx$': ['babel-jest', { configFile: './babel.components.config.js' }],
    '^.+\\.(ts|js)$': ['babel-jest', { configFile: './babel.services.config.js' }],
  },
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$': '<rootDir>/tests/services/__mocks__/async-storage.js',
    '^react-native-webview$': '<rootDir>/tests/services/__mocks__/react-native-webview.js',
    '^expo-asset$': '<rootDir>/tests/services/__mocks__/expo-asset.js',
    '^expo-file-system$': '<rootDir>/tests/services/__mocks__/expo-file-system.js',
    '^expo-file-system/legacy$': '<rootDir>/tests/services/__mocks__/expo-file-system.js',
    '^react-native$': '<rootDir>/tests/__mocks__/react-native.js',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
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
