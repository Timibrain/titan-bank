// src/components/dashboard/Sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Send, ArrowLeftRight, Landmark, Receipt, PiggyBank, Ticket, FileText, CreditCard, Gift,
} from 'lucide-react';
import clsx from 'clsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const mainLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Send Money', href: '/send', icon: Send },
    { name: 'Exchange Money', href: '/exchange', icon: ArrowLeftRight },
    { name: 'Wire Transfer', href: '/wire', icon: Landmark },
];

const secondaryLinks = [
    { name: 'Withdraw Money', href: '/withdraw', icon: PiggyBank },
    // { name: 'Fixed Deposit', href: '/fixed-deposit', icon: PiggyBank },
    // { name: 'Support Tickets', href: '/support', icon: Ticket },
    { name: 'Transactions', href: '/transactions', icon: FileText },
];

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-lg text-accent-red">$</div>
                    <span className="text-lg font-bold tracking-wider text-primary-blue">TITAN</span>
                </Link>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
                {mainLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx('flex items-center gap-3 rounded-lg px-3 py-2 text-primary-blue transition-all hover:bg-gray-100', { 'bg-gray-100 font-semibold': pathname === link.href })}
                    >
                        <link.icon className="h-4 w-4" />
                        {link.name}
                    </Link>
                ))}

                {/* --- Deposit Accordion --- */}
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="deposit" className="border-b-0">
                        <AccordionTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-blue transition-all hover:bg-gray-100 hover:no-underline">
                            <div className="flex items-center gap-3">
                                <Receipt className="h-4 w-4" />
                                <span>Deposit Money</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-8 pt-1 space-y-1">
                            <Link href="/deposit/manual" className={clsx('block rounded-md px-3 py-2 text-sm hover:bg-gray-100', { 'bg-gray-100 font-semibold': pathname === '/deposit/manual' })}>Manual Deposit</Link>
                            <Link href="/deposit/redeem" className={clsx('block rounded-md px-3 py-2 text-sm hover:bg-gray-100', { 'bg-gray-100 font-semibold': pathname === '/deposit/redeem' })}>Redeem Gift Card</Link>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="fixed-deposit" className="border-b-0">
                        <AccordionTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-blue transition-all hover:bg-gray-100 hover:no-underline">
                            <div className="flex items-center gap-3">
                                <PiggyBank className="h-4 w-4" />
                                <span>Fixed Deposit</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-8 pt-1 space-y-1">
                            <Link href="/fixed-deposit/apply" className={clsx('block rounded-md px-3 py-2 text-sm hover:bg-gray-100', { 'bg-gray-100 font-semibold': pathname === '/fixed-deposit/apply' })}>Apply New FRD</Link>
                            <Link href="/fixed-deposit/history" className={clsx('block rounded-md px-3 py-2 text-sm hover:bg-gray-100', { 'bg-gray-100 font-semibold': pathname === '/fixed-deposit/history' })}>FDR History</Link>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="support-tickets" className="border-b-0">
                        <AccordionTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-blue transition-all hover:bg-gray-100 hover:no-underline">
                            <div className="flex items-center gap-3">
                                <Ticket className="h-4 w-4" />
                                <span>Support Tickets</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-8 pt-1 space-y-1">
                            <Link href="/support/create" className={clsx('block rounded-md px-3 py-2 text-sm hover:bg-gray-100', { 'bg-gray-100 font-semibold': pathname === '/support/create' })}>Create New Ticket</Link>
                            <Link href="/support/pending" className={clsx('block rounded-md px-3 py-2 text-sm hover:bg-gray-100', { 'bg-gray-100 font-semibold': pathname === '/support/pending' })}>Pending Tickets</Link>
                            <Link href="/support/active" className={clsx('block rounded-md px-3 py-2 text-sm hover:bg-gray-100', { 'bg-gray-100 font-semibold': pathname === '/support/active' })}>Active Tickets</Link>
                            <Link href="/support/closed" className={clsx('block rounded-md px-3 py-2 text-sm hover:bg-gray-100', { 'bg-gray-100 font-semibold': pathname === '/support/closed' })}>Closed Tickets</Link>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {secondaryLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx('flex items-center gap-3 rounded-lg px-3 py-2 text-primary-blue transition-all hover:bg-gray-100', { 'bg-gray-100 font-semibold': pathname === link.href })}
                    >
                        <link.icon className="h-4 w-4" />
                        {link.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;