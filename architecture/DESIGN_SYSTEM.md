# Design System — CTC Mobile Wishlist

## Brand Identity

This POC follows Canadian Tire's brand guidelines adapted for mobile. The design prioritizes clarity, speed, and a native feel on both iOS and Android.

---

## 1. Colour Palette

### Primary

| Name            | Hex       | RGB           | Usage                                       |
| --------------- | --------- | ------------- | ------------------------------------------- |
| **CT Red**      | `#D52B1E` | 213, 43, 30   | Primary CTA, brand headers, active tab icon |
| **CT Dark Red** | `#B01E14` | 176, 30, 20   | Pressed state for red buttons               |
| **White**       | `#FFFFFF` | 255, 255, 255 | Backgrounds, button text on red             |

### Neutral

| Name            | Hex       | RGB           | Usage                                |
| --------------- | --------- | ------------- | ------------------------------------ |
| **Charcoal**    | `#333333` | 51, 51, 51    | Primary text, headings               |
| **Dark Grey**   | `#666666` | 102, 102, 102 | Secondary text, descriptions         |
| **Medium Grey** | `#999999` | 153, 153, 153 | Placeholder text, disabled states    |
| **Light Grey**  | `#E5E5E5` | 229, 229, 229 | Borders, dividers                    |
| **Off White**   | `#F5F5F5` | 245, 245, 245 | Screen backgrounds, card backgrounds |

### Semantic

| Name        | Hex       | Usage                           |
| ----------- | --------- | ------------------------------- |
| **Success** | `#2E7D32` | In stock, claimed confirmation  |
| **Warning** | `#F57C00` | Low stock, price alerts         |
| **Error**   | `#C62828` | Out of stock, validation errors |
| **Info**    | `#1565C0` | Informational badges, links     |

---

## 2. Typography

System fonts for native feel. No custom font loading required.

| Style           | iOS Font       | Android Font | Size | Weight         | Line Height | Usage                      |
| --------------- | -------------- | ------------ | ---- | -------------- | ----------- | -------------------------- |
| **H1**          | SF Pro Display | Roboto       | 28px | Bold (700)     | 34px        | Screen titles              |
| **H2**          | SF Pro Display | Roboto       | 22px | SemiBold (600) | 28px        | Section headers            |
| **H3**          | SF Pro Text    | Roboto       | 18px | SemiBold (600) | 24px        | Card titles, product names |
| **Body**        | SF Pro Text    | Roboto       | 16px | Regular (400)  | 22px        | Descriptions, body text    |
| **Body Small**  | SF Pro Text    | Roboto       | 14px | Regular (400)  | 20px        | Metadata, timestamps       |
| **Caption**     | SF Pro Text    | Roboto       | 12px | Regular (400)  | 16px        | Labels, badges             |
| **Price**       | SF Pro Display | Roboto       | 20px | Bold (700)     | 26px        | Product prices             |
| **Price Small** | SF Pro Text    | Roboto       | 16px | SemiBold (600) | 22px        | List item prices           |

---

## 3. Spacing Scale

Based on a 4px grid system.

| Token  | Value | Usage                                  |
| ------ | ----- | -------------------------------------- |
| `xs`   | 4px   | Inline icon padding, tight spacing     |
| `sm`   | 8px   | Between related elements, chip padding |
| `md`   | 12px  | Card internal padding                  |
| `base` | 16px  | Standard screen padding, between cards |
| `lg`   | 24px  | Section separation                     |
| `xl`   | 32px  | Major section breaks                   |
| `xxl`  | 48px  | Screen top/bottom padding              |

---

## 4. Component Specifications

### 4.1 Product Card

```
┌─────────────────────────┐
│  ┌───────────────────┐  │
│  │                   │  │
│  │   Product Image   │  │  Image: 100% width, 1:1 ratio
│  │    (300x300)      │  │  borderRadius: 8px (top only)
│  │                   │  │
│  └───────────────────┘  │
│  Product Name            │  H3, Charcoal, max 2 lines
│  Category                │  Caption, Dark Grey
│  $XX.XX                  │  Price, CT Red
│  ┌─────────────────────┐│
│  │  + Add to Wishlist  ││  TouchableOpacity, CT Red text
│  └─────────────────────┘│
└─────────────────────────┘

 Card: White bg, borderRadius 8px
 Shadow: { elevation: 2, shadowOffset: {0, 1}, shadowRadius: 3, opacity: 0.1 }
 Margin: base (16px) between cards
 Grid: 2 columns on phone, base gap
```

### 4.2 Wishlist Card

```
┌─────────────────────────────────────┐
│  🎁  Wishlist Name           3 items│  Icon + H3 + Caption right-aligned
│  Created Mar 15 · Shared with 2    │  Body Small, Dark Grey
│  $245.00 total                      │  Price Small, Charcoal
│                                  >  │  Chevron right
└─────────────────────────────────────┘

 Card: White bg, borderRadius 8px, padding md (12px)
 Height: auto (content-driven)
```

### 4.3 Wishlist Item Row

```
┌──────────────────────────────────────────────┐
│ ┌────┐                                       │
│ │IMG │  Product Name                   $XX.XX│  Image: 60x60, borderRadius 4px
│ │60px│  Added Dec 5                          │  Swipe left to reveal delete
│ └────┘                                       │
└──────────────────────────────────────────────┘
```

### 4.4 Shared Wishlist Item (Recipient View)

```
┌──────────────────────────────────────────────┐
│ ┌────┐                                       │
│ │IMG │  Product Name                   $XX.XX│
│ │60px│  ┌─────────────────┐                  │
│ └────┘  │ 🎁 I'll Get This│  ← CTA button   │  CT Red bg, White text
│         └─────────────────┘                  │  borderRadius: 12px
└──────────────────────────────────────────────┘

Claimed state:
┌──────────────────────────────────────────────┐
│ ┌────┐                                       │
│ │IMG │  Product Name                   $XX.XX│
│ │60px│  ✅ Claimed by Sarah                  │  Success green, Body Small
│ └────┘                                       │  Button hidden
└──────────────────────────────────────────────┘
```

### 4.5 Category Chip

```
 ┌──────────────┐    ┌──────────────┐
 │  All Items   │    │  Automotive  │
 └──────────────┘    └──────────────┘

 Active: CT Red bg, White text
 Inactive: Off White bg, Charcoal text, Light Grey border
 borderRadius: 20px (pill shape)
 paddingH: base (16px), paddingV: sm (8px)
 Font: Body Small, SemiBold
```

### 4.6 Primary Button

```
 ┌─────────────────────────────┐
 │       Button Label          │
 └─────────────────────────────┘

 Background: CT Red (#D52B1E)
 Text: White, Body, SemiBold
 borderRadius: 12px
 height: 48px
 paddingH: lg (24px)
 Pressed: CT Dark Red (#B01E14)
 Disabled: Medium Grey bg, White text
 Full width on mobile screens
```

### 4.7 Empty State

```
         ┌──────────┐
         │   Icon   │   64x64, Medium Grey
         └──────────┘
       No items yet            H2, Charcoal, centered
   Browse the catalog or       Body, Dark Grey, centered
   scan a barcode to start

   ┌─────────────────────┐
   │   Browse Catalog     │    Primary Button
   └─────────────────────┘
```

### 4.8 Barcode Scanner Overlay

```
┌─────────────────────────────────┐
│                                 │
│          Camera Feed            │
│                                 │
│     ┌───────────────────┐       │
│     │                   │       │  Scanner frame: White border, 2px
│     │    Scan Area      │       │  250x250px centered
│     │                   │       │  Corners highlighted with CT Red
│     └───────────────────┘       │
│                                 │
│   Point camera at barcode       │  Body, White, centered
│                                 │
│     ┌───────────────────┐       │
│     │  Enter Manually   │       │  Text button, White
│     └───────────────────┘       │
└─────────────────────────────────┘
```

---

## 5. Tab Bar

```
┌──────────┬──────────┬──────────┬──────────┐
│  🏠      │  📦      │  📷      │  💝      │
│  Home    │ Catalog  │  Scan    │ Wishlists│
└──────────┴──────────┴──────────┴──────────┘

Active icon: CT Red
Inactive icon: Medium Grey
Label: Caption (12px)
Background: White
Top border: Light Grey, 1px
Height: 60px (includes safe area on iPhone)
Icons: MaterialCommunityIcons from @expo/vector-icons
  - Home: "home"
  - Catalog: "shopping"
  - Scan: "barcode-scan"
  - Wishlists: "heart-multiple"
```

---

## 6. Screen Layouts

### Home Screen

- Header: "Canadian Tire" logo + user avatar (tap for profile/login)
- Featured section: Horizontal scroll of promoted products
- "My Wishlists" quick access: Top 3 wishlists as horizontal cards
- "Recently Scanned" section: Last 5 barcode scans

### Catalog Screen

- Search bar (sticky top)
- Category chips (horizontal scroll)
- Product grid (2-column, infinite scroll)

### Scan Screen

- Full-screen camera with overlay
- Bottom sheet slides up on successful scan showing product preview
- "Add to Wishlist" action directly from bottom sheet

### Wishlists Screen

- Segmented control: "My Wishlists" | "Shared With Me"
- List of wishlist cards
- FAB or header button: "+ New Wishlist"

---

## 7. Animations & Transitions

| Interaction         | Animation                                       |
| ------------------- | ----------------------------------------------- |
| Screen transitions  | Native stack push/pop (expo-router default)     |
| Tab switching       | Crossfade (instant, no slide)                   |
| Add to wishlist     | Heart icon scale pulse (1.0 → 1.3 → 1.0, 300ms) |
| Remove item         | Swipe left reveal + slide out (200ms)           |
| Barcode detected    | Scanner frame flash green (150ms)               |
| Bottom sheet        | Spring animation from bottom (expo default)     |
| Toast notifications | Slide down from top, auto-dismiss 3s            |

---

## 8. Accessibility

| Requirement     | Implementation                                                         |
| --------------- | ---------------------------------------------------------------------- |
| Touch targets   | Minimum 44x44px on all interactive elements                            |
| Colour contrast | All text meets WCAG 2.1 AA (4.5:1 normal, 3:1 large)                   |
| Screen reader   | All images have `accessibilityLabel`, buttons have `accessibilityRole` |
| Dynamic type    | Respect system font size preferences                                   |
| Reduced motion  | Check `AccessibilityInfo.isReduceMotionEnabled` and skip animations    |

---

## 9. Device Compatibility

**Orientation:** Portrait only for POC.

### Target Devices

| Device                 | Width (pt) | Height (pt) | Safe Area Top       | Safe Area Bottom    |
| ---------------------- | ---------- | ----------- | ------------------- | ------------------- |
| iPhone 17 Pro Max      | 430        | 932         | 59 (Dynamic Island) | 34 (home indicator) |
| iPhone 16 Pro          | 393        | 852         | 59                  | 34                  |
| Google Pixel 10 Pro XL | ~411       | ~915        | ~48 (status bar)    | ~48 (gesture nav)   |
| Google Pixel 9         | ~393       | ~873        | ~48                 | ~48                 |

### Layout Guarantees

- All components use flex layouts with percentage widths — no fixed-width elements exceed 375pt
- `SafeAreaProvider` wraps the entire app, handling notch, Dynamic Island, and gesture bar
- 16px horizontal padding on all screens ensures content doesn't touch edges
- Tab bar: 60px height including safe area inset
- Product cards and list items use `100% width` with consistent padding
- System fonts (SF Pro on iOS, Roboto on Android) respect dynamic type scaling
