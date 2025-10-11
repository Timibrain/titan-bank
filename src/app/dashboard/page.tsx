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

interface MeData {
    me: {
        id: string;
        name: string;
        accountNumber: string;
        balances: {
            currency: string;
            amount: number;
        }[];
    };
}

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
// GraphQL query to fetch the logged-in user's data
const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      accountNumber
      balances {
        currency
        amount
      }
    }
  }
`;

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
    const { token, loading: authLoading } = useAuth();
    const router = useRouter();

    const { data: meData, loading: meLoading, error: meError } = useQuery<MeData>(ME_QUERY, { skip: !token });
    const { data: transData, loading: transLoading, error: transError } = useQuery<TransactionsData>(TRANSACTIONS_QUERY, { skip: !token });

    useEffect(() => {
        if (!authLoading && !token) {
            router.push('/auth/signup?view=login');
        }
    }, [token, authLoading, router]);

    const isLoading = authLoading || meLoading || transLoading;

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    const error = meError || transError;
    if (error) {
        return <div className="flex items-center justify-center min-h-screen">Error: {error.message}</div>;
    }

    if (!meData?.me) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    const { me: user } = meData;
    const transactions = transData?.myTransactions || [];
    return (
        <DashboardLayout
            sidebar={<Sidebar />}
            header={<DashboardHeader />}
        >
            {/* Main Content */}
            <div className="space-y-8">
                <AccountSummary name={user.name} accountNumber={user.accountNumber} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {user.balances?.map((balance: any) => (
                        <BalanceCard
                            key={balance.currency}
                            currency={balance.currency}
                            amount={balance.amount}
                        />
                    ))}
                </div>

                <RecentTransactions transactions={transactions} />
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;