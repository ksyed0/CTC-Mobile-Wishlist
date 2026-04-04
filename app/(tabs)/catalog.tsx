import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useProducts } from '../../contexts/ProductContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export default function CatalogScreen() {
  const { products, isLoading } = useProducts();

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
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No products found</Text>
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
  price: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
