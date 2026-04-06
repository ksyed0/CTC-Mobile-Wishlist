/**
 * PriceTag render tests — BUG-0073
 * Uses @testing-library/react-native for actual component rendering.
 */

jest.mock('react-native', () => {
  const React = require('react');
  function makeComponent(name: string) {
    return function MockComponent({ children, testID, accessibilityLabel, ...rest }: any) {
      return React.createElement(name, { testID, accessibilityLabel, ...rest }, children);
    };
  }
  return {
    View: makeComponent('View'),
    Text: makeComponent('Text'),
    StyleSheet: {
      create: (styles: any) => styles,
      flatten: (style: any) => (Array.isArray(style) ? Object.assign({}, ...style) : style),
    },
    Platform: { OS: 'ios', select: (obj: any) => obj.ios ?? obj.default },
  };
});

jest.mock('../../theme/colors', () => ({
  colors: {
    primary: '#D52B1E', white: '#FFFFFF', dark: '#333333',
    textSecondary: '#666666', textLight: '#999999', background: '#F5F5F5',
  },
}));
jest.mock('../../theme/typography', () => ({
  typography: {
    fontSize: { xs: 10, sm: 12, md: 14, lg: 18, xl: 24 },
    fontWeight: { regular: '400', medium: '500', semiBold: '600', bold: '700' },
  },
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { PriceTag } from '../../components/PriceTag';

describe('PriceTag — render', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<PriceTag price={29.99} />);
    expect(toJSON()).toBeTruthy();
  });

  it('displays formatted price text', () => {
    const { getByText } = render(<PriceTag price={29.99} />);
    expect(getByText('$29.99')).toBeTruthy();
  });

  it('formats price with two decimal places', () => {
    const { getByText } = render(<PriceTag price={9.9} />);
    expect(getByText('$9.90')).toBeTruthy();
  });

  it('has accessibilityLabel with formatted price', () => {
    const { getByLabelText } = render(<PriceTag price={49.99} />);
    expect(getByLabelText('$49.99')).toBeTruthy();
  });

  it('renders with size="sm"', () => {
    const { getByText } = render(<PriceTag price={9.99} size="sm" />);
    expect(getByText('$9.99')).toBeTruthy();
  });

  it('renders with size="lg"', () => {
    const { getByText } = render(<PriceTag price={199.99} size="lg" />);
    expect(getByText('$199.99')).toBeTruthy();
  });

  it('defaults to "md" size when size is omitted', () => {
    // Renders without error — size defaults to 'md'
    const { toJSON } = render(<PriceTag price={14.99} />);
    expect(toJSON()).toBeTruthy();
  });
});
