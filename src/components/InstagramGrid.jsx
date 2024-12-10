import { InstagramEmbed } from "react-social-media-embed";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import SectionTitle from "./SectionTitle";

const InstagramSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const instagramPosts = [
    "https://www.instagram.com/p/DDXBJPfNrb5/",
    "https://www.instagram.com/p/DBWKpV9ix4H/",
    "https://www.instagram.com/p/DA_8KfniLGW/",
    "https://www.instagram.com/p/C6jQlz4MctY/",
  ];

  const slideVariants = {
    enter: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: 50,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    comeBack: {
      y: -50,
      opacity: 0,
    },
  };

  const handleSlideChange = (direction) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newIndex =
      (currentIndex + direction + instagramPosts.length) %
      instagramPosts.length;

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }, 300);
  };

  return (
    <div className="container mx-auto px-4 py-12 w-full md:w-[600px]">
      {/* Slider */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={slideVariants}
            initial="comeBack"
            animate="enter"
            exit="exit"
            transition={{
              y: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            <InstagramEmbed url={instagramPosts[currentIndex]} width="100%" />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="relative max-w-[300px] mx-auto">
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="relative text-yellow-500 hover:text-yellow-400 transition-colors bg-transparent hover:bg-transparent disabled:opacity-50"
            onClick={() => handleSlideChange(-1)}
            disabled={isAnimating}
          >
            <FaChevronLeft size={30} />
          </button>

          <button
            className="relative text-yellow-500 hover:text-yellow-400 transition-colors bg-transparent hover:bg-transparent disabled:opacity-50"
            onClick={() => handleSlideChange(1)}
            disabled={isAnimating}
          >
            <FaChevronRight size={30} />
          </button>
        </div>
        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {instagramPosts.map((_, index) => (
            <button
              key={index}
              disabled={isAnimating}
              onClick={() => {
                if (index !== currentIndex) {
                  handleSlideChange(index > currentIndex ? 1 : -1);
                }
              }}
              className={`w-2 h-2 rounded-full transition-colors disabled:opacity-50 ${
                index === currentIndex ? "bg-yellow-500" : "bg-yellow-500/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstagramSlider;
