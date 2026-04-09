/**
 * ProductCard render tests — BUG-073
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
import { ProductCard } from '../../components/ProductCard';
import type { Product } from '../../types/product';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p-001',
    barcode: '1234567890123',
    name: 'Test Widget',
    description: 'A useful widget',
    price: 29.99,
    image: 'placeholder',
    category: 'Tools',
    inStock: true,
    ...overrides,
  };
}

describe('ProductCard — render', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<ProductCard product={makeProduct()} />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows the product name', () => {
    const { getByText } = render(<ProductCard product={makeProduct({ name: 'Power Drill' })} />);
    expect(getByText('Power Drill')).toBeTruthy();
  });

  it('shows formatted price', () => {
    const { getByText } = render(<ProductCard product={makeProduct({ price: 49.99 })} />);
    expect(getByText('$49.99')).toBeTruthy();
  });

  it('shows category name', () => {
    const { getByText } = render(<ProductCard product={makeProduct({ category: 'Automotive' })} />);
    expect(getByText('Automotive')).toBeTruthy();
  });

  it('shows "Out of Stock" badge when product is not in stock', () => {
    const { getByText } = render(<ProductCard product={makeProduct({ inStock: false })} />);
    expect(getByText('Out of Stock')).toBeTruthy();
  });

  it('does not show "Out of Stock" badge when product is in stock', () => {
    const { queryByText } = render(<ProductCard product={makeProduct({ inStock: true })} />);
    expect(queryByText('Out of Stock')).toBeNull();
  });

  it('calls onPress when card is pressed', () => {
    const onPress = jest.fn();
    const { getByAccessibilityHint, getByLabelText } = render(
      <ProductCard product={makeProduct({ name: 'Drill', price: 49.99 })} onPress={onPress} />,
    );
    // The card has accessibilityLabel: "Drill, $49.99"
    fireEvent.press(getByLabelText('Drill, $49.99'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows "Add to Wishlist" button when onAddToWishlist is provided', () => {
    const { getByText } = render(<ProductCard product={makeProduct()} onAddToWishlist={jest.fn()} />);
    expect(getByText('Add to Wishlist')).toBeTruthy();
  });

  it('calls onAddToWishlist when "Add to Wishlist" button is pressed', () => {
    const onAddToWishlist = jest.fn();
    const { getByLabelText } = render(
      <ProductCard product={makeProduct({ name: 'Drill' })} onAddToWishlist={onAddToWishlist} />,
    );
    fireEvent.press(getByLabelText('Add Drill to wishlist'));
    expect(onAddToWishlist).toHaveBeenCalledTimes(1);
  });

  it('does not show "Add to Wishlist" button when onAddToWishlist is omitted', () => {
    const { queryByText } = render(<ProductCard product={makeProduct()} />);
    expect(queryByText('Add to Wishlist')).toBeNull();
  });

  it('renders category initial placeholder when image is "placeholder"', () => {
    const { getByText } = render(<ProductCard product={makeProduct({ image: 'placeholder', category: 'Tools' })} />);
    // Category initial 'T' should appear in the placeholder
    expect(getByText('T')).toBeTruthy();
  });
});
