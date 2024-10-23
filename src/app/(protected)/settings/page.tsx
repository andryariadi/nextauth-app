"use client";

import { motion } from "framer-motion";
import { settingSchema } from "@/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { BiLoaderCircle } from "react-icons/bi";
import InputField from "@/components/auth/InputField";
import { Lock, UserRound } from "lucide-react";
import { updateUser } from "@/lib/action";
import toast from "react-hot-toast";
import { toastStyle } from "@/lib/toastStyle";
import useCurrentUser from "@/hooks/useCurrentUser";
import { IoMailOutline } from "react-icons/io5";
import { PiEye } from "react-icons/pi";
import { RiEyeCloseFill } from "react-icons/ri";
import { useState } from "react";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";

const SettingsPage = () => {
  const user = useCurrentUser();
  const { update } = useSession();

  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
  });

  const togglePasswordVisibility = (type: "current" | "new") => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof settingSchema>>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const dataUsername = { ...register("name") };
  const dataEmail = { ...register("email") };
  const dataPassword = { ...register("password") };
  const dataNewPassword = { ...register("newPassword") };

  const handleUpdateUser: SubmitHandler<z.infer<typeof settingSchema>> = async (data) => {
    console.log(data, "<---diupdateuser");

    try {
      const res = await updateUser(data);

      if (res?.success) {
        toast.success(res?.success, { style: toastStyle });
        update();
      }

      if (res?.error) {
        toast.error(res?.error, { style: toastStyle });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-700 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl text-gray-400 w-full max-w-2xl p-5 space-y-5">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Settings</h2>

      <form onSubmit={handleSubmit(handleUpdateUser)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-8">
          <div className="relative">
            <InputField icon={<UserRound size={22} />} type="text" placeholder="Username" propData={dataUsername} />
            {errors.name && <p className="absolute -bottom-5 text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {user?.isOAuth === null && (
            <>
              <div className="relative">
                <InputField icon={<IoMailOutline size={22} />} type="email" placeholder="Email" propData={dataEmail} />
                {errors.email && <p className="absolute -bottom-5 text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              <div className="relative">
                <InputField
                  icon={<Lock size={22} />}
                  passIcon={passwordVisibility.current ? <PiEye size={22} /> : <RiEyeCloseFill size={22} />}
                  openPass={passwordVisibility.current}
                  setOpenPass={() => togglePasswordVisibility("current")}
                  type={passwordVisibility.current ? "text" : "password"}
                  placeholder="Password"
                  propData={dataPassword}
                />
                {errors.password && <p className="absolute -bottom-5 text-red-500 text-sm">{errors.password.message}</p>}
              </div>

              <div className="relative">
                <InputField
                  icon={<Lock size={22} />}
                  passIcon={passwordVisibility.new ? <PiEye size={22} /> : <RiEyeCloseFill size={22} />}
                  openPass={passwordVisibility.new}
                  setOpenPass={() => togglePasswordVisibility("new")}
                  type={passwordVisibility.new ? "text" : "password"}
                  placeholder="New Password"
                  propData={dataNewPassword}
                />
                {errors.newPassword && <p className="absolute -bottom-5 text-red-500 text-sm">{errors.newPassword.message}</p>}
              </div>
            </>
          )}

          <div className="relative">
            <select
              id="role"
              {...register("role")}
              className="w-full pl-4 py-3 bg-gray-800 bg-opacity-50 rounded-lg outline-none border border-gray-700 focus:border-green-500  placeholder:text-sm placeholder-gray-400 placeholder-opacity-50 transition-all duration-300 text-sm text-gray-500 cursor-pointer"
            >
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.USER}>User</option>
            </select>
            {errors.role && <p className="absolute -bottom-5 text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          {user?.isOAuth === null && (
            <div className="relative">
              <div className="b-rose-600 flex items-center justify-between py-3 px-5 rounded-lg bg-gray-800 bg-opacity-50 border border-gray-700">
                <div className="flex flex-col gap-1">
                  <h5 className="text-xl font-bold">Two Factor Authentication</h5>
                  <span className="text-sm text-gray-400">Enable two factor authentication to protect your account</span>
                </div>

                <label className="relative inline-block h-7 w-[48px] cursor-pointer rounded-full bg-gray-800 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-[#22C55E]">
                  <input {...register("isTwoFactorEnabled")} type="checkbox" id="AcceptConditions" className="peer sr-only" />
                  <span className="absolute inset-y-0 start-0 m-1 size-5 rounded-full bg-gray-300 ring-[5px] ring-inset ring-white transition-all peer-checked:start-7 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"></span>
                </label>
              </div>
            </div>
          )}
        </div>

        <motion.button
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <BiLoaderCircle size={22} className="animate-spin mx-auto" /> : "Update"}
        </motion.button>
      </form>
    </div>
  );
};

export default SettingsPage;
