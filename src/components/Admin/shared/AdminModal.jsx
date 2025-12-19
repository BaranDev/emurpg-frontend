import PropTypes from "prop-types";
import { X } from "lucide-react";

const AdminModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showClose = true,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-[95vw]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden rounded-lg border border-amber-900/50 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 shadow-2xl shadow-amber-900/20`}
      >
        {/* Stone texture overlay */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')]" />

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-amber-900/30 bg-gradient-to-r from-amber-950/50 via-gray-900 to-amber-950/50 px-6 py-4">
          <h2 className="font-metamorphous text-xl font-bold text-amber-100">
            {title}
          </h2>
          {showClose && (
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-amber-400/60 transition-all hover:bg-amber-900/30 hover:text-amber-300"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div
          className="relative overflow-y-auto p-6"
          style={{ maxHeight: "calc(90vh - 80px)" }}
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
