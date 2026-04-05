import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  SectionList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useWishlists } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { WishlistCard } from '../../components/WishlistCard';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Wishlist } from '../../types/wishlist';

export default function WishlistsScreen() {
  const router = useRouter();
  const { wishlists, sharedWishlists, isLoading, createWishlist } = useWishlists();
  const { isGuest } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (isGuest) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="favorite-border" size={48} color={colors.textLight} />
        <Text style={styles.guestTitle}>Sign in to view wishlists</Text>
        <Text style={styles.guestSubtitle}>
          Create an account or sign in to save and share your wishlists.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  async function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    setIsCreating(true);
    try {
      await createWishlist(name);
      setNewName('');
      setShowCreateModal(false);
    } catch {
      Alert.alert('Error', 'Could not create wishlist. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }

  // Build sections for SectionList
  type Section = { title: string; data: Wishlist[]; isShared: boolean };
  const sections: Section[] = [];
  sections.push({ title: 'My Wishlists', data: wishlists, isShared: false });
  if (sharedWishlists.length > 0) {
    sections.push({ title: 'Shared With Me', data: sharedWishlists, isShared: true });
  }

  const hasAnyWishlist = wishlists.length > 0 || sharedWishlists.length > 0;

  return (
    <>
      <View style={styles.container}>
        {hasAnyWishlist ? (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            renderItem={({ item, section }) => (
              <WishlistCard
                wishlist={item}
                isShared={(section as Section).isShared}
                onPress={() => {
                  if ((section as Section).isShared) {
                    router.push(`/wishlist/shared/${item.id}`);
                  } else {
                    router.push(`/wishlist/${item.id}`);
                  }
                }}
              />
            )}
            ListFooterComponent={<View style={styles.footer} />}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="favorite-border"
              title="No wishlists yet"
              subtitle="Tap the button below to create your first wishlist."
            />
          </View>
        )}

        {/* FAB: create new wishlist */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowCreateModal(true)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Create new wishlist"
        >
          <MaterialIcons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Create Wishlist Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowCreateModal(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>New Wishlist</Text>
            <TextInput
              style={styles.input}
              placeholder="Wishlist name (e.g. Birthday, Camping)"
              value={newName}
              onChangeText={setNewName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleCreate}
              maxLength={60}
            />
            <TouchableOpacity
              style={[styles.createButton, (!newName.trim() || isCreating) && styles.createButtonDisabled]}
              onPress={handleCreate}
              disabled={!newName.trim() || isCreating}
              activeOpacity={0.8}
            >
              {isCreating ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.createButtonText}>Create Wishlist</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => { setShowCreateModal(false); setNewName(''); }}
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
  emptyContainer: {
    flex: 1,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xxl + spacing.xl, // room for FAB
  },
  footer: {
    height: spacing.xxl,
  },
  sectionHeader: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
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
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 16,
    color: colors.dark,
    marginBottom: spacing.md,
    minHeight: 48,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
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
