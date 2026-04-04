import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Wishlist } from '../../types/wishlist';
import { useWishlists } from '../../contexts/WishlistContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export default function WishlistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getWishlistById } = useWishlists();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getWishlistById(id).then((w) => {
        setWishlist(w);
        setIsLoading(false);
      });
    }
  }, [id]);

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

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist.items}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.productId}>Product: {item.productId}</Text>
            {item.note && <Text style={styles.note}>{item.note}</Text>}
            {item.claimedBy && (
              <Text style={styles.claimed}>Claimed</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyTitle}>No items in this wishlist</Text>
            <Text style={styles.emptySubtitle}>
              Browse the catalog or scan barcodes to add items.
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
  productId: {
    fontSize: 15,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  note: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  claimed: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
  },
  notFound: {
    fontSize: 17,
    color: colors.textSecondary,
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
