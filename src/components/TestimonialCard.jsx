import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import PropTypes from "prop-types";

const TestimonialCard = ({ quote, author }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800 rounded-lg p-6 relative"
  >
    <FaQuoteLeft className="text-3xl text-yellow-500/20 absolute top-4 left-4" />
    <blockquote className="text-gray-300 text-lg italic mt-6 mb-4">
      "{quote}"
    </blockquote>
    <p className="text-yellow-500 text-right">- {author}</p>
  </motion.div>
);

TestimonialCard.propTypes = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

export default TestimonialCard;
