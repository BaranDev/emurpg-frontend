import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { FaMusic, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getSettings, saveSettings } from "../../utils/characterStorage";

/**
 * TavernPlayer - Collapsible ambient music player using react-h5-audio-player
 * Replaces the custom MusicPlayer with a battle-tested library,
 * themed to match the tavern/D&D aesthetic.
 */
const AUDIO_SRC = "/src/assets/sound/tavern-ambient.mp3";

const THEMES = {
  tavern: {
    bg: "rgba(61, 40, 23, 0.97)",
    border: "rgba(139, 69, 19, 0.7)",
    accent: "#ffaa33",
    text: "#d4a574",
    shadow: "rgba(139,69,19,0.45)",
    barBg: "rgba(139, 69, 19, 0.3)",
  },
  arcane: {
    bg: "rgba(20, 30, 60, 0.97)",
    border: "rgba(74, 158, 255, 0.5)",
    accent: "#4a9eff",
    text: "#94a3b8",
    shadow: "rgba(74,158,255,0.3)",
    barBg: "rgba(74, 158, 255, 0.2)",
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

  // Load persisted volume/mute on mount and attempt autoplay
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

  const handleVolumeChange = () => {
    const audio = playerRef.current?.audio?.current;
    if (!audio) return;
    const vol = Math.round(audio.volume * 100);
    saveSettings({ musicVolume: vol, musicEnabled: !audio.muted });
  };

  const handleMuteChange = () => {
    const audio = playerRef.current?.audio?.current;
    if (!audio) return;
    saveSettings({ musicEnabled: !audio.muted });
  };

  // Scoped CSS overrides for the library
  const css = `
    .tavern-player-wrap .rhap_container {
      background: ${t.bg};
      border: 2px solid ${t.border};
      border-radius: 12px;
      box-shadow: 0 4px 24px ${t.shadow};
      padding: 10px 14px;
      min-width: 260px;
      backdrop-filter: blur(6px);
    }
    .tavern-player-wrap .rhap_main-controls-button,
    .tavern-player-wrap .rhap_volume-button,
    .tavern-player-wrap .rhap_additional-controls .rhap_button-clear {
      color: ${t.accent} !important;
    }
    .tavern-player-wrap .rhap_main-controls-button:hover,
    .tavern-player-wrap .rhap_volume-button:hover {
      color: #fff !important;
    }
    .tavern-player-wrap .rhap_progress-filled,
    .tavern-player-wrap .rhap_volume-indicator,
    .tavern-player-wrap .rhap_volume-bar::before {
      background-color: ${t.accent} !important;
    }
    .tavern-player-wrap .rhap_progress-bar,
    .tavern-player-wrap .rhap_volume-bar {
      background-color: ${t.barBg} !important;
    }
    .tavern-player-wrap .rhap_progress-indicator,
    .tavern-player-wrap .rhap_volume-indicator {
      background: ${t.accent} !important;
      box-shadow: 0 0 6px ${t.accent}80;
    }
    .tavern-player-wrap .rhap_time {
      color: ${t.text};
      font-size: 11px;
    }
    .tavern-player-wrap .rhap_stacked .rhap_controls-section {
      margin-top: 4px;
    }
    .tavern-player-wrap .rhap_header {
      display: none;
    }
  `;

  // Collapsed – just a small music icon button
  if (isCollapsed) {
    return (
      <button
        onClick={handleToggleCollapse}
        title="Expand music player"
        className="group flex items-center gap-2 px-3 py-3 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
        style={{
          background: t.bg,
          border: `2px solid ${t.border}`,
          boxShadow: `0 4px 20px ${t.shadow}`,
        }}
      >
        <FaMusic
          size={18}
          color={isPlaying ? t.accent : t.text}
          className={isPlaying ? "animate-pulse" : ""}
        />
        <FaChevronLeft
          size={12}
          color={t.text}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </button>
    );
  }

  return (
    <div className="tavern-player-wrap relative">
      <style>{css}</style>

      {/* Collapse button sits in top-right of the panel */}
      <button
        onClick={handleToggleCollapse}
        title="Collapse player"
        className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center"
        style={{
          background: t.bg,
          border: `1px solid ${t.border}`,
          boxShadow: `0 2px 8px ${t.shadow}`,
        }}
      >
        <FaChevronRight size={9} color={t.text} />
      </button>

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
        onVolumeChange={handleVolumeChange}
        onMuteChange={handleMuteChange}
      />
    </div>
  );
};

TavernPlayer.propTypes = {
  autoPlay: PropTypes.bool,
  theme: PropTypes.oneOf(["tavern", "arcane"]),
};

export default TavernPlayer;
