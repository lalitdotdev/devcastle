'use client'

import {
    ArrowUpRight,
    Link as LinkIcon,
    Rocket,
    TrendingUp,
    RefreshCw,
    Calendar,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { fetchAndStoreProductHuntPosts, getProductHuntPosts } from '@/app/feed/actions/getProductHuntPosts'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useSpring, useInView } from 'framer-motion'
import { toast } from 'sonner'

interface ProductHuntPost {
    id: string
    name: string
    tagline: string
    description: string | null
    createdAt: Date
    url: string
    votesCount: number
    topics: { name: string }[]
    thumbnailUrl: string | null
    website: string | null
}

// ── Accent colors cycling deterministically ───────────────────────────────────
const ACCENTS = [
    { dot: 'bg-orange-400',   tag: 'bg-orange-500/10 text-orange-300 border-orange-500/20',   bar: 'from-orange-500',   glow: 'group-hover:shadow-orange-500/10'  },
    { dot: 'bg-violet-400',   tag: 'bg-violet-500/10 text-violet-300 border-violet-500/20',   bar: 'from-violet-500',   glow: 'group-hover:shadow-violet-500/10'  },
    { dot: 'bg-rose-400',     tag: 'bg-rose-500/10 text-rose-300 border-rose-500/20',         bar: 'from-rose-500',     glow: 'group-hover:shadow-rose-500/10'    },
    { dot: 'bg-cyan-400',     tag: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',         bar: 'from-cyan-500',     glow: 'group-hover:shadow-cyan-500/10'    },
    { dot: 'bg-emerald-400',  tag: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', bar: 'from-emerald-500', glow: 'group-hover:shadow-emerald-500/10' },
    { dot: 'bg-amber-400',    tag: 'bg-amber-500/10 text-amber-300 border-amber-500/20',      bar: 'from-amber-500',    glow: 'group-hover:shadow-amber-500/10'   },
]

// ── Loading skeleton ──────────────────────────────────────────────────────────
function PostSkeleton() {
    return (
        <div className="pl-8 space-y-3">
            <div className="absolute left-[5px] top-0 bottom-0 w-px bg-zinc-800/60 rounded-full" />
            {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 animate-pulse" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="h-14 w-14 rounded-xl bg-zinc-800 shrink-0" />
                    <div className="flex-1 space-y-2.5">
                        <div className="h-4 bg-zinc-800 rounded-full w-1/3" />
                        <div className="h-3 bg-zinc-800/70 rounded-full w-2/3" />
                        <div className="flex gap-2">
                            <div className="h-6 w-14 bg-zinc-800/60 rounded-full" />
                            <div className="h-6 w-14 bg-zinc-800/60 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ── Single post card ──────────────────────────────────────────────────────────
function PostCard({ post, index }: { post: ProductHuntPost; index: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
    const accent = ACCENTS[index % ACCENTS.length]

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.35), ease: [0.22, 1, 0.36, 1] }}
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

            {/* Card */}
            <article className={`group relative mb-3 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm hover:border-zinc-700/70 hover:bg-zinc-900/70 hover:shadow-xl ${accent.glow} transition-all duration-300`}>
                {/* Left accent stripe */}
                <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b ${accent.bar} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="flex items-start gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="shrink-0 h-14 w-14 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                        {post.thumbnailUrl ? (
                            <Image src={post.thumbnailUrl} alt={post.name} width={56} height={56} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Rocket className="h-5 w-5 text-zinc-700" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug">
                                {post.name}
                            </h3>
                            <a
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View on Product Hunt"
                                className="shrink-0 flex items-center justify-center h-6 w-6 rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-600 hover:text-zinc-200 hover:border-zinc-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                                <ArrowUpRight className="h-3 w-3" />
                            </a>
                        </div>

                        <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">{post.tagline}</p>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-600">
                            <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {post.votesCount} upvotes
                            </span>
                            <span className="h-3 w-px bg-zinc-800" />
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            {post.website && (
                                <>
                                    <span className="h-3 w-px bg-zinc-800" />
                                    <Link href={post.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-zinc-300 transition-colors duration-200">
                                        <LinkIcon className="h-3 w-3" />
                                        Website
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Topic tags */}
                        {post.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {post.topics.slice(0, 3).map((topic) => (
                                    <span key={topic.name} className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${accent.tag}`}>
                                        {topic.name}
                                    </span>
                                ))}
                                {post.topics.length > 3 && (
                                    <span className="text-[10px] text-zinc-700 px-1.5 py-0.5">+{post.topics.length - 3}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </motion.div>
    )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProductHuntFeed() {
    const [posts, setPosts] = useState<ProductHuntPost[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isFeedVisible, setIsFeedVisible] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const stored = localStorage.getItem('productHuntPosts')
        if (stored) { setPosts(JSON.parse(stored)); setIsFeedVisible(true) }
    }, [])

    const fetchPosts = async () => {
        const fetched = await getProductHuntPosts()
        setPosts(fetched)
        setIsFeedVisible(true)
        localStorage.setItem('productHuntPosts', JSON.stringify(fetched))
    }

    const handleImport = async () => {
        setIsLoading(true)
        try {
            const result = await fetchAndStoreProductHuntPosts()
            if (result.success) {
                toast.promise(fetchPosts(), {
                    loading: 'Fetching from Product Hunt…',
                    success: 'Feed imported successfully!',
                    error: 'Failed to fetch posts.',
                })
            } else {
                toast.error(result.message)
            }
        } catch {
            toast.error('Error importing Product Hunt feed')
        } finally {
            setIsLoading(false)
        }
    }

    // Scroll-driven timeline fill
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
    const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20, restDelta: 0.001 })

    return (
        <div className="space-y-6 text-zinc-100">
            {/* ── Header card ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 rounded-2xl border border-zinc-800/60 p-4 bg-zinc-900/40 backdrop-blur-sm"
            >
                <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-xl bg-orange-500/20 blur-md" />
                    <div className="relative h-11 w-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                        <Image src="/assets/images/product-hunt-logo.png" alt="Product Hunt" width={40} height={40} className="object-contain" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-semibold text-zinc-100">Product Hunt Feed</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Trending products and startups</p>
                </div>

                {/* Import / re-import button */}
                <button
                    onClick={handleImport}
                    disabled={isLoading}
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                        bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500
                        text-white shadow-lg shadow-orange-900/30
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200"
                >
                    {isLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCw className="h-4 w-4" />
                    )}
                    {posts.length > 0 ? 'Refresh' : 'Import Feed'}
                </button>
            </motion.div>

            {/* ── Info banner ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-orange-500/20 bg-orange-500/5 text-[12px] text-orange-300"
            >
                <Rocket className="h-4 w-4 shrink-0" />
                Discover the latest trending products and startups from Product Hunt!
            </motion.div>

            {/* ── Feed list with scroll timeline ── */}
            {isFeedVisible && posts.length > 0 && (
                <div ref={containerRef} className="relative">
                    {/* Timeline track */}
                    <div className="absolute left-[5px] top-0 bottom-0 w-px pointer-events-none">
                        <div className="absolute inset-0 bg-zinc-800/50 rounded-full" />
                        <motion.div
                            className="absolute top-0 left-0 right-0 origin-top rounded-full bg-gradient-to-b from-orange-500 via-rose-500 to-violet-500"
                            style={{ scaleY }}
                        />
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 -ml-[5px]"
                            style={{ top: scrollYProgress }}
                        >
                            <div className="absolute inset-0 rounded-full bg-orange-400 blur-[8px] opacity-80 animate-pulse" />
                            <div className="relative h-full w-full rounded-full bg-white border border-orange-300/60 shadow-lg shadow-orange-500/30" />
                        </motion.div>
                    </div>

                    {/* Posts */}
                    <div className="space-y-1">
                        {posts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
                    </div>

                    {/* End cap */}
                    <div className="pl-8 pt-3 pb-2">
                        <div className="flex items-center gap-3 text-[11px] text-zinc-700">
                            <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
                            <span className="px-2 py-1 rounded-full border border-zinc-800 bg-zinc-900/60">
                                {posts.length} product{posts.length !== 1 ? 's' : ''}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-l from-zinc-800 to-transparent" />
                        </div>
                    </div>
                </div>
            )}

            {/* Empty / pre-import state */}
            {!isFeedVisible && !isLoading && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4 py-20 text-center">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                        <Rocket className="h-6 w-6 text-zinc-600" />
                    </div>
                    <div>
                        <p className="text-zinc-400 font-medium text-sm">No feed imported yet</p>
                        <p className="text-zinc-600 text-xs mt-1">Click "Import Feed" to load today's trending products.</p>
                    </div>
                </motion.div>
            )}
        </div>
    )
}