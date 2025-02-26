import React, { useState, useEffect } from "react";const GameGuideModal = ({ isOpen, onClose, game }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect screen size changes dynamically
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isOpen || !game) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-950 bg-opacity-75 z-50 ${
        isMobile
          ? "flex flex-col items-start pt-16"
          : "flex items-center justify-center"
      } p-4`}
    >
      <div
        className={`bg-gray-900 border-2 border-yellow-600 rounded-lg p-6 max-w-4xl w-full ${
          isMobile
            ? "h-[90vh] max-h-[90vh] overflow-y-auto mx-auto"
            : "max-h-[90vh]"
        } relative`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 text-white hover:text-yellow-400 text-xl right-2"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-yellow-500 mb-4">{game.name}</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column - Image and details */}
          <div className="w-full md:w-1/3">
            {game.image_url && (
              <img
                src={game.image_url}
                alt={game.name}
                className="w-full h-auto rounded-lg border border-yellow-600/50 mb-4"
              />
            )}

            <div className="bg-gray-800 rounded-lg p-4 border border-yellow-600/30">
              <p className="text-gray-300 mb-2">
                <span className="font-bold text-yellow-400">Play time:</span>{" "}
                {game.avg_play_time} minutes
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-bold text-yellow-400">Players:</span>{" "}
                {game.min_players}-{game.max_players}
              </p>
            </div>
          </div>

          {/* Right column - Guide text and video */}
          <div className="w-full md:w-2/3">
            {game.guide_text && (
              <div className="mb-6 bg-gray-800/50 rounded-lg p-4 border border-yellow-600/30">
                <h3 className="text-xl font-bold text-yellow-400 mb-3">
                  Game Guide
                </h3>
                <div className="text-gray-300 text-sm">
                  {game.guide_text.split("\n").map((paragraph, idx) => (
                    <p key={idx} className="mb-2">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {game.guide_video_url && (
              <div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">
                  Video Guide
                </h3>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={game.guide_video_url}
                    title={`${game.name} Guide Video`}
                    className="w-full rounded-lg border border-yellow-600/30"
                    style={{ height: "300px" }}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameGuideModal;
