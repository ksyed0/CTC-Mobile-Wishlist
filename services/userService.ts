import { User } from '../types/user';
import { StorageKeys, getItem, setItem, removeItem } from '../utils/storage';
import usersData from '../data/users.json';

const mockUsers: User[] = usersData as User[];

const GUEST_USER: User = {
  id: 'guest',
  name: 'Guest',
  phone: '',
  avatar: 'placeholder',
};

export const userService = {
  /**
   * Return the currently logged-in user, or null if nobody is logged in.
   * Returns the synthetic GUEST_USER when the stored id is 'guest'.
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userId = await getItem<string>(StorageKeys.CURRENT_USER);
      if (!userId) return null;
      if (userId === 'guest') return GUEST_USER;
      return mockUsers.find((u) => u.id === userId) ?? null;
    } catch (error) {
      console.error('[userService] getCurrentUser error:', error);
      return null;
    }
  },

  /**
   * Return the full mock user catalogue (Alice, Bob, Carol).
   */
  async getMockUsers(): Promise<User[]> {
    try {
      return mockUsers;
    } catch (error) {
      console.error('[userService] getMockUsers error:', error);
      return [];
    }
  },

  /**
   * Persist a user selection and return the matching User object.
   * Passing 'guest' always succeeds; any other unknown id returns null
   * without writing to storage.
   */
  async setCurrentUser(userId: string): Promise<User | null> {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('[userService] setCurrentUser: userId must be a non-empty string');
    }
    try {
      if (userId === 'guest') {
        await setItem(StorageKeys.CURRENT_USER, 'guest');
        return GUEST_USER;
      }
      const user = mockUsers.find((u) => u.id === userId);
      if (!user) return null;
      await setItem(StorageKeys.CURRENT_USER, userId);
      return user;
    } catch (error) {
      console.error('[userService] setCurrentUser error:', error);
      throw new Error('[userService] setCurrentUser: failed to persist user selection');
    }
  },

  /**
   * Clear the current user from storage (log out).
   */
  async logout(): Promise<void> {
    try {
      await removeItem(StorageKeys.CURRENT_USER);
    } catch (error) {
      console.error('[userService] logout error:', error);
      throw new Error('[userService] logout: failed to clear user from storage');
    }
  },

  /**
   * Return true when no user is logged in or the user is a guest.
   */
  async isGuest(): Promise<boolean> {
    try {
      const userId = await getItem<string>(StorageKeys.CURRENT_USER);
      return userId === 'guest' || userId === null;
    } catch (error) {
      console.error('[userService] isGuest error:', error);
      // Default to treating unknown state as guest for safety
      return true;
    }
  },
};
