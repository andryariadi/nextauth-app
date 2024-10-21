import { UserRole } from "@prisma/client";
import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, { message: "Username is required!" }),
  email: z.string().min(1, { message: "Email is required!" }).email({ message: "Please provide a valid email!" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long!" }),
});

export const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is required!" }).email({ message: "Please provide a valid email!" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long!" }),
  code: z.optional(z.string()),
});

export const resetSchema = z.object({
  email: z.string().min(1, { message: "Email is required!" }).email({ message: "Please provide a valid email!" }),
});

export const newPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters long!" }),
});

export const settingSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6, { message: "Password must be at least 6 characters long!" })),
    newPassword: z.optional(z.string().min(6, { message: "New Password must be at least 6 characters long!" })),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    isTwoFactorEnabled: z.optional(z.boolean()),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.password) return false;

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      if (data.password && !data.newPassword) return false;

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  );
