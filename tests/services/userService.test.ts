/**
 * Unit tests for userService
 *
 * Coverage targets:
 *   getCurrentUser  — logged-in user / guest / no session
 *   getMockUsers    — returns Alice, Bob, Carol
 *   setCurrentUser  — known user / guest / unknown user / invalid arg
 *   logout          — clears storage
 *   isGuest         — guest / logged-in / no session
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../../services/userService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const AS = AsyncStorage as unknown as { __reset: () => void };

async function setStoredUser(userId: string | null): Promise<void> {
  if (userId === null) {
    await AsyncStorage.removeItem('currentUser');
  } else {
    await AsyncStorage.setItem('currentUser', JSON.stringify(userId));
  }
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  AS.__reset();
});

// ---------------------------------------------------------------------------
// getCurrentUser
// ---------------------------------------------------------------------------
describe('userService.getCurrentUser', () => {
  it('returns null when no user is stored', async () => {
    const result = await userService.getCurrentUser();
    expect(result).toBeNull();
  });

  it('returns the GUEST_USER object when stored id is "guest"', async () => {
    await setStoredUser('guest');
    const result = await userService.getCurrentUser();
    expect(result).not.toBeNull();
    expect(result!.id).toBe('guest');
    expect(result!.name).toBe('Guest');
  });

  it('returns Alice when stored id is user-001', async () => {
    await setStoredUser('user-001');
    const result = await userService.getCurrentUser();
    expect(result).not.toBeNull();
    expect(result!.id).toBe('user-001');
    expect(result!.name).toBe('Alice');
  });

  it('returns Bob when stored id is user-002', async () => {
    await setStoredUser('user-002');
    const result = await userService.getCurrentUser();
    expect(result).not.toBeNull();
    expect(result!.name).toBe('Bob');
  });

  it('returns Carol when stored id is user-003', async () => {
    await setStoredUser('user-003');
    const result = await userService.getCurrentUser();
    expect(result).not.toBeNull();
    expect(result!.name).toBe('Carol');
  });

  it('returns null when stored id does not match any known user', async () => {
    await setStoredUser('user-999');
    const result = await userService.getCurrentUser();
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getMockUsers
// ---------------------------------------------------------------------------
describe('userService.getMockUsers', () => {
  it('returns exactly 3 users (Alice, Bob, Carol)', async () => {
    const users = await userService.getMockUsers();
    expect(users).toHaveLength(3);
    const names = users.map((u) => u.name);
    expect(names).toContain('Alice');
    expect(names).toContain('Bob');
    expect(names).toContain('Carol');
  });

  it('each user has id, name, phone, and avatar fields', async () => {
    const users = await userService.getMockUsers();
    users.forEach((u) => {
      expect(u).toHaveProperty('id');
      expect(u).toHaveProperty('name');
      expect(u).toHaveProperty('phone');
      expect(u).toHaveProperty('avatar');
    });
  });
});

// ---------------------------------------------------------------------------
// setCurrentUser
// ---------------------------------------------------------------------------
describe('userService.setCurrentUser', () => {
  it('persists user-001 and returns Alice', async () => {
    const result = await userService.setCurrentUser('user-001');
    expect(result).not.toBeNull();
    expect(result!.id).toBe('user-001');
    expect(result!.name).toBe('Alice');
    // Verify the value was actually written to storage
    const stored = await AsyncStorage.getItem('currentUser');
    expect(stored).toBe(JSON.stringify('user-001'));
  });

  it('persists "guest" and returns the GUEST_USER', async () => {
    const result = await userService.setCurrentUser('guest');
    expect(result).not.toBeNull();
    expect(result!.id).toBe('guest');
    expect(result!.name).toBe('Guest');
    const stored = await AsyncStorage.getItem('currentUser');
    expect(stored).toBe(JSON.stringify('guest'));
  });

  it('returns null and does not write to storage for an unknown userId', async () => {
    const result = await userService.setCurrentUser('user-999');
    expect(result).toBeNull();
    const stored = await AsyncStorage.getItem('currentUser');
    expect(stored).toBeNull();
  });

  it('throws when userId is empty string', async () => {
    await expect(userService.setCurrentUser('')).rejects.toThrow(/userId must be a non-empty string/);
  });

  it('throws when userId is whitespace only', async () => {
    await expect(userService.setCurrentUser('   ')).rejects.toThrow(/userId must be a non-empty string/);
  });
});

// ---------------------------------------------------------------------------
// logout
// ---------------------------------------------------------------------------
describe('userService.logout', () => {
  it('removes the currentUser key from storage', async () => {
    await setStoredUser('user-001');
    await userService.logout();
    const result = await userService.getCurrentUser();
    expect(result).toBeNull();
  });

  it('is a no-op when no user is stored (does not throw)', async () => {
    await expect(userService.logout()).resolves.toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// isGuest
// ---------------------------------------------------------------------------
describe('userService.isGuest', () => {
  it('returns true when no user is stored', async () => {
    const result = await userService.isGuest();
    expect(result).toBe(true);
  });

  it('returns true when stored id is "guest"', async () => {
    await setStoredUser('guest');
    const result = await userService.isGuest();
    expect(result).toBe(true);
  });

  it('returns false when a real user is stored', async () => {
    await setStoredUser('user-001');
    const result = await userService.isGuest();
    expect(result).toBe(false);
  });

  it('returns false for user-002 (Bob)', async () => {
    await setStoredUser('user-002');
    const result = await userService.isGuest();
    expect(result).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Error path coverage — catch branches in service methods
// ---------------------------------------------------------------------------
describe('userService error paths', () => {
  it('getCurrentUser returns null when storage read throws', async () => {
    // storage.getItem swallows the rejection and returns null,
    // so getCurrentUser gets null userId and returns null
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('read error'));
    const result = await userService.getCurrentUser();
    expect(result).toBeNull();
  });

  it('getMockUsers returns array (no I/O — always succeeds)', async () => {
    const result = await userService.getMockUsers();
    expect(Array.isArray(result)).toBe(true);
  });

  it('setCurrentUser returns null (graceful) for unknown user without writing storage', async () => {
    // storage.setItem swallows write errors; this tests the unknown-user guard
    const result = await userService.setCurrentUser('user-unknown');
    expect(result).toBeNull();
    const stored = await AsyncStorage.getItem('currentUser');
    expect(stored).toBeNull();
  });

  it('isGuest returns true (safe default) when storage throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('storage failure'));
    const result = await userService.isGuest();
    expect(result).toBe(true);
  });

  it('logout completes without error even when no user is stored', async () => {
    await expect(userService.logout()).resolves.toBeUndefined();
  });
});
