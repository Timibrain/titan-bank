// src/components/dashboard/RecentTransactions.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Define a type for a single transaction
interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
    currency: string;
    status: string;
}

interface RecentTransactionsProps {
    transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-primary-blue mb-4">Recent Transactions</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-500">
                                No transactions yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    {new Date(transaction.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="font-medium">{transaction.description}</TableCell>
                                <TableCell className={`text-right font-semibold ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {transaction.type === 'CREDIT' ? '+' : '-'}
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: transaction.currency }).format(transaction.amount)}
                                </TableCell>
                                <TableCell>{transaction.type}</TableCell>
                                <TableCell>
                                    <Badge variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                        {transaction.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default RecentTransactions;