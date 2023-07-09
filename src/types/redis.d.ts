import { VoteType } from "@prisma/client";

export type CachedPost = {
  id: string;
  title: string;
  content: string;
  authorUsername: string;
  communityId: string;
  currentVote: VoteType | null;
  createdAt: Date;
};
