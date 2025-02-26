import { motion } from "framer-motion";
import PropTypes from "prop-types";

const EventCard = ({ title, date, description, icon: Icon = null }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
    dragElastic={0}
    dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
    drag={false} // Explicitly disable drag while keeping the passive event handling
    className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-8 border-2 border-yellow-600/30 
  shadow-lg transition-all duration-300 group backdrop-blur-sm z-10 w-full"
  >
    <div className="absolute inset-0 bg-gradient-to-b from-yellow-600/10 to-transparent rounded-lg" />
    {Icon && (
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-900/30 mb-4">
        <Icon className="text-3xl text-yellow-500" />
      </div>
    )}
    <h3 className="text-2xl font-medieval font-bold mb-2 text-yellow-600 tracking-wide">
      {title}
    </h3>
    <p className="text-yellow-500/70 mb-4 text-sm font-medium">{date}</p>
    <p className="text-gray-300/90 leading-relaxed">{description}</p>
    <motion.div
      className="absolute inset-0 border-2 border-yellow-600 rounded-lg opacity-0 group-hover:opacity-100 
      transition-opacity duration-300 shadow-[inset_0_0_20px_rgba(234,179,8,0.1)]"
      initial={false}
      whileHover={{ scale: 1.01 }}
    />
  </motion.div>
);

EventCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
};

export default EventCard;
