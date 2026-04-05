import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { userService } from '../services/userService';

interface AuthContextValue {
  currentUser: User | null;
  isLoading: boolean;
  isGuest: boolean;
  mockUsers: User[];
  login: (userId: string) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [mockUsers, setMockUsers] = useState<User[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const [user, users] = await Promise.all([userService.getCurrentUser(), userService.getMockUsers()]);
        setMockUsers(users);
        setCurrentUser(user);
        setIsGuest(user?.id === 'guest' || user === null);
      } catch (error) {
        console.error('[AuthContext] Init error:', error);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  async function login(userId: string) {
    setIsLoading(true);
    try {
      const user = await userService.setCurrentUser(userId);
      setCurrentUser(user);
      setIsGuest(user?.id === 'guest' || user === null);
    } finally {
      setIsLoading(false);
    }
  }

  async function continueAsGuest() {
    await login('guest');
  }

  async function logout() {
    setIsLoading(true);
    try {
      await userService.logout();
      setCurrentUser(null);
      setIsGuest(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isGuest,
        mockUsers,
        login,
        continueAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
