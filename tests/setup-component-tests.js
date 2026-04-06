/**
 * Jest setup file for component (RNTL) tests.
 * Mocks React Native and Expo modules that require native code.
 */

// ---- React Native core mocks ----
// RN ships a jest-preset; we pull specific mocks rather than the full preset
// because our Jest environment stays 'node' (not jsdom).

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: (obj) => obj.ios ?? obj.default,
}));

jest.mock('react-native/Libraries/Components/Touchable/TouchableOpacity', () => {
  const React = require('react');
  return function MockTouchableOpacity({ children, onPress, testID, accessibilityLabel, accessibilityRole }) {
    return React.createElement('View', { testID, accessibilityLabel, accessibilityRole, onPress }, children);
  };
});

// ---- Expo Vector Icons ----
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    MaterialIcons: function MockMaterialIcons({ name, testID }) {
      return React.createElement('Text', { testID: testID ?? `icon-${name}` }, name);
    },
  };
});

// ---- Expo Router ----
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }) => children,
  Stack: { Screen: () => null },
}));

// ---- Expo Constants ----
jest.mock('expo-constants', () => ({
  default: { expoConfig: { name: 'CTC-Mobile-Wishlist' } },
}));

// ---- Expo Camera ----
jest.mock('expo-camera', () => ({
  CameraView: () => null,
  useCameraPermissions: () => [{ granted: true }, jest.fn()],
}));

// ---- Expo Device ----
jest.mock('expo-device', () => ({
  isDevice: false,
}));

// Suppress act() warnings from React in test output
global.IS_REACT_ACT_ENVIRONMENT = true;
