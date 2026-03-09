import { motion } from "framer-motion";
import PropTypes from "prop-types";

const SocialButton = ({
  icon,
  text,
  onClick,
  className = "",
  backgroundColor = "bg-yellow-600",
  hoverColor = "hover:bg-yellow-700",
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center gap-2 ${backgroundColor} ${hoverColor} text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 ${className}`}
  >
    {icon}
    <span>{text}</span>
  </motion.button>
);

SocialButton.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  backgroundColor: PropTypes.string,
  hoverColor: PropTypes.string,
};

export default SocialButton;
