import { Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface PriceTagProps {
  price: number;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceTag({ price, size = 'md' }: PriceTagProps) {
  return (
    <Text style={[styles.price, styles[size]]}>
      ${price.toFixed(2)}
    </Text>
  );
}

const styles = StyleSheet.create({
  price: {
    color: colors.primary,
    fontWeight: '700',
  },
  sm: {
    fontSize: 13,
  },
  md: {
    fontSize: 16,
  },
  lg: {
    fontSize: 22,
  },
});
