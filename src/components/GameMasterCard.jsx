import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FaScroll, FaQuoteLeft } from "react-icons/fa";

const GameMasterCard = ({ name, title, description, image }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden p-8 group"
  >
    {/* Decorative corners */}
    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-lg" />
    <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-lg" />
    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-lg" />
    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-yellow-500/30 rounded-br-lg" />

    {/* Main content */}
    <div className="relative z-10">
      {/* Image container with decorative border */}
      <div className="relative w-36 h-36 mx-auto mb-6">
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/20 to-yellow-600/20"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <div className="absolute inset-2 rounded-full overflow-hidden border-2 border-yellow-500/30 p-1">
          <div className="w-full h-full rounded-full overflow-hidden select-none pointer-events-none">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Title section with scroll icon */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
          <FaScroll className="text-yellow-500/50 mx-2" />
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
        </div>
        <h3 className="text-2xl font-bold text-yellow-500 mb-2">{name}</h3>
        <p className="text-yellow-300/90 font-medieval italic">{title}</p>
      </div>

      {/* Description with fancy border */}
      {description ? (
        <div className="relative mt-6 pt-6 border-t border-yellow-500/20">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 px-4">
            <div className="w-2 h-2 bg-yellow-500/30 rotate-45" />
          </div>
          <FaQuoteLeft className="absolute top-0 left-0 text-yellow-500/30 text-sm -translate-x-4 -translate-y-[-10px]" />
          <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
      ) : null}
    </div>

    {/* Hover effect overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </motion.div>
);

GameMasterCard.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default GameMasterCard;
