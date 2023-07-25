import { z } from "zod";

// Define a custom regular expression pattern for password validation
const passwordPattern =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
export const UserRegisterationValidator = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z.string().email() || z.string().min(2).max(30),
  password: z
    .string()
    .min(8)
    .max(50)
    .refine(value => passwordPattern.test(value), {
      message:
        "Password must be at least 8 characters long and contain at least one letter, one number, and one special character (@$!%*#?&).",
    }),
});

export const UserLoginValidator = z.object({
  email: z.string().email(),
  password: z.string(),
});
