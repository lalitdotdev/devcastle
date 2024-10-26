"use client"

import { Crown, Plus, Users } from 'lucide-react';
import React, { useState } from 'react';
import { joinCommunity, leaveCommunity } from '@/app/feed/actions';

import { Button } from '../ui/Button';
import CommunityAvatar from '../Avatars/CommunityAvatar';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type Community = {
    id: string
    name: string
    _count: {
        subscribers: number
    }
}

interface RecommendationsProps {
    communities: Community[]
    subscribedCommunityIds: string[]
}

const Recommendations = ({
    communities,
    subscribedCommunityIds: initialSubscribedIds,

}: RecommendationsProps) => {
    const [subscribedIds, setSubscribedIds] = useState(initialSubscribedIds)
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const router = useRouter()

    const handleJoinLeave = async (communityId: string) => {
        try {
            setIsLoading(communityId)

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
            setIsLoading(null)
        }
    }
    return (
        <div className="hidden lg:block">
            <div className="sticky top-0 md:top-24 h-fit">
                <div className="rounded-lg border border-gray-800 bg-zinc-900/50 backdrop-blur-sm">
                    {/* Header section with background */}
                    <div className="relative h-32 rounded-t-lg overflow-hidden">
                        <div className="absolute inset-0 bg-castle-art bg-cover bg-center" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
                        <div className="absolute bottom-4 left-4">
                            <h2 className="text-xl font-bold text-white">Popular Castles</h2>
                            <p className="text-sm text-gray-300">Join thriving communities</p>
                        </div>
                    </div>

                    <Separator className="bg-gray-800" />

                    {/* Communities list */}
                    <div className="p-4">
                        <ul className="space-y-4">
                            {communities.map((community, index) => (
                                <li
                                    key={community.id}
                                    className={cn(
                                        "group flex items-center justify-between p-2 rounded-lg",
                                        "hover:bg-gray-800/40 transition-colors duration-200"
                                    )}
                                >
                                    <Link
                                        href={`/cb/${community.name}`}
                                        className="flex items-center space-x-3 flex-1"
                                    >
                                        <div className="relative">
                                            <CommunityAvatar
                                                seed={community.name}
                                                classNames="w-10 h-10 rounded-lg border-2 border-gray-700"
                                            />
                                            {index < 3 && (
                                                <Crown
                                                    size={14}
                                                    className={cn(
                                                        "absolute -top-1 -right-1",
                                                        index === 0 ? "text-yellow-500" :
                                                            index === 1 ? "text-gray-400" :
                                                                "text-bronze-500"
                                                    )}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-100 truncate">
                                                {community.name}
                                            </p>
                                            {community._count && (
                                                <div className="flex items-center text-xs text-gray-400">
                                                    <Users size={12} className="mr-1" />
                                                    {community._count.subscribers} members
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    <Button
                                        onClick={() => handleJoinLeave(community.id)}
                                        disabled={isLoading === community.id}
                                        className={`px-4 py-2 rounded-full text-sm font-medium ${subscribedIds.includes(community.id)
                                            ? 'bg-gray-200 hover:bg-gray-300'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                    >
                                        {isLoading === community.id
                                            ? <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                                            : subscribedIds.includes(community.id)
                                                ? 'Leave'
                                                : 'Join'}
                                    </Button>
                                </li>
                            ))}
                        </ul>

                        {/* Create community button */}
                        <div className="mt-6">
                            <Link href="/cb/create">
                                <Button
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg h-9"
                                >
                                    <Plus size={18} className="mr-2" />
                                    Create a Castle
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recommendations;
