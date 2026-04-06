import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  CURRENT_USER: 'currentUser',
  WISHLISTS: 'wishlists',
  RECENT_SCANS: 'recentScans',
  SEEN_SHARED_IDS_PREFIX: '@ctc_seen_shared_',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`[Storage] Error reading key "${key}":`, error);
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[Storage] Error writing key "${key}":`, error);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`[Storage] Error removing key "${key}":`, error);
  }
}

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('[Storage] Error clearing storage:', error);
  }
}
