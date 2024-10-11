"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { BellRing } from "lucide-react";
import Image from "next/image";
import { markAllNotificationsAsRead } from "@/lib/launchpad-server-actions/server-actions";
// import { markAllNotificationsAsRead } from "@/lib/server-actions";
import { useState } from "react";

interface NotificationIconProps {
    notifications?: any;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({
    notifications,
}) => {
    const [unreadNotifications, setUnreadNotifications] = useState(
        notifications?.filter(
            (notification: any) => notification.status === "UNREAD"
        ).length || 0
    );

    const [isOpen, setIsOpen] = useState(false)

    const handleIsOpen = () => {
        setIsOpen(!isOpen)
    }
    const allNotifications = notifications;

    const timeAgo = (date: string) => {
        const now = new Date();
        const time = new Date(date);
        const diff = now.getTime() - time.getTime();
        const seconds = diff / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;

        if (seconds < 60) {
            return "Just now";
        } else if (minutes < 60) {
            return `${Math.floor(minutes)}m ago`;
        } else if (hours < 24) {
            return `${Math.floor(hours)}h ago`;
        } else {
            return `${Math.floor(days)}d ago`;
        }
    };


    const handleMarkAllAsRead = async () => {
        try {
            //mark all notifications as read with server action
            await markAllNotificationsAsRead();
            setUnreadNotifications(0);
        } catch (error) {
            console.log(error);
        }

    };

    return (
        <div>
            <Sheet>
                <SheetTrigger >
                    <div className="flex items-center mx-2">
                        <BellRing className="text-emerald-50 " size={28} />
                        {unreadNotifications > 0 && (
                            <div
                                className="absolute ml-3 mb-3 bg-red-500
             text-white rounded-full
             h-4 w-4 flex
             items-center
              justify-center
              text-xs
              "
                            >
                                {unreadNotifications}
                            </div>
                        )}
                    </div>
                </SheetTrigger>
                <SheetContent className="border-l border-zinc-700">
                    <SheetHeader>
                        <SheetTitle className="text-teal-500">Notifications 🔔</SheetTitle>
                        <SheetDescription>
                            View all your notifications here
                        </SheetDescription>
                    </SheetHeader>
                    {unreadNotifications === 0 ? (
                        <>
                            <div className="flex items-center py-16">
                                <h1 className="text-sm text-gray-500">No new notifications</h1>
                            </div>
                        </>
                    ) : (
                        <div className="py-6">
                            <button
                                onClick={handleMarkAllAsRead}

                                className="text-sm text-red-500 hover:underline">
                                Mark all as read
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col gap-y-4">
                        {allNotifications?.map((notification: any) => (
                            <div key={notification.id} className="flex items-center gap-x-4">
                                <Image
                                    priority
                                    src={notification.profilePicture}
                                    alt="profile picture"
                                    width={50}
                                    height={50}
                                    className="rounded-full h-8 w-8"
                                />
                                {notification.status === "UNREAD" ? (
                                    <div>
                                        <p className="text-xs text-zinc-300">
                                            {notification.createdAt &&
                                                timeAgo(notification.createdAt)}
                                        </p>
                                        <h1 className="text-sm font-medium text-emerald-200">{notification.body}</h1>
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground">
                                        <p className="text-xs text-gray-500">
                                            {notification.createdAt &&
                                                timeAgo(notification.createdAt)}
                                        </p>
                                        <h1 className="text-sm text-gray-500">
                                            {notification.body}
                                        </h1>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default NotificationIcon;
