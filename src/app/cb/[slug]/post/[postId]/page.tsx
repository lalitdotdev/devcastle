import { ArrowBigDown, ArrowBigUp, Loader2, MessageSquare, Share2, UserCircle2 } from "lucide-react";
import { Post, User, Vote } from "@prisma/client";

import { CachedPost } from "../../../../../types/redis";
import CommentsSection from "@/components/CommentsSection";
import EditorOutputContent from "@/components/EditorOutputContent";
import { Metadata } from "next";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { formatTimeToNow } from "@/lib/utils";
import { notFound } from "next/navigation";
import { redis } from "@/lib/redis";

interface CommunityPostPageProps {
    params: {
        postId: string;
    };
}

export function generateMetadata({
    params: { postId },
}: CommunityPostPageProps): Metadata {
    return {
        title: `Post | Community Post`,
        description: `Post `,
    };
}

const CommunityPostPage = async ({ params }: CommunityPostPageProps) => {
    const cachedPost = (await redis.hgetall(`post:${params.postId}`)) as CachedPost;
    let post: (Post & { votes: Vote[]; author: User }) | null = null;

    if (!cachedPost) {
        post = await db.post.findUnique({
            where: { id: params.postId },
            include: { votes: true, author: true },
        });
    }

    if (!post && !cachedPost) return notFound();

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
                                                href={`/u/${post?.author.username ?? cachedPost.authorUsername}`}
                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                u/{post?.author.username ?? cachedPost.authorUsername}
                                            </a>
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
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
                            <h1 className="mt-4 text-xl sm:text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight">
                                {post?.title ?? cachedPost.title}
                            </h1>
                        </div>

                        {/* Post Content with Integrated Vote Section */}
                        <div className="relative">
                            {/* Desktop Vote Section - Fixed Position */}
                            <div className="hidden lg:block absolute left-6 top-6">
                                <Suspense fallback={<PostVoteShell />}>
                                    {/* @ts-expect-error server component*/}
                                    <PostVoteServer
                                        postId={post?.id ?? cachedPost.id}
                                        getData={async () => {
                                            return await db.post.findUnique({
                                                where: { id: params.postId },
                                                include: { votes: true },
                                            });
                                        }}
                                    />
                                </Suspense>
                            </div>

                            {/* Mobile/Tablet Vote Section - Sticky Top */}
                            <div className="lg:hidden sticky top-0 z-10 bg-gradient-to-b from-zinc-900/95 to-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50">
                                <div className="flex justify-center py-3">
                                    <Suspense fallback={<PostVoteShellMobile />}>
                                        {/* @ts-expect-error server component*/}
                                        <PostVoteServer
                                            postId={post?.id ?? cachedPost.id}
                                            getData={async () => {
                                                return await db.post.findUnique({
                                                    where: { id: params.postId },
                                                    include: { votes: true },
                                                });
                                            }}
                                        />
                                    </Suspense>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="p-4 sm:p-6 lg:pl-24">
                                <div className="prose prose-invert prose-zinc max-w-none">
                                    <EditorOutputContent content={post?.content ?? cachedPost.content} />
                                </div>
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
                                            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                                            <p className="text-sm text-zinc-500">Loading comments...</p>
                                        </div>
                                    </div>
                                }
                            >
                                {/* @ts-expect-error server component */}
                                <CommentsSection postId={post?.id ?? cachedPost.id} />
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
        <div className="flex flex-col items-center gap-2 rounded-xl bg-zinc-800/50 p-2 backdrop-blur-sm ring-1 ring-zinc-700/50 shadow-lg">
            <button
                className={buttonVariants({
                    variant: "ghost",
                    className: "hover:bg-zinc-700/50 transition-all duration-200 hover:scale-110",
                })}
            >
                <ArrowBigUp className="h-5 w-5 text-zinc-400" />
            </button>

            <div className="flex h-8 w-8 items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            </div>

            <button
                className={buttonVariants({
                    variant: "ghost",
                    className: "hover:bg-zinc-700/50 transition-all duration-200 hover:scale-110",
                })}
            >
                <ArrowBigDown className="h-5 w-5 text-zinc-400" />
            </button>
        </div>
    );
}

function PostVoteShellMobile() {
    return (
        <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-zinc-800/50 backdrop-blur-sm ring-1 ring-zinc-700/50 shadow-lg">
            <button
                className={buttonVariants({
                    variant: "ghost",
                    className: "hover:bg-zinc-700/50 transition-all duration-200 hover:scale-110",
                })}
            >
                <ArrowBigUp className="h-5 w-5 text-zinc-400" />
            </button>

            <div className="flex items-center justify-center w-12">
                <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            </div>

            <button
                className={buttonVariants({
                    variant: "ghost",
                    className: "hover:bg-zinc-700/50 transition-all duration-200 hover:scale-110",
                })}
            >
                <ArrowBigDown className="h-5 w-5 text-zinc-400" />
            </button>
        </div>
    );
}

export default CommunityPostPage;
