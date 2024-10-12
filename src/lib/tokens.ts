import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/db";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  console.log(token, "<---generateVerificationToken");

  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await prisma.verificationToken.findFirst({
    where: {
      email,
    },
  });

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      token,
      expires,
      email,
    },
  });

  return verificationToken;
};
