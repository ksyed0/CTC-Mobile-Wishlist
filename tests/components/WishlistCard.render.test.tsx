/**
 * WishlistCard render tests — BUG-073
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
import { WishlistCard } from '../../components/WishlistCard';
import type { Wishlist } from '../../types/wishlist';

function makeWishlist(overrides: Partial<Wishlist> = {}): Wishlist {
  return {
    id: 'wl-001',
    name: 'Birthday Gifts',
    ownerId: 'u-001',
    createdAt: '2026-01-01T00:00:00Z',
    items: [],
    sharedWith: [],
    ...overrides,
  };
}

describe('WishlistCard — render', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<WishlistCard wishlist={makeWishlist()} />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows the wishlist name', () => {
    const { getByText } = render(<WishlistCard wishlist={makeWishlist({ name: 'Birthday Gifts' })} />);
    expect(getByText('Birthday Gifts')).toBeTruthy();
  });

  it('shows "0 items" when wishlist is empty', () => {
    const { getByText } = render(<WishlistCard wishlist={makeWishlist({ items: [] })} />);
    expect(getByText('0 items')).toBeTruthy();
  });

  it('shows singular "item" when wishlist has 1 item', () => {
    const wishlist = makeWishlist({
      items: [{ productId: 'p-1', addedAt: '2026-01-01T00:00:00Z', claimedBy: null, note: null }],
    });
    const { getByText } = render(<WishlistCard wishlist={wishlist} />);
    expect(getByText('1 item')).toBeTruthy();
  });

  it('shows plural "items" when wishlist has multiple items', () => {
    const items = [
      { productId: 'p-1', addedAt: '2026-01-01T00:00:00Z', claimedBy: null, note: null },
      { productId: 'p-2', addedAt: '2026-01-01T00:00:00Z', claimedBy: null, note: null },
    ];
    const { getByText } = render(<WishlistCard wishlist={makeWishlist({ items })} />);
    expect(getByText('2 items')).toBeTruthy();
  });

  it('shows "Shared" badge when isShared is true', () => {
    const { getByText } = render(<WishlistCard wishlist={makeWishlist()} isShared />);
    expect(getByText('Shared')).toBeTruthy();
  });

  it('does not show "Shared" badge when isShared is false', () => {
    const { queryByText } = render(<WishlistCard wishlist={makeWishlist()} isShared={false} />);
    expect(queryByText('Shared')).toBeNull();
  });

  it('shows shared-with count in meta when sharedWith is populated', () => {
    const wishlist = makeWishlist({
      sharedWith: [{ contactId: 'c-1', contactName: 'Alice', phone: '555-0001', sharedAt: '2026-01-01T00:00:00Z' }],
    });
    const { getByText } = render(<WishlistCard wishlist={wishlist} />);
    expect(getByText(/Shared with 1/)).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const onPress = jest.fn();
    const wishlist = makeWishlist({ name: 'My List', items: [] });
    const { getByLabelText } = render(<WishlistCard wishlist={wishlist} onPress={onPress} />);
    fireEvent.press(getByLabelText('My List, 0 items'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
