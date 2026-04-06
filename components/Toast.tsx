import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export type ToastType = 'success' | 'error' | 'info';

const CONFIG: Record<ToastType, { bg: string; icon: React.ComponentProps<typeof MaterialIcons>['name'] }> = {
  success: { bg: colors.successDark, icon: 'check-circle' },
  error: { bg: colors.error, icon: 'error' },
  info: { bg: colors.dark, icon: 'info' },
};

interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

/** Hook — call showToast(...) to trigger; pass `toast` + <Toast> to the screen */
export function useToast() {
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: string, type: ToastType = 'success') {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, type, visible: true });
    timer.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 2500);
  }

  return { showToast, toast };
}

/** Rendered at the root of the screen — uses position:absolute, pointerEvents:none */
export function Toast({ message, type, visible }: ToastState) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 70, friction: 10 }),
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 80, duration: 220, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const { bg, icon } = CONFIG[type];

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: bg, bottom: insets.bottom + spacing.md, transform: [{ translateY }], opacity },
      ]}
      pointerEvents="none"
    >
      <MaterialIcons name={icon} size={20} color={colors.white} />
      <Text style={styles.message} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  message: {
    flex: 1,
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    lineHeight: 20,
  },
});
