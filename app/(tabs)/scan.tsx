import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export default function ScanScreen() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="qr-code-scanner" size={80} color={colors.primary} />
      <Text style={styles.title}>Barcode Scanner</Text>
      <Text style={styles.subtitle}>
        Scan a product barcode to quickly add it to your wishlist.
      </Text>
      <Text style={styles.note}>Camera integration coming in next phase.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.dark,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  note: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
  },
});
