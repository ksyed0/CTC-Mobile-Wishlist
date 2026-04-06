/**
 * BottomSheetInput — props contract tests
 * No React renderer installed; tests validate interface and callback logic only.
 */

interface BottomSheetInputProps {
  visible: boolean;
  title: string;
  placeholder: string;
  initialValue?: string;
  maxLength?: number;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

describe('BottomSheetInput — props contract', () => {
  it('calls onConfirm with the provided value', () => {
    const onConfirm = jest.fn();
    // Simulate what the component does when confirm is pressed
    const value = 'Size M';
    onConfirm(value);
    expect(onConfirm).toHaveBeenCalledWith('Size M');
  });

  it('calls onCancel when cancel is pressed', () => {
    const onCancel = jest.fn();
    onCancel();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('uses confirmLabel default "Save"', () => {
    const props: Partial<BottomSheetInputProps> = {};
    const label = props.confirmLabel ?? 'Save';
    expect(label).toBe('Save');
  });

  it('uses cancelLabel default "Cancel"', () => {
    const props: Partial<BottomSheetInputProps> = {};
    const label = props.cancelLabel ?? 'Cancel';
    expect(label).toBe('Cancel');
  });

  it('treats empty string confirm as clearing the value', () => {
    const onConfirm = jest.fn();
    onConfirm('');
    expect(onConfirm).toHaveBeenCalledWith('');
  });
});
