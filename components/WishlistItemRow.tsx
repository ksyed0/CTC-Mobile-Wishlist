import { View, Text, StyleSheet } from 'react-native';
import { WishlistItem } from '../types/wishlist';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface WishlistItemRowProps {
  item: WishlistItem;
  productName?: string;
  productPrice?: number;
}

export function WishlistItemRow({
  item,
  productName,
  productPrice,
}: WishlistItemRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imagePlaceholderText}>IMG</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{productName ?? item.productId}</Text>
        {productPrice !== undefined && (
          <Text style={styles.price}>${productPrice.toFixed(2)}</Text>
        )}
        {item.note && <Text style={styles.note}>{item.note}</Text>}
      </View>
      {item.claimedBy && (
        <View style={styles.claimedBadge}>
          <Text style={styles.claimedText}>Claimed</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  imagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: spacing.borderRadius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  imagePlaceholderText: {
    color: colors.textLight,
    fontSize: 11,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  note: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  claimedBadge: {
    backgroundColor: colors.success,
    borderRadius: spacing.borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    marginLeft: spacing.sm,
  },
  claimedText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
});
