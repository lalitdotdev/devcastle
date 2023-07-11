// Handling the logic for api route /community/post/vote

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/vote";
import { CachedPost } from "@/types/redis";

import { z } from "zod";

const CACHE_AFTER_UPVOTES = 1;
// This API route is going to encapsulate One Piece One Central piece of the very very cool caching data logic that we're going to make use of in this application where we cache the most popular posts depending on UPVOTE and then we're able to fetch that data super quickly on the front end whenever somebody visits that post

export async function PATCH(req: Request) {
  // We're going to be using the zod library to validate the data that's coming in from the front end
  try {
    const body = await req.json();

    const { postId, voteType } = PostVoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // check if user has already voted on this post
    // if there is an existing vote, we're going to update it
    // if there is no existing vote, we're going to create it
    const existingVote = await db.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return new Response("Post not found", { status: 404 });
    }

    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });

        // Recount the votes
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UPVOTE") return acc + 1;
          if (vote.type === "DOWNVOTE") return acc - 1;
          return acc;
        }, 0);

        if (votesAmt >= CACHE_AFTER_UPVOTES) {
          const cachePayload: CachedPost = {
            authorUsername: post.author.username ?? "",
            content: JSON.stringify(post.content),
            id: post.id,
            title: post.title,
            currentVote: null,
            createdAt: post.createdAt,
          };

          await redis.hset(`post:${postId}`, cachePayload); // Store the post data as a hash
        }

        return new Response("OK");
      }

      // if vote type is different, update the vote
      await db.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });

      // Recount the votes
      const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === "UPVOTE") return acc + 1;
        if (vote.type === "DOWNVOTE") return acc - 1;
        return acc;
      }, 0);

      //& if the votes amount is greater than or equal to the cache after votes, we're going to cache the post in redis so that we can fetch it super quickly on the front end

      if (votesAmt >= CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedPost = {
          authorUsername: post.author.username ?? "",
          content: JSON.stringify(post.content),
          id: post.id,
          title: post.title,
          currentVote: voteType,
          createdAt: post.createdAt,
        };

        await redis.hset(`post:${postId}`, cachePayload); // Store the post data as a hash
      }

      return new Response("OK");
    }

    // if no existing vote, create a new vote
    await db.vote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        postId,
      },
    });

    // Recount the votes
    const votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UPVOTE") return acc + 1;
      if (vote.type === "DOWNVOTE") return acc - 1;
      return acc;
    }, 0);

    //& if the votes amount is greater than or equal to the cache after votes, we're going to cache the post in redis so that we can fetch it super quickly on the front end

    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedPost = {
        authorUsername: post.author.username ?? "",
        content: JSON.stringify(post.content),
        id: post.id,
        title: post.title,
        currentVote: voteType,
        createdAt: post.createdAt,
      };

      await redis.hset(`post:${postId}`, cachePayload); // Store the post data as a hash
    }

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid PATCH request data passed", { status: 422 });
    }

    return new Response("Could not register your vote. Please try later", {
      status: 500,
    });
  }
}
