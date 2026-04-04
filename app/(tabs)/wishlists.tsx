import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useWishlists } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export default function WishlistsScreen() {
  const { wishlists, isLoading } = useWishlists();
  const { isGuest } = useAuth();

  if (isGuest) {
    return (
      <View style={styles.centered}>
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

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlists}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.items.length} items</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyTitle}>No wishlists yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first wishlist to get started.
            </Text>
          </View>
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
    padding: spacing.lg,
  },
  list: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  guestTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  guestSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
