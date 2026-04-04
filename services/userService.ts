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
  async getCurrentUser(): Promise<User | null> {
    const userId = await getItem<string>(StorageKeys.CURRENT_USER);
    if (!userId) return null;
    if (userId === 'guest') return GUEST_USER;
    return mockUsers.find((u) => u.id === userId) ?? null;
  },

  async getMockUsers(): Promise<User[]> {
    return mockUsers;
  },

  async setCurrentUser(userId: string): Promise<User | null> {
    if (userId === 'guest') {
      await setItem(StorageKeys.CURRENT_USER, 'guest');
      return GUEST_USER;
    }
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) return null;
    await setItem(StorageKeys.CURRENT_USER, userId);
    return user;
  },

  async logout(): Promise<void> {
    await removeItem(StorageKeys.CURRENT_USER);
  },

  async isGuest(): Promise<boolean> {
    const userId = await getItem<string>(StorageKeys.CURRENT_USER);
    return userId === 'guest' || userId === null;
  },
};
