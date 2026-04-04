import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Wishlist } from '../types/wishlist';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface WishlistCardProps {
  wishlist: Wishlist;
  onPress?: () => void;
}

export function WishlistCard({ wishlist, onPress }: WishlistCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="favorite" size={28} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{wishlist.name}</Text>
        <Text style={styles.meta}>
          {wishlist.items.length} item{wishlist.items.length !== 1 ? 's' : ''}
          {wishlist.sharedWith.length > 0
            ? ` · Shared with ${wishlist.sharedWith.length}`
            : ''}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={colors.textLight} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
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
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 2,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
