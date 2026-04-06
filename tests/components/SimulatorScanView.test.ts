// tests/components/SimulatorScanView.test.ts

// extractBarcodeFromMeta is a pure function exported from SimulatorScanView.
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
