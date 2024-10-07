"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IoMailOutline } from "react-icons/io5";
import { PiEye } from "react-icons/pi";
import { RiEyeCloseFill } from "react-icons/ri";
import { Lock, UserRound } from "lucide-react";
import { BiLoaderCircle } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { ImGithub } from "react-icons/im";
import InputField from "./InputField";
import { useState, FormEvent } from "react";

const RegisterForm: React.FC = () => {
  const [openPass, setOpenPass] = useState<boolean>(false);
  const isLoading = false;

  // Event handler for form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    console.log("masuk nih bree");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl text-gray-400">
      {/* Top */}
      <div className="p-8 flex flex-col gap-5">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Create Account</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="bg-violt-500 bg-ros-500 flex flex-col gap-4">
            <InputField icon={<UserRound size={22} />} type="text" placeholder="Username" name="username" />

            <InputField icon={<IoMailOutline size={22} />} type="email" placeholder="Email" name="email" />

            <InputField
              icon={<Lock size={22} />}
              passIcon={openPass ? <PiEye size={22} /> : <RiEyeCloseFill size={22} />}
              openPass={openPass}
              setOpenPass={setOpenPass}
              type={openPass ? "text" : "password"}
              placeholder="Password"
              name="password"
            />
          </div>

          {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

          <motion.button
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <BiLoaderCircle size={22} className="animate-spin mx-auto" /> : "Login"}
          </motion.button>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-xs">or sigup with</p>
            <div className="flex items-center justify-center gap-10">
              <FcGoogle size={24} className="hover:scale-110 transition-all duration-300 cursor-pointer" />
              <ImGithub size={24} className="hover:scale-110 transition-all duration-300 cursor-pointer" />
            </div>
          </div>
        </form>
      </div>

      {/* Bottom */}
      <div className="bg-gray-800 bg-opacity-50 px-8 py-4 text-sm">
        <p className="text-center text-gray-400">
          Already have an account?
          <Link href="/auth/login" className="text-green-500 ml-2 inline-block hover:scale-110 transition-all duration-300">
            Register
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
