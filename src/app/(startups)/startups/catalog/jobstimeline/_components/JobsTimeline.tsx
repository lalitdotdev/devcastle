"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useSpring, useInView, useTransform } from "framer-motion";
import { ArrowUpRight, Calendar, ChevronDown, Star, User, ExternalLink, Newspaper } from 'lucide-react';
import Link from 'next/link';

interface Story {
    id: number;
    title: string;
    url: string;
    by: string;
    time: number;
    score: number;
}

const PAGE_SIZE = 25;

// Accent colors cycling deterministically
const ACCENTS = [
    { dot: 'bg-orange-400',  bar: 'from-orange-500',  glow: 'group-hover:shadow-orange-500/10',  tag: 'bg-orange-500/10 text-orange-300 border-orange-500/20'  },
    { dot: 'bg-violet-400',  bar: 'from-violet-500',  glow: 'group-hover:shadow-violet-500/10',  tag: 'bg-violet-500/10 text-violet-300 border-violet-500/20'  },
    { dot: 'bg-cyan-400',    bar: 'from-cyan-500',    glow: 'group-hover:shadow-cyan-500/10',    tag: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'        },
    { dot: 'bg-emerald-400', bar: 'from-emerald-500', glow: 'group-hover:shadow-emerald-500/10', tag: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'},
    { dot: 'bg-rose-400',    bar: 'from-rose-500',    glow: 'group-hover:shadow-rose-500/10',    tag: 'bg-rose-500/10 text-rose-300 border-rose-500/20'        },
    { dot: 'bg-amber-400',   bar: 'from-amber-500',   glow: 'group-hover:shadow-amber-500/10',   tag: 'bg-amber-500/10 text-amber-300 border-amber-500/20'     },
];

// ── Skeleton ──────────────────────────────────────────────────────────────────
function StorySkeletons() {
    return (
        <div className="pl-8 space-y-3 mt-3">
            {Array(4).fill(0).map((_, i) => (
                <div
                    key={i}
                    className="p-5 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 animate-pulse"
                    style={{ animationDelay: `${i * 70}ms` }}
                >
                    <div className="h-4 bg-zinc-800 rounded-full w-3/4 mb-3" />
                    <div className="flex gap-4">
                        <div className="h-3 bg-zinc-800/70 rounded-full w-20" />
                        <div className="h-3 bg-zinc-800/50 rounded-full w-16" />
                        <div className="h-3 bg-zinc-800/40 rounded-full w-24" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Single story card ─────────────────────────────────────────────────────────
function StoryCard({ story, index }: { story: Story; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '0px 0px -50px 0px' });
    const accent = ACCENTS[index % ACCENTS.length];

    const scoreLabel =
        story.score >= 200 ? "🔥 Hot"
        : story.score >= 100 ? "⚡ Trending"
        : null;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
                duration: 0.4,
                delay: Math.min((index % PAGE_SIZE) * 0.04, 0.4),
                ease: [0.22, 1, 0.36, 1],
            }}
            className="relative pl-8"
        >
            {/* Timeline dot */}
            <div className="absolute left-0 top-5 z-10">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: Math.min((index % PAGE_SIZE) * 0.04, 0.4) + 0.08, duration: 0.22 }}
                    className="h-3 w-3 rounded-full border-2 border-zinc-900 bg-zinc-950 flex items-center justify-center"
                >
                    <div className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                </motion.div>
            </div>

            {/* Card */}
            <article className={`group relative mb-3 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm hover:border-zinc-700/70 hover:bg-zinc-900/70 hover:shadow-xl ${accent.glow} transition-all duration-300 overflow-hidden`}>
                {/* Left accent stripe */}
                <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b ${accent.bar} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="p-5">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <a
                            href={story.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug line-clamp-2 flex-1"
                        >
                            {story.title}
                        </a>
                        <a
                            href={story.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open story"
                            className="shrink-0 flex items-center justify-center h-6 w-6 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-600 hover:text-zinc-200 hover:border-zinc-600 transition-all duration-200 opacity-0 group-hover:opacity-100 mt-0.5"
                        >
                            <ArrowUpRight className="h-3 w-3" />
                        </a>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-600">
                        <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {story.by}
                        </span>
                        <span className="h-3 w-px bg-zinc-800" />
                        <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {story.score} points
                        </span>
                        <span className="h-3 w-px bg-zinc-800" />
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(story.time * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>

                        {/* Score label badge */}
                        {scoreLabel && (
                            <>
                                <span className="h-3 w-px bg-zinc-800" />
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${accent.tag}`}>
                                    {scoreLabel}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </article>
        </motion.div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
const JobsTimelineStories: React.FC = () => {
    const [allStoryIds, setAllStoryIds] = useState<number[]>([]);
    const [stories, setStories]         = useState<Story[]>([]);
    const [loadingIds, setLoadingIds]   = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset]           = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll-driven timeline
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
    const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20, restDelta: 0.001 });
    // Use transform to avoid `top` MotionValue conflicts with layoutId animations
    const dotY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    const fetchNextBatch = useCallback(async (ids: number[], currentOffset: number) => {
        setLoadingMore(true);
        try {
            const batch = ids.slice(currentOffset, currentOffset + PAGE_SIZE);
            const fetched = await Promise.all(
                batch.map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json()))
            );
            setStories(prev => [...prev, ...fetched]);
            setOffset(currentOffset + PAGE_SIZE);
        } catch (err) {
            console.error('Error fetching batch:', err);
        } finally {
            setLoadingMore(false);
        }
    }, []);

    const fetchAllIds = useCallback(async () => {
        setLoadingIds(true);
        try {
            const res = await fetch('https://hacker-news.firebaseio.com/v0/jobstories.json');
            const ids: number[] = await res.json();
            setAllStoryIds(ids);
            await fetchNextBatch(ids, 0);
        } catch (err) {
            console.error('Error fetching IDs:', err);
        } finally {
            setLoadingIds(false);
        }
    }, [fetchNextBatch]);

    useEffect(() => { fetchAllIds(); }, [fetchAllIds]);

    const hasMore = allStoryIds.length > offset;

    return (
        <main className="min-h-screen bg-[#0d0d0f] text-zinc-100">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-orange-600/4 blur-[120px]" />
                <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-violet-600/4 blur-[120px]" />
                <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-600/4 blur-[100px]" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-24">

                {/* ── Hero header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-12"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-medium mb-5"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                        Hacker News Jobs
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[0.95] mb-5">
                        <span className="text-zinc-100">Jobs</span>
                        <br />
                        <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-violet-400 bg-clip-text text-transparent">
                            Timeline
                        </span>
                    </h1>
                    <p className="text-zinc-500 text-base max-w-lg leading-relaxed">
                        Curated job stories from{" "}
                        <a href="https://news.ycombinator.com/jobs" target="_blank" rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2 transition-colors">
                            Hacker News
                        </a>
                        . Not exhaustive — highlights only.
                    </p>

                    {/* Info banner */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 flex items-start gap-3 px-4 py-3.5 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm"
                    >
                        <Newspaper className="h-4 w-4 text-zinc-600 mt-0.5 shrink-0" />
                        <p className="text-[12px] text-zinc-500 leading-relaxed">
                            A curated snapshot of top job postings from the Hacker News Jobs section. Browse all listings at{" "}
                            <a href="https://news.ycombinator.com/jobs" target="_blank" rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-0.5 transition-colors">
                                news.ycombinator.com/jobs
                                <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                        </p>
                    </motion.div>
                </motion.div>

                {/* ── Timeline feed ── */}
                <div ref={containerRef} className="relative">
                    {/* Track */}
                    <div className="absolute left-[5px] top-0 bottom-0 w-px pointer-events-none">
                        <div className="absolute inset-0 bg-zinc-800/50 rounded-full" />
                        <motion.div
                            className="absolute top-0 left-0 right-0 origin-top rounded-full bg-gradient-to-b from-orange-500 via-rose-500 to-violet-500"
                            style={{ scaleY }}
                        />
                        {/* Glowing dot — uses y% to avoid top MotionValue layout conflicts */}
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 -ml-[5px]"
                            style={{ top: dotY }}
                        >
                            <div className="absolute inset-0 rounded-full bg-orange-400 blur-[8px] opacity-80 animate-pulse" />
                            <div className="relative h-full w-full rounded-full bg-white border border-orange-300/60 shadow-lg shadow-orange-500/30" />
                        </motion.div>
                    </div>

                    {/* Story cards */}
                    <div className="space-y-1">
                        {stories.map((story, i) => (
                            <StoryCard key={`${story.id}-${i}`} story={story} index={i} />
                        ))}
                    </div>

                    {/* Loading skeletons */}
                    {(loadingIds || loadingMore) && <StorySkeletons />}

                    {/* End cap / Load more */}
                    {!loadingIds && (
                        <div className="pl-8 pt-4 pb-6">
                            {hasMore ? (
                                <button
                                    onClick={() => fetchNextBatch(allStoryIds, offset)}
                                    disabled={loadingMore}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 text-zinc-500 text-sm font-medium hover:border-zinc-700 hover:text-zinc-300 hover:bg-zinc-900/70 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {loadingMore ? (
                                        <span className="h-4 w-4 rounded-full border-2 border-zinc-600 border-t-zinc-300 animate-spin" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                    {loadingMore ? 'Loading…' : `Load more · ${allStoryIds.length - offset} remaining`}
                                </button>
                            ) : stories.length > 0 ? (
                                <div className="flex items-center gap-3 text-[11px] text-zinc-700">
                                    <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
                                    <span className="px-2 py-1 rounded-full border border-zinc-800 bg-zinc-900/60">
                                        {stories.length} stories · end of timeline
                                    </span>
                                    <div className="h-px flex-1 bg-gradient-to-l from-zinc-800 to-transparent" />
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default JobsTimelineStories;