import { motion } from "framer-motion";

const NewsCard = ({ title, date, excerpt }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800 rounded-lg p-6"
  >
    <h3 className="text-xl font-bold text-yellow-500 mb-2">{title}</h3>
    <p className="text-gray-400 text-sm mb-4">{date}</p>
    <p className="text-gray-300">{excerpt}</p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      className="mt-4 text-yellow-500 hover:text-yellow-400"
    >
      Read More →
    </motion.button>
  </motion.div>
);

export default NewsCard;
