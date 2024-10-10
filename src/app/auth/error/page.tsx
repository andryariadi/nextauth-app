"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { VscDebugStepBack } from "react-icons/vsc";

const AuthErrorPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/auth/login");
    }, 10000);

    return () => clearTimeout(timeout);
  });

  return (
    <div className="bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)] min-h-screen w-full flex flex-col items-center justify-center">
      <Image src="/error.svg" alt="error" width={800} height={800} />
      <Link href="/auth/login">
        <VscDebugStepBack size={40} className="hover:scale-110 transition-all duration-300 cursor-pointer text-green-700" />
      </Link>
    </div>
  );
};

export default AuthErrorPage;
