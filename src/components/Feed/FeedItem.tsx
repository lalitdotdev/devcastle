import { getAuthorName, truncateText } from '@/lib/utils';

import CustomLinkRenderer from '../renderers/CustomLinkRenderer';
import Link from 'next/link';
import Markdown from 'react-markdown';
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { ArrowUpRight, Calendar, User, Tag } from 'lucide-react';

interface Category {
    id: string;
    name: string;
}

export interface UniversalFeedItemProps {
    title: string;
    link?: string;
    pubDate: Date;
    contentSnippet: string;
    categories?: Category[];
    author?: string;
    imageUrl?: string;
    content?: string;
    index?: number; // position in list — used for stagger delay
}

// Deterministic accent per item based on title char sum
const ACCENTS = [
    {
        bar:  'bg-gradient-to-b from-violet-500 to-violet-500/0',
        glow: 'group-hover:shadow-violet-500/10',
        tag:  'bg-violet-500/10 text-violet-300 border-violet-500/20',
        dot:  'bg-violet-400',
        ring: 'group-hover:border-violet-500/30',
    },
    {
        bar:  'bg-gradient-to-b from-cyan-500 to-cyan-500/0',
        glow: 'group-hover:shadow-cyan-500/10',
        tag:  'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
        dot:  'bg-cyan-400',
        ring: 'group-hover:border-cyan-500/30',
    },
    {
        bar:  'bg-gradient-to-b from-fuchsia-500 to-fuchsia-500/0',
        glow: 'group-hover:shadow-fuchsia-500/10',
        tag:  'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20',
        dot:  'bg-fuchsia-400',
        ring: 'group-hover:border-fuchsia-500/30',
    },
    {
        bar:  'bg-gradient-to-b from-amber-500 to-amber-500/0',
        glow: 'group-hover:shadow-amber-500/10',
        tag:  'bg-amber-500/10 text-amber-300 border-amber-500/20',
        dot:  'bg-amber-400',
        ring: 'group-hover:border-amber-500/30',
    },
    {
        bar:  'bg-gradient-to-b from-emerald-500 to-emerald-500/0',
        glow: 'group-hover:shadow-emerald-500/10',
        tag:  'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        dot:  'bg-emerald-400',
        ring: 'group-hover:border-emerald-500/30',
    },
    {
        bar:  'bg-gradient-to-b from-rose-500 to-rose-500/0',
        glow: 'group-hover:shadow-rose-500/10',
        tag:  'bg-rose-500/10 text-rose-300 border-rose-500/20',
        dot:  'bg-rose-400',
        ring: 'group-hover:border-rose-500/30',
    },
];

function accentForTitle(title: string) {
    const sum = title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return ACCENTS[sum % ACCENTS.length];
}

function formatDate(date: Date) {
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const UniversalFeedItem: React.FC<UniversalFeedItemProps> = ({
    title,
    link,
    pubDate,
    contentSnippet,
    categories = [],
    author,
    imageUrl,
    content,
    index = 0,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
    const accent = accentForTitle(title);
    const authorName = getAuthorName(author);
    const body = content ? truncateText(content, 260) : truncateText(contentSnippet, 260);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -18 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: Math.min(index * 0.055, 0.4), ease: [0.22, 1, 0.36, 1] }}
            className="relative pl-8"  // room for the timeline dot + connector
        >
            {/* ── Timeline dot ── */}
            <div className="absolute left-0 top-5 flex flex-col items-center">
                {/* Outer ring */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.055, 0.4) + 0.1 }}
                    className={`h-3 w-3 rounded-full border-2 border-zinc-800 bg-zinc-950 flex items-center justify-center z-10`}
                >
                    <div className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                </motion.div>
            </div>

            {/* ── Card ── */}
            <article
                className={`group relative mb-3 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm
                    hover:border-zinc-700/70 hover:bg-zinc-900/70
                    hover:shadow-xl ${accent.glow}
                    ${accent.ring}
                    transition-all duration-300`}
            >
                {/* Colored left accent stripe */}
                <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full ${accent.bar} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="flex gap-4 p-5">
                    {/* Main content */}
                    <div className="flex-1 min-w-0 space-y-2.5">

                        {/* Title + arrow */}
                        <div className="flex items-start justify-between gap-3">
                            <h2 className="text-[13px] font-semibold text-zinc-200 leading-snug group-hover:text-white transition-colors duration-200 line-clamp-2 flex-1">
                                {link ? (
                                    <Link href={link} target="_blank" rel="noreferrer">
                                        {title}
                                    </Link>
                                ) : title}
                            </h2>
                            {link && (
                                <Link
                                    href={link}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Open article"
                                    className="shrink-0 flex items-center justify-center h-6 w-6 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-600 hover:text-zinc-200 hover:border-zinc-600 transition-all duration-200 opacity-0 group-hover:opacity-100 mt-0.5"
                                >
                                    <ArrowUpRight className="h-3 w-3" />
                                </Link>
                            )}
                        </div>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-600">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(pubDate)}
                            </span>
                            {authorName && (
                                <>
                                    <span className="h-3 w-px bg-zinc-800" />
                                    <span className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {authorName}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Snippet */}
                        <div className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">
                            <Markdown
                                className="prose prose-xs max-w-none text-zinc-500 [&_p]:m-0 [&_a]:text-zinc-400 [&_a]:no-underline [&_strong]:text-zinc-400 [&_code]:text-zinc-400 [&_ul]:hidden [&_ol]:hidden"
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{ img: () => null, a: CustomLinkRenderer }}
                            >
                                {body}
                            </Markdown>
                        </div>

                        {/* Categories */}
                        {categories.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {categories.slice(0, 3).map((cat) => (
                                    <span
                                        key={cat.id}
                                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${accent.tag}`}
                                    >
                                        <Tag className="h-2 w-2" />
                                        {cat.name}
                                    </span>
                                ))}
                                {categories.length > 3 && (
                                    <span className="text-[10px] text-zinc-700 px-1.5 py-0.5">
                                        +{categories.length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Thumbnail */}
                    {imageUrl && (
                        <div className="hidden md:block shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={imageUrl}
                                alt={title}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-300"
                            />
                        </div>
                    )}
                </div>
            </article>
        </motion.div>
    );
};

export default UniversalFeedItem;