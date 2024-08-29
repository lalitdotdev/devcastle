"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

type Tab = {
    title: string;
    value: string;
    content?: string | React.ReactNode | any;
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
    const [active, setActive] = useState<Tab>(propTabs[0]);
    const [hovering, setHovering] = useState(false);

    return (
        <>
            <div
                className={cn(
                    "flex flex-row items-center justify-start  relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-fit border border-white/10 md:p-2 p-1 rounded-full tracking-tighter ",
                    containerClassName
                )}
            >
                {propTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActive(tab)}
                        onMouseEnter={() => setHovering(true)}
                        style={{
                            transformStyle: "preserve-3d",
                        }}
                        onMouseLeave={() => setHovering(false)}
                        className={cn(
                            "relative px-2 py-1 rounded-full",
                            tabClassName,
                            active.value === tab.value && activeTabClassName
                        )}
                    >
                        {active.value === tab.value && (
                            <motion.div
                                layoutId="clickedbutton"
                                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                className={cn(
                                    "absolute inset-0 bg-gradient-to-br from-purple-700 to-violet-900 rounded-full"
                                )}
                            />
                        )}
                        <span className="relative block text-white dark:text-white text-sm">
                            {tab.title}
                        </span>
                    </button>
                ))}
            </div>
            <FadeInDiv
                active={active}
                className={cn("mt-10", contentClassName)}
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
                layoutId={active.value}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={cn("w-full", className)}
            >
                {active.content}
            </motion.div>
        </div>
    );
};
