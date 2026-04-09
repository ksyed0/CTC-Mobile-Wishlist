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
  Switch,
} from 'react-native';
import { BottomSheetInput } from '../../components/BottomSheetInput';
import { Toast, useToast } from '../../components/Toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { typography } from '../../theme/typography';

export default function WishlistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { getWishlistById, removeItem, shareWishlist, updateItemNote, renameWishlist, setShowClaimers, setPrivacy } =
    useWishlists();
  const { products } = useProducts();
  const { mockUsers, currentUser } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [noteSheet, setNoteSheet] = useState<{ productId: string; currentNote: string | null } | null>(null);
  const [showRenameSheet, setShowRenameSheet] = useState(false);
  const [showPrivacySheet, setShowPrivacySheet] = useState(false);
  const { showToast, toast } = useToast();

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

  // AC-004-002-002: confirm before removing
  function handleRemove(productId: string, productName: string) {
    Alert.alert('Remove Item', `Remove "${productName}" from this wishlist?`, [
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
    ]);
  }

  // AC-005-001-001/44: share with a mock user
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
    showToast(`Wishlist shared with ${userName}`, 'success');
    const updated = await getWishlistById(wishlist.id);
    setWishlist(updated);
  }

  async function handleNoteSave(note: string) {
    if (!wishlist || !noteSheet) return;
    await updateItemNote(wishlist.id, noteSheet.productId, note);
    const updated = await getWishlistById(wishlist.id);
    setWishlist(updated);
    setNoteSheet(null);
  }

  async function handleRenameSave(newName: string) {
    if (!wishlist || !newName.trim()) return;
    await renameWishlist(wishlist.id, newName);
    setWishlist((prev) => (prev ? { ...prev, name: newName.trim() } : prev));
    setShowRenameSheet(false);
  }

  // AC-007-006-001/66/67/68: claimer reveal toggle (owner-only)
  async function handleToggleClaimers(value: boolean) {
    if (!wishlist) return;
    await setShowClaimers(wishlist.id, value);
    setWishlist((prev) => (prev ? { ...prev, showClaimers: value } : prev));
  }

  // US-007-009: privacy level picker
  async function handlePrivacyChange(privacy: 'private' | 'contacts' | 'public') {
    if (!wishlist) return;
    await setPrivacy(wishlist.id, privacy);
    setWishlist((prev) => (prev ? { ...prev, privacy } : prev));
    setShowPrivacySheet(false);
  }

  // US-007-009: copy shareable link to clipboard
  function handleCopyLink() {
    if (!wishlist) return;
    const link = `ctcwishlist://shared/${wishlist.id}`;
    showToast('Link copied to clipboard', 'info');
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
  // AC-005-002-003/AC-005-003-003: owner sees "Claimed" without claimer identity
  const isOwner = currentUser?.id === wishlist.ownerId;

  return (
    <>
      <View style={styles.container}>
        {/* Header with share button */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>{wishlist.name}</Text>
              <TouchableOpacity
                onPress={() => setShowRenameSheet(true)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Rename wishlist"
              >
                <MaterialIcons name="edit" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.headerMeta}>
              {wishlist.items.length} item{wishlist.items.length !== 1 ? 's' : ''}
            </Text>
          </View>
          {(wishlist.privacy ?? 'contacts') !== 'private' && (
            <TouchableOpacity style={styles.shareButton} onPress={() => setShowShareModal(true)}>
              <MaterialIcons name="share" size={20} color={colors.primary} />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* AC-007-006-001: claimer reveal toggle — owner-only */}
        {isOwner && (
          <View style={styles.claimerToggleRow}>
            <Text style={styles.claimerToggleLabel}>Show who claimed items</Text>
            <Switch
              value={wishlist.showClaimers ?? false}
              onValueChange={handleToggleClaimers}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        )}

        {/* US-007-009: privacy level selector — owner-only */}
        {isOwner && (
          <TouchableOpacity
            style={styles.privacyRow}
            onPress={() => setShowPrivacySheet(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Change wishlist privacy"
          >
            <MaterialIcons
              name={
                (wishlist.privacy ?? 'contacts') === 'private'
                  ? 'lock'
                  : (wishlist.privacy ?? 'contacts') === 'public'
                    ? 'link'
                    : 'group'
              }
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.privacyLabel}>
              {(wishlist.privacy ?? 'contacts') === 'private'
                ? 'Private'
                : (wishlist.privacy ?? 'contacts') === 'public'
                  ? 'Public link'
                  : 'Contacts only'}
            </Text>
            <MaterialIcons name="chevron-right" size={16} color={colors.textLight} />
          </TouchableOpacity>
        )}
        {isOwner && (wishlist.privacy ?? 'contacts') === 'public' && (
          <TouchableOpacity
            style={styles.copyLinkButton}
            onPress={handleCopyLink}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Copy link"
          >
            <MaterialIcons name="content-copy" size={14} color={colors.primary} />
            <Text style={styles.copyLinkText}>Copy link</Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={wishlist.items}
          keyExtractor={(item) => item.productId}
          contentContainerStyle={wishlist.items.length === 0 ? styles.listEmpty : styles.list}
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
                  productImage={product?.image}
                  isOwner={isOwner}
                  note={item.note}
                  onNotePress={() => setNoteSheet({ productId: item.productId, currentNote: item.note })}
                  claimerName={
                    isOwner && (wishlist.showClaimers ?? false) && item.claimedBy
                      ? (wishlist.sharedWith.find((c) => c.contactId === item.claimedBy)?.contactName ?? item.claimedBy)
                      : undefined
                  }
                />
                {/* Remove button (AC-004-002-002) */}
                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.productId, productName)}>
                  <MaterialIcons name="delete-outline" size={18} color={colors.error} />
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          ListEmptyComponent={
            /* AC-004-002-003: EmptyState component */
            <EmptyState
              icon="favorite-border"
              title="No items yet"
              subtitle="Browse the catalog or scan barcodes to add items to this wishlist."
            />
          }
        />

        {/* AC-004-003-001: price total footer — BUG-103: safe area bottom inset */}
        {wishlist.items.length > 0 && (
          <View style={[styles.footer, { paddingBottom: spacing.md + insets.bottom }]}>
            <Text style={styles.footerLabel}>Total</Text>
            <Text style={styles.footerTotal}>${total.toFixed(2)}</Text>
          </View>
        )}
      </View>

      {/* Item Note bottom sheet */}
      <BottomSheetInput
        visible={noteSheet !== null}
        title="Item Note"
        placeholder="e.g. Size M, the blue one"
        initialValue={noteSheet?.currentNote ?? ''}
        maxLength={120}
        onConfirm={handleNoteSave}
        onCancel={() => setNoteSheet(null)}
      />

      {/* Rename Wishlist bottom sheet */}
      <BottomSheetInput
        visible={showRenameSheet}
        title="Rename Wishlist"
        placeholder="Wishlist name"
        initialValue={wishlist?.name ?? ''}
        maxLength={60}
        confirmLabel="Save"
        onConfirm={handleRenameSave}
        onCancel={() => setShowRenameSheet(false)}
      />

      {/* US-007-009: Privacy picker modal */}
      <Modal
        visible={showPrivacySheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrivacySheet(false)}
      >
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowPrivacySheet(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Wishlist Privacy</Text>
            {(
              [
                {
                  value: 'private' as const,
                  icon: 'lock' as const,
                  label: 'Private',
                  subtitle: 'Only you can see this wishlist',
                },
                {
                  value: 'contacts' as const,
                  icon: 'group' as const,
                  label: 'Contacts only',
                  subtitle: 'Share with specific people',
                },
                {
                  value: 'public' as const,
                  icon: 'link' as const,
                  label: 'Public link',
                  subtitle: 'Anyone with the link can view',
                },
              ] as const
            ).map((option) => {
              const isSelected = (wishlist?.privacy ?? 'contacts') === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.privacyOption, isSelected && styles.privacyOptionSelected]}
                  onPress={() => handlePrivacyChange(option.value)}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityLabel={`Set privacy to ${option.label}`}
                >
                  <MaterialIcons
                    name={option.icon}
                    size={22}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.privacyOptionLabel, isSelected && styles.privacyOptionLabelSelected]}>
                      {option.label}
                    </Text>
                    <Text style={styles.privacyOptionSubtitle}>{option.subtitle}</Text>
                  </View>
                  {isSelected && <MaterialIcons name="check" size={18} color={colors.primary} />}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowPrivacySheet(false)}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* AC-005-001-001/44: Share modal with mock users */}
      <Modal visible={showShareModal} transparent animationType="slide" onRequestClose={() => setShowShareModal(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowShareModal(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Share Wishlist</Text>
            <Text style={styles.modalSubtitle}>Choose someone to share "{wishlist.name}" with</Text>
            {mockUsers
              .filter((user) => user.id !== currentUser?.id)
              .map((user) => {
                const alreadyShared = wishlist.sharedWith.some((s) => s.contactId === user.id);
                return (
                  <TouchableOpacity
                    key={user.id}
                    style={[styles.userOption, alreadyShared && styles.userOptionShared]}
                    onPress={() => !alreadyShared && handleShare(user.id, user.name)}
                    disabled={alreadyShared}
                  >
                    <MaterialIcons name="person" size={24} color={alreadyShared ? colors.textLight : colors.primary} />
                    <Text style={[styles.userName, alreadyShared && styles.userNameShared]}>{user.name}</Text>
                    {alreadyShared && <Text style={styles.sharedBadge}>Shared</Text>}
                  </TouchableOpacity>
                );
              })}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowShareModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <Toast {...toast} />
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
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
  claimerToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  claimerToggleLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  privacyLabel: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  copyLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  copyLinkText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.semiBold,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  privacyOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#fff5f5',
  },
  privacyOptionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark,
  },
  privacyOptionLabelSelected: {
    color: colors.primary,
  },
  privacyOptionSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight,
    marginTop: spacing.xxs,
  },
});
