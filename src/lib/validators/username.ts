import { z } from "zod";

export const UserProfileValidator = z.object({
  name: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/),
  about: z.string().max(256),
});
