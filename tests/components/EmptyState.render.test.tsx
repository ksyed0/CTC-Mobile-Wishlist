/**
 * EmptyState render tests — BUG-0073
 * Uses @testing-library/react-native for actual component rendering.
 */

// Mock React Native primitives
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
    ScrollView: makeComponent('ScrollView'),
    TouchableOpacity: function TouchableOpacity({ children, onPress, testID, accessibilityLabel, accessibilityRole, ...rest }: any) {
      return React.createElement('TouchableOpacity', { testID, accessibilityLabel, accessibilityRole, onPress, ...rest }, children);
    },
    StyleSheet: {
      create: (styles: any) => styles,
      flatten: (style: any) => (Array.isArray(style) ? Object.assign({}, ...style) : style),
    },
    Platform: { OS: 'ios', select: (obj: any) => obj.ios ?? obj.default },
  };
});

// Mock expo vector icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    MaterialIcons: function MockMaterialIcons({ name }: { name: string }) {
      return React.createElement('Text', { testID: `icon-${name}` }, name);
    },
  };
});

// Mock theme modules (they import fine in node but let's be safe)
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
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
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
import { EmptyState } from '../../components/EmptyState';

describe('EmptyState — render', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<EmptyState title="Nothing here" />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows the title text', () => {
    const { getByText } = render(<EmptyState title="No wishlists yet" />);
    expect(getByText('No wishlists yet')).toBeTruthy();
  });

  it('shows subtitle when provided', () => {
    const { getByText } = render(
      <EmptyState title="Empty" subtitle="Add some items to get started" />
    );
    expect(getByText('Add some items to get started')).toBeTruthy();
  });

  it('does not render subtitle when omitted', () => {
    const { queryByText } = render(<EmptyState title="Empty" />);
    expect(queryByText('Add some items to get started')).toBeNull();
  });

  it('renders CTA button when ctaLabel and onCta are provided', () => {
    const onCta = jest.fn();
    const { getByText } = render(
      <EmptyState title="Empty" ctaLabel="Create Wishlist" onCta={onCta} />
    );
    expect(getByText('Create Wishlist')).toBeTruthy();
  });

  it('fires onCta when CTA button is pressed', () => {
    const onCta = jest.fn();
    const { getByText } = render(
      <EmptyState title="Empty" ctaLabel="Create Wishlist" onCta={onCta} />
    );
    fireEvent.press(getByText('Create Wishlist'));
    expect(onCta).toHaveBeenCalledTimes(1);
  });

  it('does not render CTA when only ctaLabel is provided (no handler)', () => {
    const { queryByText } = render(
      <EmptyState title="Empty" ctaLabel="Create Wishlist" />
    );
    // Button should not render without both ctaLabel AND onCta
    expect(queryByText('Create Wishlist')).toBeNull();
  });
});
