// src/components/dashboard/BalanceCard.tsx
import { Wallet } from 'lucide-react';

interface BalanceCardProps {
    currency: string;
    amount: number;
}

const BalanceCard = ({ currency, amount }: BalanceCardProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">{currency} Balance</p>
                <Wallet className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-primary-blue">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount)}
            </p>
        </div>
    );
};

export default BalanceCard;