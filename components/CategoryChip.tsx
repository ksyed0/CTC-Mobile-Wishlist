import { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Category } from '../types/product';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface CategoryChipProps {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}

export const CategoryChip = memo(function CategoryChip({ category, isSelected, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, isSelected ? styles.chipSelected : styles.chipInactive]}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={category.name}
    >
      <Text style={[styles.label, isSelected ? styles.labelSelected : styles.labelInactive]}>{category.name}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.full,
    marginRight: spacing.sm,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipInactive: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
  labelSelected: {
    color: colors.white,
  },
  labelInactive: {
    color: colors.dark,
  },
});
