"use client";

import { Briefcase, LucideIcon, MessageSquare, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence as _AP, LayoutGroup } from "framer-motion";


const AnimatePresence = _AP as any;




type Tab = {
    title: string;
    value: string;
    icon?: LucideIcon | React.ReactNode;
    content?: string | React.ReactNode | any;
};

const defaultIcons: Record<string, LucideIcon> = {
    discussions:  MessageSquare,
    opportunities: Briefcase,
    showcases:    Rocket,
};

export const HomeFeedTabs = ({
    tabs: propTabs,
    containerClassName,
    activeTabClassName,
    tabClassName,
    contentClassName,
}: {
    tabs: Tab[];
    containerClassName?: string;
    activeTabClassName?: string;
    tabClassName?: string;
    contentClassName?: string;
}) => {
    const tabs = propTabs.map(tab => ({
        ...tab,
        icon: tab.icon ?? defaultIcons[tab.value],
    }));

    const [active, setActive] = useState<Tab>(tabs[0]);

    return (
        <div className="w-full">
            {/* ── Tab strip ── */}
            <LayoutGroup id="feed-tabs">

            <div className={cn(
                "relative flex items-center gap-1 p-1 rounded-2xl",
                "bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm",
                containerClassName
            )}>
                {tabs.map((tab) => {
                    const isActive = active.value === tab.value;
                    // Resolve icon — could be a LucideIcon constructor or ReactNode
                    const Icon = typeof tab.icon === 'function' ? tab.icon as LucideIcon : null;
                    const iconNode = Icon
                        ? <Icon className={cn("h-3.5 w-3.5 transition-colors", isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300")} />
                        : tab.icon as React.ReactNode;

                    return (
                        <button
                            key={tab.value}
                            onClick={() => setActive(tab)}
                            className={cn(
                                "group relative flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-xl",
                                "text-xs font-semibold tracking-wide transition-colors duration-200",
                                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-200",
                                tabClassName
                            )}
                        >
                            {/* Active pill */}
                            {isActive && (
                                <AnimatePresence mode="wait">

                                <motion.div
                                    layoutId="active-feed-tab"
                                    className={cn(
                                        "absolute inset-0 rounded-xl",
                                        "bg-zinc-800 border border-zinc-700/60",
                                        "shadow-sm",
                                        activeTabClassName
                                    )}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                                />
                                </AnimatePresence>

                            )}

                            <span className="relative flex items-center gap-2">
                                {iconNode}
                                <span className="whitespace-nowrap">{tab.title}</span>
                            </span>
                        </button>
                    );
                })}
            </div>

            </LayoutGroup>

            {/* ── Active content ── */}
            <div className={cn("relative mt-5 w-full", contentClassName)}>
                <motion.div
                    key={active.value}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                    {active.content}
                </motion.div>
            </div>
        </div>
    );
};