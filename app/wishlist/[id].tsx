import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Wishlist, SharedContact } from '../../types/wishlist';
import { Product } from '../../types/product';
import { useProducts } from '../../contexts/ProductContext';
import { useWishlists } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { WishlistItemRow } from '../../components/WishlistItemRow';
import { EmptyState } from '../../components/EmptyState';
import { PriceTag } from '../../components/PriceTag';
import { getTotalPrice } from '../../utils/wishlistUtils';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

// Mock contacts available for sharing (AC-0028 / AC-0044)
const MOCK_CONTACTS = [
  { contactId: 'alice', contactName: 'Alice', phone: '555-0001' },
  { contactId: 'bob', contactName: 'Bob', phone: '555-0002' },
  { contactId: 'carol', contactName: 'Carol', phone: '555-0003' },
];

export default function WishlistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { getProductById, products } = useProducts();
  const { getWishlistById, removeItem, shareWishlist, wishlists } = useWishlists();
  const { currentUser } = useAuth();

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [productMap, setProductMap] = useState<Record<string, Product>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [sharingWith, setSharingWith] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);

  // Load wishlist and resolve all product details
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

  // Keep wishlist in sync with context updates (e.g. after removeItem)
  useEffect(() => {
    if (!id) return;
    const updated = wishlists.find((w) => w.id === id);
    if (updated) {
      setWishlist(updated);
    }
  }, [wishlists, id]);

  // Update navigation title once wishlist is known
  useEffect(() => {
    if (wishlist) {
      navigation.setOptions({ title: wishlist.name });
    }
  }, [wishlist, navigation]);

  const handleRemoveItem = useCallback(
    async (productId: string) => {
      if (!wishlist) return;
      const productName = productMap[productId]?.name ?? productId;
      Alert.alert(
        'Remove Item',
        `Remove "${productName}" from this wishlist?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              try {
                await removeItem(wishlist.id, productId);
              } catch {
                Alert.alert('Error', 'Could not remove item. Please try again.');
              }
            },
          },
        ]
      );
    },
    [wishlist, productMap, removeItem]
  );

  const toggleContact = useCallback((contactId: string) => {
    setSharingWith((prev) =>
      prev.includes(contactId)
        ? prev.filter((c) => c !== contactId)
        : [...prev, contactId]
    );
  }, []);

  const openShareModal = useCallback(() => {
    if (!wishlist) return;
    setSharingWith(wishlist.sharedWith.map((c) => c.contactId));
    setShareModalVisible(true);
  }, [wishlist]);

  const handleShare = useCallback(async () => {
    if (!wishlist) return;
    setIsSharing(true);
    try {
      const contacts: SharedContact[] = sharingWith.map((cid) => {
        const contact = MOCK_CONTACTS.find((c) => c.contactId === cid)!;
        return {
          contactId: contact.contactId,
          contactName: contact.contactName,
          phone: contact.phone,
          sharedAt: new Date().toISOString(),
        };
      });
      await shareWishlist(wishlist.id, contacts);
      setShareModalVisible(false);
      Alert.alert(
        'Done',
        sharingWith.length > 0
          ? `Shared with ${sharingWith.length} contact${sharingWith.length > 1 ? 's' : ''}.`
          : 'Wishlist is now private.'
      );
    } catch {
      Alert.alert('Error', 'Could not share wishlist. Please try again.');
    } finally {
      setIsSharing(false);
    }
  }, [wishlist, sharingWith, shareWishlist]);

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
        <Text style={styles.notFound}>Wishlist not found</Text>
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

  const totalPrice = getTotalPrice(wishlist, products);

  return (
    <>
      <View style={styles.container}>
        {/* Meta bar: item count + share button */}
        <View style={styles.metaBar}>
          <Text style={styles.metaText}>
            {wishlist.items.length} item{wishlist.items.length !== 1 ? 's' : ''}
            {wishlist.sharedWith.length > 0
              ? ` · Shared with ${wishlist.sharedWith.length}`
              : ''}
          </Text>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={openShareModal}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Share wishlist"
          >
            <MaterialIcons name="share" size={18} color={colors.primary} />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Items list — AC-0024/25/26/27 */}
        <FlatList
          data={wishlist.items}
          keyExtractor={(item) => item.productId}
          contentContainerStyle={[
            styles.list,
            wishlist.items.length === 0 && styles.listEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <WishlistItemRow
              item={item}
              productName={productMap[item.productId]?.name}
              productPrice={productMap[item.productId]?.price}
              productImage={productMap[item.productId]?.image}
              onRemove={() => handleRemoveItem(item.productId)}
              isOwner={true}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="favorite-border"
              title="No items yet"
              subtitle="Browse the catalog or scan a barcode to add items to this wishlist."
              ctaLabel="Browse Catalog"
              onCta={() => router.push('/(tabs)/catalog')}
            />
          }
          ListFooterComponent={
            wishlist.items.length > 0 ? (
              <View style={styles.totalFooter}>
                <Text style={styles.totalLabel}>Estimated Total</Text>
                <PriceTag price={totalPrice} size="lg" />
              </View>
            ) : null
          }
        />
      </View>

      {/* Share Modal — AC-0028/44 */}
      <Modal
        visible={shareModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Share Wishlist</Text>
            <Text style={styles.modalSubtitle}>
              Select contacts to share &ldquo;{wishlist.name}&rdquo; with.
            </Text>

            {MOCK_CONTACTS.filter((c) => c.contactId !== currentUser?.id).map(
              (contact) => {
                const selected = sharingWith.includes(contact.contactId);
                return (
                  <TouchableOpacity
                    key={contact.contactId}
                    style={[
                      styles.contactRow,
                      selected && styles.contactRowSelected,
                    ]}
                    onPress={() => toggleContact(contact.contactId)}
                    activeOpacity={0.75}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                  >
                    <View style={styles.contactAvatar}>
                      <Text style={styles.contactAvatarText}>
                        {contact.contactName.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{contact.contactName}</Text>
                      <Text style={styles.contactPhone}>{contact.phone}</Text>
                    </View>
                    <MaterialIcons
                      name={selected ? 'check-circle' : 'radio-button-unchecked'}
                      size={24}
                      color={selected ? colors.primary : colors.textLight}
                    />
                  </TouchableOpacity>
                );
              }
            )}

            <TouchableOpacity
              style={[
                styles.shareConfirmButton,
                isSharing && styles.shareConfirmButtonDisabled,
              ]}
              onPress={handleShare}
              disabled={isSharing}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              {isSharing ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.shareConfirmText}>
                  {sharingWith.length > 0
                    ? `Share with ${sharingWith.length} contact${sharingWith.length > 1 ? 's' : ''}`
                    : 'Make Private'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShareModalVisible(false)}
              activeOpacity={0.75}
              accessibilityRole="button"
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  metaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  metaText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    minHeight: 36,
  },
  shareButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  listEmpty: {
    flex: 1,
  },
  totalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  totalLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark,
  },
  // Share modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: spacing.borderRadius.lg,
    borderTopRightRadius: spacing.borderRadius.lg,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 60,
  },
  contactRowSelected: {
    backgroundColor: colors.background,
    borderRadius: spacing.borderRadius.sm,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  contactAvatarText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  shareConfirmButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  shareConfirmButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  shareConfirmText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
  },
  modalCancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    minHeight: 48,
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  modalCancelText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
});
