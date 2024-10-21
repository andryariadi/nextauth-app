"use client";

import RoleGate from "@/components/auth/RoleGate";
import { toastStyle } from "@/lib/toastStyle";
import { UserRole } from "@prisma/client";
import toast from "react-hot-toast";
import { GoCheckCircle } from "react-icons/go";
import axios from "axios";
import { admin } from "@/lib/action";

const AdminPage = () => {
  const onApiRouteClick = async () => {
    try {
      const res = await axios.get("/api/admin");

      if (res.status === 200) {
        toast.success("API route accessed!", {
          style: toastStyle,
        });
      }
    } catch (error) {
      console.log(error, "<---diadminpage>");
      if (error.response?.status === 403) {
        toast.error("Forbidden!", {
          style: toastStyle,
        });
      } else {
        toast.error("An error occurred!", {
          style: toastStyle,
        });
      }
    }
  };

  const onServerActionClick = async () => {
    try {
      const res = await admin();

      if (res?.error) {
        toast.error(res?.error, { style: toastStyle });
      } else if (res?.success) {
        toast.success(res?.success, { style: toastStyle });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-700 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl text-gray-400 w-full max-w-2xl p-5 flex flex-col items-center gap-7">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Admin</h2>

      <div className="b-violet-500 flex flex-col gap-3 w-full">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <div className="flex items-center justify-center gap-5 bg-emerald-400 bg-opacity-20 rounded-lg p-2 text-emerald-400">
            <GoCheckCircle size={20} />
            <p>You are allowed to see this content!</p>
          </div>
        </RoleGate>

        <div className="b-rose-500 p-3 border-b border-gray-400 w-full flex items-center justify-between">
          <span>Admin-only API Route</span>
          <button onClick={onApiRouteClick} className="py-2 px-4 mt-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300">
            Click to test
          </button>
        </div>

        <div className="b-rose-500 p-3 border-b border-gray-400 w-full flex items-center justify-between">
          <span>Admin-only Server Action</span>
          <form action={onServerActionClick}>
            <button className="py-2 px-4 mt-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300">Click to test</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
