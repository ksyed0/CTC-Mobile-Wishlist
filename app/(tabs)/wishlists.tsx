import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  SectionList,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlists } from '../../contexts/WishlistContext';
import { WishlistCard } from '../../components/WishlistCard';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function WishlistsScreen() {
  const { isGuest } = useAuth();
  const { wishlists, sharedWishlists, isLoading, createWishlist } = useWishlists();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleWishlistPress = useCallback((id: string, isShared: boolean) => {
    if (isShared) {
      router.push(`/wishlist/shared/${id}`);
    } else {
      router.push(`/wishlist/${id}`);
    }
  }, []);

  const handleCreateWishlist = useCallback(async () => {
    const name = newWishlistName.trim();
    if (!name) return;
    setIsCreating(true);
    try {
      await createWishlist(name);
      setNewWishlistName('');
      setCreateModalVisible(false);
    } catch {
      Alert.alert('Error', 'Failed to create wishlist. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }, [newWishlistName, createWishlist]);

  const handleOpenCreate = useCallback(() => {
    setCreateModalVisible(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setCreateModalVisible(false);
    setNewWishlistName('');
  }, []);

  const handleLoginPress = useCallback(() => {
    router.push('/login');
  }, []);

  // Guest state
  if (isGuest) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="favorite-border"
          title="Sign in to view wishlists"
          subtitle="Create and share wishlists with family and friends."
          ctaLabel="Sign In"
          onCta={handleLoginPress}
        />
      </View>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const sections = [
    {
      title: 'My Wishlists',
      data: wishlists,
      isShared: false,
    },
    ...(sharedWishlists.length > 0
      ? [{ title: 'Shared With Me', data: sharedWishlists, isShared: true }]
      : []),
  ];

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.title === 'My Wishlists' ? (
              <Text style={styles.sectionCount}>{wishlists.length}</Text>
            ) : null}
          </View>
        )}
        renderItem={({ item, section }) => (
          <WishlistCard
            wishlist={item}
            isShared={section.isShared}
            onPress={() => handleWishlistPress(item.id, section.isShared)}
          />
        )}
        ListFooterComponent={
          wishlists.length === 0 && sharedWishlists.length === 0 ? (
            <EmptyState
              icon="favorite-border"
              title="No wishlists yet"
              subtitle="Create your first wishlist to get started."
            />
          ) : null
        }
        stickySectionHeadersEnabled={false}
      />

      {/* FAB — Create Wishlist */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleOpenCreate}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Create new wishlist"
      >
        <MaterialIcons name="add" size={28} color={colors.white} />
      </TouchableOpacity>

      {/* Create Wishlist Modal */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseCreate}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Wishlist</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Wishlist name (e.g. Christmas 2025)"
              placeholderTextColor={colors.textLight}
              value={newWishlistName}
              onChangeText={setNewWishlistName}
              returnKeyType="done"
              onSubmitEditing={handleCreateWishlist}
              autoFocus
              maxLength={60}
              accessibilityLabel="Wishlist name"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handleCloseCreate}
                activeOpacity={0.75}
                accessibilityRole="button"
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalCreateButton,
                  !newWishlistName.trim() ? styles.modalCreateButtonDisabled : null,
                ]}
                onPress={handleCreateWishlist}
                disabled={!newWishlistName.trim() || isCreating}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                {isCreating ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.modalCreateText}>Create</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  list: {
    padding: spacing.md,
    paddingBottom: 96, // room for FAB
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.dark,
  },
  sectionCount: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    borderRadius: spacing.borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.dark,
    minHeight: 48,
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  modalCreateButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  modalCreateButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  modalCreateText: {
    fontSize: typography.fontSize.md,
    color: colors.white,
    fontWeight: typography.fontWeight.semiBold,
  },
});
