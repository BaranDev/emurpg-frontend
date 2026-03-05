import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { FaMusic, FaChevronRight } from "react-icons/fa";
import { getSettings, saveSettings } from "../../utils/characterStorage";

/**
 * TavernPlayer - Collapsible ambient music player using react-h5-audio-player
 * Themed for the tavern/D&D aesthetic.
 */
const AUDIO_SRC = "/src/assets/sound/tavern-ambient.mp3";

const THEMES = {
  tavern: {
    bg: "rgba(45, 27, 12, 0.97)",
    border: "rgba(139, 69, 19, 0.7)",
    accent: "#ffaa33",
    text: "#d4a574",
    shadow: "rgba(80, 40, 10, 0.6)",
    barBg: "rgba(100, 55, 15, 0.4)",
  },
  arcane: {
    bg: "rgba(16, 24, 50, 0.97)",
    border: "rgba(74, 158, 255, 0.5)",
    accent: "#4a9eff",
    text: "#94a3b8",
    shadow: "rgba(20, 40, 100, 0.5)",
    barBg: "rgba(30, 60, 120, 0.3)",
  },
};

const TavernPlayer = ({ autoPlay = false, theme = "tavern" }) => {
  const t = THEMES[theme] || THEMES.tavern;
  const playerRef = useRef(null);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("emurpg_music_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const [isPlaying, setIsPlaying] = useState(false);

  // Apply persisted settings on mount + handle autoplay
  useEffect(() => {
    const settings = getSettings();
    const audio = playerRef.current?.audio?.current;
    if (!audio) return;

    const vol = (settings.musicVolume ?? 30) / 100;
    const muted = settings.musicEnabled === false;
    audio.volume = muted ? 0 : vol;
    audio.muted = muted;

    if (autoPlay && !muted) {
      const timer = setTimeout(() => {
        audio.play().catch(() => {});
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [autoPlay]);

  const handleToggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    try {
      localStorage.setItem("emurpg_music_collapsed", String(next));
    } catch {}
  };

  const persistVolume = () => {
    const audio = playerRef.current?.audio?.current;
    if (!audio) return;
    saveSettings({
      musicVolume: Math.round(audio.volume * 100),
      musicEnabled: !audio.muted,
    });
  };

  // Scoped CSS: strip down to a clean single-row ambient player
  const css = `
    .tp-wrap .rhap_container {
      background: transparent;
      box-shadow: none;
      border: none;
      padding: 0;
      min-width: 0;
    }
    /* Hide the progress / time section entirely */
    .tp-wrap .rhap_progress-section {
      display: none !important;
    }
    /* Controls row: play + volume, nicely spaced */
    .tp-wrap .rhap_controls-section {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      padding: 0;
    }
    /* Remove the left spacer */
    .tp-wrap .rhap_additional-controls {
      display: none !important;
    }
    /* Play/pause button */
    .tp-wrap .rhap_main-controls-button {
      color: ${t.accent} !important;
      font-size: 28px !important;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .tp-wrap .rhap_main-controls-button:hover {
      color: #fff !important;
      transform: scale(1.1);
    }
    /* Skip buttons – hidden (ambient loop doesn't need them) */
    .tp-wrap .rhap_skip-button {
      display: none !important;
    }
    /* Volume section */
    .tp-wrap .rhap_volume-controls {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
      min-width: 90px;
    }
    .tp-wrap .rhap_volume-button {
      color: ${t.accent} !important;
      font-size: 16px;
      flex-shrink: 0;
    }
    .tp-wrap .rhap_volume-button:hover {
      color: #fff !important;
    }
    .tp-wrap .rhap_volume-bar {
      background: ${t.barBg} !important;
      height: 4px;
      border-radius: 4px;
    }
    .tp-wrap .rhap_volume-filled {
      background: ${t.accent} !important;
    }
    .tp-wrap .rhap_volume-indicator {
      background: ${t.accent} !important;
      width: 12px;
      height: 12px;
      box-shadow: 0 0 6px ${t.accent}88;
    }
    /* Overall stacked container: just controls, nothing else */
    .tp-wrap .rhap_stacked .rhap_controls-section {
      margin-top: 0;
    }
    .tp-wrap .rhap_header,
    .tp-wrap .rhap_footer {
      display: none !important;
    }
  `;

  // Collapsed state – minimal icon button
  if (isCollapsed) {
    return (
      <button
        onClick={handleToggleCollapse}
        title="Open music player"
        className="flex items-center justify-center w-11 h-11 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
        style={{
          background: t.bg,
          border: `2px solid ${t.border}`,
          boxShadow: `0 4px 16px ${t.shadow}`,
        }}
      >
        <FaMusic
          size={16}
          color={isPlaying ? t.accent : t.text}
          className={isPlaying ? "animate-pulse" : ""}
        />
      </button>
    );
  }

  // Expanded state – clean single-row panel
  return (
    <div
      className="tp-wrap flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-sm"
      style={{
        background: t.bg,
        border: `2px solid ${t.border}`,
        boxShadow: `0 4px 20px ${t.shadow}`,
        minWidth: "200px",
      }}
    >
      <style>{css}</style>

      {/* Ambient label */}
      <FaMusic
        size={13}
        color={t.text}
        className={isPlaying ? "animate-pulse" : ""}
        style={{ flexShrink: 0 }}
      />

      {/* Player controls */}
      <div className="flex-1 min-w-0">
        <AudioPlayer
          ref={playerRef}
          src={AUDIO_SRC}
          loop
          showJumpControls={false}
          showSkipControls={false}
          autoPlayAfterSrcChange={false}
          layout="stacked-reverse"
          customAdditionalControls={[]}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onVolumeChange={persistVolume}
        />
      </div>

      {/* Collapse */}
      <button
        onClick={handleToggleCollapse}
        title="Collapse player"
        className="flex items-center justify-center w-7 h-7 rounded-lg transition-all hover:scale-110 flex-shrink-0"
        style={{
          background: t.barBg,
          border: `1px solid ${t.border}`,
        }}
      >
        <FaChevronRight size={10} color={t.text} />
      </button>
    </div>
  );
};

TavernPlayer.propTypes = {
  autoPlay: PropTypes.bool,
  theme: PropTypes.oneOf(["tavern", "arcane"]),
};

export default TavernPlayer;
