import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  FaMusic,
  FaChevronDown,
  FaPause,
  FaPlay,
  FaVolumeMute,
  FaVolumeDown,
  FaVolumeUp,
} from "react-icons/fa";
import { useGlobalAudio } from "../../contexts/GlobalAudioContext";

/**
 * TavernPlayer - Compact collapsible ambient music player (desktop only).
 * Play/pause + mute + volume slider + minimize. No text.
 */
const THEME = {
  bg: "rgba(45, 27, 12, 0.97)",
  border: "rgba(139, 69, 19, 0.7)",
  accent: "#ffaa33",
  text: "#d4a574",
  shadow: "rgba(80, 40, 10, 0.6)",
  barBg: "rgba(100, 55, 15, 0.4)",
};

const TavernPlayer = ({ autoPlay = false }) => {
  const t = THEME;
  const {
    hasUserInteracted,
    isMuted,
    isPlaying,
    setVolume,
    toggleMute,
    togglePlay,
    unlockAudio,
    volume,
  } = useGlobalAudio();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("emurpg_music_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const hasAutoPlayedRef = useRef(false);

  useEffect(() => {
    if (
      autoPlay &&
      !hasAutoPlayedRef.current &&
      hasUserInteracted &&
      !isMuted &&
      !isPlaying
    ) {
      hasAutoPlayedRef.current = true;
      togglePlay();
    }
  }, [autoPlay, hasUserInteracted, isMuted, isPlaying, togglePlay]);

  const handleToggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    try {
      localStorage.setItem("emurpg_music_collapsed", String(next));
    } catch {}
  };

  const handleVolumeChange = (event) => {
    setVolume(Number(event.target.value));
  };

  const handlePlayPress = async () => {
    if (!hasUserInteracted && !isPlaying) {
      await unlockAudio();
      return;
    }
    await togglePlay();
  };

  const VolumeIcon = isMuted
    ? FaVolumeMute
    : volume > 55
      ? FaVolumeUp
      : FaVolumeDown;

  // Collapsed — small icon button
  if (isCollapsed) {
    return (
      <button
        onClick={handleToggleCollapse}
        title="Open music player"
        className="flex items-center justify-center w-10 h-10 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
        style={{
          background: t.bg,
          border: `1px solid ${t.border}`,
          boxShadow: `0 2px 12px ${t.shadow}`,
        }}
      >
        <FaMusic
          size={14}
          color={isPlaying ? t.accent : t.text}
          className={isPlaying ? "animate-pulse" : ""}
        />
      </button>
    );
  }

  // Expanded — compact row: play | mute | volume slider | minimize
  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 rounded-lg backdrop-blur-sm"
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        boxShadow: `0 2px 12px ${t.shadow}`,
      }}
    >
      {/* Play / Pause */}
      <button
        onClick={handlePlayPress}
        aria-label={isPlaying ? "Pause ambient music" : "Play ambient music"}
        className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-105"
        style={{
          color: "#fff",
          background: `linear-gradient(135deg, ${t.accent}, ${t.border})`,
        }}
      >
        {isPlaying ? (
          <FaPause size={11} />
        ) : (
          <FaPlay size={11} className="ml-px" />
        )}
      </button>

      {/* Mute */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
        className="transition-colors hover:text-white"
        style={{ color: t.accent }}
      >
        <VolumeIcon size={13} />
      </button>

      {/* Volume slider */}
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        aria-label="Music volume"
        className="w-20 h-1 appearance-none cursor-pointer rounded-lg"
        style={{
          background: `linear-gradient(90deg, ${t.accent} ${volume}%, ${t.barBg} ${volume}%)`,
        }}
      />

      {/* Minimize */}
      <button
        onClick={handleToggleCollapse}
        aria-label="Minimize player"
        className="flex items-center justify-center w-6 h-6 rounded transition-all hover:scale-110"
        style={{ color: t.text }}
      >
        <FaChevronDown size={12} />
      </button>
    </div>
  );
};

TavernPlayer.propTypes = {
  autoPlay: PropTypes.bool,
};

export default TavernPlayer;
