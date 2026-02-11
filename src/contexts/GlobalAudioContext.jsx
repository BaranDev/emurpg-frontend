/**
 * GlobalAudioContext - Manages persistent audio playback across page navigation
 * 
 * Uses a singleton pattern to ensure audio continues playing between
 * /charroller and /charroller/manager routes.
 */

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { getSettings, saveSettings } from "../utils/characterStorage";

// Singleton audio element - persists across component unmounts
let globalAudio = null;
let globalIsPlaying = false;
let globalVolume = 30;
let globalIsMuted = false;
let globalIsLoaded = false;

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

export const GlobalAudioProvider = ({ children, audioSrc = "/src/assets/sound/tavern-ambient.mp3" }) => {
  const audioRef = useRef(getGlobalAudio(audioSrc));
  const [isPlaying, setIsPlaying] = useState(globalIsPlaying);
  const [volume, setVolume] = useState(globalVolume);
  const [isMuted, setIsMuted] = useState(globalIsMuted);
  const [isLoaded, setIsLoaded] = useState(globalIsLoaded);

  // Sync with global state on mount
  useEffect(() => {
    const audio = audioRef.current;
    
    // Load settings
    const settings = getSettings();
    const savedVolume = settings.musicVolume || 30;
    const savedMuted = !settings.musicEnabled;
    
    setVolume(savedVolume);
    setIsMuted(savedMuted);
    globalVolume = savedVolume;
    globalIsMuted = savedMuted;
    audio.volume = savedMuted ? 0 : savedVolume / 100;
    
    // Sync playing state
    setIsPlaying(!audio.paused);
    setIsLoaded(audio.readyState >= 3);
    
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
    
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("canplaythrough", handleLoaded);
    
    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("canplaythrough", handleLoaded);
    };
  }, []);

  // Update volume
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume / 100;
    globalVolume = volume;
    globalIsMuted = isMuted;
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
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

  const startAutoPlay = () => {
    const audio = audioRef.current;
    if (!isMuted && audio.paused) {
      audio.play().catch((err) => {
        console.log("Autoplay blocked by browser:", err);
      });
    }
  };

  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const value = {
    isPlaying,
    volume,
    isMuted,
    isLoaded,
    togglePlay,
    toggleMute,
    setVolume: setVolumeLevel,
    startAutoPlay,
    stopAudio
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const useGlobalAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useGlobalAudio must be used within a GlobalAudioProvider");
  }
  return context;
};

export default GlobalAudioProvider;
