import { z } from 'zod';

export const CommentValidator = z.object({
  postId: z.string(),
  text: z.string().min(1).max(255),
  replyToId: z.string().optional(),
});

export type CommentRequest = z.infer<typeof CommentValidator>;
