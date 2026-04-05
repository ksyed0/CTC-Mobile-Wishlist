import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface BarcodeOverlayProps {
  isScanning?: boolean;
}

const CORNER_SIZE = 28;
const CORNER_THICKNESS = 3;
const FRAME_WIDTH = 250;
const FRAME_HEIGHT = 250;

export const BarcodeOverlay = memo(function BarcodeOverlay({ isScanning = false }: BarcodeOverlayProps) {
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.frame}>
        {/* Corner markers */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />

        {/* Scan line animation hint */}
        {isScanning ? <View style={styles.scanLine} /> : null}
      </View>

      <Text style={styles.hint}>{isScanning ? 'Scanning…' : 'Point camera at barcode'}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    position: 'relative',
    marginBottom: spacing.md,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: colors.primary,
  },
  topLeft: {
    top: -1,
    left: -1,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
  },
  topRight: {
    top: -1,
    right: -1,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
  },
  bottomLeft: {
    bottom: -1,
    left: -1,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
  },
  bottomRight: {
    bottom: -1,
    right: -1,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
    opacity: 0.8,
  },
  hint: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
  },
});
