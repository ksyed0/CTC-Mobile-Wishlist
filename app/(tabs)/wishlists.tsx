import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useWishlists } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { WishlistCard } from '../../components/WishlistCard';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export default function WishlistsScreen() {
  const router = useRouter();
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
        contentContainerStyle={
          wishlists.length === 0 ? styles.listEmpty : styles.list
        }
        renderItem={({ item }) => (
          <WishlistCard
            wishlist={item}
            onPress={() => router.push(`/wishlist/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="favorite-border"
            title="No wishlists yet"
            subtitle="Create your first wishlist to get started."
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
    padding: spacing.lg,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  listEmpty: {
    flexGrow: 1,
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
});
