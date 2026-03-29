"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import UniversalFeedItem, { UniversalFeedItemProps } from "./FeedItem";

interface FeedListProps {
    items: UniversalFeedItemProps[];
}

/**
 * FeedList
 *
 * Renders a vertical animated timeline with:
 * - A scroll-progress bar (left edge of the container) that fills as you scroll through items
 * - Each item revealed via scroll-triggered entrance (handled inside FeedItem via useInView)
 * - A glowing dot pulse at the leading edge of the progress bar
 */
export default function FeedList({ items }: FeedListProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress within this container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Smooth spring for the fill bar
    const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20, restDelta: 0.001 });

    if (!items || items.length === 0) return null;

    return (
        <div ref={containerRef} className="relative">
            {/* ── Vertical timeline track ── */}
            <div className="absolute left-[5px] top-0 bottom-0 w-px">
                {/* Track background */}
                <div className="absolute inset-0 bg-zinc-800/60 rounded-full" />

                {/* Scroll-driven fill */}
                <motion.div
                    className="absolute top-0 left-0 right-0 origin-top rounded-full bg-gradient-to-b from-violet-500 via-fuchsia-500 to-cyan-500"
                    style={{ scaleY }}
                />

                {/* Glowing leading dot — rides with scroll progress */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 -ml-[4px]"
                    style={{ top: scrollYProgress }}
                >
                    {/* Outer glow */}
                    <div className="absolute inset-0 rounded-full bg-violet-400 blur-[6px] opacity-70 animate-pulse" />
                    {/* Inner dot */}
                    <div className="relative h-full w-full rounded-full bg-white border border-violet-300/60 shadow-lg" />
                </motion.div>
            </div>

            {/* ── Feed items ── */}
            <div className="space-y-1">
                {items.map((item, i) => (
                    <UniversalFeedItem
                        key={item.link ?? item.title + i}
                        {...item}
                        index={i}
                    />
                ))}
            </div>

            {/* ── End cap ── */}
            <div className="pl-8 pt-2 pb-4">
                <div className="flex items-center gap-2 text-[11px] text-zinc-700">
                    <div className="h-px flex-1 bg-zinc-800" />
                    <span>{items.length} articles</span>
                    <div className="h-px flex-1 bg-zinc-800" />
                </div>
            </div>
        </div>
    );
}