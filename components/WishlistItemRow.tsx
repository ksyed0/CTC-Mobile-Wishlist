import { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { WishlistItem } from '../types/wishlist';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface WishlistItemRowProps {
  item: WishlistItem;
  productName?: string;
  productPrice?: number;
  productImage?: string;
  claimerName?: string;
  onRemove?: () => void;
  onClaim?: () => void;
  showClaimButton?: boolean;
  isOwner?: boolean;
  note?: string | null;
  onNotePress?: () => void;
}

export const WishlistItemRow = memo(function WishlistItemRow({
  item,
  productName,
  productPrice,
  productImage,
  claimerName,
  onRemove,
  onClaim,
  showClaimButton = false,
  isOwner = false,
  note,
  onNotePress,
}: WishlistItemRowProps) {
  const isClaimed = item.claimedBy !== null;

  return (
    <View style={[styles.row, isClaimed && styles.rowClaimed]}>
      <View style={styles.imageContainer}>
        {productImage && productImage !== 'placeholder' ? (
          <Image
            source={{ uri: productImage }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={productName ?? item.productId}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="image" size={24} color={colors.textLight} />
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, isClaimed && styles.nameClaimed]} numberOfLines={2}>
          {productName ?? item.productId}
        </Text>
        {productPrice !== undefined ? (
          <Text style={[styles.price, isClaimed && styles.priceClaimed]}>${productPrice.toFixed(2)}</Text>
        ) : null}

        {/* Item note — owner sees tappable note or add-note link; recipients see read-only */}
        {note ? (
          <TouchableOpacity onPress={onNotePress} activeOpacity={onNotePress ? 0.7 : 1} disabled={!onNotePress}>
            <Text style={styles.noteText}>{note}</Text>
          </TouchableOpacity>
        ) : onNotePress ? (
          <TouchableOpacity onPress={onNotePress} activeOpacity={0.7}>
            <Text style={styles.addNoteLink}>+ Add note</Text>
          </TouchableOpacity>
        ) : null}

        {isClaimed ? (
          <View style={styles.claimedRow}>
            <MaterialIcons name="check-circle" size={14} color={colors.success} />
            <Text style={styles.claimedText}>{claimerName ? `Claimed by ${claimerName}` : 'Claimed'}</Text>
          </View>
        ) : showClaimButton ? (
          <TouchableOpacity
            style={styles.claimButton}
            onPress={onClaim}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel={`Claim ${productName ?? item.productId}`}
          >
            <MaterialIcons name="card-giftcard" size={14} color={colors.white} />
            <Text style={styles.claimButtonText}>I'll Get This</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {onRemove ? (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${productName ?? item.productId} from wishlist`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialIcons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  rowClaimed: {
    opacity: 0.65,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: spacing.borderRadius.sm,
    overflow: 'hidden',
    marginRight: spacing.sm,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark,
    marginBottom: 2,
    lineHeight: 18,
  },
  nameClaimed: {
    color: colors.textSecondary,
  },
  price: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 4,
  },
  priceClaimed: {
    color: colors.textLight,
  },
  claimedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  claimedText: {
    fontSize: typography.fontSize.xs,
    color: colors.success,
    fontWeight: typography.fontWeight.semiBold,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    gap: 4,
    alignSelf: 'flex-start',
    minHeight: 28,
  },
  claimButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
  removeButton: {
    width: 36,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  noteText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  addNoteLink: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
    marginTop: 2,
  },
});
