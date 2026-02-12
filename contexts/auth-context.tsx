"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { User, LoginInput, RegisterInput } from "@/types";
import * as api from "@/lib/api";
import {
  saveToken,
  removeToken,
  getToken,
  saveUser,
  getUser,
} from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<{ token: string; user: User }>;
  register: (input: RegisterInput) => Promise<{ token: string; user: User }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const stored = getUser();
      if (stored) setUser(stored);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const res = await api.login(input);
    saveToken(res.token);
    saveUser(res.user);
    setUser(res.user);
    return res;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const res = await api.register(input);
    saveToken(res.token);
    saveUser(res.user);
    setUser(res.user);
    return res;
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
  }, []);

  return (
    <AuthContext value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
