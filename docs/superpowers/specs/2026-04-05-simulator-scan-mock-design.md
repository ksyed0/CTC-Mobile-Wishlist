# Design Spec: Simulator Scan Mock (US-0015)

**Date:** 2026-04-05  
**Status:** Approved  
**Branch:** feature/US-0015-simulator-scan-mock

---

## Context

The app's barcode scan screen uses `expo-camera` for live camera scanning. Running on a physical device is not possible during the demo window. This feature replaces the camera view with an interactive HTML product catalog when running on a simulator, so the scan flow can be fully demonstrated without hardware.

Physical device behaviour is unchanged — the camera + live scanning runs exactly as before.

---

## Approach

### Simulator Detection

Use `expo-device`'s `Device.isDevice`:

- `true` → physical device → existing camera path, no change
- `false` → simulator/emulator → show `SimulatorScanView`

`__DEV__` is intentionally not used — it is `true` on real devices running debug builds, which would break the real scanning flow during developer testing on hardware.

### SimulatorScanView Component

**File:** `components/SimulatorScanView.tsx`  
**Props:** `onBarcodeDetected: (barcode: string) => void`

Renders a full-screen `WebView` (from `react-native-webview`) loading `data/product-catalog-print.html`. The HTML is read as a string at runtime using `expo-file-system` + `expo-asset`, then modified by injecting a tap-handler script before `</body>`.

**Injected JS** adds a `click` listener to each `.card` element. On tap:

1. Reads the barcode from `.card-meta` (format: `Category | prod-XXX | 062073000011`)
2. Calls `window.ReactNativeWebView.postMessage(barcode)`

React Native receives the barcode string via WebView's `onMessage` and calls `onBarcodeDetected(barcode)`.

A red banner at the top of the screen reads **"SIMULATOR MODE — Tap any product card to scan"**.

### scan.tsx Changes

- Import `Device` from `expo-device`
- Derive `const isSimulator = !Device.isDevice` (module-level constant, evaluated once)
- In the camera view render path: if `isSimulator`, render `<SimulatorScanView onBarcodeDetected={handleBarcode} />` in place of `<CameraView>` + `<BarcodeOverlay>`
- `handleBarcode` is reused without modification — lookup and navigation work identically

### HTML File Loading

`data/product-catalog-print.html` stays in `data/`. Metro is configured (via `metro.config.js`) to treat `.html` as an asset extension. `expo-asset` resolves the bundled file URI; `expo-file-system` reads its string content. The injected script is appended before `</body>` in memory — the file on disk is never modified.

---

## New Dependencies

| Package                | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| `expo-device`          | `Device.isDevice` for simulator detection |
| `react-native-webview` | WebView component                         |
| `expo-asset`           | Resolve bundled HTML file URI             |
| `expo-file-system`     | Read HTML file content as string          |

---

## Files Changed

| File                               | Change                              |
| ---------------------------------- | ----------------------------------- |
| `components/SimulatorScanView.tsx` | New component                       |
| `app/(tabs)/scan.tsx`              | Add simulator branch                |
| `metro.config.js`                  | New — add `html` to `assetExts`     |
| `app.json`                         | Add `html` to `assetBundlePatterns` |
| `docs/RELEASE_PLAN.md`             | Add US-0015, TASK-0022, TASK-0023   |
| `package.json`                     | Add 4 new deps                      |

---

## Acceptance Criteria

- **AC-0045:** On a physical device, scan screen behaves exactly as before (camera + live barcode scanning)
- **AC-0046:** On a simulator, the camera view is replaced with a scrollable WebView rendering `data/product-catalog-print.html`
- **AC-0047:** Each product card in the WebView is tappable; tapping fires `handleBarcode()` with the card's barcode string
- **AC-0048:** A simulator-mode banner is shown at the top of the scan screen

---

## Out of Scope

- Offline/no-network fallback for CDN images and JsBarcode script (simulator has internet)
- Android-specific WebView file access flags (simulator-only feature; iOS simulator is the demo target)
- Any changes to the post-scan flow (product detail, add to wishlist)
