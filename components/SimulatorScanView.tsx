// components/SimulatorScanView.tsx
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Props {
  onBarcodeDetected: (barcode: string) => void;
}

/**
 * Reads the barcode string from a .card-meta element's textContent.
 * Format: "Category | prod-XXX | 062073000011"
 * Returns null if the format is unexpected.
 */
export function extractBarcodeFromMeta(metaText: string): string | null {
  const parts = metaText.split('|');
  if (parts.length < 3) return null;
  const barcode = parts[parts.length - 1].trim();
  return barcode.length > 0 ? barcode : null;
}

// Injected into the HTML body. Attaches click listeners to every .card element.
// Uses window.onload so it runs after JsBarcode has already rendered barcodes.
const INJECT_SCRIPT = `
<script>
(function() {
  var prev = window.onload;
  window.onload = function(e) {
    if (prev) prev(e);
    document.querySelectorAll('.card').forEach(function(card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function() {
        var meta = card.querySelector('.card-meta');
        if (!meta) return;
        var parts = meta.textContent.split('|');
        if (parts.length < 3) return;
        var barcode = parts[parts.length - 1].trim();
        if (barcode) window.ReactNativeWebView.postMessage(barcode);
      });
    });
  };
})();
</script>
`;

export default function SimulatorScanView({ onBarcodeDetected }: Props) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      const [asset] = await Asset.loadAsync(require('../data/product-catalog-print.html'));
      if (!asset.localUri) return;
      const raw = await FileSystem.readAsStringAsync(asset.localUri);
      // Inject tap handler before </body>
      setHtmlContent(raw.replace('</body>', `${INJECT_SCRIPT}</body>`));
    }
    loadCatalog();
  }, []);

  function handleMessage(event: WebViewMessageEvent) {
    const barcode = event.nativeEvent.data.trim();
    if (barcode) onBarcodeDetected(barcode);
  }

  if (!htmlContent) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading catalog…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.banner} accessibilityRole="text">
        <Text style={styles.bannerText}>SIMULATOR MODE — Tap any product card to scan</Text>
      </View>
      <WebView
        style={styles.webview}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        javaScriptEnabled
        scrollEnabled
        accessibilityLabel="Product catalog for simulator scanning"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  banner: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  bannerText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  webview: {
    flex: 1,
  },
});
