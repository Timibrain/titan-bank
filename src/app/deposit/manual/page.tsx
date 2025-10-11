// src/app/deposit/manual/page.tsx
"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CryptoDepositDialog } from '@/components/dashboard/CryptoDepositDialog';
import { DirectDepositDialog } from '@/components/dashboard/DirectDepositDialog'; 
import { CreditCard, Landmark } from 'lucide-react';

const ManualDepositPage = () => {
    return (
        <DashboardLayout
            sidebar={<Sidebar />}
            header={<DashboardHeader />}
        >
            <div>
                <h1 className="text-3xl font-bold text-primary-blue mb-8">Manual Deposit Methods</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Crypto Wallet Card */}
                    <Card className="text-center">
                        <CardHeader>
                            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                            <CardTitle className="mt-4">CRYPTO WALLET (USD)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600">Deposit Limit: $50.00 - $1,000,000.00</p>
                            <p className="text-sm text-gray-600">Deposit Charge: $0.00 + 0.50%</p>
                            <CryptoDepositDialog />
                        </CardContent>
                    </Card>

                    {/* Direct Deposit Card */}
                    <Card className="text-center">
                        <CardHeader>
                            <Landmark className="mx-auto h-12 w-12 text-gray-400" />
                            <CardTitle className="mt-4">DIRECT DEPOSIT</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600">Deposit Limit: $50.00 - $1,000,000.00</p>
                            <p className="text-sm text-gray-600">Deposit Charge: $0.00 + 0.00%</p>
                            {/* 👇 Replace the disabled button with the new dialog */}
                            <DirectDepositDialog />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ManualDepositPage;