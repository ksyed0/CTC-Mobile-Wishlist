import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  function handlePress() {
    Alert.alert('Switch User', 'Return to login screen to switch users?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Switch',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel="Switch user"
    >
      <MaterialIcons name="logout" size={22} color={colors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: spacing.sm,
    padding: spacing.xs,
  },
});
