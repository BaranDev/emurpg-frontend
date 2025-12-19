import PropTypes from "prop-types";

const LoadingSpinner = ({ message = "Loading...", size = "md" }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      {/* Castle-themed loading spinner */}
      <div className="relative">
        <div
          className={`${sizes[size]} animate-spin rounded-full border-4 border-amber-900/30 border-t-amber-500`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-5 w-5 text-amber-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
          </svg>
        </div>
      </div>
      <p className="text-sm text-amber-400/70">{message}</p>
    </div>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

export default LoadingSpinner;
