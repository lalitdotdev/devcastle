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

interface PostFeedProps {
    initialPosts: ExtendedPost[];
    communityName?: string;
}

//&------------------------------------------------------------------
//Adding a functionality of infinite scrolling to the post feed component using the useIntersection hook from @mantine/hooks package
//&-------------------------------------------------------------------

const PostFeed: FC<PostFeedProps> = ({ initialPosts, communityName }) => {
    const lastPostRef = useRef<HTMLElement>(null);

    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    });

    // fetch session client side

    const { data: session } = useSession();

    // INFINITE SCROLLING LOGIC HERE

    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
        ["infinite-query"],

        async ({ pageParam = 1 }) => {
            // query to api end point to fetch posts from the db and return them to the client side for rendering in the post feed component of the app

            const query =
                `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
                (!!communityName ? `&communityName=${communityName}` : "");

            const { data } = await axios.get(query);

            return data as ExtendedPost[];
        },
        {
            // get the next page of posts from the server side and return them to the client side for rendering in the post feed component of the app

            getNextPageParam: (_, pages) => {
                if (pages.length === 0) return undefined;

                return pages.length + 1;
            },
            // passing the initialPosts as the initial data to the useInfiniteQuery hook
            initialData: { pages: [initialPosts], pageParams: [1] },
        },
    );

    // fetching posts if the last post intersects with the viewport of the user and the next page of posts is not already being fetched from the server side

    useEffect(() => {
        if (entry?.isIntersecting && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [entry, fetchNextPage]);

    const posts = data?.pages.flatMap(page => page) ?? initialPosts;

    return (
        <ul className="flex flex-col col-span-2 space-y-2">
            {posts.map((post, index) => {
                // votes logic here

                const votesAmt = post.votes.reduce((acc, vote) => {
                    if (vote.type === "UPVOTE") return acc + 1;
                    else if (vote.type === "DOWNVOTE") return acc - 1;
                    else return acc;
                }, 0);

                // determine whether user has already voted on the post or not

                const currentVote = post?.votes.find(
                    vote => vote.userId === session?.user.id,
                );

                if (index === posts.length - 1) {
                    return (
                        // attaching ref to the last post
                        <li key={post.id} ref={ref}>
                            {isFetchingNextPage ? (
                                <PostSkeleton />) : (
                                <Post
                                    communityName={post.community.name}
                                    post={post}
                                    commentsCount={post.comments.length}
                                    votesAmt={votesAmt}
                                    currentVote={currentVote}
                                />
                            )}
                        </li>
                    );
                } else {
                    return (
                        <Post
                            key={post.id}
                            communityName={post.community.name}
                            post={post}
                            commentsCount={post.comments.length}
                            votesAmt={votesAmt}
                            currentVote={currentVote}
                        />
                    );
                }
            })}
        </ul >
    );
};

export default PostFeed;
