"use server";

import { signupSchema } from "@/validators";
import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "@/lib/db";

export const sigup = async ({ username, email, password }: z.infer<typeof signupSchema>) => {
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
        username,
        email,
        password: hashedPassword,
      },
    });

    if (user) return { success: true, message: "User created successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "An error occurred during user creation" };
  }
};
