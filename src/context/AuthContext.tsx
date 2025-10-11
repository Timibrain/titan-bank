// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
 loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedToken = localStorage.getItem('auth-token');
    if (storedToken) {
      try {
        const decoded = jwtDecode<{ userId: string, name: string, email: string }>(storedToken);
        setUser({ id: decoded.userId, name: "User", email: "" }); // Simplified for now
        setToken(storedToken);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('auth-token');
      } finally{
        setLoading(false);
      }
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('auth-token', newToken);
    const decoded = jwtDecode<{ userId: string, name: string, email: string }>(newToken);
    setUser({ id: decoded.userId, name: "User", email: "" }); // Simplified for now
    setToken(newToken);
    window.location.href = '/dashboard'; // Redirect after login
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    setUser(null);
    setToken(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, token, loading,  login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};