"use server";

import { loginSchema, resetSchema, signupSchema } from "@/validators";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./mail";

export const handleGithubLogin = async () => {
  await signIn("github");
};

export const handleGoogleLogin = async () => {
  await signIn("google");
};

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

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    if (user && verificationToken) return { success: true, usermessage: "User created successfully!", tokenmessage: "Confirmation email sent!" };
  } catch (error) {
    console.log(error, "<--disignupserver");
    return { success: false, message: "An error occurred during user creation" };
  }
};

export const login = async ({ email, password }: z.infer<typeof loginSchema>) => {
  console.log(email, password, "<---diloginserver");

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    console.log(existingUser, "<---diloginserever2");

    if (!existingUser || !existingUser.email || !existingUser.password) return { error: "Email does not exist!" };

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(email);

      await sendVerificationEmail(verificationToken.email, verificationToken.token);

      return { succes: "Confirmation email sent!" };
    }

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

export const newVerification = async (token: string) => {
  console.log(token, "<---dinewverificationserver");

  const existingToken = await prisma.verificationToken.findUnique({
    where: {
      token,
    },
  });

  console.log(existingToken, "<---dinewverificationserver2");

  if (!existingToken) return { error: "Token does not exist!" };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "Token has expired!" };

  const existingUser = await prisma.user.findUnique({
    where: {
      email: existingToken.email,
    },
  });

  console.log(existingUser, "<---dinewverificationserver3");

  if (!existingUser) return { error: "User does not exist!" };

  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prisma.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Email verified!" };
};

export const resetPassword = async ({ email }: z.infer<typeof resetSchema>) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) return { error: "Email not found!" };

    return { success: "Reset email sent!" };
  } catch (error) {
    console.log(error, "<---diresetpasswordserver");
  }
};
