import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Product } from '../../types/product';
import { useProducts } from '../../contexts/ProductContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProductById } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getProductById(id).then((p) => {
        setProduct(p);
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

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imagePlaceholderText}>Product Image</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.stockStatus}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.barcode}>Barcode: {product.barcode}</Text>
      </View>
    </ScrollView>
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
  imagePlaceholderText: {
    color: colors.textLight,
    fontSize: 15,
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
  },
  notFound: {
    fontSize: 17,
    color: colors.textSecondary,
  },
});
