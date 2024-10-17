"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
// import { handleLogout } from "@/lib/action";
// import { auth } from "@/lib/auth";
import { signOut, useSession } from "next-auth/react";

const SettingsPage = () => {
  // Get session in server side
  // const session = await auth();

  // Get session in client side
  const session = useSession();
  const user = useCurrentUser();

  // Function to handle logout in client side
  const handleLogout = () => {
    signOut();
  };

  console.log(session, "<----disettingspage");

  return (
    <div className="bg-gray-700 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl text-gray-400 w-full max-w-2xl">
      {/* Handle logout in client side */}
      <button type="submit" onClick={handleLogout}>
        Logout
      </button>

      {/* Handle logout in server side */}
      {/* <form action={handleLogout}>
        <button type="submit">Logout</button>
      </form> */}
    </div>
  );
};

export default SettingsPage;
