// src/components/dashboard/TicketColumns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type Ticket = {
    id: string
    ticketId: string
    subject: string
    status: "PENDING" | "ACTIVE" | "CLOSED"
    createdAt: string
}

export const columns: ColumnDef<Ticket>[] = [
    {
        accessorKey: "ticketId",
        header: "ID",
    },
    {
        accessorKey: "subject",
        header: "Subject",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            let variant: "default" | "secondary" | "destructive" = "secondary";
            if (status === 'ACTIVE') variant = 'default';
            if (status === 'PENDING') variant = 'destructive';
            return <Badge variant={variant}>{status}</Badge>;
        }
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
            return new Date(row.getValue("createdAt")).toLocaleDateString();
        }
    },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
            const ticket = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => alert(`Viewing ticket ${ticket.ticketId}`)}>
                            View Ticket
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]