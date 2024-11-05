"use client"

import { BellRing, CheckCircle, Clock } from "lucide-react";
import React, { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { markAllNotificationsAsRead } from "@/lib/launchpad-server-actions/server-actions";

interface NotificationIconProps {
    notifications?: any[];
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ notifications = [] }) => {
    const [unreadNotifications, setUnreadNotifications] = useState(
        notifications.filter((notification) => notification.status === "UNREAD").length
    );
    const [isOpen, setIsOpen] = useState(false);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimate(prev => !prev);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const timeAgo = (date: string) => {
        const now = new Date();
        const time = new Date(date);
        const diff = now.getTime() - time.getTime();
        const seconds = diff / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;

        if (seconds < 60) return "Just now";
        if (minutes < 60) return `${Math.floor(minutes)}m ago`;
        if (hours < 24) return `${Math.floor(hours)}h ago`;
        return `${Math.floor(days)}d ago`;
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setUnreadNotifications(0);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <TooltipProvider>
            <Sheet onOpenChange={setIsOpen}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`
                                    relative group
                                    hover:bg-zinc-800/50
                                    transition-all duration-300
                                    ${isOpen ? 'bg-zinc-800/50' : ''}
                                `}
                            >
                                <div className={`
                                    relative
                                    ${unreadNotifications > 0 && animate ? 'animate-wiggle' : ''}
                                `}>
                                    <BellRing className={`
                                        h-6 w-6
                                        transition-all duration-300
                                        ${isOpen ? 'text-teal-400' : 'text-zinc-200'}
                                        group-hover:text-teal-400
                                    `} />
                                    {unreadNotifications > 0 && (
                                        <Badge
                                            className={`
                                                absolute -top-1 -right-1
                                                h-5 w-5
                                                flex items-center justify-center
                                                p-0
                                                bg-gradient-to-r from-red-500 to-red-600
                                                shadow-lg shadow-red-500/20
                                                border border-red-400/20
                                                transition-transform duration-300
                                                group-hover:scale-110
                                            `}
                                        >
                                            {unreadNotifications}
                                        </Badge>
                                    )}
                                </div>
                            </Button>
                        </SheetTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>View notifications</p>
                    </TooltipContent>
                </Tooltip>

                <SheetContent
                    className="w-80 sm:w-96 border-l border-zinc-800 bg-zinc-900 /95 backdrop-blur-sm"
                >
                    <SheetHeader className="pb-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <SheetTitle className="text-zinc-100 flex items-center gap-2">
                                <BellRing className="h-5 w-5 text-teal-500" />
                                Notifications
                                {unreadNotifications > 0 && (
                                    <Badge variant="default" className="bg-zinc-800">
                                        {unreadNotifications} new
                                    </Badge>
                                )}
                            </SheetTitle>

                        </div>
                        <SheetDescription className="text-zinc-400">
                            Stay updated with your latest activity
                        </SheetDescription>
                    </SheetHeader>

                    {unreadNotifications > 0 && (
                        <div className="relative mb-4">
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent rounded-lg blur-lg" />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleMarkAllAsRead}
                                className="w-full relative bg-zinc-900/50 border border-zinc-800 text-teal-400 hover:text-teal-300 hover:bg-zinc-800/50"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark all as read
                            </Button>
                        </div>
                    )}

                    <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
                        {notifications?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-zinc-500">
                                <div className="relative p-4 rounded-full bg-zinc-800/50 mb-4">
                                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-zinc-500/10 rounded-full blur-xl" />
                                    <BellRing className="h-8 w-8 text-zinc-400 relative" />
                                </div>
                                <p className="font-medium">No notifications yet</p>
                                <p className="text-sm text-zinc-600">We&apos;ll notify you when something arrives</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notifications?.map((notification, index) => (
                                    <div
                                        key={notification.id}
                                        className={`
                                            group
                                            p-4 rounded-lg
                                            transition-all duration-300
                                            hover:translate-x-1
                                            ${notification.status === "UNREAD"
                                                ? 'bg-gradient-to-r from-zinc-800/80 to-zinc-800/40 border border-zinc-700/50'
                                                : 'bg-zinc-900/30 hover:bg-zinc-800/30'
                                            }
                                        `}
                                        style={{
                                            animation: `fadeIn 0.5s ease-out ${index * 0.1}s`
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="relative">
                                                <Image
                                                    src={notification.profilePicture}
                                                    alt="Profile"
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full h-10 w-10 object-cover ring-2 ring-zinc-800 group-hover:ring-teal-500/30 transition-all duration-300"
                                                />
                                                {notification.status === "UNREAD" && (
                                                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-teal-500 rounded-full ring-2 ring-zinc-900" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`
                                                    text-sm mb-1
                                                    ${notification.status === "UNREAD"
                                                        ? 'text-zinc-100 font-medium'
                                                        : 'text-zinc-400'
                                                    }
                                                `}>
                                                    {notification.body}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                    <Clock className="h-3 w-3" />
                                                    {notification.createdAt && timeAgo(notification.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>

                    <style jsx global>{`
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        @keyframes wiggle {
                            0% { transform: rotate(0deg); }
                            25% { transform: rotate(10deg); }
                            50% { transform: rotate(-10deg); }
                            75% { transform: rotate(5deg); }
                            100% { transform: rotate(0deg); }
                        }
                        .animate-wiggle {
                            animation: wiggle 0.5s ease-in-out;
                        }
                    `}</style>
                </SheetContent>
            </Sheet>
        </TooltipProvider>
    );
};

export default NotificationIcon;
