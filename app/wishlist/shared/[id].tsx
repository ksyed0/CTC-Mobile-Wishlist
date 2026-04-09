import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Wishlist } from '../../../types/wishlist';
import { useWishlists } from '../../../contexts/WishlistContext';
import { useProducts } from '../../../contexts/ProductContext';
import { useAuth } from '../../../contexts/AuthContext';
import { WishlistItemRow } from '../../../components/WishlistItemRow';
import { EmptyState } from '../../../components/EmptyState';
import { Toast, useToast } from '../../../components/Toast';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

export default function SharedWishlistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getWishlistById, claimItem, markWishlistSeen } = useWishlists();
  const { products } = useProducts();
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const { showToast, toast } = useToast();

  useEffect(() => {
    if (id) {
      getWishlistById(id).then((w) => {
        setWishlist(w);
        setIsLoading(false);
        // AC-007-005-002: mark as seen so the tab badge clears
        if (w) {
          markWishlistSeen(id);
        }
      });
    }
  }, [id]);

  function getProductData(productId: string) {
    return products.find((p) => p.id === productId);
  }

  // AC-005-003-001/35: claim an item
  async function handleClaim(productId: string, productName: string) {
    if (!wishlist || !currentUser) return;
    setClaimingId(productId);
    try {
      await claimItem(wishlist.id, productId);
      const updated = await getWishlistById(wishlist.id);
      setWishlist(updated);
      showToast(`Reserved "${productName}" as a gift`, 'success');
    } catch {
      showToast('Could not claim item. Please try again.', 'error');
    } finally {
      setClaimingId(null);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!wishlist) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Shared wishlist not found</Text>
      </View>
    );
  }

  // AC-005-003-003: owner cannot claim their own items
  const isOwner = currentUser?.id === wishlist.ownerId;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{wishlist.name}</Text>
        <Text style={styles.headerMeta}>
          {wishlist.items.length} item{wishlist.items.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={wishlist.items}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={wishlist.items.length === 0 ? styles.listEmpty : styles.list}
        renderItem={({ item }) => {
          const product = getProductData(item.productId);
          const productName = product?.name ?? item.productId;
          const isClaimed = !!item.claimedBy;
          const isClaiming = claimingId === item.productId;

          return (
            <View style={[styles.itemWrapper, isClaimed && styles.itemWrapperClaimed]}>
              <WishlistItemRow
                item={item}
                productName={productName}
                productPrice={product?.price}
                productImage={product?.image}
                note={item.note}
              />

              {/* AC-005-002-003: show "Claimed" badge — NOT who claimed it */}
              {/* AC-005-003-003: owner sees no claim buttons; guests see "I'll Get This" */}
              {!isOwner && (
                <View style={styles.claimRow}>
                  {isClaimed ? (
                    <View style={styles.claimedBadge}>
                      <MaterialIcons name="check-circle" size={14} color={colors.white} />
                      <Text style={styles.claimedBadgeText}>Claimed</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[styles.claimButton, isClaiming && styles.claimButtonDisabled]}
                      onPress={() => handleClaim(item.productId, productName)}
                      disabled={isClaiming}
                      accessibilityRole="button"
                      accessibilityLabel={`Reserve ${productName} as a gift`}
                    >
                      {isClaiming ? (
                        <ActivityIndicator size="small" color={colors.white} />
                      ) : (
                        <Text style={styles.claimButtonText}>I'll Get This</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState icon="card-giftcard" title="Nothing here yet" subtitle="This wishlist has no items yet." />
        }
      />
      <Toast {...toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  headerMeta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  listEmpty: {
    flexGrow: 1,
  },
  itemWrapper: {
    marginBottom: spacing.sm,
  },
  itemWrapperClaimed: {
    opacity: 0.55,
  },
  claimRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xs,
    marginTop: 2,
  },
  claimButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimButtonDisabled: {
    opacity: 0.6,
  },
  claimButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  claimedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.textLight,
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    gap: 4,
    minHeight: 36,
  },
  claimedBadgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  notFound: {
    fontSize: 17,
    color: colors.textSecondary,
  },
});
