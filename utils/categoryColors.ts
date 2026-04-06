import { colors } from '../theme/colors';

export const CATEGORY_COLORS: Record<string, string> = {
  Tools: colors.primary,
  Automotive: '#1565C0',
  Outdoor: '#2E7D32',
  Sports: '#E65100',
  Home: '#6A1B9A',
};

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? colors.primary;
}

export function getCategoryInitial(category: string): string {
  return category.charAt(0).toUpperCase();
}
