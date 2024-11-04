import { Menu, TerminalSquare } from "lucide-react";
import { getNotifications, getProductsByUserId, isUserPremium } from "@/lib/launchpad-server-actions/server-actions";

import { Badge } from "./ui/badge";
import KeyboardShortcuts from "@/lib/hotkeys";
import Link from "next/link";
import NotificationIcon from "./Navbar/NotificationIcon";
import RabbitIcon from "./Icons";
import React from 'react';
import RightNavContent from "./RightNavContent";
import SearchBar from "./SearchBar";
import { Separator } from "./ui/separator";
import UserAccountNav from "./UserAccountNav";
import { authOptions } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/Button";
import { getServerSession } from "next-auth";

const Navbar = async () => {
    const session = await getServerSession(authOptions);

    let notifications: any[] = [];
    let products: any[] = [];
    let isPremium: any = false;

    if (session?.user?.id) {
        // Only fetch data if the user is logged in
        notifications = await getNotifications() ?? [];
        products = await getProductsByUserId(session.user.id) ?? [];
        isPremium = await isUserPremium();
    }

    return (
        <nav className="fixed top-0 w-full z-10 bg-gradient-to-r border-b border-gray-800 backdrop-blur-lg shadow-sm ">
            <div className="container max-w-7xl mx-auto flex justify-between items-center py-4 px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-white hover:text-indigo-300 transition-colors duration-200">
                    <TerminalSquare size={32} className="text-indigo-400" />
                    <span className="hidden md:block text-2xl font-normal">devcastle</span>
                </Link>

                {/* Search Bar and Nav Links */}
                <div className="flex items-center space-x-4">
                    {/* Search Bar */}
                    <div className="">
                        <SearchBar />
                    </div>

                    {/* Separator */}
                    <Separator orientation="vertical" className="h-8 w-0.5 bg-indigo-600 hidden md:block" />

                    {/* Right Side Content */}
                    {session?.user?.email && (
                        <div className="hidden md:flex items-center space-x-4">
                            <RightNavContent products={products} authenticatedUser={session} />
                            <KeyboardShortcuts />
                        </div>
                    )}

                    {/* Rabbit Icon with Badge */}
                    {session?.user?.email && (
                        <div className="relative">
                            <Link href="/launchpad" className="text-teal-300 hover:text-teal-100 transition-colors duration-200">
                                <RabbitIcon className="w-6 h-6" />
                            </Link>
                            <Badge
                                variant="outline"
                                className="absolute -top-2 -right-2 px-1 py-0.5 text-[0.6rem] bg-yellow-400 text-yellow-900 border-yellow-500"
                            >
                                WIP
                            </Badge>
                        </div>
                    )}

                    {/* Notification Icon */}
                    {session?.user?.email && (
                        <NotificationIcon notifications={notifications} />
                    )}

                    {/* User Account or Sign-in */}
                    <div className="flex items-center">
                        {session?.user ? (
                            <UserAccountNav user={session.user} username={session?.user?.username} isUserPremium={isPremium} />
                        ) : (
                            <Link href="/sign-in" className={buttonVariants({
                                size: "sm",
                                className: "bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
                            })}>
                                Sign In
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
