// src/app/dashboard/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const DashboardPage = () => {
    const { user, loading } = useAuth(); // 👈 Destructure 'loading', not 'token'
    const router = useRouter();

    useEffect(() => {
        // Wait for the auth state to finish loading before checking for a user
        if (!loading && !user) {
            router.push('/auth/signup?view=login');
        }
    }, [user, loading, router]); // 👈 Depend on 'user' and 'loading'

    // Show a loading screen while the user state is being determined
    if (loading || !user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <DashboardLayout
            sidebar={<Sidebar />}
            header={<DashboardHeader />}
        >
            <div>
                <h1 className="text-3xl font-bold text-primary-blue">Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;