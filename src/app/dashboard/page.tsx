// src/app/dashboard/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AccountSummary from '@/components/dashboard/AccountSummary';
import BalanceCard from '@/components/dashboard/BalanceCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface TransactionsData {
    myTransactions: {
        id: string;
        date: string;
        description: string;
        amount: number;
        type: 'DEBIT' | 'CREDIT';
        currency: string;
        status: string;
    }[];
}

// We only need the Transactions query here now
const TRANSACTIONS_QUERY = gql`
  query MyTransactions {
    myTransactions {
      id
      date
      description
      amount
      type
      currency
      status
    }
  }
`;

const DashboardPage = () => {
    // Get user and authLoading directly from the context
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    // We still fetch transactions separately
    const { data: transData, loading: transLoading, error: transError } = useQuery<TransactionsData>(TRANSACTIONS_QUERY, {
        skip: !user,
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/signup?view=login');
        }
    }, [user, authLoading, router]);

    const isLoading = authLoading || transLoading;

    if (isLoading || !user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (transError) {
        return <div className="flex items-center justify-center min-h-screen">Error: {transError.message}</div>;
    }

    const transactions = transData?.myTransactions || [];

    return (
        <DashboardLayout sidebar={<Sidebar />} header={<DashboardHeader />}>
            <div className="space-y-8">
                <AccountSummary name={user.name} accountNumber={user.accountNumber!} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {user.balances?.map((balance: any) => (
                        <BalanceCard
                            key={balance.currency}
                            currency={balance.currency}
                            amount={balance.amount}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Fixed Deposits</CardTitle>
                            <Link href="/fixed-deposit/history" className="text-sm text-blue-600 hover:underline">+ View</Link>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user.activeFixedDepositsCount}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
                            <Link href="/support/active" className="text-sm text-blue-600 hover:underline">+ View</Link>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user.activeTicketsCount}</div>
                        </CardContent>
                    </Card>
                </div>

                <RecentTransactions transactions={transactions} />
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;