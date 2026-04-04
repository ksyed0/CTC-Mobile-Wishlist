import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Product } from '../../types/product';
import { Wishlist } from '../../types/wishlist';
import { useProducts } from '../../contexts/ProductContext';
import { useWishlists } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProductById } = useProducts();
  const { wishlists, addItem, isLoading: wishlistsLoading } = useWishlists();
  const { isGuest } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getProductById(id)
      .then((p) => {
        setProduct(p);
        if (!p) setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [id, getProductById]);

  const isAlreadyInWishlist = useCallback(
    (wishlist: Wishlist) =>
      wishlist.items.some((item) => item.productId === id),
    [id]
  );

  const handleAddToWishlist = useCallback(async () => {
    if (!product || isGuest) {
      if (isGuest) router.push('/login');
      return;
    }

    if (wishlists.length === 0) {
      Alert.alert(
        'No Wishlists',
        'Create a wishlist first before adding items.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Create Wishlist', onPress: () => router.push('/(tabs)/wishlists') },
        ]
      );
      return;
    }

    if (wishlists.length === 1) {
      const wishlist = wishlists[0];
      if (isAlreadyInWishlist(wishlist)) {
        Alert.alert('Already in Wishlist', `"${product.name}" is already in "${wishlist.name}".`);
        return;
      }
      setIsAdding(true);
      try {
        await addItem(wishlist.id, product.id);
        Alert.alert('Added!', `"${product.name}" was added to "${wishlist.name}".`);
      } catch {
        Alert.alert('Error', 'Failed to add item. Please try again.');
      } finally {
        setIsAdding(false);
      }
      return;
    }

    // Multiple wishlists — show picker
    setPickerVisible(true);
  }, [product, isGuest, wishlists, isAlreadyInWishlist, addItem]);

  const handleWishlistSelect = useCallback(
    async (wishlist: Wishlist) => {
      if (!product) return;
      setPickerVisible(false);

      if (isAlreadyInWishlist(wishlist)) {
        Alert.alert('Already in Wishlist', `"${product.name}" is already in "${wishlist.name}".`);
        return;
      }

      setIsAdding(true);
      try {
        await addItem(wishlist.id, product.id);
        Alert.alert('Added!', `"${product.name}" was added to "${wishlist.name}".`);
      } catch {
        Alert.alert('Error', 'Failed to add item. Please try again.');
      } finally {
        setIsAdding(false);
      }
    },
    [product, isAlreadyInWishlist, addItem]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="error-outline" size={48} color={colors.textLight} />
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <MaterialIcons name="image" size={80} color={colors.textLight} />
          <Text style={styles.imagePlaceholderText}>Product Image</Text>
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          {/* Category badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{product.category}</Text>
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <View
              style={[
                styles.stockBadge,
                product.inStock ? styles.stockBadgeIn : styles.stockBadgeOut,
              ]}
            >
              <MaterialIcons
                name={product.inStock ? 'check-circle' : 'cancel'}
                size={14}
                color={product.inStock ? colors.success : colors.error}
              />
              <Text
                style={[
                  styles.stockText,
                  product.inStock ? styles.stockTextIn : styles.stockTextOut,
                ]}
              >
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.barcodeRow}>
            <MaterialIcons name="qr-code" size={16} color={colors.textLight} />
            <Text style={styles.barcodeText}>{product.barcode}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Add to Wishlist CTA */}
      <View style={styles.footer}>
        {isGuest ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/login')}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <MaterialIcons name="login" size={20} color={colors.white} />
            <Text style={styles.addButtonText}>Sign In to Add to Wishlist</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.addButton, (!product.inStock || wishlistsLoading) ? styles.addButtonSecondary : null]}
            onPress={handleAddToWishlist}
            disabled={isAdding || wishlistsLoading}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            {isAdding ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <>
                <MaterialIcons name="favorite-border" size={20} color={colors.white} />
                <Text style={styles.addButtonText}>Add to Wishlist</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Wishlist Picker Modal */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add to Wishlist</Text>
            <Text style={styles.modalSubtitle}>Choose a wishlist for "{product.name}"</Text>

            <FlatList
              data={wishlists}
              keyExtractor={(item) => item.id}
              style={styles.modalList}
              renderItem={({ item }) => {
                const alreadyAdded = isAlreadyInWishlist(item);
                return (
                  <TouchableOpacity
                    style={[styles.wishlistOption, alreadyAdded ? styles.wishlistOptionAdded : null]}
                    onPress={() => handleWishlistSelect(item)}
                    activeOpacity={0.75}
                    disabled={alreadyAdded}
                    accessibilityRole="button"
                  >
                    <MaterialIcons
                      name={alreadyAdded ? 'check-circle' : 'favorite-border'}
                      size={22}
                      color={alreadyAdded ? colors.success : colors.primary}
                    />
                    <View style={styles.wishlistOptionInfo}>
                      <Text style={styles.wishlistOptionName}>{item.name}</Text>
                      <Text style={styles.wishlistOptionMeta}>
                        {item.items.length} item{item.items.length !== 1 ? 's' : ''}
                        {alreadyAdded ? ' · Already added' : ''}
                      </Text>
                    </View>
                    {!alreadyAdded ? (
                      <MaterialIcons name="chevron-right" size={20} color={colors.textLight} />
                    ) : null}
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setPickerVisible(false)}
              activeOpacity={0.75}
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
  content: {
    paddingBottom: 96,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  errorText: {
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
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  imagePlaceholderText: {
    color: colors.textLight,
    fontSize: typography.fontSize.sm,
  },
  detailsContainer: {
    padding: spacing.md,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    borderRadius: spacing.borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  categoryBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  productName: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.dark,
    marginBottom: spacing.sm,
    lineHeight: 30,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  price: {
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.full,
  },
  stockBadgeIn: {
    backgroundColor: '#E8F5E9',
  },
  stockBadgeOut: {
    backgroundColor: '#FFEBEE',
  },
  stockText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
  stockTextIn: {
    color: colors.success,
  },
  stockTextOut: {
    color: colors.error,
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  barcodeText: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
    fontFamily: 'monospace',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    minHeight: 52,
  },
  addButtonSecondary: {
    backgroundColor: colors.textSecondary,
  },
  addButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
  },
  // Picker modal
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
    maxHeight: '70%',
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
  modalList: {
    flexGrow: 0,
  },
  wishlistOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 60,
  },
  wishlistOptionAdded: {
    opacity: 0.6,
  },
  wishlistOptionInfo: {
    flex: 1,
  },
  wishlistOptionName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark,
    marginBottom: 2,
  },
  wishlistOptionMeta: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  modalCancelButton: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
});
