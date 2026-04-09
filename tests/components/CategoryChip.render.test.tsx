/**
 * CategoryChip render tests — BUG-073
 * Uses @testing-library/react-native for actual component rendering.
 */

jest.mock('react-native', () => {
  const React = require('react');
  function makeComponent(name: string) {
    return function MockComponent({ children, testID, ...rest }: any) {
      return React.createElement(name, { testID, ...rest }, children);
    };
  }
  return {
    View: makeComponent('View'),
    Text: makeComponent('Text'),
    Image: makeComponent('Image'),
    TouchableOpacity: function TouchableOpacity({
      children,
      onPress,
      testID,
      accessibilityLabel,
      accessibilityRole,
      accessibilityState,
      ...rest
    }: any) {
      return React.createElement(
        'TouchableOpacity',
        { testID, accessibilityLabel, accessibilityRole, accessibilityState, onPress, ...rest },
        children,
      );
    },
    StyleSheet: {
      create: (styles: any) => styles,
      flatten: (style: any) => (Array.isArray(style) ? Object.assign({}, ...style) : style),
    },
    Platform: { OS: 'ios', select: (obj: any) => obj.ios ?? obj.default },
  };
});

jest.mock('../../theme/colors', () => ({
  colors: {
    primary: '#D52B1E',
    white: '#FFFFFF',
    dark: '#333333',
    textSecondary: '#666666',
    textLight: '#999999',
    background: '#F5F5F5',
    border: '#E0E0E0',
    success: '#2E7D32',
  },
}));
jest.mock('../../theme/spacing', () => ({
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    borderRadius: { sm: 8, md: 12, lg: 16, full: 999 },
  },
}));
jest.mock('../../theme/typography', () => ({
  typography: {
    fontSize: { xs: 10, sm: 12, md: 14, lg: 18, xl: 24 },
    fontWeight: { regular: '400', medium: '500', semiBold: '600', bold: '700' },
  },
}));

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CategoryChip } from '../../components/CategoryChip';
import type { Category } from '../../types/product';

const category: Category = { id: 'cat-tools', name: 'Tools', icon: 'build' };

describe('CategoryChip — render', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<CategoryChip category={category} isSelected={false} onPress={jest.fn()} />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows the category name', () => {
    const { getByText } = render(<CategoryChip category={category} isSelected={false} onPress={jest.fn()} />);
    expect(getByText('Tools')).toBeTruthy();
  });

  it('renders with accessibilityLabel matching category name', () => {
    const { getByLabelText } = render(<CategoryChip category={category} isSelected={false} onPress={jest.fn()} />);
    expect(getByLabelText('Tools')).toBeTruthy();
  });

  it('calls onPress when chip is pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<CategoryChip category={category} isSelected={false} onPress={onPress} />);
    fireEvent.press(getByText('Tools'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders correctly when selected', () => {
    // Selected state should not crash or hide the label
    const { getByText } = render(<CategoryChip category={category} isSelected onPress={jest.fn()} />);
    expect(getByText('Tools')).toBeTruthy();
  });

  it('renders correctly when not selected', () => {
    const { getByText } = render(<CategoryChip category={category} isSelected={false} onPress={jest.fn()} />);
    expect(getByText('Tools')).toBeTruthy();
  });

  it('renders different category names correctly', () => {
    const autoCat: Category = { id: 'cat-auto', name: 'Automotive', icon: 'directions-car' };
    const { getByText } = render(<CategoryChip category={autoCat} isSelected={false} onPress={jest.fn()} />);
    expect(getByText('Automotive')).toBeTruthy();
  });
});
