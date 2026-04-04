import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useProducts } from '../../contexts/ProductContext';
import { BarcodeOverlay } from '../../components/BarcodeOverlay';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

// expo-camera with barcode scanning is used for SDK 52+.
// We attempt a dynamic require so the app degrades gracefully
// if the package is not installed in this environment.
let CameraView: React.ComponentType<{
  style?: object;
  facing?: string;
  onBarcodeScanned?: (result: { data: string }) => void;
  barcodeScannerSettings?: object;
}> | null = null;
let useCameraPermissions: (() => [{ granted: boolean } | null, () => Promise<{ granted: boolean }>]) | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const expoCam = require('expo-camera');
  CameraView = expoCam.CameraView ?? expoCam.Camera ?? null;
  useCameraPermissions = expoCam.useCameraPermissions ?? null;
} catch {
  // expo-camera not installed — fallback to manual entry only
}

export default function ScanScreen() {
  const { getByBarcode } = useProducts();

  const [manualBarcode, setManualBarcode] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [cameraAvailable] = useState(CameraView !== null && useCameraPermissions !== null);
  const [useManual, setUseManual] = useState(!cameraAvailable);

  // Camera permissions — only used when camera is available
  const cameraPermissionsHook = useCameraPermissions?.();
  const permission = cameraPermissionsHook?.[0] ?? null;
  const requestPermission = cameraPermissionsHook?.[1] ?? null;

  const lookupBarcode = useCallback(
    async (barcode: string) => {
      if (isLookingUp) return;
      setIsLookingUp(true);
      try {
        const product = await getByBarcode(barcode);
        if (product) {
          router.push(`/product/${product.id}`);
        } else {
          Alert.alert(
            'Product Not Found',
            `No product matched barcode: ${barcode}`,
            [{ text: 'OK', onPress: () => setHasScanned(false) }]
          );
        }
      } finally {
        setIsLookingUp(false);
      }
    },
    [getByBarcode, isLookingUp]
  );

  const handleBarcodeScanned = useCallback(
    ({ data }: { data: string }) => {
      if (hasScanned || isLookingUp) return;
      setHasScanned(true);
      lookupBarcode(data);
    },
    [hasScanned, isLookingUp, lookupBarcode]
  );

  const handleManualSubmit = useCallback(() => {
    const trimmed = manualBarcode.trim();
    if (!trimmed) return;
    lookupBarcode(trimmed);
  }, [manualBarcode, lookupBarcode]);

  // Camera not available in this environment — show manual only
  if (!cameraAvailable || useManual) {
    return (
      <View style={styles.manualContainer}>
        <MaterialIcons name="qr-code-scanner" size={72} color={colors.primary} />
        <Text style={styles.manualTitle}>Barcode Scanner</Text>
        <Text style={styles.manualSubtitle}>
          {!cameraAvailable
            ? 'Camera unavailable in this environment.'
            : 'Manual entry mode.'}
        </Text>

        <View style={styles.manualInputContainer}>
          <Text style={styles.manualLabel}>Enter barcode number:</Text>
          <TextInput
            style={styles.manualInput}
            value={manualBarcode}
            onChangeText={setManualBarcode}
            placeholder="e.g. 062073000011"
            placeholderTextColor={colors.textLight}
            keyboardType="numeric"
            returnKeyType="search"
            onSubmitEditing={handleManualSubmit}
            accessibilityLabel="Barcode number input"
            autoFocus
          />
          <TouchableOpacity
            style={[styles.lookupButton, !manualBarcode.trim() && styles.lookupButtonDisabled]}
            onPress={handleManualSubmit}
            disabled={!manualBarcode.trim() || isLookingUp}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            {isLookingUp ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.lookupButtonText}>Look Up Product</Text>
            )}
          </TouchableOpacity>
        </View>

        {cameraAvailable ? (
          <TouchableOpacity
            style={styles.switchModeButton}
            onPress={() => setUseManual(false)}
            activeOpacity={0.75}
          >
            <MaterialIcons name="camera-alt" size={16} color={colors.primary} />
            <Text style={styles.switchModeText}>Use Camera</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  // Camera permission not yet determined or denied
  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="camera-alt" size={72} color={colors.textLight} />
        <Text style={styles.permissionTitle}>Camera Access Needed</Text>
        <Text style={styles.permissionSubtitle}>
          We need permission to use your camera to scan product barcodes in-store.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission ?? undefined}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.switchModeButton}
          onPress={() => setUseManual(true)}
          activeOpacity={0.75}
        >
          <MaterialIcons name="keyboard" size={16} color={colors.primary} />
          <Text style={styles.switchModeText}>Enter Manually</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Camera active — overlay is a sibling (not child) to avoid TS children error
  const CameraComponent = CameraView!;
  return (
    <View style={styles.cameraContainer}>
      <CameraComponent
        style={styles.camera}
        facing="back"
        onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'],
        }}
      />
      <View style={styles.cameraOverlay} pointerEvents="box-none">
        <Text style={styles.cameraTitle}>Scan Barcode</Text>

        <BarcodeOverlay isScanning={isLookingUp} />

        {isLookingUp ? (
          <View style={styles.scanningIndicator}>
            <ActivityIndicator size="small" color={colors.white} />
            <Text style={styles.scanningText}>Looking up product…</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.manualEntryButton}
          onPress={() => setUseManual(true)}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <MaterialIcons name="keyboard" size={18} color={colors.white} />
          <Text style={styles.manualEntryButtonText}>Enter Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Manual / fallback mode
  manualContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  manualTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.dark,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  manualSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  manualInputContainer: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: spacing.md,
  },
  manualLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  manualInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.lg,
    color: colors.dark,
    minHeight: 48,
    marginBottom: spacing.md,
  },
  lookupButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  lookupButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  lookupButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
  },
  switchModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  switchModeText: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
  // Permission screen
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  permissionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.dark,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  permissionSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    width: '100%',
  },
  permissionButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
  },
  // Camera mode
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  cameraTitle: {
    color: colors.white,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xl,
  },
  scanningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.borderRadius.full,
  },
  scanningText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
  },
  manualEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    minHeight: 44,
  },
  manualEntryButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
});
