// src/components/dashboard/TicketList.tsx
"use client";

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Ticket, columns } from "@/components/dashboard/TicketColumns";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

const MY_TICKETS_QUERY = gql`
  query MyTickets($status: String) {
    myTickets(status: $status) {
      id
      ticketId
      subject
      status
      createdAt
    }
  }
`;

interface TicketsData {
    myTickets: Ticket[];
}

interface TicketListProps {
    title: string;
    status?: 'PENDING' | 'ACTIVE' | 'CLOSED';
}

const TicketList = ({ title, status }: TicketListProps) => {
    const { data, loading, error } = useQuery<TicketsData>(MY_TICKETS_QUERY, {
        variables: { status },
    });

    if (loading) return <div>Loading tickets...</div>;
    if (error) return <div>Error loading tickets: {error.message}</div>;

    const tickets = data?.myTickets || [];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary-blue">{title}</h1>
                <Button asChild>
                    <Link href="/support/create">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New
                    </Link>
                </Button>
            </div>
            <DataTable columns={columns} data={tickets} />
        </div>
    );
};

export default TicketList;