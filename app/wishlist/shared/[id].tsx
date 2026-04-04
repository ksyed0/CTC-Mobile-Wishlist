import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Wishlist } from '../../../types/wishlist';
import { Product } from '../../../types/product';
import { useProducts } from '../../../contexts/ProductContext';
import { useWishlists } from '../../../contexts/WishlistContext';
import { useAuth } from '../../../contexts/AuthContext';
import { WishlistItemRow } from '../../../components/WishlistItemRow';
import { EmptyState } from '../../../components/EmptyState';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

export default function SharedWishlistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { getProductById } = useProducts();
  const { getWishlistById, claimItem, unclaimItem, sharedWishlists } = useWishlists();
  const { currentUser } = useAuth();

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [productMap, setProductMap] = useState<Record<string, Product>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const w = await getWishlistById(id);
      setWishlist(w);
      if (w && w.items.length > 0) {
        const entries = await Promise.all(
          w.items.map(async (item) => {
            const p = await getProductById(item.productId);
            return p ? ([item.productId, p] as [string, Product]) : null;
          })
        );
        const map: Record<string, Product> = {};
        entries.forEach((e) => {
          if (e) map[e[0]] = e[1];
        });
        setProductMap(map);
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, getWishlistById, getProductById]);

  useEffect(() => {
    load();
  }, [load]);

  // Keep wishlist in sync with context after claim/unclaim
  useEffect(() => {
    if (!id) return;
    const updated = sharedWishlists.find((w) => w.id === id);
    if (updated) {
      setWishlist(updated);
    }
  }, [sharedWishlists, id]);

  // Set nav title once wishlist is loaded
  useEffect(() => {
    if (wishlist) {
      navigation.setOptions({ title: wishlist.name });
    }
  }, [wishlist, navigation]);

  // AC-0034/35: claim an item as the current user
  const handleClaim = useCallback(
    async (productId: string) => {
      if (!wishlist || !currentUser) return;
      const productName = productMap[productId]?.name ?? productId;
      setClaimingId(productId);
      try {
        await claimItem(wishlist.id, productId);
        Alert.alert(
          "You're getting it!",
          `You claimed "${productName}". The owner won't see who claimed it.`
        );
      } catch {
        Alert.alert('Error', 'Could not claim item. Please try again.');
      } finally {
        setClaimingId(null);
      }
    },
    [wishlist, currentUser, productMap, claimItem]
  );

  // Allow unclaiming your own claim
  const handleUnclaim = useCallback(
    async (productId: string) => {
      if (!wishlist) return;
      const productName = productMap[productId]?.name ?? productId;
      Alert.alert(
        'Unclaim Item',
        `Remove your claim on "${productName}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Unclaim',
            style: 'destructive',
            onPress: async () => {
              setClaimingId(productId);
              try {
                await unclaimItem(wishlist.id, productId);
              } catch {
                Alert.alert('Error', 'Could not unclaim item. Please try again.');
              } finally {
                setClaimingId(null);
              }
            },
          },
        ]
      );
    },
    [wishlist, productMap, unclaimItem]
  );

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
        <MaterialIcons name="error-outline" size={48} color={colors.textLight} />
        <Text style={styles.notFound}>Shared wishlist not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // AC-0036: determine whether current user is the owner (hides claimer names)
  const isOwner = currentUser?.id === wishlist.ownerId;

  return (
    <View style={styles.container}>
      {/* Shared-by header */}
      <View style={styles.headerBanner}>
        <MaterialIcons name="people" size={20} color={colors.primary} />
        <Text style={styles.headerText}>
          {isOwner
            ? `Your wishlist · ${wishlist.items.length} item${wishlist.items.length !== 1 ? 's' : ''}`
            : `Shared wishlist · ${wishlist.items.length} item${wishlist.items.length !== 1 ? 's' : ''}`}
        </Text>
      </View>

      {/* Recipient notice — AC-0036: claimer names hidden from owner */}
      {!isOwner && (
        <View style={styles.noticeBanner}>
          <MaterialIcons name="info-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.noticeText}>
            Claimed items are hidden from the wishlist owner. Your selections stay secret!
          </Text>
        </View>
      )}

      <FlatList
        data={wishlist.items}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={[
          styles.list,
          wishlist.items.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isMyClaim =
            item.claimedBy !== null && item.claimedBy === currentUser?.id;
          const isClaimed = item.claimedBy !== null;

          // AC-0035: if this user claimed the item, let them tap to unclaim
          const onClaim = isMyClaim
            ? () => handleUnclaim(item.productId)
            : () => handleClaim(item.productId);

          // Resolve claimer display name (never shown to owner — AC-0036)
          const claimerName = isOwner
            ? undefined
            : isMyClaim
              ? 'You'
              : isClaimed
                ? 'Someone'
                : undefined;

          return (
            <View style={claimingId === item.productId ? styles.rowLoading : undefined}>
              {claimingId === item.productId && (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={styles.rowSpinner}
                />
              )}
              <WishlistItemRow
                item={item}
                productName={productMap[item.productId]?.name}
                productPrice={productMap[item.productId]?.price}
                productImage={productMap[item.productId]?.image}
                claimerName={claimerName}
                // AC-0034: show claim button only to non-owners on unclaimed items,
                //          OR to the user who already claimed (to let them unclaim)
                showClaimButton={!isOwner && (!isClaimed || isMyClaim)}
                onClaim={onClaim}
                isOwner={isOwner}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="card-giftcard"
            title="No items in this wishlist"
            subtitle="The owner hasn't added anything yet. Check back soon!"
          />
        }
      />
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
    gap: spacing.md,
    padding: spacing.lg,
  },
  notFound: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.semiBold,
  },
  backButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    justifyContent: 'center',
  },
  backButtonText: {
    color: colors.white,
    fontWeight: typography.fontWeight.semiBold,
  },
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  noticeText: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  listEmpty: {
    flex: 1,
  },
  rowLoading: {
    position: 'relative',
  },
  rowSpinner: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 1,
  },
});
