import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const { currentUser, isGuest } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Canadian Tire Wishlist</Text>
        <Text style={styles.bannerSubtitle}>
          {isGuest
            ? 'Browsing as Guest'
            : `Welcome back, ${currentUser?.name ?? ''}!`}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Get Started</Text>
        <Text style={styles.sectionBody}>
          Browse the catalog, scan barcodes in-store, and build your wishlist to
          share with family and friends.
        </Text>
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
    padding: spacing.md,
  },
  banner: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  bannerSubtitle: {
    color: colors.white,
    fontSize: 15,
    opacity: 0.9,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  sectionBody: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
