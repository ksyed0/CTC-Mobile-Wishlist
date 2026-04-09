import { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

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

export function BottomSheetInput({
  visible,
  title,
  placeholder,
  initialValue = '',
  maxLength,
  onConfirm,
  onCancel,
  confirmLabel = 'Save',
  cancelLabel = 'Cancel',
}: BottomSheetInputProps) {
  const [value, setValue] = useState(initialValue);

  // Reset value when sheet opens with a new initialValue
  useEffect(() => {
    if (visible) {
      setValue(initialValue);
    }
  }, [visible, initialValue]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onCancel}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.sheet}>
              <Text style={styles.title}>{title}</Text>
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.textLight}
                value={value}
                maxLength={maxLength}
                autoFocus
                onChangeText={setValue}
                returnKeyType="done"
                onSubmitEditing={() => onConfirm(value)}
                accessibilityLabel={title}
              />
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={[styles.confirmButton, value.trim() === '' && styles.confirmButtonDisabled]}
                  onPress={() => onConfirm(value)}
                  disabled={value.trim() === ''}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={confirmLabel}
                >
                  <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onCancel}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={cancelLabel}
                >
                  <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: spacing.borderRadius.lg,
    borderTopRightRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.4,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
  },
});
