// Minimal mock for react-native in Jest tests (no renderer installed)
module.exports = {
  View: 'View',
  Text: 'Text',
  StyleSheet: {
    create: (styles) => styles,
    absoluteFill: {},
    absoluteFillObject: {},
  },
  ActivityIndicator: 'ActivityIndicator',
  Platform: { OS: 'ios' },
};
