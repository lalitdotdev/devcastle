"use client"

import { AnimatePresence as _AnimatePresence, motion, useScroll, useSpring, useInView } from 'framer-motion';
import { Briefcase, Search } from 'lucide-react';
import { Job } from "@prisma/client";
import { JobListItemWrapper } from "./JobListItem";
import Link from "next/link";
import React, { useRef } from 'react';

const AnimatePresence = _AnimatePresence as any;

interface JobResultsProps {
    jobs: Job[];
}

// Accent colors cycling per item index
const ACCENTS = [
    { dot: 'bg-amber-400',   bar: 'from-amber-500',   glow: 'group-hover:shadow-amber-500/10'   },
    { dot: 'bg-violet-400',  bar: 'from-violet-500',  glow: 'group-hover:shadow-violet-500/10'  },
    { dot: 'bg-cyan-400',    bar: 'from-cyan-500',    glow: 'group-hover:shadow-cyan-500/10'    },
    { dot: 'bg-emerald-400', bar: 'from-emerald-500', glow: 'group-hover:shadow-emerald-500/10' },
    { dot: 'bg-rose-400',    bar: 'from-rose-500',    glow: 'group-hover:shadow-rose-500/10'    },
    { dot: 'bg-fuchsia-400', bar: 'from-fuchsia-500', glow: 'group-hover:shadow-fuchsia-500/10' },
];

// ── Single animated job row ───────────────────────────────────────────────────
function JobRow({ job, index }: { job: Job; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
    const accent = ACCENTS[index % ACCENTS.length];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
                duration: 0.4,
                delay: Math.min(index * 0.05, 0.35),
                ease: [0.22, 1, 0.36, 1],
            }}
            className="relative pl-8"
        >
            {/* Timeline dot */}
            <div className="absolute left-0 top-5 z-10">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: Math.min(index * 0.05, 0.35) + 0.1, duration: 0.25 }}
                    className="h-3 w-3 rounded-full border-2 border-zinc-900 bg-zinc-950 flex items-center justify-center"
                >
                    <div className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                </motion.div>
            </div>

            {/* Card wrapper — hover styles live here so JobListItemWrapper inherits context */}
            <div className={`group relative mb-3 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm hover:border-zinc-700/70 hover:bg-zinc-900/70 hover:shadow-xl ${accent.glow} transition-all duration-300`}>
                {/* Left accent stripe */}
                <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b ${accent.bar} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <Link href={`jobs/${job.slug}`} className="block">
                    <JobListItemWrapper job={job} />
                </Link>
            </div>
        </motion.div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
const JobResults = ({ jobs }: JobResultsProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });
    const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20, restDelta: 0.001 });

    if (jobs.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 py-20 text-center"
            >
                <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Search className="h-6 w-6 text-zinc-600" />
                </div>
                <div>
                    <p className="text-zinc-400 font-medium text-sm">No opportunities found</p>
                    <p className="text-zinc-600 text-xs mt-1">Try adjusting your search filters.</p>
                </div>
            </motion.div>
        );
    }

    return (
        <div ref={containerRef} className="relative">
            {/* ── Vertical timeline track ── */}
            <div className="absolute left-[5px] top-0 bottom-0 w-px pointer-events-none">
                <div className="absolute inset-0 bg-zinc-800/50 rounded-full" />

                {/* Scroll-driven fill */}
                <motion.div
                    className="absolute top-0 left-0 right-0 origin-top rounded-full bg-gradient-to-b from-amber-500 via-violet-500 to-cyan-500"
                    style={{ scaleY }}
                />

                {/* Glowing leading dot */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-3 h-3 -ml-[5px]"
                    style={{ top: scrollYProgress }}
                >
                    <div className="absolute inset-0 rounded-full bg-amber-400 blur-[8px] opacity-80 animate-pulse" />
                    <div className="relative h-full w-full rounded-full bg-white border border-amber-300/60 shadow-lg shadow-amber-500/30" />
                </motion.div>
            </div>

            {/* ── Job rows ── */}
            <AnimatePresence>
                <div className="space-y-1">
                    {jobs.map((job, index) => (
                        <JobRow key={job.id} job={job} index={index} />
                    ))}
                </div>
            </AnimatePresence>

            {/* ── End cap ── */}
            <div className="pl-8 pt-3 pb-4">
                <div className="flex items-center gap-3 text-[11px] text-zinc-700">
                    <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-zinc-800 bg-zinc-900/60">
                        <Briefcase className="h-3 w-3" />
                        {jobs.length} opportunit{jobs.length !== 1 ? 'ies' : 'y'}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-zinc-800 to-transparent" />
                </div>
            </div>
        </div>
    );
};

export default JobResults;