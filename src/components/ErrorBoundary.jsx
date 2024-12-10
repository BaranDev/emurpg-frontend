import React from "react";
import { FaRegSadTear } from "react-icons/fa";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <div className="text-center">
            <FaRegSadTear className="text-yellow-500 text-6xl mx-auto mb-6 animate-bounce" />
            <h1 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-4">
              Oops! Browser Not Supported
            </h1>
            <p className="text-gray-400 text-lg mb-6 max-w-md mx-auto">
              We apologize, but it seems your browser isn't compatible with some
              of our features. Please try using a modern browser like Chrome,
              Firefox, or Edge.
            </p>
            <p className="text-gray-400 text-lg mb-6 max-w-md mx-auto">
              If you believe this is a mistake, please try refreshing the page.
              Or reach the developer at{" "}
              <a
                href="mailto:cevdetbaranoral@gmail.com"
                className="text-yellow-500 hover:underline"
              >
                {" "}
                by email
              </a>
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
