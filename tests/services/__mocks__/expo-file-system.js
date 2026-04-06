// Mock for expo-file-system in Jest tests
module.exports = {
  readAsStringAsync: jest.fn().mockResolvedValue('<html><body></body></html>'),
};
