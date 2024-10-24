"use server";

import { loginSchema, newPasswordSchema, resetSchema, settingSchema, signupSchema } from "@/validators";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { generateResetPasswordToken, generateTwoFactorToken, generateVerificationToken } from "./tokens";
import { sendResetPasswordEmail, sendTwoFactorTokenEmail, sendVerificationEmail } from "./mail";
import { currentRole, currentUser } from "./currentUser";
import { UserRole } from "@prisma/client";

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

export const login = async ({ email, password, code }: z.infer<typeof loginSchema>) => {
  console.log({ email, password, code }, "<---diloginserver1");

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    console.log(existingUser, "<---diloginserever2");

    if (!existingUser || !existingUser.email) return { error: "Email does not exist!" };

    // Check if email is verified
    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(email);

      await sendVerificationEmail(verificationToken.email, verificationToken.token);

      return { success: "Confirmation email sent!" };
    }

    // Handle two-factor authentication if enabled
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      if (code) {
        const twoFactorToken = await prisma.twoFactorToken.findFirst({
          where: {
            email: existingUser.email,
          },
        });

        if (!twoFactorToken) return { error: "Invalid code!" };

        if (twoFactorToken.token !== code) return { error: "Invalid code!" };

        const hasExpired = new Date(twoFactorToken.expires) < new Date();
        if (hasExpired) return { error: "Code has expired!" };

        await prisma.twoFactorToken.delete({
          where: {
            id: twoFactorToken.id,
          },
        });

        const existingTwoFoctorConfirmation = await prisma.twoFactorConfirmation.findUnique({ where: { userId: existingUser.id } });

        if (existingTwoFoctorConfirmation) {
          await prisma.twoFactorConfirmation.delete({
            where: {
              id: existingTwoFoctorConfirmation.id,
            },
          });
        }

        // Create two-factor confirmation
        await prisma.twoFactorConfirmation.create({
          data: { userId: existingUser.id },
        });
      } else {
        // Generate and send two-factor token
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);

        return { twoFactor: true, success: "Two factor code email sent!" };
      }
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
          console.log(errorCause, "<---diloginserver3");
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

    const resetPasswordToken = await generateResetPasswordToken(email);

    await sendResetPasswordEmail(resetPasswordToken.email, resetPasswordToken.token);

    return { success: "Reset email sent!" };
  } catch (error) {
    console.log(error, "<---diresetpasswordserver");
  }
};

export const newPassword = async ({ password }: z.infer<typeof newPasswordSchema>, token: string | null) => {
  try {
    console.log({ password, token }, "<---dinewpasswordserver");

    if (!token) return { error: "Missing token!" };

    const existingToken = await prisma.resetPasswordToken.findUnique({
      where: {
        token,
      },
    });
    if (!existingToken) return { error: "Invalid token!" };

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) return { error: "Token has expired!" };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: existingToken.email,
      },
    });
    if (!existingUser) return { error: "Email does not exist!" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    await prisma.resetPasswordToken.delete({
      where: {
        id: existingToken.id,
      },
    });

    return { success: "Password reset successfully!" };
  } catch (error) {
    console.log(error);
  }
};

export const admin = async () => {
  try {
    const role = await currentRole();

    if (role !== UserRole.ADMIN) return { error: "Forbidden!" };

    return { success: "Allowed server action!" };
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (data: z.infer<typeof settingSchema>) => {
  console.log(data, "<---updateUserServer");

  try {
    const user = await currentUser();

    if (!user) return { error: "Unauthorized!" };

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) return { error: "Unauthorized!" };

    // Prevent user OAuth cannot update this data
    if (user.isOAuth) {
      data.email = undefined;
      data.password = undefined;
      data.newPassword = undefined;
      data.isTwoFactorEnabled = undefined;
    }

    // Prevent if user trying update email
    if (data.email && data.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (existingUser && existingUser.id !== user.id) return { error: "Email already in use!" };

      const verificationToken = await generateVerificationToken(data.email);

      await sendVerificationEmail(verificationToken.email, verificationToken.token);

      return { success: "Verification email sent!" };
    }

    // Validation if user trying update password
    if (data.password && data.newPassword && dbUser.password) {
      const passwordsMatch = await bcrypt.compare(data.password, dbUser.password);

      if (!passwordsMatch) return { error: "Incorrect password!" };

      const hashedPassword = await bcrypt.hash(data.newPassword, 10);

      data.password = hashedPassword;
      data.newPassword = undefined;
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...data,
      },
    });

    return { success: "User updated successfully!" };
  } catch (error) {
    console.log(error);
  }
};
