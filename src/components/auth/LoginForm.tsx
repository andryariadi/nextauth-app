"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IoMailOutline } from "react-icons/io5";
import { PiEye } from "react-icons/pi";
import { RiEyeCloseFill } from "react-icons/ri";
import { Lock } from "lucide-react";
import { BiLoaderCircle } from "react-icons/bi";
import InputField from "./InputField";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/validators";
import { login } from "@/lib/action";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes/routes";
import toast from "react-hot-toast";
import { toastStyle } from "@/lib/toastStyle";
import Oatuh from "./Oatuh";
import { GoCheckCircle } from "react-icons/go";
import { CiWarning } from "react-icons/ci";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [openPass, setOpenPass] = useState<boolean>(false);
  const [tokenMessage, setTokenMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const searchParams = useSearchParams();
  const errorUrl = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider!" : "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const dataEmail = { ...register("email") };
  const dataPassword = { ...register("password") };
  const dataCode = { ...register("code") };

  const handleLogin: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
    try {
      const res = await login(data);

      if (res?.success) {
        setTokenMessage(res?.success as string);
        reset();
      }

      if (res?.error) {
        setErrorMessage(res?.error as string);
      }

      const errorJson = JSON.parse(res?.error as string);
      if (errorJson) {
        setErrorMessage(errorJson.errors.password);
      }

      if (res?.twoFactor) {
        setShowTwoFactor(res?.twoFactor as boolean);
      }

      if (!res?.error && !res?.success && !res?.twoFactor) {
        toast.success("Login successful!", {
          style: toastStyle,
        });
      }

      router.push(DEFAULT_LOGIN_REDIRECT);
    } catch (error) {
      console.log(error, "<---handleLogin");
    }
  };

  // Old Way
  // const [isLoading, setisLoading] = useState<boolean>(false);
  // const [isError, setIsError] = useState<InputState>({
  //   email: "",
  //   password: "",
  // });

  // const [input, setInput] = useState<InputState>({
  //   email: "",
  //   password: "",
  // });

  // const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
  //   const { name, value } = e.target;
  //   setInput((prevInput) => ({
  //     ...prevInput,
  //     [name]: value,
  //   }));
  // };

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
  //   e.preventDefault();
  //   setisLoading(true);

  //   try {
  //     const res = await login(input);
  //     const errorBre = JSON.parse(res?.error as string);
  //     setIsError(errorBre.errors);
  //     router.push(DEFAULT_LOGIN_REDIRECT);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setisLoading(false);
  //   }
  // };

  console.log(showTwoFactor, "<---showtwofactor");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl text-gray-400">
      {/* Top */}
      <div className="p-8 flex flex-col gap-5">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Welcome Back</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-6">
          {!showTwoFactor && (
            <>
              <div className="bg-violt-500 bg-ros-500 flex flex-col gap-8">
                <div className="relative">
                  <InputField icon={<IoMailOutline size={22} />} type="email" placeholder="Email" name="email" propData={dataEmail} />

                  {errors.email && <p className="absolute -bottom-5 text-red-500 text-sm">{errors.email.message as string}</p>}
                </div>

                <div className="relative">
                  <InputField
                    icon={<Lock size={22} />}
                    passIcon={openPass ? <PiEye size={22} /> : <RiEyeCloseFill size={22} />}
                    openPass={openPass}
                    setOpenPass={setOpenPass}
                    type={openPass ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    propData={dataPassword}
                  />

                  {errors.password && <p className="absolute -bottom-5 text-red-500 text-sm">{errors.password.message as string}</p>}
                </div>
              </div>

              <div className="mt-2">
                <Link href="/auth/reset-password" className="text-green-500 text-sm inline-block hover:scale-105 transition-all duration-300">
                  Forgot Password?
                </Link>
              </div>
            </>
          )}

          {showTwoFactor && (
            <div className="relative">
              <InputField icon={<IoMailOutline size={22} />} type="text" placeholder="Enter your code" name="code" propData={dataCode} />

              {errors.code && <p className="absolute -bottom-5 text-red-500 text-sm">{errors.code.message as string}</p>}
            </div>
          )}

          <span className="text-red-500 text-sm">{errorUrl}</span>

          {tokenMessage && (
            <div className="flex items-center justify-center gap-2 bg-emerald-400 bg-opacity-20 rounded-lg p-2 text-emerald-400">
              <GoCheckCircle size={20} />
              <p>{tokenMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center justify-center gap-2 bg-rose-500 bg-opacity-20 rounded-lg p-2 text-rose-500">
              <CiWarning size={20} />
              <p>{errorMessage}</p>
            </div>
          )}

          <motion.button
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <BiLoaderCircle size={22} className="animate-spin mx-auto" /> : showTwoFactor ? "Confirm" : "Login"}
          </motion.button>
        </form>

        {/* OAuth */}
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-xs">or login with</p>
          {/* Tempatkan OAuth diluar form agar bisa memakai signIn dari Server Action atau dari NextAuth/React */}
          <Oatuh />
        </div>
      </div>

      {/* Bottom */}
      <div className="bg-gray-800 bg-opacity-50 px-8 py-4 text-sm">
        <p className="text-center text-gray-400">
          Don&apos;t have an account?
          <Link href="/auth/register" className="text-green-500 ml-2 inline-block hover:scale-110 transition-all duration-300">
            Signup
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;
