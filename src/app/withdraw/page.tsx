// src/app/withdraw/page.tsx
"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { WithdrawDialog } from '@/components/dashboard/WithdrawDialog';
import { Landmark } from 'lucide-react';

const WithdrawPage = () => {
    return (
        <DashboardLayout
            sidebar={<Sidebar />}
            header={<DashboardHeader />}
        >
            <div>
                <h1 className="text-3xl font-bold text-primary-blue mb-8">Withdraw Methods</h1>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="flex flex-col items-center justify-center p-6 text-center">
                        <Landmark className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-primary-blue">Wire Transfer</h3>
                        <CardContent className="mt-4 space-y-2 text-sm text-gray-600">
                            <p>Withdraw Limit: $500.00 - $10,000,000.00</p>
                            <p>Withdraw Charge: $25.00 + 0.00%</p>
                            <div className="pt-4">
                                <WithdrawDialog />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default WithdrawPage;