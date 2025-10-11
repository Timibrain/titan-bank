// src/components/dashboard/AccountSummary.tsx
import { UserCircle } from 'lucide-react';

interface AccountSummaryProps {
    name: string;
    accountNumber: string;
}

const AccountSummary = ({ name, accountNumber }: AccountSummaryProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="bg-gray-100 p-4 rounded-full">
                <UserCircle className="h-10 w-10 text-primary-blue" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-primary-blue">{name}</h2>
                <p className="text-gray-500">Account Number: {accountNumber}</p>
            </div>
        </div>
    );
};

export default AccountSummary;