import { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useProducts } from '../../contexts/ProductContext';
import { useWishlists } from '../../contexts/WishlistContext';
import { ProductCard } from '../../components/ProductCard';
import { CategoryChip } from '../../components/CategoryChip';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function CatalogScreen() {
  const router = useRouter();
  const { filteredProducts, categories, isLoading, selectedCategory, setSelectedCategory } = useProducts();
  const { wishlists } = useWishlists();
  const savedProductIds = useMemo(
    () => new Set(wishlists.flatMap((w) => w.items.map((i) => i.productId))),
    [wishlists],
  );

  /* BUG-0086: Search state — filter locally for real-time response */
  const [searchQuery, setSearchQuery] = useState('');

  const displayedProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return filteredProducts;
    return filteredProducts.filter((p) => p.name.toLowerCase().includes(query));
  }, [filteredProducts, searchQuery]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* BUG-0086: Search bar — AC-0015, AC-0016 */}
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="never"
          accessibilityLabel="Search products"
          accessibilityHint="Type to filter the product list by name"
        />
        {searchQuery.length > 0 ? (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <MaterialIcons name="close" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category chip row */}
      <View style={styles.chipBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {/* "All" pseudo-chip */}
          <CategoryChip
            category={{ id: '__all__', name: 'All', icon: '' }}
            isSelected={selectedCategory === null}
            onPress={() => setSelectedCategory(null)}
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              isSelected={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(cat.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Product list — ProductCard with onPress → /product/[id] (AC-0011) */}
      <FlatList
        data={displayedProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={displayedProducts.length === 0 ? styles.listEmpty : styles.list}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/product/${item.id}`)}
            isSaved={savedProductIds.has(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="search-off"
            title="No products found"
            subtitle={
              searchQuery.trim()
                ? `No results for "${searchQuery.trim()}". Try a different search.`
                : 'Try selecting a different category.'
            }
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
  },
  /* BUG-0086: Search bar styles */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchIcon: {
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 0,
    fontSize: typography.fontSize.sm,
    color: colors.text,
    backgroundColor: colors.background,
  },
  chipBar: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
  },
  chipScroll: {
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  listEmpty: {
    flexGrow: 1,
  },
});
