"use client";

import { newVerification } from "@/lib/action";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { GoCheckCircle } from "react-icons/go";
import { CiWarning } from "react-icons/ci";
import { IoIosArrowRoundBack } from "react-icons/io";
import { BeatLoader } from "react-spinners";
import Link from "next/link";

const NewVerificationPage = () => {
  const searchParams = useSearchParams();
  const [succes, setSucces] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const token = searchParams.get("token");

  const handleSubmit = useCallback(() => {
    console.log(token, "<---newverificationpage");

    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        console.log(data, "<---newverificationpage2");
        setSucces(data?.success);
        setError(data?.error);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [token]);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  console.log({ succes, error }, "<---newverificationpage3");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl text-gray-400">
      <div className="b-violet-600 flex flex-col items-center gap-7 p-5">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">Verify Your Email</h2>

        {!succes && !error && <BeatLoader size={13} color={"#21C480"} />}

        {succes && (
          <div className="flex items-center justify-center gap-2 bg-emerald-400 bg-opacity-20 rounded-lg p-2 text-emerald-400">
            <GoCheckCircle size={20} />
            <p>{succes}</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center gap-2 bg-rose-500 bg-opacity-20 rounded-lg p-2 text-rose-500">
            <CiWarning size={20} />
            <p>{error}</p>
          </div>
        )}
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

export default NewVerificationPage;
