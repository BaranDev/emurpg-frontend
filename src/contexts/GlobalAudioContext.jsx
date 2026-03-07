/**
 * GlobalAudioContext - Manages persistent audio playback across page navigation
 *
 * Uses a singleton pattern to ensure audio continues playing between
 * /charroller and /charroller/manager routes.
 */

import { createContext, useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { getSettings, saveSettings } from "../utils/characterStorage";
import { config } from "../config";

// Singleton audio element - persists across component unmounts
let globalAudio = null;
let globalIsPlaying = false;
let globalVolume = 24;
let globalIsMuted = false;
let globalIsLoaded = false;
let globalHasUserInteracted = false;

const getGlobalAudio = (src) => {
  if (!globalAudio) {
    globalAudio = new Audio(src);
    globalAudio.loop = true;
    globalAudio.preload = "auto";
    globalAudio.volume = globalVolume / 100;

    globalAudio.addEventListener("canplaythrough", () => {
      globalIsLoaded = true;
    });

    globalAudio.addEventListener("play", () => {
      globalIsPlaying = true;
    });

    globalAudio.addEventListener("pause", () => {
      globalIsPlaying = false;
    });
  }
  return globalAudio;
};

const AudioContext = createContext(null);

export const GlobalAudioProvider = ({
  children,
  audioSrc = config.tavernAmbientUrl,
}) => {
  const audioRef = useRef(getGlobalAudio(audioSrc));
  const [isPlaying, setIsPlaying] = useState(globalIsPlaying);
  const [volume, setVolume] = useState(globalVolume);
  const [isMuted, setIsMuted] = useState(globalIsMuted);
  const [isLoaded, setIsLoaded] = useState(globalIsLoaded);
  const [hasUserInteracted, setHasUserInteracted] = useState(
    globalHasUserInteracted,
  );

  // Sync with global state on mount
  useEffect(() => {
    const audio = audioRef.current;

    // Load settings
    const settings = getSettings();
    const savedVolume = settings.musicVolume ?? 24;
    const savedMuted = !settings.musicEnabled;

    setVolume(savedVolume);
    setIsMuted(savedMuted);
    globalVolume = savedVolume;
    globalIsMuted = savedMuted;
    audio.volume = savedMuted ? 0 : savedVolume / 100;
    audio.muted = savedMuted;

    // Sync playing state
    setIsPlaying(!audio.paused);
    setIsLoaded(audio.readyState >= 3);
    setHasUserInteracted(globalHasUserInteracted);

    // Event listeners
    const handlePlay = () => {
      globalIsPlaying = true;
      setIsPlaying(true);
    };

    const handlePause = () => {
      globalIsPlaying = false;
      setIsPlaying(false);
    };

    const handleLoaded = () => {
      globalIsLoaded = true;
      setIsLoaded(true);
    };

    const handleSettingsChanged = (event) => {
      const nextSettings = event.detail || getSettings();
      const nextVolume = nextSettings.musicVolume ?? 24;
      const nextMuted = !nextSettings.musicEnabled;

      setVolume(nextVolume);
      setIsMuted(nextMuted);
      globalVolume = nextVolume;
      globalIsMuted = nextMuted;
      audio.volume = nextMuted ? 0 : nextVolume / 100;
      audio.muted = nextMuted;
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("canplaythrough", handleLoaded);
    window.addEventListener(
      "charroller-settings-changed",
      handleSettingsChanged,
    );

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("canplaythrough", handleLoaded);
      window.removeEventListener(
        "charroller-settings-changed",
        handleSettingsChanged,
      );

      // Stop audio when leaving charroller routes (provider unmounts)
      audio.pause();
    };
  }, []);

  // Update volume
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume / 100;
    audio.muted = isMuted;
    globalVolume = volume;
    globalIsMuted = isMuted;
  }, [volume, isMuted]);

  const play = async () => {
    const audio = audioRef.current;

    try {
      await audio.play();
      return true;
    } catch (error) {
      console.log("Audio playback blocked by browser:", error);
      return false;
    }
  };

  const pause = () => {
    audioRef.current.pause();
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (audio.paused) {
      return play();
    } else {
      pause();
      return true;
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    globalIsMuted = newMuted;
    saveSettings({ musicEnabled: !newMuted });
  };

  const setVolumeLevel = (newVolume) => {
    setVolume(newVolume);
    globalVolume = newVolume;
    saveSettings({ musicVolume: newVolume });

    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      globalIsMuted = false;
      saveSettings({ musicEnabled: true });
    }
  };

  const unlockAudio = async () => {
    globalHasUserInteracted = true;
    setHasUserInteracted(true);

    if (!isMuted) {
      return play();
    }

    return true;
  };

  const value = {
    isPlaying,
    volume,
    isMuted,
    isLoaded,
    hasUserInteracted,
    play,
    pause,
    togglePlay,
    toggleMute,
    setVolume: setVolumeLevel,
    startAutoPlay: unlockAudio,
    unlockAudio,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

GlobalAudioProvider.propTypes = {
  children: PropTypes.node.isRequired,
  audioSrc: PropTypes.string,
};

export const useGlobalAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useGlobalAudio must be used within a GlobalAudioProvider");
  }
  return context;
};

export default GlobalAudioProvider;
