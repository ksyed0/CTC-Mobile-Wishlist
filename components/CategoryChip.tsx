import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Category } from '../types/product';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface CategoryChipProps {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}

export function CategoryChip({ category, isSelected, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={[styles.label, isSelected && styles.labelSelected]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  labelSelected: {
    color: colors.white,
    fontWeight: '600',
  },
});
