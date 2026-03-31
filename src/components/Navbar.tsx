import { Menu, TerminalSquare, Sparkles } from "lucide-react";
import { getNotifications, getProductsByUserId, isUserPremium } from "@/lib/launchpad-server-actions/server-actions";

import { Badge } from "./ui/badge";
import KeyboardShortcuts from "@/lib/hotkeys";
import Link from "next/link";
import NotificationIcon from "./Navbar/NotificationIcon";
import RabbitIcon from "./Icons";
import React from 'react';
import RightNavContent from "./RightNavContent";
import SearchBar from "./SearchBar";
import UserAccountNav from "./UserAccountNav";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const Navbar = async () => {
    const session = await getServerSession(authOptions);

    let notifications: any[] = [];
    let products: any[]      = [];
    let isPremium: any       = false;

    if (session?.user?.id) {
        notifications = await getNotifications() ?? [];
        products      = await getProductsByUserId(session.user.id) ?? [];
        isPremium     = await isUserPremium();
    }

    const isLoggedIn = !!session?.user?.email;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            {/* Glass backdrop */}
            <div className="absolute inset-0 bg-[#0d0d0f]/80 backdrop-blur-xl border-b border-zinc-800/60" />

            {/* Subtle top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

            <div className="relative max-w-7xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6">

                {/* ── Logo ── */}
                <Link
                    href="/"
                    className="group flex items-center gap-2.5 shrink-0"
                >
                    <div className="relative flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-900/40 group-hover:shadow-violet-700/50 transition-shadow duration-300">
                        <TerminalSquare className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden md:block text-sm font-semibold text-zinc-200 group-hover:text-white tracking-tight transition-colors duration-200">
                        devcastle
                    </span>
                </Link>

                {/* ── Center: Search ── */}
                <div className="flex-1 max-w-sm mx-6 hidden sm:block">
                    <SearchBar />
                </div>

                {/* ── Right side ── */}
                <div className="flex items-center gap-1">

                    {/* Authenticated extras */}
                    {isLoggedIn && (
                        <>
                            {/* Right nav links (hidden on mobile) */}
                            <div className="hidden md:flex items-center">
                                <RightNavContent products={products} authenticatedUser={session} />
                            </div>

                            {/* Keyboard shortcuts */}
                            <div className="hidden md:block">
                                <KeyboardShortcuts />
                            </div>

                            {/* Launchpad / Rabbit icon */}
                            <div className="relative">
                                <Link
                                    href="/launchpad"
                                    className="flex items-center justify-center h-8 w-8 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all duration-200"
                                    aria-label="Launchpad"
                                >
                                    <RabbitIcon className="h-4 w-4" />
                                </Link>
                                <span className="absolute -top-1 -right-1 flex items-center justify-center h-3.5 w-3.5 rounded-full bg-amber-500 border border-zinc-900">
                                    <span className="text-[7px] font-bold text-zinc-900 leading-none">W</span>
                                </span>
                            </div>

                            {/* Notifications */}
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-zinc-800/60 transition-all duration-200">
                                <NotificationIcon notifications={notifications} />
                            </div>

                            {/* Divider */}
                            <div className="h-5 w-px bg-zinc-800 mx-1" />
                        </>
                    )}

                    {/* User account / Sign in */}
                    {session?.user ? (
                        <UserAccountNav
                            user={session.user}
                            username={session?.user?.username}
                            isUserPremium={isPremium}
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/sign-in"
                                className="hidden sm:inline-flex items-center h-8 px-3 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all duration-200"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/sign-up"
                                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold
                                    bg-gradient-to-r from-violet-600 to-fuchsia-600
                                    hover:from-violet-500 hover:to-fuchsia-500
                                    text-white shadow-md shadow-violet-900/30
                                    transition-all duration-200"
                            >
                                <Sparkles className="h-3 w-3" />
                                Get started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;