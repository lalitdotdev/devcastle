import { Community, Post, User, Vote, Comment, Bookmark } from "@prisma/client";

export type ExtendedPost = Post & {
  community: Community;
  votes: Vote[];
  author: User;
  comments: Comment[];
  bookmarks: Bookmark[];
};
