"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export type FixedDeposit = {
    id: string
    plan: string
    currency: "USD" | "EUR" | "GBP"
    depositAmount: number
    returnAmount: number
    status: "ACTIVE" | "MATURED" | "CLOSED"
    matureDate: string
}

export const columns: ColumnDef<FixedDeposit>[] = [
    { accessorKey: "plan", header: "Plan" },
    { accessorKey: "currency", header: "Currency" },
    {
        accessorKey: "depositAmount",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-right w-full justify-end">
                Deposit Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("depositAmount"));
            const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: row.getValue("currency") }).format(amount);
            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "returnAmount",
        header: "Return Amount",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("returnAmount"));
            const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: row.getValue("currency") }).format(amount);
            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            let variant: "default" | "secondary" | "destructive" = "secondary";
            if (status === 'ACTIVE') variant = 'default';
            if (status === 'CLOSED') variant = 'destructive';
            return <Badge variant={variant}>{status}</Badge>;
        }
    },
    { accessorKey: "matureDate", header: "Mature Date" },
]