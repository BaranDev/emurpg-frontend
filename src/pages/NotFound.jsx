const NotFound = () => (
  <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center bg-medieval-pattern">
    <div className="bg-gray-800 rounded-lg border-4 border-yellow-600 shadow-2xl p-8 max-w-lg text-center">
      <h1 className="text-6xl font-medieval text-yellow-500 mb-4">404</h1>
      <p className="text-xl mb-6 font-medieval">
        The realm you seek has been lost to time...
      </p>
      <a
        href="/"
        className="inline-block bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition"
      >
        Return to safety
      </a>
    </div>
  </div>
);

export default NotFound;
