import { motion } from "framer-motion";
import PropTypes from "prop-types";

const SocialIcon = ({ icon, href, className, label, scale = 1.1 }) => (
  <motion.a
    href={href}
    whileHover={{ scale }}
    className={`flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors ${
      className || ""
    }`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <span className="text-3xl">{icon}</span>
    {label && (
      <span className="text-sm font-medium uppercase tracking-wider">
        {label}
      </span>
    )}
  </motion.a>
);

SocialIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  scale: PropTypes.number,
};

export default SocialIcon;
