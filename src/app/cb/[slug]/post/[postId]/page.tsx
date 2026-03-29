import { Loader2, MessageSquare, Share2, UserCircle2 } from "lucide-react";
import { Post, User, Vote } from "@prisma/client";

import { CachedPost } from "../../../../../types/redis";
import CommentsSection from "@/components/CommentsSection";
import EditorOutputContent from "@/components/EditorOutputContent";
import { Metadata } from "next";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { formatTimeToNow } from "@/lib/utils";
import { notFound } from "next/navigation";
import { redis } from "@/lib/redis";
import { getAuthSession } from "@/lib/auth";

interface CommunityPostPageProps {
    params: {
        postId: string;
    };
}

export function generateMetadata({
    params: { postId },
}: CommunityPostPageProps): Metadata {
    return {
        title: `Post ${postId} | Community Post`,
        description: `Post details for ${postId}`,
    };
}

const CommunityPostPage = async ({ params }: CommunityPostPageProps) => {
    // Parallelize Redis and Session fetching
    const [cachedPost, session] = await Promise.all([
        redis.hgetall(`post:${params.postId}`) as Promise<CachedPost | null>,
        getAuthSession()
    ]);

    let post: (Post & { votes: Vote[]; author: User }) | null = null;

    if (!cachedPost) {
        post = await db.post.findUnique({
            where: { id: params.postId },
            include: { votes: true, author: true },
        });
    } else {
        // If we have cachedPost, we still need the votes for the PostVoteServer
        // We'll fetch the votes once here to avoid multiple queries later
        const postWithVotes = await db.post.findUnique({
            where: { id: params.postId },
            include: { votes: true },
        });
        if (postWithVotes) {
            post = {
                ...postWithVotes,
                author: {
                    username: cachedPost.authorUsername
                } as User, // Mock author from cache for UI
            } as (Post & { votes: Vote[]; author: User });
        }
    }

    if (!post && !cachedPost) return notFound();

    // Calculate votes Amt and current user's vote here to pass to both instances of PostVoteServer
    const votesAmt = post?.votes.reduce((acc, vote) => {
        if (vote.type === "UPVOTE") return acc + 1;
        if (vote.type === "DOWNVOTE") return acc - 1;
        return acc;
    }, 0) ?? 0;

    const currentVote = post?.votes.find(
        (vote) => vote.userId === session?.user?.id
    )?.type;

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
            <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="relative overflow-hidden rounded-2xl bg-zinc-900/90 shadow-2xl backdrop-blur-xl ring-1 ring-zinc-700/50">
                        {/* Post Header */}
                        <div className="border-b border-zinc-800/70 bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 p-1 ring-1 ring-zinc-700/50">
                                        <UserCircle2 className="h-6 w-6 text-zinc-200" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-zinc-300">
                                            Posted by{" "}
                                            <a
                                                href={`/u/${post?.author?.username ?? cachedPost?.authorUsername}`}
                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                u/{post?.author?.username ?? cachedPost?.authorUsername}
                                            </a>
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost!.createdAt))}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors text-zinc-400 hover:text-zinc-300">
                                        <Share2 className="h-5 w-5" />
                                    </button>
                                    <button className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors text-zinc-400 hover:text-zinc-300">
                                        <MessageSquare className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            <h1 className="post-title mt-4 text-xl sm:text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight" style={{ wordBreak: 'break-all', overflowWrap: 'anywhere', whiteSpace: 'normal', display: 'block' }}>
                                {post?.title ?? cachedPost?.title}
                            </h1>
                        </div>

                        {/* Post Content with Integrated Vote Section */}
                        <div className="relative">
                            {/* Desktop Vote Section - Fixed Position */}
                            <div className="hidden lg:block absolute left-6 top-6">
                                <Suspense fallback={<PostVoteShell />}>
                                    {/* @ts-expect-error server component*/}
                                    <PostVoteServer
                                        postId={post?.id ?? cachedPost!.id}
                                        initialVoteAmt={votesAmt}
                                        initialVote={currentVote}
                                        layout="vertical"
                                    />
                                </Suspense>
                            </div>

                            {/* Mobile/Tablet Vote Section - Sticky Top */}
                            <div className="lg:hidden sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800/50">
                                <div className="flex justify-center py-3">
                                    <Suspense fallback={<PostVoteShellMobile />}>
                                        {/* @ts-expect-error server component*/}
                                        <PostVoteServer
                                            postId={post?.id ?? cachedPost!.id}
                                            initialVoteAmt={votesAmt}
                                            initialVote={currentVote}
                                            layout="horizontal"
                                        />
                                    </Suspense>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="p-4 sm:p-6 lg:pl-24">
                                <EditorOutputContent content={post?.content ?? (cachedPost ? JSON.parse(cachedPost.content) : null)} />
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="border-t border-zinc-800/70 bg-zinc-900/30 p-4 sm:p-6">
                            <h2 className="flex items-center gap-2 mb-6 text-lg font-semibold text-zinc-100">
                                <MessageSquare className="h-5 w-5 text-zinc-400" />
                                Comments
                            </h2>
                            <Suspense
                                fallback={
                                    <div className="flex items-center justify-center py-8">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                                            <p className="text-sm text-zinc-500 font-medium">Loading comments...</p>
                                        </div>
                                    </div>
                                }
                            >
                                {/* @ts-expect-error server component */}
                                <CommentsSection postId={post?.id ?? cachedPost!.id} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function PostVoteShell() {
    return (
        <div className="flex flex-col items-center gap-2 rounded-full bg-zinc-800/40 p-1 border border-zinc-700/30 shadow-sm py-3 w-9 overflow-hidden">
            <div className="h-7 w-7 rounded-full bg-zinc-700/50 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer" />
            </div>
            <div className="h-4 w-5 rounded bg-zinc-700/50 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer" />
            </div>
            <div className="h-7 w-7 rounded-full bg-zinc-700/50 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer" />
            </div>
        </div>
    );
}

function PostVoteShellMobile() {
    return (
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-zinc-800/40 border border-zinc-700/30 shadow-sm overflow-hidden">
            <div className="h-7 w-7 rounded-full bg-zinc-700/50 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer" />
            </div>
            <div className="h-4 w-8 rounded bg-zinc-700/50 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer" />
            </div>
            <div className="h-7 w-7 rounded-full bg-zinc-700/50 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer" />
            </div>
        </div>
    );
}

export default CommunityPostPage;
