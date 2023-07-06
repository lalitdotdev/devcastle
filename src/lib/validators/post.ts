import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: " Title must be longer than 3 characters" })
    .max(128, {
      message: "Title must be shorter than 128 characters",
    }),
  communityId: z.string(),
  content: z.any(),
});

export type PostCreateRequest = z.infer<typeof PostValidator>;
