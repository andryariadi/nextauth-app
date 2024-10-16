import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/validators";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        console.log(validatedFields, "<---dicredentials1");

        if (!validatedFields.success) {
          const errorMessages = validatedFields.error.flatten().fieldErrors;

          throw new Error(
            JSON.stringify({
              success: false,
              error: true,
              errors: errorMessages,
            })
          );
        }

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          console.log(user, "<---dicredentials2");

          if (!user || !user.password) {
            throw new Error(
              JSON.stringify({
                success: false,
                error: true,
                errors: { email: "User not found or Invalid email!" },
              })
            );
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            throw new Error(
              JSON.stringify({
                success: false,
                error: true,
                errors: { password: "Invalid password!" },
              })
            );
          }

          return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
