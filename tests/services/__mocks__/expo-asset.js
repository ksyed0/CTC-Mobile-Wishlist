// Mock for expo-asset in Jest tests
module.exports = {
  Asset: {
    loadAsync: jest.fn().mockResolvedValue([{ localUri: 'file://mock-catalog.html' }]),
  },
};
