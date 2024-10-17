import type { Metadata } from "next";
import { Poppins } from "next/font/google";
// import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "NextAuth",
  description: "Next Auth Authentication with Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${poppins.variable} antialiased bg-gray-800`}>
          {children}
          <Toaster position="top-right" />
        </body>
      </html>
    </SessionProvider>
  );
}
