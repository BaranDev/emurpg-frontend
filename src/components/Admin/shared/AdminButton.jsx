import PropTypes from "prop-types";

const AdminButton = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  icon: Icon,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-b from-amber-600 to-amber-700 text-white border-amber-500 hover:from-amber-500 hover:to-amber-600 focus:ring-amber-500 shadow-lg shadow-amber-900/30",
    secondary:
      "bg-gradient-to-b from-gray-700 to-gray-800 text-white border-gray-600 hover:from-gray-600 hover:to-gray-700 focus:ring-gray-500",
    danger:
      "bg-gradient-to-b from-red-600 to-red-700 text-white border-red-500 hover:from-red-500 hover:to-red-600 focus:ring-red-500 shadow-lg shadow-red-900/30",
    success:
      "bg-gradient-to-b from-emerald-600 to-emerald-700 text-white border-emerald-500 hover:from-emerald-500 hover:to-emerald-600 focus:ring-emerald-500 shadow-lg shadow-emerald-900/30",
    ghost:
      "bg-transparent text-amber-300 border-transparent hover:bg-amber-900/20 hover:text-amber-200 focus:ring-amber-500",
    outline:
      "bg-transparent text-amber-300 border-amber-600 hover:bg-amber-900/30 hover:text-amber-200 focus:ring-amber-500",
  };

  const sizes = {
    xs: "px-2.5 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
    xl: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : Icon ? (
        <Icon className="h-4 w-4" />
      ) : null}
      {children}
    </button>
  );
};

AdminButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "success",
    "ghost",
    "outline",
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.elementType,
};

export default AdminButton;
