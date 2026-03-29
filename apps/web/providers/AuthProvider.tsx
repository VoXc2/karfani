'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { api } from '../lib/api';

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEYS = {
  accessToken: 'karfani_access_token',
  refreshToken: 'karfani_refresh_token',
  user: 'karfani_user',
} as const;

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEYS.accessToken);
      const storedRefresh = localStorage.getItem(STORAGE_KEYS.refreshToken);
      const storedUser = localStorage.getItem(STORAGE_KEYS.user);

      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setRefreshToken(storedRefresh);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Ignore localStorage errors (e.g. SSR, corrupted data)
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (phone: string, otp: string) => {
    const result: any = await api.verifyOtp(phone, otp);

    const { accessToken: newAccess, refreshToken: newRefresh, user: newUser } = result;

    setAccessToken(newAccess);
    setRefreshToken(newRefresh);
    setUser(newUser);

    localStorage.setItem(STORAGE_KEYS.accessToken, newAccess);
    if (newRefresh) {
      localStorage.setItem(STORAGE_KEYS.refreshToken, newRefresh);
    }
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);

    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.user);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token: accessToken,
        isAuthenticated: !!accessToken && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
