import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '../types/product';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imagePlaceholderText}>IMG</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        {!product.inStock && (
          <Text style={styles.outOfStock}>Out of Stock</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  imagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: colors.textLight,
    fontSize: 13,
  },
  info: {
    padding: spacing.sm,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  outOfStock: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
});
