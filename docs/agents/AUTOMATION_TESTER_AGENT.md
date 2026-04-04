# Automation Tester Agent — Session Instructions

> **Read this file in full before starting any work.**

## Role

You are the **Automation Tester Agent** for the CTC Mobile Wishlist POC. You own Jest test suites, component tests, and coverage reporting.

## BLAST Phase

**Trigger** — You operate in Phase 5 of the BLAST framework.

## Mandatory Startup

1. Read `AGENTS.md` (full file — especially §8 unit testing standards)
2. Read `docs/TEST_CASES.md` (test scenarios to automate)
3. Read `architecture/DATA_FLOW.md` (service interfaces to test)
4. Read source code in `src/services/` and `src/components/` (what you're testing)

## Responsibilities

1. **Service unit tests** — Full coverage of ProductService, WishlistService, UserService
2. **Component tests** — Render tests for all UI components
3. **Screen tests** — Basic render and interaction tests for each screen
4. **Coverage reporting** — Generate coverage summary for PlanVisualizer

## Test File Structure

```
__tests__/
  services/
    productService.test.ts      # getProducts, getById, getByBarcode, search
    wishlistService.test.ts     # CRUD, addItem, removeItem, share, claim
    userService.test.ts         # getCurrentUser, setCurrentUser, logout
  components/
    ProductCard.test.tsx        # Renders product data, handles press
    WishlistCard.test.tsx       # Renders wishlist summary, handles press
    WishlistItemRow.test.tsx    # Renders item, claim/remove buttons
    CategoryChip.test.tsx       # Renders label, selected/unselected states
  screens/
    HomeScreen.test.tsx         # Renders welcome, recent wishlists
    CatalogScreen.test.tsx      # Renders product grid, filters
    WishlistsScreen.test.tsx    # Renders wishlist list, create button
```

## Coverage Targets

| Layer | Target | Rationale |
|-------|--------|-----------|
| Services (`src/services/`) | ≥ 80% | Business logic — highest priority |
| Components (`src/components/`) | ≥ 50% | UI rendering — snapshot + interaction |
| Screens (`src/screens/`) | ≥ 30% | Integration — basic render tests |
| **Overall** | **≥ 60%** | Hackathon POC target |

## Test Patterns

### Service Tests
```typescript
import { productService } from '../../src/services/productService';

describe('ProductService', () => {
  it('should return all products', async () => {
    const products = await productService.getProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('barcode');
  });

  it('should find product by barcode', async () => {
    const product = await productService.getByBarcode('1234567890123');
    expect(product).not.toBeNull();
    expect(product?.barcode).toBe('1234567890123');
  });

  it('should search case-insensitively', async () => {
    const results = await productService.search('drill');
    expect(results.length).toBeGreaterThan(0);
  });
});
```

### Component Tests
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import ProductCard from '../../src/components/ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: 'prod-001', name: 'Test Drill', price: 79.99,
    image: '', category: 'Tools', inStock: true,
    barcode: '1234567890123', description: 'A test drill',
  };

  it('renders product name and price', () => {
    const { getByText } = render(<ProductCard product={mockProduct} onPress={() => {}} />);
    expect(getByText('Test Drill')).toBeTruthy();
    expect(getByText('$79.99')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(<ProductCard product={mockProduct} onPress={onPress} />);
    fireEvent.press(getByText('Test Drill'));
    expect(onPress).toHaveBeenCalledWith(mockProduct);
  });
});
```

## PlanVisualizer Integration

- **Coverage output**: Generate `docs/coverage/coverage-summary.json` (PlanVisualizer reads this path from `plan-visualizer.config.json`)
- **Jest config**: Add `--coverage --coverageReporters=json-summary` to test script
- **Commit format**: `[test] US-XXXX | TASK-XXXX: Add unit tests for [module]`
- **Progress**: Update `progress.md` with coverage percentages after each test run
- **Branch**: Work on the same feature branch as the code being tested

## Jest Configuration

Ensure `package.json` includes:
```json
{
  "scripts": {
    "test": "jest --coverage --coverageReporters=json-summary --coverageReporters=text",
    "test:services": "jest __tests__/services/ --coverage",
    "test:components": "jest __tests__/components/ --coverage"
  },
  "jest": {
    "preset": "jest-expo",
    "coverageDirectory": "docs/coverage",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*)"
    ]
  }
}
```

## AsyncStorage Mocking

```typescript
// jest.setup.js
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
```

## Rules

- All tests must be deterministic — no reliance on external state or timing
- Mock AsyncStorage for all service tests — never touch real storage
- Every test file must clean up after itself (`beforeEach`/`afterEach`)
- Tests must pass before committing — failing tests are build blockers (AGENTS.md §8)
- Coverage report must be generated to `docs/coverage/coverage-summary.json` for PlanVisualizer
- Follow AGENTS.md commit standards for all test commits
