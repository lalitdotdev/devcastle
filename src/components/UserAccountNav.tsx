"use client";

import {
    Activity, ArrowUpWideNarrow, BookOpen, Briefcase, Compass,
    Crown, FilePlus, Github, Heart, HeartHandshake, HelpingHand,
    Library, LogOut, Newspaper, Package, Rocket, Settings,
    UserCog, User as UserIcon,
} from "lucide-react";
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { FC } from "react";
import { Icons } from "./Icons";
import Link from "next/link";
import { User } from "next-auth";
import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface UserAccountNavProps {
    user: Pick<User, "name" | "image" | "email">;
    username: string | null | undefined;
    isUserPremium: boolean;
}

// ── Nav sections ──────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
    {
        label: "Account",
        items: [
            { href: (u: string) => `/u/${u}`, icon: UserIcon,       label: "Your Profile"    },
            { href: () => "/dashboard",        icon: UserCog,        label: "Dashboard"       },
            { href: () => "/feed",             icon: Activity,       label: "Your Feed"       },
        ],
    },
    {
        label: "Launchpad",
        items: [
            { href: () => "/launchpad/new-product", icon: Icons.rabbit, label: "Submit a Product"       },
            { href: () => "/launchpad/my-products",  icon: Package,      label: "My Products"            },
            { href: () => "/launchpad/my-upvoted",   icon: Heart,        label: "Upvoted Products"       },
            { href: () => "/launchpad",              icon: Rocket,       label: "Creator Launchpad"      },
            { href: () => "/launchpad/settings",     icon: Settings,     label: "Settings"               },
        ],
    },
    {
        label: "Network & Opportunities",
        items: [
            { href: () => "/network",         icon: HeartHandshake, label: "Professional Network"  },
            { href: () => "/jobs/new",        icon: FilePlus,       label: "Post an Opportunity"   },
            { href: () => "/opportunities",   icon: Compass,        label: "Browse Opportunities"  },
        ],
    },
    {
        label: "Catalog & Resources",
        items: [
            { href: () => "/feed/blogs",                           icon: Library,            label: "Resources & Tools"          },
            { href: () => "/startups/catalog/feeds",               icon: BookOpen,           label: "Feed Reader"                },
            { href: () => "/startups/catalog/workatstartups",      icon: Briefcase,          label: "Work At Startups"           },
            { href: () => "/startups/catalog/jobstimeline",        icon: Activity,           label: "Jobs Timeline"              },
            { href: () => "/startups/catalog/crunchbase-feed",     icon: Compass,            label: "Crunchbase Feed"            },
            { href: () => "/startups/catalog/topstories",          icon: ArrowUpWideNarrow,  label: "Top Stories"                },
            { href: () => "/startups/catalog/phfeed",              icon: Newspaper,          label: "Product Hunt Feed"          },
        ],
    },
];

// ── Accent dot per section ────────────────────────────────────────────────────
const SECTION_ACCENTS = [
    "bg-violet-400",
    "bg-orange-400",
    "bg-emerald-400",
    "bg-cyan-400",
];

const UserAccountNav: FC<UserAccountNavProps> = ({ user, username, isUserPremium }) => {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* ── Trigger ── */}
            <SheetTrigger asChild>
                <button
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl border border-zinc-800/60 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-200"
                    aria-label="Open account menu"
                >
                    <UserAvatar
                        className="h-6 w-6 md:h-7 md:w-7 rounded-lg"
                        user={{ name: user.name || null, image: user.image || undefined }}
                    />
                    {/* Premium crown dot */}
                    {isUserPremium && (
                        <Crown className="h-3 w-3 text-yellow-400 shrink-0" />
                    )}
                </button>
            </SheetTrigger>

            {/* ── Drawer ── */}
            <SheetContent
                className="w-[280px] md:w-[320px] bg-[#0d0d0f] border-l border-zinc-800/60 p-0 flex flex-col"
                side="right"
            >
                {/* Top accent line */}
                <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent shrink-0" />

                {/* ── User header ── */}
                <div className="px-4 pt-5 pb-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <UserAvatar
                                className="h-10 w-10 rounded-xl border border-zinc-800"
                                user={{ name: user.name || null, image: user.image || undefined }}
                            />
                            {isUserPremium && (
                                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                                    <Crown className="h-2.5 w-2.5 text-yellow-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-100 truncate">
                                {user.name ?? "Anonymous"}
                            </p>
                            <p className="text-[11px] text-zinc-600 truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Premium / Upgrade pill */}
                    {isUserPremium ? (
                        <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                            <Crown className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                            <span className="text-[11px] font-semibold text-yellow-400">Premium member</span>
                        </div>
                    ) : (
                        <Link
                            href="/premium"
                            onClick={close}
                            className="mt-3 flex items-center justify-center gap-2 w-full py-2 rounded-xl
                                bg-gradient-to-r from-violet-600 to-fuchsia-600
                                hover:from-violet-500 hover:to-fuchsia-500
                                text-white text-xs font-semibold
                                shadow-lg shadow-violet-900/30
                                transition-all duration-200"
                        >
                            <Rocket className="h-3.5 w-3.5" />
                            Upgrade to Premium
                        </Link>
                    )}
                </div>

                <div className="mx-4 border-t border-zinc-800/60 shrink-0" />

                {/* ── Scrollable nav ── */}
                <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5 custom-scrollbar">
                    {NAV_SECTIONS.map((section, si) => (
                        <div key={section.label}>
                            {/* Section label */}
                            <div className="flex items-center gap-2 px-2 mb-1.5">
                                <div className={`h-1.5 w-1.5 rounded-full ${SECTION_ACCENTS[si]}`} />
                                <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
                                    {section.label}
                                </span>
                            </div>

                            {/* Items */}
                            <div className="space-y-0.5">
                                {section.items.map((item) => {
                                    const href = item.href(username ?? "");
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={href}
                                            href={href}
                                            onClick={close}
                                            className={cn(
                                                "group flex items-center gap-3 px-2.5 py-2 rounded-xl",
                                                "text-xs text-zinc-500 hover:text-zinc-200",
                                                "hover:bg-zinc-800/60 transition-all duration-150"
                                            )}
                                        >
                                            <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Pinned footer ── */}
                <div className="shrink-0">
                    <div className="mx-4 border-t border-zinc-800/60" />
                    <div className="px-4 py-4 space-y-3">
                        {/* External links */}
                        <div className="flex items-center gap-2">
                            <Link
                                href="https://github.com/lalitdotdev/devcastle"
                                target="_blank"
                                onClick={close}
                                className="flex items-center justify-center h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-600 hover:text-zinc-200 hover:border-zinc-700 transition-all duration-200"
                                aria-label="GitHub"
                            >
                                <Github className="h-3.5 w-3.5" />
                            </Link>
                            <Link
                                href="/feedback"
                                onClick={close}
                                className="flex items-center justify-center h-8 w-8 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-600 hover:text-zinc-200 hover:border-zinc-700 transition-all duration-200"
                                aria-label="Feedback"
                            >
                                <HelpingHand className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {/* Sign out */}
                        <button
                            onClick={() => {
                                close();
                                signOut({ callbackUrl: `${window.location.origin}/` });
                            }}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl border border-zinc-800/60 bg-zinc-900/40 text-xs font-medium text-zinc-500 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all duration-200"
                        >
                            <LogOut className="h-3.5 w-3.5 shrink-0" />
                            Sign out
                        </button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default UserAccountNav;