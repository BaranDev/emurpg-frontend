import { motion } from "framer-motion";
import PropTypes from "prop-types";
import logoBlack from "../../assets/logo/LOGO_BLACK.png";

/* Wax seal — CSS-only, sits at top-center overlapping the card edge. */
const WaxSeal = () => (
  <div className="relative w-11 h-11 md:w-13 md:h-13">
    <div
      className="absolute inset-0 rounded-full"
      style={{
        background:
          "radial-gradient(circle at 38% 32%, #d4453a 0%, #b8261c 30%, #8b1a10 60%, #5c0f08 100%)",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,160,140,0.2), inset 0 -2px 4px rgba(0,0,0,0.35)",
      }}
    />
    {/* Stamp ring */}
    <div
      className="absolute rounded-full"
      style={{
        top: "14%",
        left: "14%",
        right: "14%",
        bottom: "14%",
        border: "1px solid rgba(0,0,0,0.12)",
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15), 0 0.5px 0 rgba(255,180,160,0.12)",
      }}
    />
    {/* Logo impression */}
    <div className="absolute inset-0 flex items-center justify-center p-2 md:p-2.5">
      <img
        src={logoBlack}
        alt=""
        className="w-full h-full object-contain select-none pointer-events-none"
        style={{
          opacity: 0.18,
          mixBlendMode: "multiply",
          filter: "contrast(1.4)",
        }}
      />
    </div>
    {/* Wax highlight */}
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        top: "6%",
        left: "10%",
        width: "40%",
        height: "28%",
        background:
          "radial-gradient(ellipse, rgba(255,200,180,0.25) 0%, transparent 100%)",
      }}
    />
  </div>
);

const EventCard = ({ title, date, description, rotation = 0 }) => (
  <motion.div
    whileHover={{ scale: 1.02, rotate: 0, y: -3 }}
    transition={{ type: "spring", stiffness: 350, damping: 25 }}
    className="relative group pt-5"
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    {/* Wax seal — overlaps top-center */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
      <WaxSeal />
    </div>

    {/* Card */}
    <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden p-5 md:p-6 transition-all duration-300">
      {/* Golden corner brackets — matches GameMasterCard style */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500/30 rounded-br-lg" />

      {/* Subtle warm overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-600/5 to-transparent rounded-lg pointer-events-none" />

      {/* Hover glow */}
      <div className="absolute inset-0 border border-yellow-500/0 group-hover:border-yellow-500/20 rounded-lg transition-colors duration-300 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 pt-3">
        {/* Title */}
        <h3 className="font-cinzel font-bold text-base md:text-lg text-yellow-500 leading-snug mb-1.5">
          {title}
        </h3>

        {/* Date with scroll divider */}
        <div className="flex items-center gap-2 mb-3">
          <p className="text-yellow-500/60 text-xs font-medium tracking-wider uppercase">
            {date}
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-yellow-500/20 to-transparent" />
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  </motion.div>
);

EventCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  rotation: PropTypes.number,
};

export default EventCard;
