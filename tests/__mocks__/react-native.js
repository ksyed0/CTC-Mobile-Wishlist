/**
 * Minimal React Native mock for component tests.
 * Maps RN primitives to plain elements so @testing-library/react-native
 * can render them in a Node.js environment without a native runtime.
 */
'use strict';

const React = require('react');

function makeComponent(name) {
  function MockComponent({ children, testID, ...rest }) {
    return React.createElement(name, { testID, ...rest }, children);
  }
  MockComponent.displayName = name;
  return MockComponent;
}

const View = makeComponent('View');
const Text = makeComponent('Text');
const Image = makeComponent('Image');
const ScrollView = makeComponent('ScrollView');
const FlatList = makeComponent('FlatList');
const TextInput = makeComponent('TextInput');
const SafeAreaView = makeComponent('SafeAreaView');

function TouchableOpacity({ children, onPress, testID, accessibilityLabel, accessibilityRole, disabled, ...rest }) {
  return React.createElement(
    'TouchableOpacity',
    { testID, accessibilityLabel, accessibilityRole, onPress, disabled, ...rest },
    children
  );
}

const StyleSheet = {
  create: (styles) => styles,
  flatten: (style) => (Array.isArray(style) ? Object.assign({}, ...style) : style),
  absoluteFill: {},
};

const Platform = {
  OS: 'ios',
  select: (obj) => obj.ios ?? obj.default,
};

const Alert = {
  alert: jest.fn(),
};

const Dimensions = {
  get: () => ({ width: 375, height: 812 }),
};

const ActivityIndicator = makeComponent('ActivityIndicator');
const Modal = makeComponent('Modal');

module.exports = {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Dimensions,
  ActivityIndicator,
  Modal,
};
