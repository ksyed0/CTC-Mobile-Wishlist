import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useProducts } from '../../contexts/ProductContext';
import { BarcodeOverlay } from '../../components/BarcodeOverlay';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export default function ScanScreen() {
  const router = useRouter();
  const { getByBarcode } = useProducts();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const lastScanned = useRef<string | null>(null);

  async function handleBarcode({ data }: { data: string }) {
    // Debounce: ignore duplicate scans within the same session
    if (isLookingUp || data === lastScanned.current) return;
    lastScanned.current = data;
    setIsScanning(true);
    setIsLookingUp(true);
    try {
      const product = await getByBarcode(data);
      if (product) {
        router.push(`/product/${product.id}`);
      } else {
        Alert.alert('Product Not Found', `No product found for barcode: ${data}`, [
          {
            text: 'OK',
            onPress: () => {
              lastScanned.current = null;
              setIsScanning(false);
            },
          },
        ]);
      }
    } finally {
      setIsLookingUp(false);
    }
  }

  async function handleManualLookup() {
    const barcode = manualBarcode.trim();
    if (!barcode) return;
    setIsLookingUp(true);
    try {
      const product = await getByBarcode(barcode);
      if (product) {
        setManualBarcode('');
        router.push(`/product/${product.id}`);
      } else {
        Alert.alert('Product Not Found', `No product found for barcode: ${barcode}`);
      }
    } finally {
      setIsLookingUp(false);
    }
  }

  // Permission not yet determined
  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Permission denied — show explanation + manual fallback (AC-0043)
  if (!permission.granted) {
    return (
      <ScrollView contentContainerStyle={styles.permissionContainer}>
        <MaterialIcons name="camera-alt" size={64} color={colors.textLight} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionBody}>
          To scan product barcodes, this app needs access to your camera. Your
          camera is only used while you are on this screen.
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Allow Camera Access</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setShowManual(true)}
        >
          <Text style={styles.secondaryButtonText}>Enter Barcode Manually</Text>
        </TouchableOpacity>
        {showManual && (
          <View style={styles.manualSection}>
            <TextInput
              style={styles.input}
              placeholder="Enter barcode number…"
              value={manualBarcode}
              onChangeText={setManualBarcode}
              keyboardType="number-pad"
              returnKeyType="search"
              onSubmitEditing={handleManualLookup}
            />
            <TouchableOpacity
              style={[styles.primaryButton, isLookingUp && styles.buttonDisabled]}
              onPress={handleManualLookup}
              disabled={isLookingUp}
            >
              {isLookingUp ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.primaryButtonText}>Look Up</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  }

  // Camera available — show scanner
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Camera viewfinder */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={handleBarcode}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'qr'],
          }}
        />
        {/* Barcode viewfinder overlay */}
        <View style={styles.overlayWrapper}>
          <BarcodeOverlay isScanning={isScanning} />
        </View>
        {isLookingUp && (
          <View style={styles.lookupOverlay}>
            <ActivityIndicator size="large" color={colors.white} />
            <Text style={styles.lookupText}>Looking up product…</Text>
          </View>
        )}
      </View>

      {/* Manual barcode fallback for simulator (AC-0043) */}
      <View style={styles.manualContainer}>
        <Text style={styles.manualLabel}>Or enter a barcode manually:</Text>
        <View style={styles.manualRow}>
          <TextInput
            style={styles.manualInput}
            placeholder="Barcode number…"
            value={manualBarcode}
            onChangeText={setManualBarcode}
            keyboardType="number-pad"
            returnKeyType="search"
            onSubmitEditing={handleManualLookup}
          />
          <TouchableOpacity
            style={[styles.lookupButton, isLookingUp && styles.buttonDisabled]}
            onPress={handleManualLookup}
            disabled={isLookingUp}
          >
            {isLookingUp ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <MaterialIcons name="search" size={22} color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  permissionContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  permissionBody: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    width: '100%',
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: spacing.borderRadius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    width: '100%',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  manualSection: {
    width: '100%',
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 16,
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  overlayWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lookupOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lookupText: {
    color: colors.white,
    fontSize: 16,
    marginTop: spacing.md,
  },
  manualContainer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  manualLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  manualRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manualInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.dark,
    marginRight: spacing.sm,
    minHeight: 44,
  },
  lookupButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
