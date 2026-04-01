"use client"

import { Bell, CheckCheck, Clock, Inbox } from "lucide-react";
import React, { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence as _AP } from "framer-motion";
import { markAllNotificationsAsRead } from "@/lib/launchpad-server-actions/server-actions";



const AnimatePresence = _AP as any;
interface NotificationIconProps {
    notifications?: any[];
}

function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const s = diff / 1000;
    if (s < 60)         return "Just now";
    if (s < 3600)       return `${Math.floor(s / 60)}m ago`;
    if (s < 86400)      return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
}

// Accent dot per index — same cycling palette as the rest of the system
const DOT_COLORS = [
    "bg-violet-400", "bg-cyan-400", "bg-fuchsia-400",
    "bg-amber-400",  "bg-emerald-400", "bg-rose-400",
];

const NotificationIcon: React.FC<NotificationIconProps> = ({ notifications = [] }) => {
    const [unread, setUnread] = useState(
        notifications.filter((n) => n.status === "UNREAD").length
    );
    const [isOpen, setIsOpen] = useState(false);
    const [wiggle, setWiggle] = useState(false);

    // Subtle wiggle every 5s when there are unread notifications
    useEffect(() => {
        if (unread === 0) return;
        const id = setInterval(() => {
            setWiggle(true);
            setTimeout(() => setWiggle(false), 600);
        }, 5000);
        return () => clearInterval(id);
    }, [unread]);

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setUnread(0);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Sheet onOpenChange={setIsOpen}>
            {/* ── Trigger ── */}
            <SheetTrigger asChild>
                <button
                    aria-label="Notifications"
                    className={`relative flex items-center justify-center h-8 w-8 rounded-lg border transition-all duration-200
                        ${isOpen
                            ? "border-violet-500/40 bg-violet-500/10 text-violet-400"
                            : "border-zinc-800 bg-zinc-900/60 text-zinc-600 hover:text-zinc-200 hover:border-zinc-700"
                        }`}
                >
                    <motion.div
                        animate={wiggle ? { rotate: [0, 12, -12, 6, 0] } : {}}
                        transition={{ duration: 0.5 }}
                    >
                        <Bell className="h-3.5 w-3.5" />
                    </motion.div>

                    {/* Unread badge */}
                    <AnimatePresence>
                        {unread > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full
                                    bg-gradient-to-br from-violet-600 to-fuchsia-600
                                    text-[9px] font-bold text-white
                                    border border-zinc-950 shadow-sm"
                            >
                                {unread > 9 ? "9+" : unread}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </SheetTrigger>

            {/* ── Drawer ── */}
            <SheetContent
                side="right"
                className="w-[300px] sm:w-[340px] bg-[#0d0d0f] border-l border-zinc-800/60 p-0 flex flex-col"
            >
                {/* Top accent */}
                <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent shrink-0" />

                {/* ── Header ── */}
                <div className="px-5 pt-5 pb-4 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shrink-0">
                                <Bell className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-100 leading-tight">Notifications</p>
                                <p className="text-[11px] text-zinc-600 mt-0.5">
                                    {unread > 0 ? `${unread} unread` : "All caught up"}
                                </p>
                            </div>
                        </div>

                        {/* Mark all read */}
                        <AnimatePresence>
                            {unread > 0 && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={handleMarkAllAsRead}
                                    className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg
                                        border border-zinc-800 bg-zinc-900/60 text-zinc-600
                                        hover:border-violet-500/30 hover:text-violet-400 hover:bg-violet-500/5
                                        text-[11px] font-medium transition-all duration-200"
                                >
                                    <CheckCheck className="h-3 w-3" />
                                    Mark read
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mx-5 border-t border-zinc-800/60 shrink-0" />

                {/* ── Notification list ── */}
                <ScrollArea className="flex-1 px-3 py-3">
                    {notifications.length === 0 ? (
                        /* Empty state */
                        <div className="flex flex-col items-center gap-3 py-16 text-center">
                            <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                <Inbox className="h-6 w-6 text-zinc-700" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-400">All clear</p>
                                <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">
                                    No notifications yet.<br />We&apos;ll let you know when something arrives.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {notifications.map((notification, i) => {
                                const isUnread = notification.status === "UNREAD";
                                const dotColor = DOT_COLORS[i % DOT_COLORS.length];

                                return (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: Math.min(i * 0.04, 0.3),
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                        className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-default
                                            transition-all duration-200
                                            ${isUnread
                                                ? "border border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700/80 hover:bg-zinc-900/80"
                                                : "hover:bg-zinc-900/40"
                                            }`}
                                    >
                                        {/* Left accent bar (unread only) */}
                                        {isUnread && (
                                            <div className={`absolute left-0 top-3 bottom-3 w-[2px] rounded-full ${dotColor} opacity-70`} />
                                        )}

                                        {/* Avatar */}
                                        <div className="relative shrink-0 mt-0.5">
                                            <div className="h-8 w-8 rounded-xl overflow-hidden border border-zinc-800">
                                                <Image
                                                    src={notification.profilePicture}
                                                    alt="Profile"
                                                    width={32}
                                                    height={32}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {isUnread && (
                                                <div className={`absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ${dotColor} border-2 border-zinc-950`} />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <p className={`text-xs leading-snug ${isUnread ? "text-zinc-200 font-medium" : "text-zinc-500"}`}>
                                                {notification.body}
                                            </p>
                                            <span className="flex items-center gap-1 text-[10px] text-zinc-700">
                                                <Clock className="h-2.5 w-2.5" />
                                                {notification.createdAt && timeAgo(notification.createdAt)}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>

                {/* ── Footer ── */}
                {notifications.length > 0 && (
                    <div className="shrink-0 px-5 py-4 border-t border-zinc-800/60">
                        <div className="flex items-center gap-3 text-[10px] text-zinc-700">
                            <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
                            <span>{notifications.length} total</span>
                            <div className="h-px flex-1 bg-gradient-to-l from-zinc-800 to-transparent" />
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default NotificationIcon;