import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Wishlist } from '../../types/wishlist';
import { useWishlists } from '../../contexts/WishlistContext';
import { useProducts } from '../../contexts/ProductContext';
import { useAuth } from '../../contexts/AuthContext';
import { WishlistItemRow } from '../../components/WishlistItemRow';
import { EmptyState } from '../../components/EmptyState';
import { getTotalPrice } from '../../utils/wishlistUtils';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export default function WishlistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getWishlistById, removeItem, shareWishlist } = useWishlists();
  const { products } = useProducts();
  const { mockUsers } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (id) {
      getWishlistById(id).then((w) => {
        setWishlist(w);
        setIsLoading(false);
      });
    }
  }, [id]);

  function getProductData(productId: string) {
    return products.find((p) => p.id === productId);
  }

  // AC-0025: confirm before removing
  function handleRemove(productId: string, productName: string) {
    Alert.alert(
      'Remove Item',
      `Remove "${productName}" from this wishlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            if (!wishlist) return;
            await removeItem(wishlist.id, productId);
            const updated = await getWishlistById(wishlist.id);
            setWishlist(updated);
          },
        },
      ],
    );
  }

  // AC-0028/44: share with a mock user
  async function handleShare(userId: string, userName: string) {
    if (!wishlist) return;
    await shareWishlist(wishlist.id, [
      {
        contactId: userId,
        contactName: userName,
        phone: '',
        sharedAt: new Date().toISOString(),
      },
    ]);
    setShowShareModal(false);
    Alert.alert('Shared!', `Wishlist shared with ${userName}.`);
    const updated = await getWishlistById(wishlist.id);
    setWishlist(updated);
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
        <Text style={styles.notFound}>Wishlist not found</Text>
      </View>
    );
  }

  const total = getTotalPrice(wishlist, products);

  return (
    <>
      <View style={styles.container}>
        {/* Header with share button */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{wishlist.name}</Text>
            <Text style={styles.headerMeta}>
              {wishlist.items.length} item{wishlist.items.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => setShowShareModal(true)}
          >
            <MaterialIcons name="share" size={20} color={colors.primary} />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={wishlist.items}
          keyExtractor={(item) => item.productId}
          contentContainerStyle={
            wishlist.items.length === 0 ? styles.listEmpty : styles.list
          }
          renderItem={({ item }) => {
            const product = getProductData(item.productId);
            const productName = product?.name ?? item.productId;
            return (
              <View style={styles.itemWrapper}>
                {/* Use WishlistItemRow with resolved product data */}
                <WishlistItemRow
                  item={item}
                  productName={productName}
                  productPrice={product?.price}
                />
                {/* Remove button (AC-0025) */}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(item.productId, productName)}
                >
                  <MaterialIcons name="delete-outline" size={18} color={colors.error} />
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={
            /* AC-0026: EmptyState component */
            <EmptyState
              icon="favorite-border"
              title="No items yet"
              subtitle="Browse the catalog or scan barcodes to add items to this wishlist."
            />
          }
        />

        {/* AC-0027: price total footer */}
        {wishlist.items.length > 0 && (
          <View style={styles.footer}>
            <Text style={styles.footerLabel}>Total</Text>
            <Text style={styles.footerTotal}>${total.toFixed(2)}</Text>
          </View>
        )}
      </View>

      {/* AC-0028/44: Share modal with mock users */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowShareModal(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Share Wishlist</Text>
            <Text style={styles.modalSubtitle}>
              Choose someone to share "{wishlist.name}" with
            </Text>
            {mockUsers.map((user) => {
              const alreadyShared = wishlist.sharedWith.some(
                (s) => s.contactId === user.id,
              );
              return (
                <TouchableOpacity
                  key={user.id}
                  style={[styles.userOption, alreadyShared && styles.userOptionShared]}
                  onPress={() => !alreadyShared && handleShare(user.id, user.name)}
                  disabled={alreadyShared}
                >
                  <MaterialIcons
                    name="person"
                    size={24}
                    color={alreadyShared ? colors.textLight : colors.primary}
                  />
                  <Text style={[styles.userName, alreadyShared && styles.userNameShared]}>
                    {user.name}
                  </Text>
                  {alreadyShared && (
                    <Text style={styles.sharedBadge}>Shared</Text>
                  )}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 2,
  },
  headerMeta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    minHeight: 44,
    gap: spacing.xs,
  },
  shareButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
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
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 36,
    gap: 4,
  },
  removeButtonText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  footerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  footerTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  notFound: {
    fontSize: 17,
    color: colors.textSecondary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: spacing.borderRadius.lg,
    borderTopRightRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  userOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.borderRadius.md,
    minHeight: 56,
    gap: spacing.md,
  },
  userOptionShared: {
    opacity: 0.5,
  },
  userName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.dark,
  },
  userNameShared: {
    color: colors.textSecondary,
  },
  sharedBadge: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: spacing.sm,
    alignItems: 'center',
    paddingVertical: spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
