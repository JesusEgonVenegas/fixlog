"use client";

import { useState, useEffect, useCallback } from "react";
import { User, LoginInput, RegisterInput } from "@/types";
import * as api from "@/lib/api";
import {
  saveToken,
  removeToken,
  getToken,
  saveUser,
  getUser,
} from "@/lib/auth";

export function useAuth() {
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

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };
}
