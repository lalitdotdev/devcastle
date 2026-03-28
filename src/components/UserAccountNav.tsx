"use client";

import { Activity, ArrowUpWideNarrow, BookOpen, Briefcase, Compass, Crown, FilePlus, Heart, HeartHandshake, HelpingHand, Newspaper, Package, Rocket, Settings, UserCog, User as UserIcon } from "lucide-react";
import { Github, Library } from "lucide-react";
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetTrigger } from "./ui/sheet";

import { FC } from "react";
import { Icons } from "./Icons";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { User } from "next-auth";
import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface UserAccountNavProps {
    user: Pick<User, "name" | "image" | "email">;
    username: string | null | undefined;
    isUserPremium: boolean;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user, username, isUserPremium }) => {
    const [open, setOpen] = useState(false);

    const handleLinkClick = () => {
        setOpen(false);
    };

    return (
        <div className="flex-shrink-0 md:block md:flex-shrink-0 md:items-center gap-4 justify-center items-center ml-2">

            <div className="text-gray-200 mr-4">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <div className="flex items-center justify-center p-1 rounded-lg transition-all duration-300 ease-in-out cursor-pointer  ">


                            <div className="relative flex items-center mr-3 border rounded-xl border-zinc-800 py-2 px-2">

                                <UserAvatar
                                    className="md:h-10 md:w-10 h-7 w-7 "
                                    user={{
                                        name: user.name || null,
                                        image: user.image || undefined,
                                    }}
                                />


                            </div>

                        </div>
                    </SheetTrigger>
                    <SheetContent className="w-[240px] md:w-[400px] bg-[#1B1F23] text-gray-200 border border-gray-600 rounded-l-2xl p-0 flex flex-col h-full data-[state=closed]:animate-out overflow-hidden">
                        <div className="flex flex-col h-full w-full">
                            {/* Scrollable middle section */}
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                <div className="space-y-[2.2px] md:space-y-1">
                                    {/* Navigation links */}
                                    {[
                                        { href: `/u/${username}`, icon: UserIcon, label: "Your Profile" },
                                        { href: "/dashboard", icon: UserCog, label: "Dashboard" },
                                        { href: "/feed", icon: Activity, label: "Your Feed" },
                                        { href: "/launchpad/new-product", icon: Icons.rabbit, label: "Submit a Product" },
                                        { href: "/launchpad/my-products", icon: Package, label: "My Products" },
                                        { href: "/launchpad/my-upvoted", icon: Heart, label: "Your Upvoted Products" },
                                        { href: "/launchpad/settings", icon: Settings, label: "Settings" },
                                        { href: "/network", icon: HeartHandshake, label: "Professional Network" },
                                        { href: "/jobs/new", icon: FilePlus, label: "Post an Opportunity" },
                                        { href: "/opportunities", icon: Compass, label: "Browse Opportunities" },
                                        { href: "/feed/blogs", icon: Library, label: "Free Resources and Tools" },
                                        { href: "/launchpad", icon: Rocket, label: "Creator Launchpad" },
                                        { href: "/startups/catalog/feeds", icon: BookOpen, label: "Feed Reader / startup catalog" },
                                        { href: "/startups/catalog/workatstartups", icon: Briefcase, label: "Work At Startups" },
                                        { href: "/startups/catalog/jobstimeline", icon: Activity, label: "Jobs Timeline" },
                                        {
                                            href: "/startups/catalog/crunchbase-feed",
                                            icon: Compass,
                                            label: "Crunchbase Feed"
                                        },
                                        { href: "/startups/catalog/topstories", icon: ArrowUpWideNarrow, label: "Top Stories" },
                                        { href: "/startups/catalog/phfeed", icon: Newspaper, label: "Feed Importer(Product Hunt)" },
                                    ].map((item, index) => (
                                        <React.Fragment key={item.href}>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center p-2 rounded-md transition-all duration-300 ease-in-out gap-2 hover:bg-zinc-800"
                                                )}
                                                onClick={handleLinkClick}
                                            >
                                                <item.icon size={22} />
                                                <span>{item.label}</span>
                                            </Link>

                                            {index === 2 || index === 6 || index === 9 ? (
                                                <Separator className="bg-gray-700 my-4" />
                                            ) : null}
                                            {index === 2 && (
                                                <SheetDescription className="text-xs my-2 px-2">
                                                    Launchpad Section
                                                </SheetDescription>
                                            )}
                                            {(index === 6 || index === 9) ? (
                                                <SheetDescription className="text-xs my-2 px-2">
                                                    {index === 6 ? "Professional Connections and get Mentorship" : "Catalog and Archives to get you inspired"}
                                                </SheetDescription>
                                            ) : null}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* Pinned Bottom Section */}
                            <div className="flex-shrink-0">
                                <Separator className="bg-gray-700" />
                                <div className="p-4 bg-zinc-900/80 backdrop-blur-sm">
                                    <div className="flex flex-col w-full gap-4">
                                        <div className="flex items-center justify-between w-full">
                                            <div
                                                className="cursor-pointer hover:text-white transition-colors font-medium"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    setOpen(false);
                                                    signOut({
                                                        callbackUrl: `${window.location.origin}/`,
                                                    });
                                                }}
                                            >
                                                Sign Out
                                            </div>
                                            {isUserPremium ? (
                                                <div className="flex items-center gap-2 w-fit">
                                                    <Crown size={22} className="text-yellow-400" />
                                                    <span className="text-xs font-semibold">Premium</span>
                                                </div>
                                            ) : (
                                                <Link
                                                    href="/premium"
                                                    onClick={handleLinkClick}
                                                    className="flex items-center gap-2 p-1.5 px-3 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors text-xs font-bold"
                                                >
                                                    <Rocket size={18} />
                                                    <span>Upgrade</span>
                                                </Link>
                                            )}
                                        </div>
                                        <div className="flex gap-4 items-center justify-start border-t border-gray-800 pt-3">
                                            <Link
                                                href="https://github.com/lalitdotdev/devcastle"
                                                target="_blank"
                                                className="text-gray-400 hover:text-white transition-colors"
                                                onClick={handleLinkClick}
                                            >
                                                <Github size={20} />
                                            </Link>
                                            <Link
                                                href="/feedback"
                                                className="text-gray-400 hover:text-white transition-colors"
                                                onClick={handleLinkClick}
                                            >
                                                <HelpingHand size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div >
    );
};

export default UserAccountNav;
