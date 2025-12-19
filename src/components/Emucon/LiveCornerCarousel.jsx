import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Users,
  Clock,
  MapPin,
  RefreshCw,
  Pause,
  Play,
  X,
} from "lucide-react";
import { config } from "../../config";

// Corner type icons and colors
const cornerConfig = {
  entertainment: {
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    textColor: "text-purple-300",
    icon: "🎮",
    name: "Entertainment Corner",
    nameTr: "Eglence Kosesi",
  },
  diversity: {
    color: "from-pink-500 to-pink-700",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
    textColor: "text-pink-300",
    icon: "🌈",
    name: "Diversity Corner",
    nameTr: "Cesitlilik Kosesi",
  },
  healthAndLifestyle: {
    color: "from-emerald-500 to-emerald-700",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-300",
    icon: "💚",
    name: "Health & Lifestyle",
    nameTr: "Saglik & Yasam",
  },
  artAndCreativity: {
    color: "from-amber-500 to-amber-700",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-300",
    icon: "🎨",
    name: "Art & Creativity",
    nameTr: "Sanat & Yaraticilik",
  },
  techAndScience: {
    color: "from-cyan-500 to-cyan-700",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    textColor: "text-cyan-300",
    icon: "🔬",
    name: "Tech & Science",
    nameTr: "Teknoloji & Bilim",
  },
  stage: {
    color: "from-red-500 to-red-700",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    textColor: "text-red-300",
    icon: "🎤",
    name: "Main Stage",
    nameTr: "Ana Sahne",
  },
};

const LiveCornerCarousel = ({ language = "en", className = "" }) => {
  const [corners, setCorners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [selectedCorner, setSelectedCorner] = useState(null);
  const autoScrollRef = useRef(null);
  const containerRef = useRef(null);
  const backendUrl = config.backendUrl;

  // Fetch live corner data
  const fetchCornerData = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/emucon/live-corners`);
      if (response.ok) {
        const data = await response.json();
        setCorners(data.corners || []);
        setLastUpdate(new Date().toISOString());
      }
    } catch (error) {
      console.error("Failed to fetch corner data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  // Initial fetch and 5-minute interval
  useEffect(() => {
    fetchCornerData();
    const interval = setInterval(fetchCornerData, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [fetchCornerData]);

  // Auto-scroll carousel
  useEffect(() => {
    if (!isPaused && corners.length > 1) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % corners.length);
      }, 5000); // 5 seconds per slide
    }
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isPaused, corners.length]);

  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % corners.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + corners.length) % corners.length);
  };

  const openParticipants = (corner) => {
    setSelectedCorner(corner);
    setShowParticipants(true);
  };

  if (isLoading) {
    return (
      <div
        className={`flex h-48 items-center justify-center rounded-xl border border-amber-900/30 bg-gray-900/50 ${className}`}
      >
        <RefreshCw className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (corners.length === 0) {
    return null; // Don't show if no live events
  }

  const currentCorner = corners[currentIndex];
  const cornerStyle =
    cornerConfig[currentCorner?.cornerType] || cornerConfig.entertainment;

  return (
    <>
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-xl border border-amber-900/30 bg-gradient-to-b from-gray-900 to-gray-950 ${
          isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
        } ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/30 bg-gradient-to-r from-amber-950/50 via-gray-900 to-amber-950/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white">
              <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
            </div>
            <div>
              <h3 className="font-metamorphous text-lg font-bold text-amber-100">
                {language === "en" ? "Live Now" : "Simdi Canli"}
              </h3>
              <p className="text-xs text-amber-400/60">
                {language === "en"
                  ? "What's happening at EMUCON"
                  : "EMUCON'da neler oluyor"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Last update indicator */}
            {lastUpdate && (
              <span className="hidden text-xs text-amber-400/50 sm:block">
                <Clock className="mr-1 inline h-3 w-3" />
                {new Date(lastUpdate).toLocaleTimeString()}
              </span>
            )}

            {/* Pause/Play */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="rounded-lg p-2 text-amber-400/60 transition-all hover:bg-amber-900/20 hover:text-amber-300"
            >
              {isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="rounded-lg p-2 text-amber-400/60 transition-all hover:bg-amber-900/20 hover:text-amber-300"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Carousel Content */}
        <div
          className={`relative ${
            isFullscreen ? "flex h-[calc(100%-120px)] items-center" : "h-64"
          }`}
        >
          {/* Navigation Arrows */}
          {corners.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Corner Card */}
          <div
            className={`flex h-full w-full flex-col p-6 ${
              isFullscreen ? "items-center justify-center" : ""
            }`}
          >
            {/* Corner Badge */}
            <div className="mb-4 flex items-center gap-3">
              <div
                className={`flex items-center gap-2 rounded-full ${cornerStyle.bgColor} ${cornerStyle.borderColor} border px-4 py-2`}
              >
                <span className="text-xl">{cornerStyle.icon}</span>
                <span className={`font-medium ${cornerStyle.textColor}`}>
                  {language === "en" ? cornerStyle.name : cornerStyle.nameTr}
                </span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-400">
                <MapPin className="h-3 w-3" />
                {currentCorner?.location || "TBA"}
              </div>
            </div>

            {/* Event Info */}
            <div className={`flex-1 ${isFullscreen ? "text-center" : ""}`}>
              <h4
                className={`mb-2 font-metamorphous font-bold text-white ${
                  isFullscreen ? "text-4xl" : "text-2xl"
                }`}
              >
                {language === "en"
                  ? currentCorner?.clubNameEn
                  : currentCorner?.clubName}
              </h4>
              <p
                className={`text-gray-300 ${
                  isFullscreen ? "text-2xl" : "text-lg"
                }`}
              >
                {language === "en"
                  ? currentCorner?.activityEn
                  : currentCorner?.activity}
              </p>

              {/* Time remaining */}
              {currentCorner?.endTime && (
                <div
                  className={`mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-500/10 px-4 py-2 ${
                    isFullscreen ? "text-xl" : "text-sm"
                  }`}
                >
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-300">
                    {language === "en" ? "Until" : "Kadar"}{" "}
                    {currentCorner.endTime}
                  </span>
                </div>
              )}
            </div>

            {/* Participants Button */}
            {currentCorner?.hasParticipants && (
              <button
                onClick={() => openParticipants(currentCorner)}
                className={`mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-amber-300 transition-all hover:bg-amber-500/20 ${
                  isFullscreen ? "text-lg" : "text-sm"
                }`}
              >
                <Users className="h-4 w-4" />
                {language === "en" ? "See Participants" : "Katilimcilari Gor"}
                {currentCorner.participantCount && (
                  <span className="rounded-full bg-amber-500/30 px-2 py-0.5 text-xs">
                    {currentCorner.participantCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Dots Indicator */}
        {corners.length > 1 && (
          <div className="flex justify-center gap-2 border-t border-amber-900/30 bg-gray-950/50 py-3">
            {corners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-6 bg-amber-500"
                    : "w-2 bg-amber-900/50 hover:bg-amber-700/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Participants Modal */}
      {showParticipants && selectedCorner && (
        <ParticipantsModal
          corner={selectedCorner}
          language={language}
          onClose={() => {
            setShowParticipants(false);
            setSelectedCorner(null);
          }}
        />
      )}
    </>
  );
};

// Participants Modal Component
const ParticipantsModal = ({ corner, language, onClose }) => {
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const backendUrl = config.backendUrl;

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/emucon/corner/${corner.id}/participants`
        );
        if (response.ok) {
          const data = await response.json();
          setParticipants(data.participants || []);
        }
      } catch (error) {
        console.error("Failed to fetch participants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipants();
  }, [backendUrl, corner.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative max-h-[80vh] w-full max-w-lg overflow-hidden rounded-xl border border-amber-900/30 bg-gradient-to-b from-gray-900 to-gray-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/30 bg-amber-950/30 px-6 py-4">
          <div>
            <h3 className="font-metamorphous text-lg font-bold text-amber-100">
              {language === "en" ? "Participants" : "Katilimcilar"}
            </h3>
            <p className="text-sm text-amber-400/60">
              {language === "en" ? corner.clubNameEn : corner.clubName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-amber-400/60 transition-all hover:bg-amber-900/20 hover:text-amber-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : participants.length === 0 ? (
            <p className="py-8 text-center text-gray-400">
              {language === "en"
                ? "No participants registered yet"
                : "Henuz kayitli katilimci yok"}
            </p>
          ) : (
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-amber-900/20 bg-gray-900/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-sm font-bold text-amber-400">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-200">
                      {participant.name}
                    </span>
                  </div>
                  {participant.studentNumber && (
                    <span className="text-sm text-gray-500">
                      {participant.studentNumber}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ParticipantsModal.propTypes = {
  corner: PropTypes.shape({
    id: PropTypes.string.isRequired,
    clubName: PropTypes.string,
    clubNameEn: PropTypes.string,
  }).isRequired,
  language: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

LiveCornerCarousel.propTypes = {
  language: PropTypes.string,
  className: PropTypes.string,
};

export default LiveCornerCarousel;
