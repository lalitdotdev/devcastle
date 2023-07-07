import { Community, Post, User, Vote, Comment } from "@prisma/client";

export type ExtendedPost = Post & {
  community: Community;
  votes: Vote[];
  author: User;
  comments: Comment[];
};
