"use client";

import { ExtendedPost } from "@/types/db.d";
import { FC, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";
import Post from "./Post";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  communityName?: string;
}

//TODO: Adding a functionality of infinite scrolling to the post feed component using the useIntersection hook from @mantine/hooks package

//~ ------------------------------------****************************------------------------------------>

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
    }
  );

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        // votes logic here

        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UPVOTE") return acc + 1;
          else if (vote.type === "DOWNVOTE") return acc - 1;
          else return acc;
        }, 0);

        // determine whether user has already voted on the post or not

        const currentVote = post?.votes.find(
          (vote) => vote.userId === session?.user.id
        );

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post post={post} communityName={post.community.name} />
            </li>
          );
        } else {
          return <Post post={post} communityName={post.community.name} />;
        }
      })}
    </ul>
  );
};

export default PostFeed;
