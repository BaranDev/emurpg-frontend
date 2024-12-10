import { motion } from "framer-motion";
import PropTypes from "prop-types";

const SocialIcon = ({ icon, href, className, scale = 1.2 }) => (
  <motion.a
    href={href}
    whileHover={{ scale }}
    className={`text-2xl text-yellow-500 hover:text-yellow-400 transition-colors ${
      className || ""
    }`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </motion.a>
);

SocialIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
  scale: PropTypes.number,
};

export default SocialIcon;
