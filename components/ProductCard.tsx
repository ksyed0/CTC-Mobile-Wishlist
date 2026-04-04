import { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Product } from '../types/product';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

/** BUG-0085: Category color map for placeholder views */
const CATEGORY_COLORS: Record<string, string> = {
  Tools: colors.primary,       // #D52B1E
  Automotive: '#1565C0',
  Outdoor: '#2E7D32',
  Sports: '#F57C00',
  Home: '#6A1B9A',
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? colors.textSecondary;
}

function getCategoryInitial(category: string): string {
  return category.trim().charAt(0).toUpperCase();
}

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onAddToWishlist?: () => void;
}

export const ProductCard = memo(function ProductCard({
  product,
  onPress,
  onAddToWishlist,
}: ProductCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, $${product.price.toFixed(2)}`}
    >
      <View style={styles.imageContainer}>
        {product.image && product.image !== 'placeholder' ? (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={product.name}
          />
        ) : (
          /* BUG-0085: Render a colored category placeholder instead of broken image */
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: getCategoryColor(product.category) },
            ]}
          >
            <Text style={styles.categoryInitial}>
              {getCategoryInitial(product.category)}
            </Text>
          </View>
        )}
        {!product.inStock ? (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockBadgeText}>Out of Stock</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>

        {onAddToWishlist ? (
          <TouchableOpacity
            style={[styles.addButton, !product.inStock && styles.addButtonDisabled]}
            onPress={onAddToWishlist}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel={`Add ${product.name} to wishlist`}
          >
            <MaterialIcons
              name="favorite-border"
              size={14}
              color={product.inStock ? colors.primary : colors.textLight}
            />
            <Text
              style={[
                styles.addButtonText,
                !product.inStock && styles.addButtonTextDisabled,
              ]}
            >
              Add to Wishlist
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: spacing.md,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.background,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInitial: {
    fontSize: 48,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    opacity: 0.9,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.textLight,
    borderRadius: spacing.borderRadius.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  outOfStockBadgeText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
  info: {
    padding: spacing.sm,
  },
  name: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  category: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 4,
    minHeight: 32,
  },
  addButtonDisabled: {
    borderColor: colors.border,
  },
  addButtonText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primary,
  },
  addButtonTextDisabled: {
    color: colors.textLight,
  },
});
