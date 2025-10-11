// src/components/dashboard/DashboardHeader.tsx
"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import * as Ably from 'ably';
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, Globe, User, Settings, Lock, LogOut } from 'lucide-react';

const DashboardHeader = () => {
    const { user, logout } = useAuth();
    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_ABLY_PUBLIC_KEY) {
            console.error("Ably public key not found.");
            return;
        }

        const ably = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_PUBLIC_KEY });

        ably.connection.on('connected', () => {
            console.log('Connected to Ably!');
        });

        const channel = ably.channels.get('general-notifications');

        channel.subscribe('new-message', (message) => {
            console.log('Received Ably message:', message.data);
            toast("New Notification", { // 👈 Call toast directly
                description: message.data.text,
            });
        });

        return () => {
            ably.close();
        };
    }, []); // Empty dependency array means this runs once

    const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';

    return (
        <div className="flex items-center justify-end w-full">
            <div className="flex items-center gap-4">

                {/* --- Notification Popover --- */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                        <div className="p-4 text-center">
                            <p className="font-bold">You have no new notification!</p>
                            <p className="text-sm text-muted-foreground">You have no notification!</p>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* --- Language Dropdown --- */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Globe className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>English</DropdownMenuItem>
                        <DropdownMenuItem>Spanish</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* --- User Profile Dropdown --- */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary-blue text-white font-bold">{initials}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile/overview"><User className="mr-2 h-4 w-4" />Profile Overview</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/profile/settings"><Settings className="mr-2 h-4 w-4" />Profile Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/profile/password"><Lock className="mr-2 h-4 w-4" />Change Password</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut className="mr-2 h-4 w-4" />Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
    );
};

export default DashboardHeader;