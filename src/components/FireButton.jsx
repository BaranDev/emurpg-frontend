import { motion } from "framer-motion";
import React from "react";

const FireButton = ({
  onClick,
  color1 = "yellow",
  color2 = "orange",
  sparkcolor = "red",
  textcolor = "white",
  text = "",
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`relative overflow-hidden group bg-${color1}-600 text-${textcolor} font-bold py-4 px-8 rounded-lg transform transition-all duration-300 mx-2 my-2`}
    onClick={onClick}
  >
    {/* Fire effects container */}
    <div className="absolute inset-0 overflow-hidden">
      {/* Base glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-${color2}-600 via-${color1}-500 to-transparent opacity-50 animate-pulse`}
      />
      {/* Ember particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 bg-${sparkcolor}-200 rounded-full`}
            animate={{
              y: [-20, -60],
              x: [0, i % 2 === 0 ? 20 : -20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut",
            }}
            style={{
              left: `${10 + i * 10}%`,
              bottom: "0%",
            }}
          />
        ))}
      </div>
    </div>

    {/* Button content */}
    <span className="relative z-10">{text}</span>
    <div className="absolute inset-0 bg-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000" />
  </motion.button>
);

export default FireButton;
