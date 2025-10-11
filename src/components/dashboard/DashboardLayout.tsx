// src/components/dashboard/DashboardLayout.tsx
"use client";

import React, { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // Assuming you have these
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
    children: ReactNode;
    sidebar: ReactNode; // We'll pass the Sidebar component as a prop
    header: ReactNode;  // We'll pass the DashboardHeader component as a prop
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar, header }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile Sidebar Toggle */}
            <div className="md:hidden fixed top-0 left-0 p-4 z-50">
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-primary-blue">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        {sidebar}
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-100 shadow-sm">
                {sidebar}
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Dashboard Header */}
                <header className="bg-white border-b border-gray-100 shadow-sm py-3 px-6 md:px-8 sticky top-0 z-40">
                    {header}
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;