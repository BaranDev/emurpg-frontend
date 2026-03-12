import PropTypes from "prop-types";
import { X } from "lucide-react";

const CORNER_POS = ["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"];

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-[95vw]",
};

const AdminModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showClose = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(30,10,60,0.55) 0%, rgba(0,0,0,0.88) 100%)",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden rounded-xl`}
        style={{
          background: "rgba(10, 12, 22, 0.97)",
          border: "1px solid rgba(201,162,39,0.28)",
          boxShadow: [
            "0 32px 80px rgba(0,0,0,0.9)",
            "inset 0 1px 0 rgba(201,162,39,0.16)",
            "inset 0 -1px 0 rgba(0,0,0,0.5)",
          ].join(", "),
        }}
      >
        {/* Corner runes */}
        {CORNER_POS.map((pos) => (
          <span
            key={pos}
            className={`absolute ${pos} text-xs select-none pointer-events-none z-10`}
            style={{ color: "rgba(201,162,39,0.2)" }}
            aria-hidden="true"
          >
            ◆
          </span>
        ))}

        {/* Header */}
        <div
          className="relative flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4"
          style={{
            background:
              "linear-gradient(to right, rgba(201,162,39,0.07), rgba(201,162,39,0.04), rgba(201,162,39,0.07))",
            borderBottom: "1px solid rgba(201,162,39,0.18)",
          }}
        >
          <h2 className="font-cinzel font-bold text-lg text-amber-100">
            {title}
          </h2>
          {showClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-stone-500 transition-all hover:bg-amber-900/20 hover:text-amber-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div
          className="relative overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
          style={{ maxHeight: "calc(90vh - 68px)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

AdminModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "full"]),
  showClose: PropTypes.bool,
};

export default AdminModal;
