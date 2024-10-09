"use server";

import { loginSchema, signupSchema } from "@/validators";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export const sigup = async ({ name, email, password }: z.infer<typeof signupSchema>) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) return { success: false, message: "User already exists" };

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (user) return { success: true, message: "User created successfully" };
  } catch (error) {
    console.log(error, "<--disignupserver");
    return { success: false, message: "An error occurred during user creation" };
  }
};

export const login = async ({ email, password }: z.infer<typeof loginSchema>) => {
  console.log(email, password, "<---diloginserver");

  try {
    await signIn("credentials", {
      email,
      password,
    });
  } catch (error) {
    console.log(error, "<---diloginserver");
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password!" };
        case "CallbackRouteError":
          const errorCause = error.cause?.err?.message;
          return { error: errorCause };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};

export const handleLogout = async () => {
  await signOut();
};
