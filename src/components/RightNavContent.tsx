"use client";

import {
    Backpack, BrainCog, Feather, Plus, Rocket, Terminal, Sparkles,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MembershipModal from "./modals/upgrade-membership-modal";
import UpgradeMembership from "./launchpad/upgrade-membership";
import { cn } from "@/lib/utils";
import { isUserPremium } from "@/lib/launchpad-server-actions/server-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RightNavContentProps {
    products?: any;
    authenticatedUser?: any;
}

// ── Menu items config ─────────────────────────────────────────────────────────
const ITEMS = [
    {
        group: "Create",
        entries: [
            {
                href: "/cb/create",
                icon: Plus,
                label: "New Castle",
                shortcut: "⌘N",
                accent: "text-violet-400 bg-violet-500/10 group-hover:bg-violet-500/20",
                desc: "Start a community",
            },
            {
                href: "/articles/publish",
                icon: Feather,
                label: "New Article",
                shortcut: "⌘E",
                accent: "text-cyan-400 bg-cyan-500/10 group-hover:bg-cyan-500/20",
                desc: "Write & publish",
            },
            {
                href: "/courses/new",
                icon: BrainCog,
                label: "New Thought",
                shortcut: "⌘T",
                accent: "text-fuchsia-400 bg-fuchsia-500/10 group-hover:bg-fuchsia-500/20",
                desc: "Share an idea",
            },
        ],
    },
    {
        group: "Launch",
        entries: [
            {
                href: null,        // handled by handleClick
                icon: Rocket,
                label: "New Product",
                shortcut: "⌘P",
                accent: "text-orange-400 bg-orange-500/10 group-hover:bg-orange-500/20",
                desc: "Submit to Launchpad",
                action: true,
            },
            {
                href: "/jobs/new",
                icon: Backpack,
                label: "Post a Job",
                shortcut: "⌘J",
                accent: "text-emerald-400 bg-emerald-500/10 group-hover:bg-emerald-500/20",
                desc: "Hire the community",
            },
        ],
    },
];

// ── Row component ─────────────────────────────────────────────────────────────
function MenuRow({
    icon: Icon,
    label,
    shortcut,
    accent,
    desc,
}: {
    icon: any;
    label: string;
    shortcut: string;
    accent: string;
    desc: string;
}) {
    return (
        <span className="group flex items-center gap-3 w-full px-2.5 py-2 rounded-xl hover:bg-zinc-800/60 transition-all duration-150 cursor-pointer">
            <span className={cn("flex items-center justify-center h-7 w-7 rounded-lg transition-colors duration-150 shrink-0", accent)}>
                <Icon className="h-3.5 w-3.5" />
            </span>
            <span className="flex-1 min-w-0">
                <span className="block text-xs font-medium text-zinc-300 group-hover:text-white transition-colors leading-tight">
                    {label}
                </span>
                <span className="block text-[10px] text-zinc-600 mt-0.5">{desc}</span>
            </span>
            <span className="shrink-0 text-[10px] font-mono text-zinc-700 group-hover:text-zinc-500 transition-colors">
                {shortcut}
            </span>
        </span>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
const RightNavContent = ({ products, authenticatedUser }: RightNavContentProps) => {
    const router = useRouter();
    const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);
    const [open, setOpen] = useState(false);

    const handleProductClick = async () => {
        const isPremium = await isUserPremium();
        if (!isPremium && products?.length === 2) {
            setIsUpgradeModalVisible(true);
        } else {
            setOpen(false);
            router.push("/launchpad/new-product");
        }
    };

    return (
        <div className="flex items-center">
            <DropdownMenu open={open} onOpenChange={setOpen}>
                {/* ── Trigger ── */}
                <DropdownMenuTrigger asChild>
                    <button
                        aria-label="Create new"
                        className={cn(
                            "group relative flex items-center gap-1.5 h-8 px-3 rounded-lg",
                            "border border-zinc-800 bg-zinc-900/60",
                            "hover:border-zinc-700 hover:bg-zinc-800/80",
                            "transition-all duration-200",
                            open && "border-violet-500/40 bg-violet-500/5"
                        )}
                    >
                        <Terminal className={cn("h-3.5 w-3.5 transition-colors duration-200", open ? "text-violet-400" : "text-zinc-600 group-hover:text-zinc-300")} />
                        <Plus className={cn("h-3 w-3 transition-colors duration-200", open ? "text-violet-400" : "text-zinc-600 group-hover:text-zinc-300")} />
                        {/* Subtle glow when open */}
                        {open && (
                            <span className="absolute inset-0 rounded-lg bg-violet-500/10 pointer-events-none" />
                        )}
                    </button>
                </DropdownMenuTrigger>

                {/* ── Content ── */}
                <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-64 bg-[#111113] border border-zinc-800 rounded-2xl p-2 shadow-2xl shadow-black/60"
                >
                    {/* Header */}
                    <div className="px-2.5 pt-1.5 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center h-5 w-5 rounded-md bg-gradient-to-br from-violet-600 to-fuchsia-600">
                                <Sparkles className="h-2.5 w-2.5 text-white" />
                            </div>
                            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                                Create
                            </span>
                        </div>
                    </div>

                    {ITEMS.map((group, gi) => (
                        <div key={group.group}>
                            {gi > 0 && (
                                <>
                                    <DropdownMenuSeparator className="bg-zinc-800/60 my-1.5" />
                                    <div className="px-2.5 py-1.5">
                                        <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
                                            {group.group}
                                        </span>
                                    </div>
                                </>
                            )}

                            {group.entries.map((item) =>
                                item.action ? (
                                    // Product button — needs click handler
                                    <DropdownMenuItem key={item.label} asChild onSelect={(e) => e.preventDefault()}>
                                        <button
                                            onClick={handleProductClick}
                                            className="w-full text-left focus:outline-none"
                                        >
                                            <MenuRow
                                                icon={item.icon}
                                                label={item.label}
                                                shortcut={item.shortcut}
                                                accent={item.accent}
                                                desc={item.desc}
                                            />
                                            <MembershipModal
                                                visible={isUpgradeModalVisible}
                                                setVisible={setIsUpgradeModalVisible}
                                            >
                                                <UpgradeMembership authenticatedUser={authenticatedUser} />
                                            </MembershipModal>
                                        </button>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem key={item.label} asChild>
                                        <Link href={item.href!} className="block focus:outline-none">
                                            <MenuRow
                                                icon={item.icon}
                                                label={item.label}
                                                shortcut={item.shortcut}
                                                accent={item.accent}
                                                desc={item.desc}
                                            />
                                        </Link>
                                    </DropdownMenuItem>
                                )
                            )}
                        </div>
                    ))}

                    {/* Footer hint */}
                    <div className="mx-2.5 mt-3 pt-2.5 border-t border-zinc-800/60">
                        <p className="text-[10px] text-zinc-700 text-center">
                            Use keyboard shortcuts to create faster
                        </p>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default RightNavContent;