import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "@/lib/auth.config";
import prisma from "@/lib/db";
import { UserRole } from "@prisma/client";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       role: "ADMIN" | "USER";
//     } & DefaultSession["user"];
//   }
// }

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      console.log({ user }, "<---dilinkaccount");

      // Update emailVerified for OAuth users
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log({ user, account, profile }, "<---dicallbacksignin");

      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      console.log({ existingUser }, "<---dicallbacksignin2");

      // Prevent sign in if email is not verified
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async jwt({ token, user }) {
      console.log({ token, user }, "<---dicallbackjwt");

      if (!token.sub) return token;

      const existingUser = await prisma.user.findUnique({
        where: {
          id: token.sub,
        },
      });

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
    async session({ session, token }) {
      console.log({ session, token }, "<---dicallbacksession");

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
  },
  ...authConfig,
});
