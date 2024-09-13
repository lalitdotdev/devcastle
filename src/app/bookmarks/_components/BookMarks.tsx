"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { Loader2 } from "lucide-react";
import Post from "@/components/Posts/Post";
import PostsLoadingSkeleton from "@/components/Posts/PostLoadingSkeleton";
import { PostsPage } from "@/types/types";
import kyInstance from "@/lib/ky";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useBookmarkedPosts() {
    return useInfiniteQuery({
        queryKey: ["post-feed", "bookmarks"],
        queryFn: ({ pageParam = null }) =>
            kyInstance
                .get(
                    "/api/posts/bookmarked",
                    pageParam ? { searchParams: { cursor: pageParam } } : {}
                )
                .json<PostsPage>(),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });
}

export default function Bookmarks() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useBookmarkedPosts();

    const posts = data?.pages.flatMap((page) => page.posts) || [];

    if (status === "loading") {
        return <PostsLoadingSkeleton />;
    }

    if (status === "success" && !posts.length && !hasNextPage) {
        return (
            <p className="text-center text-muted-foreground">
                You don&apos;t have any bookmarks yet.
            </p>
        );
    }

    if (status === "error") {
        return (
            <p className="text-center text-destructive">
                An error occurred while loading bookmarks.
            </p>
        );
    }


    console.log(posts)

    return (
        <InfiniteScrollContainer
            className="space-y-5 p-0"
            onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
        >
            {posts.map((post) => ( // todo: fix type error here
                <Post key={post.id} post={post} communityName={post.community.name} />
            ))}
            {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
        </InfiniteScrollContainer>
    );
}
