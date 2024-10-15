"use client";

import InputField from "@/components/auth/InputField";
import { resetPassword } from "@/lib/action";
import { resetSchema } from "@/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiLoaderCircle } from "react-icons/bi";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoMailOutline } from "react-icons/io5";
import { z } from "zod";

const ResetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
  });

  const dataEmail = { ...register("email") };

  const handleResetPassword: SubmitHandler<z.infer<typeof resetSchema>> = async (data) => {
    console.log(data, "<---diresetpassword");

    await resetPassword(data);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl text-gray-400">
      <div className="space-y-8 p-8">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Reset Password</h2>

          <p className="text-sm">Forgot your password? Enter your email address and we will send you a link to reset it.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleResetPassword)} className="flex flex-col gap-12">
          <div className="bg-violt-500 bg-ros-500 flex flex-col gap-8">
            <div className="relative">
              <InputField icon={<IoMailOutline size={22} />} type="email" placeholder="Email" name="email" propData={dataEmail} />

              {errors.email && <p className="absolute -bottom-5 text-red-500 text-sm">{errors.email.message as string}</p>}
            </div>
          </div>

          <motion.button
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <BiLoaderCircle size={22} className="animate-spin mx-auto" /> : "Send reset email"}
          </motion.button>
        </form>
      </div>

      <div className="bg-gray-800 bg-opacity-50 px-8 py-4 text-sm text-green-500 flex items-center justify-center gap-3 hover:scale-110 transition-all duration-300">
        <IoIosArrowRoundBack size={20} />
        <Link href="/auth/login" className="ml-2 inline-block">
          Back to Login
        </Link>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
