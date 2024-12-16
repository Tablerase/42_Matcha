import { z } from "zod";

export const userCreationSchema = z
  .object({
    firstName: z
      .string({
        required_error: "First name is required",
      })
      .trim()
      .min(1, "First name must be at least 1 characters"),
    lastName: z
      .string({
        required_error: "Last name is required",
      })
      .trim()
      .min(1, "Last name must be at least 1 characters"),
    username: z
      .string({
        required_error: "Username is required",
      })
      .trim()
      .min(3, "Username must be at least 3 characters"),
    email: z
      .string({
        required_error: "Email is required",
      })
      .trim()
      .email("Invalid email format"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .trim()
      .min(8, "Password must be at least 8 characters")
      .max(32),
  })
  .strict();

export const userLoginSchema = z
  .object({
    username: z
      .string({
        required_error: "Username is required",
      })
      .trim()
      .min(3, "Username must be at least 3 characters"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .trim()
      .min(8, "Password must be at least 8 characters")
      .max(32),
  })
  .strict();
