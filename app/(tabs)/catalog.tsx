import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useProducts } from '../../contexts/ProductContext';
import { ProductCard } from '../../components/ProductCard';
import { CategoryChip } from '../../components/CategoryChip';
import { EmptyState } from '../../components/EmptyState';
import { Product } from '../../types/product';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const ALL_CATEGORY = { id: '', name: 'All', icon: 'apps' };

export default function CatalogScreen() {
  const {
    products,
    categories,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    search,
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimer.current = setTimeout(async () => {
      const results = await search(searchQuery.trim());
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [searchQuery, search]);

  const displayedProducts = searchQuery.trim() !== '' ? searchResults : filteredProducts;

  const handleProductPress = useCallback((productId: string) => {
    router.push(`/product/${productId}`);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const chipData = [ALL_CATEGORY, ...categories];

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading products…</Text>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="shopping-cart"
        title="No products available"
        subtitle="Check back later for new products."
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products…"
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          accessibilityLabel="Search products"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && isSearching ? (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={styles.searchSpinner}
          />
        ) : searchQuery.length > 0 ? (
          <MaterialIcons
            name="close"
            size={18}
            color={colors.textSecondary}
            onPress={handleClearSearch}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            style={styles.clearIcon}
          />
        ) : null}
      </View>

      {/* Category Chips */}
      {searchQuery.trim() === '' ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}
        >
          {chipData.map((cat) => (
            <CategoryChip
              key={cat.id}
              category={cat}
              isSelected={
                selectedCategory === cat.id ||
                (cat.id === '' && selectedCategory === null)
              }
              onPress={() => setSelectedCategory(cat.id === '' ? null : cat.id)}
            />
          ))}
        </ScrollView>
      ) : null}

      {/* Product Grid */}
      <FlatList
        data={displayedProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="search-off"
            title={
              searchQuery.trim() !== ''
                ? 'No results found'
                : 'No products in this category'
            }
            subtitle={
              searchQuery.trim() !== ''
                ? `No products match "${searchQuery}"`
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
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.dark,
    paddingVertical: spacing.sm,
  },
  searchSpinner: {
    marginLeft: spacing.xs,
  },
  clearIcon: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
  },
  chipsScroll: {
    flexGrow: 0,
    marginBottom: spacing.sm,
  },
  chipsContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  columnWrapper: {
    gap: spacing.sm,
  },
  cardWrapper: {
    flex: 1,
  },
});
