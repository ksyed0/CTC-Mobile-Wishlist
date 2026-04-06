/**
 * WishlistItemRow render tests — BUG-0073
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
    ScrollView: makeComponent('ScrollView'),
    TouchableOpacity: function TouchableOpacity({
      children,
      onPress,
      testID,
      accessibilityLabel,
      accessibilityRole,
      ...rest
    }: any) {
      return React.createElement(
        'TouchableOpacity',
        { testID, accessibilityLabel, accessibilityRole, onPress, ...rest },
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

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  return {
    MaterialIcons: function MockMaterialIcons({ name }: { name: string }) {
      return React.createElement('Text', { testID: `icon-${name}` }, name);
    },
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
import { WishlistItemRow } from '../../components/WishlistItemRow';
import type { WishlistItem } from '../../types/wishlist';

function makeItem(overrides: Partial<WishlistItem> = {}): WishlistItem {
  return {
    productId: 'p-001',
    addedAt: '2026-01-01T00:00:00Z',
    claimedBy: null,
    note: null,
    ...overrides,
  };
}

describe('WishlistItemRow — render', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<WishlistItemRow item={makeItem()} />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows product name when provided', () => {
    const { getByText } = render(<WishlistItemRow item={makeItem()} productName="Power Drill" />);
    expect(getByText('Power Drill')).toBeTruthy();
  });

  it('falls back to productId when productName is not provided', () => {
    const { getByText } = render(<WishlistItemRow item={makeItem({ productId: 'p-999' })} />);
    expect(getByText('p-999')).toBeTruthy();
  });

  it('shows formatted price when productPrice is provided', () => {
    const { getByText } = render(<WishlistItemRow item={makeItem()} productName="Drill" productPrice={49.99} />);
    expect(getByText('$49.99')).toBeTruthy();
  });

  it('does not show price when productPrice is omitted', () => {
    const { queryByText } = render(<WishlistItemRow item={makeItem()} productName="Drill" />);
    expect(queryByText(/^\$/)).toBeNull();
  });

  it('shows "Claimed" text when item is claimed', () => {
    const { getByText } = render(
      <WishlistItemRow item={makeItem({ claimedBy: 'u-002' })} productName="Drill" isOwner />,
    );
    expect(getByText('Claimed')).toBeTruthy();
  });

  it('shows claimer name for non-owner view when item is claimed', () => {
    const { getByText } = render(
      <WishlistItemRow
        item={makeItem({ claimedBy: 'u-002' })}
        productName="Drill"
        claimerName="Alice"
        isOwner={false}
      />,
    );
    expect(getByText('Claimed by Alice')).toBeTruthy();
  });

  it('shows "I\'ll Get This" claim button when showClaimButton is true and not claimed', () => {
    const { getByText } = render(<WishlistItemRow item={makeItem()} productName="Drill" showClaimButton />);
    expect(getByText("I'll Get This")).toBeTruthy();
  });

  it('does not show claim button when item is already claimed', () => {
    const { queryByText } = render(
      <WishlistItemRow item={makeItem({ claimedBy: 'u-002' })} productName="Drill" showClaimButton />,
    );
    expect(queryByText("I'll Get This")).toBeNull();
  });

  it('calls onClaim when "I\'ll Get This" button is pressed', () => {
    const onClaim = jest.fn();
    const { getByLabelText } = render(
      <WishlistItemRow item={makeItem()} productName="Power Drill" showClaimButton onClaim={onClaim} />,
    );
    fireEvent.press(getByLabelText('Claim Power Drill'));
    expect(onClaim).toHaveBeenCalledTimes(1);
  });

  it('calls onRemove when remove button is pressed', () => {
    const onRemove = jest.fn();
    const { getByLabelText } = render(
      <WishlistItemRow item={makeItem()} productName="Power Drill" onRemove={onRemove} />,
    );
    fireEvent.press(getByLabelText('Remove Power Drill from wishlist'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('does not render remove button when onRemove is not provided', () => {
    const { queryByLabelText } = render(<WishlistItemRow item={makeItem()} productName="Power Drill" />);
    expect(queryByLabelText(/Remove/)).toBeNull();
  });
});
