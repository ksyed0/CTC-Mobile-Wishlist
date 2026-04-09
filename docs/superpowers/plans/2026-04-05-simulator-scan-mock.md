# Simulator Scan Mock Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the camera view on iOS/Android simulators with a scrollable, tappable HTML product catalog that fires the same scan flow as a real barcode scan.

**Architecture:** `Device.isDevice` (expo-device) gates which view renders in `scan.tsx`. On simulators it renders `SimulatorScanView`, a WebView loading `data/product-catalog-print.html` with an injected click handler that posts the barcode string back to React Native via `onMessage`. Physical device path is completely unchanged.

**Tech Stack:** expo-device, react-native-webview, expo-asset, expo-file-system, metro.config.js (HTML asset extension)

---

## File Map

| File                                         | Action | Responsibility                                                                               |
| -------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- |
| `metro.config.js`                            | Create | Add `html` to Metro `assetExts` so `require()` can reference the HTML file                   |
| `components/SimulatorScanView.tsx`           | Create | WebView + loading state + injected tap handler; exports `extractBarcodeFromMeta` for testing |
| `app/(tabs)/scan.tsx`                        | Modify | Add `isSimulator` branch to swap `CameraView` for `SimulatorScanView`                        |
| `tests/components/SimulatorScanView.test.ts` | Create | Unit tests for `extractBarcodeFromMeta` pure function                                        |
| `docs/RELEASE_PLAN.md`                       | Modify | Add US-003-002, TASK-003-002-001, TASK-003-002-002 under Epic 3                              |

---

### Task 1: Install dependencies and configure Metro

**Files:**

- Create: `metro.config.js`
- Modify: `package.json` (via npx expo install)

- [ ] **Step 1: Install the four new packages using Expo's version resolver**

```bash
npx expo install expo-device react-native-webview expo-asset expo-file-system
```

Expected: packages added to `package.json` with SDK-compatible versions, `node_modules` updated.

- [ ] **Step 2: Create `metro.config.js` to bundle `.html` files as assets**

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow Metro to bundle .html files so we can require() the catalog
config.resolver.assetExts.push('html');

module.exports = config;
```

- [ ] **Step 3: Verify Metro picks up the config**

```bash
npx expo start --clear
```

Expected: Metro starts without errors. Press `Ctrl+C` once confirmed.

- [ ] **Step 4: Commit**

```bash
git add metro.config.js package.json package-lock.json
git commit -m "feat(deps): add expo-device, react-native-webview, expo-asset, expo-file-system; configure Metro HTML assets"
```

---

### Task 2: Write tests for barcode extraction logic

**Files:**

- Create: `tests/components/SimulatorScanView.test.ts`

The barcode extraction logic reads `.card-meta` `textContent` which looks like:
`"Tools | prod-001 | 062073000011"` (spaces around `|` due to `<span class="sep">` elements).

- [ ] **Step 1: Write the failing tests**

```ts
// tests/components/SimulatorScanView.test.ts

// extractBarcodeFromMeta is a pure function exported from SimulatorScanView.
// Import path will resolve once the component file exists; jest runs after Task 3.
import { extractBarcodeFromMeta } from '../../components/SimulatorScanView';

describe('extractBarcodeFromMeta', () => {
  it('extracts barcode from well-formed meta text', () => {
    expect(extractBarcodeFromMeta('Tools | prod-001 | 062073000011')).toBe('062073000011');
  });

  it('trims whitespace from the extracted barcode', () => {
    expect(extractBarcodeFromMeta('Outdoor | prod-011 |  062073000110 ')).toBe('062073000110');
  });

  it('returns null when there are fewer than 3 pipe-separated parts', () => {
    expect(extractBarcodeFromMeta('Tools | prod-001')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(extractBarcodeFromMeta('')).toBeNull();
  });

  it('returns null when the barcode segment is blank after trimming', () => {
    expect(extractBarcodeFromMeta('Tools | prod-001 |   ')).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests — expect import failure (module doesn't exist yet)**

```bash
npm test -- --testPathPattern="SimulatorScanView" --watchAll=false
```

Expected: `Cannot find module '../../components/SimulatorScanView'`

---

### Task 3: Build SimulatorScanView component

**Files:**

- Create: `components/SimulatorScanView.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
      <View style={styles.banner}>
        <Text style={styles.bannerText}>SIMULATOR MODE — Tap any product card to scan</Text>
      </View>
      <WebView
        style={styles.webview}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        javaScriptEnabled
        scrollEnabled
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
    paddingVertical: spacing.xs ?? 6,
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
```

- [ ] **Step 2: Run tests — expect them to pass now**

```bash
npm test -- --testPathPattern="SimulatorScanView" --watchAll=false
```

Expected: 5 tests pass.

- [ ] **Step 3: Commit**

```bash
git add components/SimulatorScanView.tsx tests/components/SimulatorScanView.test.ts
git commit -m "feat(scan): add SimulatorScanView component with tappable catalog WebView"
```

---

### Task 4: Wire simulator detection into scan.tsx

**Files:**

- Modify: `app/(tabs)/scan.tsx`

The existing camera render block (lines 158–211) is inside the final `return` statement. We wrap the `<CameraView>` section with an `isSimulator` check. `handleBarcode` is already typed as `({ data }: { data: string }) => Promise<void>` — `SimulatorScanView` calls `onBarcodeDetected(barcode: string)` so we adapt with a thin wrapper.

- [ ] **Step 1: Add the import and isSimulator constant at the top of scan.tsx**

Add after the existing imports (after line 22):

```tsx
import * as Device from 'expo-device';
import SimulatorScanView from '../../components/SimulatorScanView';

const isSimulator = !Device.isDevice;
```

- [ ] **Step 2: Replace the camera view block in the final return**

Find this block in `scan.tsx` (lines 158–211):

```tsx
// Camera available — show scanner
return (
  <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
          accessibilityRole="button"
          accessibilityLabel="Look up barcode"
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
```

Replace it with:

```tsx
// Camera available — show scanner (or simulator catalog on non-device)
if (isSimulator) {
  return <SimulatorScanView onBarcodeDetected={(barcode) => handleBarcode({ data: barcode })} />;
}

return (
  <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
          accessibilityRole="button"
          accessibilityLabel="Look up barcode"
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
```

- [ ] **Step 3: Run the full test suite**

```bash
npm test -- --watchAll=false
```

Expected: all existing tests pass (scan.tsx has no unit tests; this is a render-path change).

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/scan.tsx
git commit -m "feat(scan): show SimulatorScanView on simulator, real camera on physical device"
```

---

### Task 5: Update RELEASE_PLAN.md

**Files:**

- Modify: `docs/RELEASE_PLAN.md`

- [ ] **Step 1: Add US-003-002 and its tasks under Epic 3, after TASK-003-001-002**

Find this line in `docs/RELEASE_PLAN.md`:

```
---

### Epic 4: Wishlist Management
```

Insert before it:

````
```
US-003-002 (EPIC-003): As a demo presenter, I want the scan screen to show a tappable product catalog when running on a simulator, so that I can demonstrate the scan flow without a physical device or real barcode.
Priority: High
Estimate: M
Status: Done
Branch: feature/US-003-002-simulator-scan-mock
Dependencies: US-003-001
Acceptance Criteria:
  - [ ] AC-003-002-001: On a physical device, scan screen behaves exactly as before (camera + live barcode scanning)
  - [ ] AC-003-002-002: On a simulator (Device.isDevice === false), the camera view is replaced with a scrollable WebView rendering data/product-catalog-print.html
  - [ ] AC-003-002-003: Each product card in the WebView is tappable; tapping fires handleBarcode() with the card's barcode string
  - [ ] AC-003-002-004: A simulator-mode banner is shown at the top of the scan screen
```

```
TASK-003-002-001 (US-003-002): Build SimulatorScanView component — WebView loading product-catalog-print.html with injected tap-to-scan click handlers
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-003-002-simulator-scan-mock
Notes: extractBarcodeFromMeta reads barcode from .card-meta text; expo-asset + expo-file-system load HTML; script injected before </body>
```

```
TASK-003-002-002 (US-003-002): Wire Device.isDevice simulator detection into scan.tsx
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-003-002-simulator-scan-mock
Notes: isSimulator = !Device.isDevice; renders SimulatorScanView in place of CameraView on simulators; physical device path unchanged
```

---
````

- [ ] **Step 2: Commit**

```bash
git add docs/RELEASE_PLAN.md
git commit -m "docs: add US-003-002 simulator scan mock to release plan"
```

---

### Task 6: Manual verification

- [ ] **Step 1: Start the app on iOS simulator**

```bash
npx expo start --ios --clear
```

- [ ] **Step 2: Navigate to the Scan tab**

Expected: red banner at top reads "SIMULATOR MODE — Tap any product card to scan". Product catalog renders below with product images and EAN barcodes.

- [ ] **Step 3: Scroll down to find a product (e.g. Dome Tent or Jump Starter). Tap its card.**

Expected: app navigates to that product's detail screen — same as if the barcode had been physically scanned.

- [ ] **Step 4: Verify the "Product not found" path is unreachable from the catalog**

All 20+ products in `product-catalog-print.html` have matching entries in `data/products.json`, so every tap should resolve. Confirm by tapping several different product cards.

- [ ] **Step 5 (optional): Confirm physical device path is untouched**

On a real device (if available), open the Scan tab — camera and `BarcodeOverlay` should render as normal with no simulator banner.
