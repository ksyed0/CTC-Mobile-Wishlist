import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlists } from '../../contexts/WishlistContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { StorageKeys, getItem } from '../../utils/storage';
import { Product } from '../../types/product';

export default function HomeScreen() {
  const { currentUser, isGuest, isLoading: authLoading } = useAuth();
  const { wishlists, isLoading: wishlistsLoading } = useWishlists();
  const [recentScans, setRecentScans] = useState<Product[]>([]);

  // Load recent scans from AsyncStorage whenever user changes
  useEffect(() => {
    getItem<Product[]>(StorageKeys.RECENT_SCANS).then((scans) => {
      setRecentScans(scans ?? []);
    });
  }, [currentUser]);

  const handleBrowseCatalog = useCallback(() => {
    router.push('/(tabs)/catalog');
  }, []);

  const handleScan = useCallback(() => {
    router.push('/(tabs)/scan');
  }, []);

  const handleMyWishlists = useCallback(() => {
    router.push('/(tabs)/wishlists');
  }, []);

  const handleLogin = useCallback(() => {
    router.push('/login');
  }, []);

  if (authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Text style={styles.heroTitle}>Canadian Tire</Text>
        <Text style={styles.heroSubtitle}>Wishlist</Text>
        {isGuest ? (
          <Text style={styles.heroWelcome}>Browsing as Guest</Text>
        ) : (
          <Text style={styles.heroWelcome}>
            Welcome back, {currentUser?.name ?? ''}!
          </Text>
        )}
      </View>

      {/* Guest Prompt */}
      {isGuest ? (
        <View style={styles.guestCard}>
          <MaterialIcons name="account-circle" size={32} color={colors.primary} />
          <View style={styles.guestCardText}>
            <Text style={styles.guestCardTitle}>Sign in to save wishlists</Text>
            <Text style={styles.guestCardSubtitle}>
              Create and share wishlists with family and friends.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleLogin}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Sign in to your account"
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Quick Stats */}
      {!isGuest ? (
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={handleMyWishlists}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="View wishlists"
          >
            {wishlistsLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.statValue}>{wishlists.length}</Text>
            )}
            <Text style={styles.statLabel}>Wishlists</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statCard}
            onPress={handleMyWishlists}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="View saved items"
          >
            {wishlistsLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.statValue}>
                {wishlists.reduce((sum, w) => sum + w.items.length, 0)}
              </Text>
            )}
            <Text style={styles.statLabel}>Items Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statCard}
            onPress={handleMyWishlists}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="View shared wishlists"
          >
            {wishlistsLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.statValue}>
                {wishlists.filter((w) => w.sharedWith.length > 0).length}
              </Text>
            )}
            <Text style={styles.statLabel}>Shared</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* CTA Buttons */}
      <Text style={styles.sectionTitle}>Get Started</Text>

      <TouchableOpacity
        style={styles.ctaButton}
        onPress={handleBrowseCatalog}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Browse catalog, explore products by category"
      >
        <View style={styles.ctaIcon}>
          <MaterialIcons name="grid-view" size={24} color={colors.primary} />
        </View>
        <View style={styles.ctaTextContainer}>
          <Text style={styles.ctaTitle}>Browse Catalog</Text>
          <Text style={styles.ctaSubtitle}>Explore products by category</Text>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={colors.textLight} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.ctaButton}
        onPress={handleScan}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Scan item, scan a barcode in-store"
      >
        <View style={styles.ctaIcon}>
          <MaterialIcons name="qr-code-scanner" size={24} color={colors.primary} />
        </View>
        <View style={styles.ctaTextContainer}>
          <Text style={styles.ctaTitle}>Scan Item</Text>
          <Text style={styles.ctaSubtitle}>Scan a barcode in-store</Text>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={colors.textLight} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.ctaButton, isGuest ? styles.ctaButtonDisabled : null]}
        onPress={isGuest ? handleLogin : handleMyWishlists}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={isGuest ? 'Sign in to view wishlists' : 'My wishlists, view and manage your wishlists'}
      >
        <View style={styles.ctaIcon}>
          <MaterialIcons
            name="favorite"
            size={24}
            color={isGuest ? colors.textLight : colors.primary}
          />
        </View>
        <View style={styles.ctaTextContainer}>
          <Text style={[styles.ctaTitle, isGuest ? styles.ctaTitleDisabled : null]}>
            My Wishlists
          </Text>
          <Text style={styles.ctaSubtitle}>
            {isGuest ? 'Sign in to view wishlists' : 'View and manage your wishlists'}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={colors.textLight} />
      </TouchableOpacity>

      {/* Recent Scans */}
      {recentScans.length > 0 ? (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <FlatList
            data={recentScans}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.recentCard}
                onPress={() => router.push(`/product/${item.id}`)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={item.name}
              >
                <View style={styles.recentImagePlaceholder}>
                  <MaterialIcons name="image" size={28} color={colors.textLight} />
                </View>
                <Text style={styles.recentName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.recentPrice}>${item.price.toFixed(2)}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBanner: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  heroTitle: {
    color: colors.white,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
  },
  heroSubtitle: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  heroWelcome: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    opacity: 0.85,
    marginTop: spacing.sm,
  },
  guestCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  guestCardText: {
    flex: 1,
  },
  guestCardTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark,
    marginBottom: 2,
  },
  guestCardSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  signInButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.dark,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
    minHeight: 64,
  },
  ctaButtonDisabled: {
    opacity: 0.6,
  },
  ctaIcon: {
    width: 44,
    height: 44,
    borderRadius: spacing.borderRadius.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark,
    marginBottom: 2,
  },
  ctaTitleDisabled: {
    color: colors.textSecondary,
  },
  ctaSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  recentSection: {
    marginTop: spacing.sm,
  },
  recentList: {
    paddingBottom: spacing.sm,
  },
  recentCard: {
    width: 120,
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.sm,
    marginRight: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  recentImagePlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: colors.background,
    borderRadius: spacing.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  recentName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark,
    marginBottom: 2,
    lineHeight: 16,
  },
  recentPrice: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
});
