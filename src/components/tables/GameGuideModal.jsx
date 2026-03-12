import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const CORNER_POSITIONS = ["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"];

const GameGuideModal = ({ isOpen, onClose, game }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isOpen || !game) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex p-4 ${
        isMobile ? "items-start pt-16" : "items-center justify-center"
      }`}
      style={{
        background:
          "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(30,10,60,0.6) 0%, rgba(0,0,0,0.88) 100%)",
      }}
      onClick={onClose}
    >
      <div
        className={`relative max-w-4xl w-full rounded-xl overflow-hidden ${
          isMobile ? "h-[90vh] max-h-[90vh] overflow-y-auto mx-auto" : "max-h-[90vh]"
        }`}
        style={{
          background: "rgba(10, 12, 22, 0.97)",
          border: "1px solid rgba(201,162,39,0.28)",
          boxShadow: [
            "0 32px 80px rgba(0,0,0,0.9)",
            "inset 0 1px 0 rgba(201,162,39,0.18)",
            "inset 0 -1px 0 rgba(0,0,0,0.5)",
            "0 0 60px rgba(201,162,39,0.03)",
          ].join(", "),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner rune ornaments */}
        {CORNER_POSITIONS.map((pos) => (
          <span
            key={pos}
            className={`absolute ${pos} text-xs select-none pointer-events-none`}
            style={{ color: "rgba(201,162,39,0.22)" }}
            aria-hidden="true"
          >
            ◆
          </span>
        ))}

        {/* Header */}
        <div className="px-7 pt-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-stone-500 hover:text-amber-300 text-lg transition-colors leading-none"
            aria-label="Close"
          >
            ✕
          </button>

          <h2 className="font-cinzel font-bold text-2xl md:text-3xl text-amber-100 pr-8 leading-tight">
            {game.name}
          </h2>

          <div
            className="mt-3 h-px w-full"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(201,162,39,0.42), transparent)",
            }}
          />
        </div>

        {/* Body */}
        <div
          className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-0 px-7 pb-7 ${
            isMobile ? "" : "divide-x divide-yellow-900/25"
          }`}
        >
          {/* Left — cover page */}
          <div
            className={`${
              isMobile ? "w-full" : "w-64 pr-6 flex-shrink-0"
            } flex flex-col gap-4`}
          >
            {game.image_url && (
              <div
                className="w-full overflow-hidden rounded-lg"
                style={{
                  boxShadow:
                    "inset 0 0 0 1px rgba(201,162,39,0.28), 0 8px 24px rgba(0,0,0,0.6)",
                }}
              >
                <img
                  src={game.image_url}
                  alt={game.name}
                  className="w-full h-auto block"
                />
              </div>
            )}

            {/* Stat runes */}
            <div
              className="rounded-lg p-4 flex flex-col gap-3"
              style={{
                background: "rgba(6, 8, 18, 0.8)",
                border: "1px solid rgba(201,162,39,0.13)",
              }}
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="text-amber-200/50 w-4 text-center shrink-0">
                  ⏱
                </span>
                <span className="text-stone-400 font-cinzel text-xs tracking-wide">
                  Play time
                </span>
                <span className="ml-auto text-stone-200 tabular-nums text-sm">
                  {game.avg_play_time} min
                </span>
              </div>
              <div
                className="h-px w-full"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
              <div className="flex items-center gap-2 text-sm">
                <span className="text-amber-200/50 w-4 text-center shrink-0">
                  ⚔
                </span>
                <span className="text-stone-400 font-cinzel text-xs tracking-wide">
                  Players
                </span>
                <span className="ml-auto text-stone-200 text-sm">
                  {game.min_players}–{game.max_players}
                </span>
              </div>
            </div>
          </div>

          {/* Right — manuscript pages */}
          <div
            className={`${
              isMobile ? "w-full mt-5" : "flex-1 pl-6"
            } flex flex-col gap-6 overflow-y-auto max-h-[58vh]`}
          >
            {game.guide_text && (
              <div>
                <h3 className="font-cinzel font-semibold text-sm text-amber-200/75 mb-3 tracking-widest uppercase">
                  ✦ Game Guide
                </h3>
                <div
                  className="text-stone-300 text-sm leading-relaxed pl-4"
                  style={{ borderLeft: "2px solid rgba(201,162,39,0.18)" }}
                >
                  {game.guide_text.split("\n").map((paragraph, idx) => (
                    <p key={idx} className={paragraph.trim() ? "mb-3" : "mb-1"}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {game.guide_video_url && (
              <div>
                <h3 className="font-cinzel font-semibold text-sm text-amber-200/75 mb-3 tracking-widest uppercase">
                  ✦ Video Guide
                </h3>
                <div
                  className="overflow-hidden rounded-lg"
                  style={{ border: "1px solid rgba(99,102,241,0.28)" }}
                >
                  <iframe
                    src={game.guide_video_url}
                    title={`${game.name} Guide Video`}
                    className="w-full block"
                    style={{ height: "280px" }}
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

GameGuideModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  game: PropTypes.shape({
    name: PropTypes.string,
    image_url: PropTypes.string,
    avg_play_time: PropTypes.number,
    min_players: PropTypes.number,
    max_players: PropTypes.number,
    guide_text: PropTypes.string,
    guide_video_url: PropTypes.string,
  }),
};

export default GameGuideModal;
