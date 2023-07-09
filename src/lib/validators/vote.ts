import { z } from "zod";

export const PostVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(["UPVOTE", "DOWNVOTE"]),
});

export type PostVoteRequest = z.infer<typeof PostVoteValidator>;

export const CommentVoteValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(["UPVOTE", "DOWNVOTE"]),
});

export type CommentVoteRequest = z.infer<typeof CommentVoteValidator>;
