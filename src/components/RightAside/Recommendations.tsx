"use client"

import { Crown, Plus, Users, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { joinCommunity, leaveCommunity } from '@/app/feed/actions';
import CommunityAvatar from '../Avatars/CommunityAvatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type Community = {
    id: string
    name: string
    _count: { subscribers: number }
}

interface RecommendationsProps {
    communities: Community[]
    subscribedCommunityIds: string[]
}

// Crown color per rank
const crownColors = ['text-yellow-400', 'text-zinc-400', 'text-amber-700'];

const Recommendations = ({ communities, subscribedCommunityIds: initialSubscribedIds }: RecommendationsProps) => {
    const [subscribedIds, setSubscribedIds] = useState(initialSubscribedIds)
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const router = useRouter()
    const { loginToast } = useCustomToast()
    const { data: session } = useSession()

    const handleJoinLeave = async (communityId: string) => {
        if (!session) return loginToast()
        try {
            setLoadingId(communityId)
            if (subscribedIds.includes(communityId)) {
                await leaveCommunity(communityId)
                setSubscribedIds(prev => prev.filter(id => id !== communityId))
            } else {
                await joinCommunity(communityId)
                setSubscribedIds(prev => [...prev, communityId])
            }
            router.refresh()
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className="hidden lg:block">
            <div className="sticky top-24 h-fit">
                <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm overflow-hidden">

                    {/* ── Header ── */}
                    <div className="relative h-28 overflow-hidden">
                        {/* Background art */}
                        <div className="absolute inset-0 bg-castle-art bg-cover bg-center opacity-30" />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-zinc-900/60 to-zinc-900/95" />
                        {/* Ambient glow */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-24 w-48 rounded-full bg-violet-500/15 blur-2xl" />

                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-zinc-100">Popular Castles</h2>
                                <p className="text-[11px] text-zinc-500 mt-0.5">Join thriving communities</p>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-violet-500/20 bg-violet-500/10 text-[10px] font-medium text-violet-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                                {communities.length} castles
                            </span>
                        </div>
                    </div>

                    {/* ── Community list ── */}
                    <div className="p-3 space-y-1">
                        {communities.map((community, index) => {
                            const isSubscribed = subscribedIds.includes(community.id)
                            const isLoading = loadingId === community.id

                            return (
                                <motion.div
                                    key={community.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-800/50 transition-all duration-200"
                                >
                                    {/* Avatar */}
                                    <Link href={`/cb/${community.name}`} className="relative shrink-0">
                                        <CommunityAvatar seed={community.name} classNames="w-9 h-9 rounded-xl border border-zinc-800" />
                                        {index < 3 && (
                                            <Crown size={11} className={cn("absolute -top-1 -right-1 drop-shadow-sm", crownColors[index])} />
                                        )}
                                    </Link>

                                    {/* Name + count */}
                                    <Link href={`/cb/${community.name}`} className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-zinc-200 group-hover:text-white truncate transition-colors">
                                            {community.name}
                                        </p>
                                        {community._count && (
                                            <div className="flex items-center gap-1 text-[10px] text-zinc-600 mt-0.5">
                                                <Users size={9} />
                                                {community._count.subscribers.toLocaleString()} members
                                            </div>
                                        )}
                                    </Link>

                                    {/* Join / Leave */}
                                    <button
                                        onClick={() => handleJoinLeave(community.id)}
                                        disabled={isLoading}
                                        className={cn(
                                            "shrink-0 flex items-center justify-center h-7 px-3 rounded-lg text-[11px] font-semibold transition-all duration-200",
                                            isSubscribed
                                                ? "border border-zinc-700 bg-transparent text-zinc-400 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/5"
                                                : "border border-violet-500/40 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 hover:border-violet-500/60",
                                            isLoading && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        {isLoading
                                            ? <Loader2 className="h-3 w-3 animate-spin" />
                                            : isSubscribed ? 'Leave' : 'Join'
                                        }
                                    </button>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* ── Divider ── */}
                    <div className="mx-3 border-t border-zinc-800/60" />

                    {/* ── Create CTA ── */}
                    <div className="p-3">
                        <Link
                            href="/cb/create"
                            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl
                                bg-gradient-to-r from-violet-600 to-fuchsia-600
                                hover:from-violet-500 hover:to-fuchsia-500
                                text-white text-xs font-semibold
                                shadow-lg shadow-violet-900/30
                                transition-all duration-200"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Create a Castle
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Recommendations