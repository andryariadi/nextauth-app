"use client";

import { motion } from "framer-motion";

type FloatingShapeProps = {
  color: string;
  size: string;
  top: string;
  left: string;
  delay: number;
};

const FloatingShape = ({ color, size, top, left, delay }: FloatingShapeProps) => {
  return (
    <motion.div
      className={`absolute ${color} ${size} rounded-full opacity-20 blur-xl`}
      style={{ top, left }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: ["0deg", "360deg"],
      }}
      transition={{
        duration: 20,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
      aria-hidden="true"
    />
  );
};

export default FloatingShape;
