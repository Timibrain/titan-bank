// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';

// Expanded User interface
interface User {
    id: string;
    name: string;
    email: string;
    accountNumber?: string;
    balances?: { currency: string; amount: number }[];
    activeFixedDepositsCount?: number;
    activeTicketsCount?: number;
}

interface MeQueryData {
    me: User | null;
}

// Expanded ME_QUERY to fetch all dashboard data
const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      accountNumber
      balances {
        currency
        amount
      }
      activeFixedDepositsCount
      activeTicketsCount
    }
  }
`;

const LOGOUT_MUTATION = gql`mutation Logout { logout }`;

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const { data, loading, refetch } = useQuery<MeQueryData>(ME_QUERY);
    const [logoutMutation] = useMutation(LOGOUT_MUTATION);

    const user = data?.me || null;

    const login = async (newToken: string) => {
        try {
            await fetch('/api/auth/set-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: newToken }),
            });
            await refetch();
            router.push('/dashboard');
        } catch (error) {
            console.error("Failed to set auth cookie", error);
        }
    };

    const logout = async () => {
        try {
            // Call the new API route to clear the cookie
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            // Always clear the frontend state and redirect
            await refetch();
            router.push('/');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
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