// Manual mock for @react-native-async-storage/async-storage.
// Provides an in-memory store so service tests never touch real storage.

let store = {};

const AsyncStorage = {
  getItem: jest.fn((key) => Promise.resolve(store[key] ?? null)),
  setItem: jest.fn((key, value) => {
    store[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key) => {
    delete store[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    store = {};
    return Promise.resolve();
  }),
  // Helper used in beforeEach to reset state between tests
  __reset: () => {
    store = {};
    AsyncStorage.getItem.mockClear();
    AsyncStorage.setItem.mockClear();
    AsyncStorage.removeItem.mockClear();
    AsyncStorage.clear.mockClear();
    // Re-bind implementations after mock.mockClear() resets call counts only
    AsyncStorage.getItem.mockImplementation((key) =>
      Promise.resolve(store[key] ?? null)
    );
    AsyncStorage.setItem.mockImplementation((key, value) => {
      store[key] = value;
      return Promise.resolve();
    });
    AsyncStorage.removeItem.mockImplementation((key) => {
      delete store[key];
      return Promise.resolve();
    });
    AsyncStorage.clear.mockImplementation(() => {
      store = {};
      return Promise.resolve();
    });
  },
};

module.exports = AsyncStorage;
