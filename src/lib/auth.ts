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

      // Prevent sign in if 2FA is enabled
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
          where: {
            userId: existingUser.id,
          },
        });

        console.log({ twoFactorConfirmation }, "<---dicallbacksignin3");

        // Prevent sign in if 2FA is not confirmed
        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for new sign in
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }

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

      console.log({ existingUser }, "<---dicallbackjwt2");

      if (!existingUser) return token;

      const existingAccount = await prisma.account.findFirst({
        where: { userId: existingUser.id },
      });

      token.isOAuth = existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

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

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
  },
  ...authConfig,
});
