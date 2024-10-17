"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiMiniUser } from "react-icons/hi2";
import { BiLogOutCircle } from "react-icons/bi";
import { signOut } from "next-auth/react";
import useCurrentUser from "@/hooks/useCurrentUser";
import Image from "next/image";

const Navbar = () => {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);

  const user = useCurrentUser();

  const handleLogout = () => {
    signOut();
  };

  console.log(user, "<---dinavbar");

  return (
    <nav className="relative z-10 bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-2xl flex items-center justify-between p-5">
      {/* Right */}

      <div className="b-amber-600 flex items-center gap-5 font-semibold">
        <Link href="/server" className={`py-2 px-6 rounded-md ${pathName === "/server" ? "bg-emerald-600 text-white" : "text-gray-400"}`}>
          Server
        </Link>
        <Link href="/client" className={`py-2 px-6 rounded-md ${pathName === "/client" ? "bg-emerald-600 text-white" : "text-gray-400"}`}>
          CLient
        </Link>
        <Link href="/admin" className={`py-2 px-6 rounded-md ${pathName === "/admin" ? "bg-emerald-600 text-white" : "text-gray-400"}`}>
          Admin
        </Link>
        <Link href="/settings" className={`py-2 px-6 rounded-md ${pathName === "/settings" ? "bg-emerald-600 text-white" : "text-gray-400"}`}>
          Settings
        </Link>
      </div>

      {/* Left */}
      <div onClick={() => setOpen(!open)} className="b-violet-600 p-[5px] rounded-full border border-gray-400 cursor-pointer">
        <HiMiniUser size={22} className="text-gray-400" />
      </div>

      {open && (
        <div className="absolute top-[5.5rem] right-0 bg-emerald-600 rounded-2xl shadow-xl w-full max-w-36 p-2 flex flex-col items-center justify-center gap-2 text-gray-200">
          <div className="b-amber-500 flex items-center justify-between w-full">
            {user?.image && <Image src={user?.image} width={40} height={40} alt="Avatar" className="rounded-full object-cover" />}
            <span className="text-sm font-medium text-nowrap">{user?.name}</span>
          </div>

          <button onClick={handleLogout} className="self-end">
            <BiLogOutCircle size={24} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
