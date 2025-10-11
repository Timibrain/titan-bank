// src/app/dashboard/page.tsx
"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

// We'll also import the auth protection logic
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const DashboardPage = () => {
    const { user, token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push('/auth/signup?view=login');
        }
    }, [token, router]);

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <DashboardLayout
            sidebar={<Sidebar />}
            header={<DashboardHeader />}
        >
            {/* Main Content Goes Here */}
            <div>
                <h1 className="text-3xl font-bold text-primary-blue">Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
                {/* We will add the balance cards and transaction table here next */}
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;