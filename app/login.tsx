import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/user';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function LoginScreen() {
  const { mockUsers, login, continueAsGuest, isLoading } = useAuth();

  async function handleLogin(user: User) {
    await login(user.id);
    router.replace('/(tabs)');
  }

  async function handleGuest() {
    await continueAsGuest();
    router.replace('/(tabs)');
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
      <View style={styles.header}>
        <Text style={styles.logo}>Canadian Tire</Text>
        <Text style={styles.tagline}>Wishlist App</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Select a profile to sign in</Text>
        <FlatList
          data={mockUsers}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userCard}
              onPress={() => handleLogin(item)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`Sign in as ${item.name}`}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userPhone}>{item.phone}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.userList}
        />

        <TouchableOpacity
          style={styles.guestButton}
          onPress={handleGuest}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Continue as guest"
        >
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          This is a demo app. No real authentication is performed.
        </Text>
      </View>
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
  header: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  logo: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: 17,
    color: colors.white,
    opacity: 0.9,
  },
  body: {
    flex: 1,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  userList: {
    marginBottom: spacing.md,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  guestButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  guestButtonText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
});
