"use client";

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { FixedDeposit, columns } from "@/components/dashboard/FdrColumns";
import { DataTable } from "@/components/dashboard/DataTable";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

const MY_FIXED_DEPOSITS_QUERY = gql`
  query MyFixedDeposits {
    myFixedDeposits {
      id
      plan
      currency
      depositAmount
      returnAmount
      status
      matureDate
    }
  }
`;

interface FdrData {
    myFixedDeposits: FixedDeposit[];
}

const FDRHistoryPage = () => {
    const { data, loading, error } = useQuery<FdrData>(MY_FIXED_DEPOSITS_QUERY);

    if (loading) {
        return <DashboardLayout sidebar={<Sidebar />} header={<DashboardHeader />}><div>Loading history...</div></DashboardLayout>;
    }
    if (error) {
        return <DashboardLayout sidebar={<Sidebar />} header={<DashboardHeader />}><div>Error loading history: {error.message}</div></DashboardLayout>;
    }

    const fdrHistory = data?.myFixedDeposits || [];

    return (
        <DashboardLayout
            sidebar={<Sidebar />}
            header={<DashboardHeader />}
        >
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-primary-blue">Fixed Deposit History</h1>
                    <Button asChild>
                        <Link href="/fixed-deposit/apply">
                            <PlusCircle className="mr-2 h-4 w-4" /> Apply New
                        </Link>
                    </Button>
                </div>
                <DataTable columns={columns} data={fdrHistory} />
            </div>
        </DashboardLayout>
    );
};

export default FDRHistoryPage;