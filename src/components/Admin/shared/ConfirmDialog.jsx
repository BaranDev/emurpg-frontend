import PropTypes from "prop-types";
import AdminModal from "./AdminModal";
import AdminButton from "./AdminButton";
import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) => {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center gap-4 py-4">
        <div
          className={`rounded-full p-3 ${
            variant === "danger"
              ? "bg-red-900/30 text-red-400"
              : "bg-amber-900/30 text-amber-400"
          }`}
        >
          <AlertTriangle className="h-8 w-8" />
        </div>

        <p className="text-center text-gray-300">{message}</p>

        <div className="flex gap-3 pt-4">
          <AdminButton variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </AdminButton>
          <AdminButton variant={variant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(["danger", "primary"]),
  loading: PropTypes.bool,
};

export default ConfirmDialog;
