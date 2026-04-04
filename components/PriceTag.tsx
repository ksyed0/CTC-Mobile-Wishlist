import { memo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface PriceTagProps {
  price: number;
  size?: 'sm' | 'md' | 'lg';
  style?: object;
}

export const PriceTag = memo(function PriceTag({
  price,
  size = 'md',
  style,
}: PriceTagProps) {
  return (
    <Text style={[styles.price, styles[size], style]} accessibilityLabel={`$${price.toFixed(2)}`}>
      ${price.toFixed(2)}
    </Text>
  );
});

const styles = StyleSheet.create({
  price: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  sm: {
    fontSize: typography.fontSize.sm,
  },
  md: {
    fontSize: typography.fontSize.md,
  },
  lg: {
    fontSize: typography.fontSize.xl,
  },
});
