import { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Wishlist } from '../types/wishlist';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface WishlistCardProps {
  wishlist: Wishlist;
  onPress?: () => void;
  isShared?: boolean;
}

export const WishlistCard = memo(function WishlistCard({
  wishlist,
  onPress,
  isShared = false,
}: WishlistCardProps) {
  const itemCount = wishlist.items.length;
  const sharedCount = wishlist.sharedWith.length;

  const totalPrice = wishlist.items.reduce((sum, _item) => sum, 0);
  void totalPrice; // price total shown only when product data is available

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${wishlist.name}, ${itemCount} items`}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons
          name={isShared ? 'people' : 'favorite'}
          size={26}
          color={colors.primary}
        />
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {wishlist.name}
          </Text>
          {isShared ? (
            <View style={styles.sharedBadge}>
              <Text style={styles.sharedBadgeText}>Shared</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.meta}>
          {itemCount} item{itemCount !== 1 ? 's' : ''}
          {sharedCount > 0 ? ` · Shared with ${sharedCount}` : ''}
        </Text>
      </View>

      <MaterialIcons name="chevron-right" size={24} color={colors.textLight} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: spacing.borderRadius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  name: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark,
    flex: 1,
  },
  sharedBadge: {
    backgroundColor: colors.background,
    borderRadius: spacing.borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sharedBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  meta: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});
