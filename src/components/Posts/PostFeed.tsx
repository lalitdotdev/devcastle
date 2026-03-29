"use client";

import { FC, useEffect, useRef } from "react";
import { ExtendedPost } from "@/types/db.d";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import Post from "./Post";
import { PostSkeleton } from "./Skeleton";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersection } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { motion, useScroll, useSpring } from "framer-motion";

interface PostFeedProps {
    initialPosts: ExtendedPost[];
    communityName?: string;
}

// ── Skeleton placeholder ──────────────────────────────────────────────────────
function FeedSkeleton() {
    return (
        <div className="pl-8 space-y-3">
            {Array(3).fill(0).map((_, i) => (
                <div
                    key={i}
                    className="flex gap-4 p-5 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 animate-pulse"
                    style={{ animationDelay: `${i * 80}ms` }}
                >
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-zinc-800" />
                            <div className="h-3 bg-zinc-800 rounded-full w-24" />
                            <div className="h-3 bg-zinc-800/50 rounded-full w-16 ml-auto" />
                        </div>
                        <div className="h-4 bg-zinc-800 rounded-full w-3/4" />
                        <div className="h-3 bg-zinc-800/60 rounded-full w-full" />
                        <div className="h-3 bg-zinc-800/40 rounded-full w-2/3" />
                        <div className="flex gap-3 mt-2">
                            <div className="h-7 w-16 rounded-lg bg-zinc-800/60" />
                            <div className="h-7 w-16 rounded-lg bg-zinc-800/60" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── End of feed message ───────────────────────────────────────────────────────
function EndCap({ count }: { count: number }) {
    return (
        <div className="pl-8 pt-3 pb-6">
            <div className="flex items-center gap-3 text-[11px] text-zinc-700">
                <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
                <span className="px-2 py-1 rounded-full border border-zinc-800 bg-zinc-900/60">
                    {count} post{count !== 1 ? "s" : ""}
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-zinc-800 to-transparent" />
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
const PostFeed: FC<PostFeedProps> = ({ initialPosts, communityName }) => {
    const lastPostRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    });

    const { data: session } = useSession();

    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
        ["infinite-query"],
        async ({ pageParam = 1 }) => {
            const query =
                `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
                (!!communityName ? `&communityName=${communityName}` : "");
            const { data } = await axios.get(query);
            return data as ExtendedPost[];
        },
        {
            getNextPageParam: (_, pages) => {
                if (pages.length === 0) return undefined;
                return pages.length + 1;
            },
            initialData: { pages: [initialPosts], pageParams: [1] },
        },
    );

    useEffect(() => {
        if (entry?.isIntersecting && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [entry, fetchNextPage]);

    const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

    // Scroll-driven timeline progress
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });
    const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20, restDelta: 0.001 });

    return (
        <div ref={containerRef} className="relative">
            {/* ── Vertical timeline track ── */}
            <div className="absolute left-[5px] top-0 bottom-0 w-px pointer-events-none">
                {/* Track background */}
                <div className="absolute inset-0 bg-zinc-800/50 rounded-full" />

                {/* Scroll-driven fill */}
                <motion.div
                    className="absolute top-0 left-0 right-0 origin-top rounded-full bg-gradient-to-b from-violet-500 via-fuchsia-500 to-cyan-500"
                    style={{ scaleY }}
                />

                {/* Glowing leading dot */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-3 h-3 -ml-[5px]"
                    style={{ top: scrollYProgress }}
                >
                    <div className="absolute inset-0 rounded-full bg-violet-400 blur-[8px] opacity-80 animate-pulse" />
                    <div className="relative h-full w-full rounded-full bg-white border border-violet-300/60 shadow-lg shadow-violet-500/30" />
                </motion.div>
            </div>

            {/* ── Post list ── */}
            <ul className="pl-8 flex flex-col space-y-2">
                {posts.map((post, index) => {
                    const votesAmt = post.votes.reduce((acc, vote) => {
                        if (vote.type === "UPVOTE") return acc + 1;
                        else if (vote.type === "DOWNVOTE") return acc - 1;
                        return acc;
                    }, 0);

                    const currentVote = post?.votes.find(
                        (vote) => vote.userId === session?.user.id,
                    );

                    // Timeline dot per post
                    const dotColors = [
                        "bg-violet-400", "bg-cyan-400", "bg-fuchsia-400",
                        "bg-amber-400",  "bg-emerald-400", "bg-rose-400",
                    ];
                    const dotColor = dotColors[index % dotColors.length];

                    const PostWrapper = ({ children }: { children: React.ReactNode }) => (
                        <motion.li
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: Math.min(index * 0.05, 0.35),
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="relative"
                        >
                            {/* Timeline dot */}
                            <div className="absolute -left-[27px] top-5 z-10 flex items-center justify-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: Math.min(index * 0.05, 0.35) + 0.1, duration: 0.25 }}
                                    className="h-3 w-3 rounded-full border-2 border-zinc-900 bg-zinc-950 flex items-center justify-center"
                                >
                                    <div className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                                </motion.div>
                            </div>
                            {children}
                        </motion.li>
                    );

                    if (index === posts.length - 1) {
                        return (
                            <PostWrapper key={post.id}>
                                <div ref={ref}>
                                    {isFetchingNextPage ? (
                                        <FeedSkeleton />
                                    ) : (
                                        <Post
                                            communityName={post.community.name}
                                            post={post}
                                            commentsCount={post.comments.length}
                                            votesAmt={votesAmt}
                                            currentVote={currentVote}
                                        />
                                    )}
                                </div>
                            </PostWrapper>
                        );
                    }

                    return (
                        <PostWrapper key={post.id}>
                            <Post
                                communityName={post.community.name}
                                post={post}
                                commentsCount={post.comments.length}
                                votesAmt={votesAmt}
                                currentVote={currentVote}
                            />
                        </PostWrapper>
                    );
                })}

                {isFetchingNextPage && (
                    <li className="relative">
                        <div className="absolute -left-[27px] top-5 z-10 h-3 w-3 rounded-full border-2 border-zinc-900 bg-zinc-800 animate-pulse" />
                        <FeedSkeleton />
                    </li>
                )}
            </ul>

            <EndCap count={posts.length} />
        </div>
    );
};

export default PostFeed;