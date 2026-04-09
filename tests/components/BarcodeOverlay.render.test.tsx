/**
 * BarcodeOverlay render tests — BUG-073
 * Uses @testing-library/react-native for actual component rendering.
 */

jest.mock('react-native', () => {
  const React = require('react');
  function makeComponent(name: string) {
    return function MockComponent({
      children,
      testID,
      accessibilityLabel,
      accessibilityRole,
      pointerEvents,
      ...rest
    }: any) {
      return React.createElement(
        name,
        { testID, accessibilityLabel, accessibilityRole, pointerEvents, ...rest },
        children,
      );
    };
  }
  return {
    View: makeComponent('View'),
    Text: makeComponent('Text'),
    Image: makeComponent('Image'),
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
import { render } from '@testing-library/react-native';
import { BarcodeOverlay } from '../../components/BarcodeOverlay';

describe('BarcodeOverlay — render', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<BarcodeOverlay />);
    expect(toJSON()).toBeTruthy();
  });

  it('shows "Point camera at barcode" hint when not scanning', () => {
    const { getByText } = render(<BarcodeOverlay isScanning={false} />);
    expect(getByText('Point camera at barcode')).toBeTruthy();
  });

  it('shows "Scanning…" hint when scanning', () => {
    const { getByText } = render(<BarcodeOverlay isScanning />);
    expect(getByText('Scanning\u2026')).toBeTruthy();
  });

  it('defaults to not-scanning state when isScanning is omitted', () => {
    const { getByText } = render(<BarcodeOverlay />);
    expect(getByText('Point camera at barcode')).toBeTruthy();
  });

  it('has correct accessibilityLabel when not scanning', () => {
    const { getByLabelText } = render(<BarcodeOverlay isScanning={false} />);
    expect(getByLabelText('Point camera at barcode')).toBeTruthy();
  });

  it('has correct accessibilityLabel when scanning', () => {
    const { getByLabelText } = render(<BarcodeOverlay isScanning />);
    expect(getByLabelText('Scanning barcode')).toBeTruthy();
  });
});
