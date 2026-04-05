import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Product } from '../../types/product';
import { Wishlist } from '../../types/wishlist';
import { useProducts } from '../../contexts/ProductContext';
import { useWishlists } from '../../contexts/WishlistContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getProductById } = useProducts();
  const { wishlists, addItem } = useWishlists();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (id) {
      getProductById(id).then((p) => {
        setProduct(p);
        setIsLoading(false);
      });
    }
  }, [id]);

  async function addToWishlist(wishlist: Wishlist) {
    if (!product) return;

    // AC-0042: duplicate guard
    const alreadyIn = wishlist.items.some((i) => i.productId === product.id);
    if (alreadyIn) {
      Alert.alert('Already in Wishlist', `"${product.name}" is already in "${wishlist.name}".`);
      setShowPicker(false);
      return;
    }

    setIsAdding(true);
    setShowPicker(false);
    try {
      await addItem(wishlist.id, product.id);
      Alert.alert('Added!', `"${product.name}" was added to "${wishlist.name}".`);
    } catch {
      Alert.alert('Error', 'Could not add item. Please try again.');
    } finally {
      setIsAdding(false);
    }
  }

  function handleAddToWishlist() {
    // AC-0013: no wishlists → prompt to create one first, offer navigation
    if (wishlists.length === 0) {
      Alert.alert('No Wishlists', 'Create a wishlist first, then come back to add this product.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create Wishlist',
          onPress: () => router.push('/(tabs)/wishlists'),
        },
      ]);
      return;
    }
    // AC-0014: one wishlist → add directly; multiple → show picker
    if (wishlists.length === 1) {
      addToWishlist(wishlists[0]);
    } else {
      setShowPicker(true);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Product not found</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.imagePlaceholder}>
          <MaterialIcons name="image" size={64} color={colors.textLight} />
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.stockStatus}>{product.inStock ? 'In Stock' : 'Out of Stock'}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.barcode}>Barcode: {product.barcode}</Text>

          {/* AC-0013/14: Add to Wishlist */}
          <TouchableOpacity
            style={[styles.addButton, isAdding && styles.addButtonDisabled]}
            onPress={handleAddToWishlist}
            disabled={isAdding}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Add to wishlist"
          >
            {isAdding ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <>
                <MaterialIcons name="favorite-border" size={20} color={colors.white} />
                <Text style={styles.addButtonText}>Add to Wishlist</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Wishlist picker modal — shown when user has multiple wishlists */}
      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowPicker(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Add to Wishlist</Text>
            <Text style={styles.modalSubtitle}>Choose which wishlist to add "{product.name}"</Text>
            <FlatList
              data={wishlists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.wishlistOption}
                  onPress={() => addToWishlist(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Add to ${item.name}`}
                >
                  <MaterialIcons name="favorite" size={20} color={colors.primary} />
                  <View style={styles.wishlistOptionInfo}>
                    <Text style={styles.wishlistOptionName}>{item.name}</Text>
                    <Text style={styles.wishlistOptionMeta}>
                      {item.items.length} item{item.items.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color={colors.textLight} />
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowPicker(false)}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
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
  content: {
    paddingBottom: spacing.xl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: 260,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    padding: spacing.md,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  stockStatus: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  barcode: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: spacing.lg,
  },
  notFound: {
    fontSize: 17,
    color: colors.textSecondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
    gap: spacing.sm,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
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
    maxHeight: '70%',
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
  wishlistOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    minHeight: 56,
  },
  wishlistOptionInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  wishlistOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.dark,
  },
  wishlistOptionMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  cancelButton: {
    marginTop: spacing.md,
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
