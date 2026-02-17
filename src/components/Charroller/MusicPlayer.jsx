import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaMusic,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useGlobalAudio } from "../../contexts/GlobalAudioContext";

/**
 * MusicPlayer - Collapsible ambient music control component
 * Uses global audio context to persist playback across page navigation
 * Supports theming (tavern/arcane) and collapsible state
 */
const MusicPlayer = ({ autoPlay = false, theme = "tavern" }) => {
  const {
    isPlaying,
    volume,
    isMuted,
    isLoaded,
    togglePlay,
    toggleMute,
    setVolume,
    startAutoPlay,
  } = useGlobalAudio();

  // Collapsed state - persisted to localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem("emurpg_music_collapsed");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Theme configuration
  const themeConfig = {
    tavern: {
      bg: "rgba(61, 40, 23, 0.95)",
      bgCollapsed: "rgba(61, 40, 23, 0.9)",
      border: "rgba(139, 69, 19, 0.6)",
      accent: "#ffaa33",
      accentLight: "rgba(255, 170, 51, 0.3)",
      text: "#d4a574",
      iconColor: "#ffffff",
      shadow: "rgba(139,69,19,0.4)",
    },
    arcane: {
      bg: "rgba(30, 58, 95, 0.95)",
      bgCollapsed: "rgba(30, 58, 95, 0.9)",
      border: "rgba(74, 158, 255, 0.4)",
      accent: "#4a9eff",
      accentLight: "rgba(74, 158, 255, 0.3)",
      text: "#94a3b8",
      iconColor: "#ffffff",
      shadow: "rgba(74,158,255,0.3)",
    },
  };

  const currentTheme = themeConfig[theme] || themeConfig.tavern;

  // Handle autoplay on mount
  useEffect(() => {
    if (autoPlay && isLoaded) {
      const timer = setTimeout(startAutoPlay, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, isLoaded, startAutoPlay]);

  // Persist collapsed state
  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    try {
      localStorage.setItem("emurpg_music_collapsed", String(newState));
    } catch (e) {
      console.error("Failed to save collapsed state:", e);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
  };

  // Collapsed view - minimal floating button
  if (isCollapsed) {
    return (
      <button
        onClick={handleToggleCollapse}
        className="group flex items-center gap-2 px-3 py-3 rounded-xl shadow-lg backdrop-blur-sm
                   transition-all duration-300 hover:scale-105"
        style={{
          background: currentTheme.bgCollapsed,
          border: `2px solid ${currentTheme.border}`,
          boxShadow: `0 4px 20px ${currentTheme.shadow}`,
        }}
        title="Expand music player"
      >
        {/* Music icon with pulse animation when playing */}
        <div className="relative">
          <FaMusic
            size={18}
            color={isPlaying ? currentTheme.accent : currentTheme.text}
            className={isPlaying ? "animate-pulse" : ""}
          />
          {isPlaying && (
            <div
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
              style={{
                background: currentTheme.accent,
                animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
              }}
            />
          )}
        </div>

        {/* Expand chevron */}
        <FaChevronLeft
          size={12}
          color={currentTheme.text}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        />

        {/* Ping animation keyframes */}
        <style>{`
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}</style>
      </button>
    );
  }

  // Expanded view - full controls
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm
                 transition-all duration-300"
      style={{
        background: currentTheme.bg,
        border: `2px solid ${currentTheme.border}`,
        boxShadow: `0 4px 20px ${currentTheme.shadow}`,
      }}
    >
      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        disabled={!isLoaded}
        className={`
          w-11 h-11 rounded-full flex items-center justify-center
          transition-all duration-200 shadow-md
          ${isLoaded ? "hover:scale-110 active:scale-95" : "opacity-50 cursor-not-allowed"}
        `}
        style={{
          background: isPlaying
            ? `linear-gradient(135deg, ${currentTheme.accent}, ${theme === "arcane" ? "#2d5a87" : "#ff8800"})`
            : currentTheme.accentLight,
          border: `2px solid ${currentTheme.accent}`,
        }}
        title={isPlaying ? "Pause Music" : "Play Music"}
      >
        {isPlaying ? (
          <FaPause size={16} color={currentTheme.iconColor} />
        ) : (
          <FaPlay
            size={16}
            color={currentTheme.iconColor}
            style={{ marginLeft: "2px" }}
          />
        )}
      </button>

      {/* Volume slider */}
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className="w-20 h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${currentTheme.accent} 0%, ${currentTheme.accent} ${volume}%, ${currentTheme.accentLight} ${volume}%, ${currentTheme.accentLight} 100%)`,
        }}
        title={`Volume: ${volume}%`}
      />

      {/* Mute button */}
      <button
        onClick={toggleMute}
        className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
        title={isMuted ? "Unmute" : "Mute"}
        style={{
          background: isMuted
            ? "rgba(239, 68, 68, 0.2)"
            : currentTheme.accentLight,
          border: `2px solid ${isMuted ? "#ef4444" : currentTheme.accent}`,
        }}
      >
        {isMuted ? (
          <FaVolumeMute size={18} color="#ef4444" />
        ) : (
          <FaVolumeUp size={18} color={currentTheme.iconColor} />
        )}
      </button>

      {/* Status text */}
      <span
        className="text-xs hidden sm:block font-medium min-w-[50px]"
        style={{ color: currentTheme.text }}
      >
        {isLoaded ? (isPlaying ? "Playing" : "Paused") : "Loading..."}
      </span>

      {/* Collapse button */}
      <button
        onClick={handleToggleCollapse}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all 
                   hover:scale-110 ml-1"
        style={{
          background: currentTheme.accentLight,
          border: `1px solid ${currentTheme.border}`,
        }}
        title="Collapse player"
      >
        <FaChevronRight size={12} color={currentTheme.text} />
      </button>
    </div>
  );
};

MusicPlayer.propTypes = {
  autoPlay: PropTypes.bool,
  theme: PropTypes.oneOf(["tavern", "arcane"]),
};

export default MusicPlayer;
