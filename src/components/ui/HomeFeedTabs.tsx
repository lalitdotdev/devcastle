"use client";

import { Briefcase, LucideIcon, MessageSquare, Rocket } from "lucide-react";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

type Tab = {
    title: string;
    value: string;
    icon?: LucideIcon;
    content?: string | React.ReactNode | any;
};

const defaultTabs: Tab[] = [
    {
        title: "Discussions",
        value: "discussions",
        icon: MessageSquare
    },
    {
        title: "Opportunities",
        value: "opportunities",
        icon: Briefcase
    },
    {
        title: "Showcases",
        value: "showcases",
        icon: Rocket
    }
];

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
    // Merge default icons with provided tabs
    const tabs = propTabs.map(tab => ({
        ...tab,
        icon: tab.icon || defaultTabs.find(t => t.value === tab.value)?.icon
    }));

    const [active, setActive] = useState<Tab>(tabs[0]);
    const [hovering, setHovering] = useState(false);

    return (
        <>
            <div
                className={cn(
                    "flex flex-row items-center justify-start relative overflow-auto scrollbar-hide",
                    "bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-2",
                    "shadow-lg shadow-purple-900/20",
                    containerClassName
                )}
            >
                <div className="flex gap-2 p-1 w-full">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = active.value === tab.value;

                        return (
                            <button
                                key={tab.value}
                                onClick={() => setActive(tab)}
                                onMouseEnter={() => setHovering(true)}
                                onMouseLeave={() => setHovering(false)}
                                className={cn(
                                    "relative flex items-center gap-2 px-4 py-2 rounded-xl flex-1",
                                    "text-sm font-medium transition-all duration-200",
                                    "text-white",
                                    !isActive && "text-zinc-400",
                                    tabClassName
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-tab"
                                        className={cn(
                                            "absolute inset-0 rounded-xl",
                                            "bg-gradient-to-br from-purple-700/80 to-violet-900/80",
                                            "border border-purple-500/20",
                                            "shadow-lg shadow-purple-900/20",
                                            activeTabClassName
                                        )}
                                        transition={{
                                            type: "spring",
                                            bounce: 0.25,
                                            duration: 0.5
                                        }}
                                    />
                                )}

                                <span className="relative flex items-center gap-2">
                                    {Icon && (
                                        <Icon
                                            className={cn(
                                                "w-4 h-4 transition-colors",
                                                isActive ? "text-white" : "text-zinc-400"
                                            )}
                                        />
                                    )}
                                    <span className="relative whitespace-nowrap">{tab.title}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <FadeInDiv
                active={active}
                className={cn("mt-6", contentClassName)}
            />
        </>
    );
};

export const FadeInDiv = ({
    className,
    active,
}: {
    className?: string;
    active: Tab;
}) => {
    return (
        <div className="relative w-full">
            <motion.div
                key={active.value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut"
                }}
                className={cn("w-full", className)}
            >
                {active.content}
            </motion.div>
        </div>
    );
};
