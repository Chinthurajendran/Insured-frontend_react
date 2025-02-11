import React from "react"
import { motion } from "framer-motion"

const text = "Insured+"

export default function AnimatedInsuredText() {
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-4xl font-bold">
        {text.split("").map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
            }}
            className={char === "+" ? "text-green-500" : "text-blue-600"}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

