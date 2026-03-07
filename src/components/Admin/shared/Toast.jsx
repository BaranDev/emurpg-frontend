import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  X
} from "lucide-react";
import PropTypes from "prop-types";
import { useEffect } from "react";

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
  error: <XCircle className="w-5 h-5 text-rose-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
};

const styles = {
  success: "bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-emerald-900/20",
  error: "bg-rose-950/90 border-rose-500/50 text-rose-100 shadow-rose-900/20",
  warning: "bg-amber-950/90 border-amber-500/50 text-amber-100 shadow-amber-900/20",
  info: "bg-blue-950/90 border-blue-500/50 text-blue-100 shadow-blue-900/20",
};

const Toast = ({ message, type = "info", isVisible, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95, x: "-50%" }}
          animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
          exit={{ opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 }, x: "-50%" }}
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl min-w-[300px] max-w-md ${styles[type]}`}
        >
          <div className="shrink-0">
            {icons[type]}
          </div>
          
          <div className="flex-1 text-sm font-medium">
            {message}
          </div>

          <button 
            onClick={onClose}
            className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 opacity-60" />
          </button>

          {/* Progress bar */}
          {duration > 0 && (
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-0 h-1 bg-current opacity-20`}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default Toast;
