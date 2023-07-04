import { z } from "zod"; // zod is a library for data validation and parsing that is simple and powerful. It is designed to be approachable, yet versatile enough to cover every use case.

export const CommunityValidator = z.object({
  name: z.string().min(3).max(255),
});

export const CommunitySubscriptionValidator = z.object({
  communityId: z.string(),
});

export type CreateCommunityPayload = z.infer<typeof CommunityValidator>;
export type SubscribeCommunityPayload = z.infer<
  typeof CommunitySubscriptionValidator
>;
