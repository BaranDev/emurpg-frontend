/**
 * EmuconDemoLive – A self-contained demo version of the Emucon Live Board.
 *
 * Uses mock data instead of API calls so the page works without a backend.
 * The original Live.jsx is left completely untouched.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Radio,
  Clock,
  MapPin,
  RefreshCw,
  ChevronLeft,
  Maximize2,
  Minimize2,
  Users,
  Zap,
  Calendar,
  CheckCircle2,
  Timer,
  Building2,
  Pause,
  Play,
  Gamepad2,
  Heart,
  Palette,
  Laptop,
  FlaskConical,
  Mic,
  Lightbulb,
  Music,
  Cpu,
  Microscope,
  X,
  Info,
} from "lucide-react";
import {
  emuconMockCorners,
  emuconMockParticipants,
} from "../../data/emuconMockData";

// ─── Corner theme config (same as Live.jsx) ────────────────────────────
const cornerConfig = {
  entertainment: {
    color: "from-purple-600 to-purple-800",
    bgColor: "bg-purple-600/10",
    borderColor: "border-purple-500/40",
    textColor: "text-purple-200",
    glowColor: "shadow-purple-500/20",
    icon: Gamepad2,
    name: "Entertainment Corner",
    nameTr: "Eglence Kosesi",
  },
  diversity: {
    color: "from-pink-600 to-pink-800",
    bgColor: "bg-pink-600/10",
    borderColor: "border-pink-500/40",
    textColor: "text-pink-200",
    glowColor: "shadow-pink-500/20",
    icon: Heart,
    name: "Diversity Corner",
    nameTr: "Cesitlilik Kosesi",
  },
  healthAndLifestyle: {
    color: "from-emerald-600 to-emerald-800",
    bgColor: "bg-emerald-600/10",
    borderColor: "border-emerald-500/40",
    textColor: "text-emerald-200",
    glowColor: "shadow-emerald-500/20",
    icon: Heart,
    name: "Health & Lifestyle",
    nameTr: "Saglik & Yasam",
  },
  artAndCreativity: {
    color: "from-amber-600 to-amber-800",
    bgColor: "bg-amber-600/10",
    borderColor: "border-amber-500/40",
    textColor: "text-amber-200",
    glowColor: "shadow-amber-500/20",
    icon: Palette,
    name: "Art & Creativity",
    nameTr: "Sanat & Yaraticilik",
  },
  techAndScience: {
    color: "from-cyan-600 to-cyan-800",
    bgColor: "bg-cyan-600/10",
    borderColor: "border-cyan-500/40",
    textColor: "text-cyan-200",
    glowColor: "shadow-cyan-500/20",
    icon: FlaskConical,
    name: "Tech & Science",
    nameTr: "Teknoloji & Bilim",
  },
  stage: {
    color: "from-red-600 to-red-800",
    bgColor: "bg-red-600/10",
    borderColor: "border-red-500/40",
    textColor: "text-red-200",
    glowColor: "shadow-red-500/20",
    icon: Mic,
    name: "Main Stage",
    nameTr: "Ana Sahne",
  },
  awareness: {
    color: "from-indigo-600 to-indigo-800",
    bgColor: "bg-indigo-600/10",
    borderColor: "border-indigo-500/40",
    textColor: "text-indigo-200",
    glowColor: "shadow-indigo-500/20",
    icon: Lightbulb,
    name: "Awareness Corner",
    nameTr: "Farkindalik Kosesi",
  },
  folkAndSocial: {
    color: "from-orange-600 to-orange-800",
    bgColor: "bg-orange-600/10",
    borderColor: "border-orange-500/40",
    textColor: "text-orange-200",
    glowColor: "shadow-orange-500/20",
    icon: Music,
    name: "Folk & Social",
    nameTr: "Halk & Sosyal",
  },
  art: {
    color: "from-rose-600 to-rose-800",
    bgColor: "bg-rose-600/10",
    borderColor: "border-rose-500/40",
    textColor: "text-rose-200",
    glowColor: "shadow-rose-500/20",
    icon: Palette,
    name: "Art Corner",
    nameTr: "Sanat Kosesi",
  },
  technology: {
    color: "from-blue-600 to-blue-800",
    bgColor: "bg-blue-600/10",
    borderColor: "border-blue-500/40",
    textColor: "text-blue-200",
    glowColor: "shadow-blue-500/20",
    icon: Cpu,
    name: "Technology Corner",
    nameTr: "Teknoloji Kosesi",
  },
  science: {
    color: "from-teal-600 to-teal-800",
    bgColor: "bg-teal-600/10",
    borderColor: "border-teal-500/40",
    textColor: "text-teal-200",
    glowColor: "shadow-teal-500/20",
    icon: Microscope,
    name: "Science Corner",
    nameTr: "Bilim Kosesi",
  },
};

// ─── Status Badge ──────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const statusConfig = {
    live: {
      bg: "bg-gradient-to-r from-red-600 to-red-500",
      text: "text-white",
      glow: "shadow-lg shadow-red-500/50",
      pulse: true,
      icon: Radio,
      label: "LIVE",
    },
    upcoming: {
      bg: "bg-gradient-to-r from-amber-600 to-amber-500",
      text: "text-white",
      glow: "shadow-lg shadow-amber-500/40",
      pulse: false,
      icon: Timer,
      label: "UPCOMING",
    },
    completed: {
      bg: "bg-gradient-to-r from-gray-600 to-gray-500",
      text: "text-gray-200",
      glow: "shadow-lg shadow-gray-500/30",
      pulse: false,
      icon: CheckCircle2,
      label: "COMPLETED",
    },
  };

  const cfg = statusConfig[status] || statusConfig.upcoming;
  const Icon = cfg.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider ${
        cfg.bg
      } ${cfg.text} ${cfg.glow} ${cfg.pulse ? "animate-pulse" : ""}`}
    >
      <Icon className={`w-4 h-4 ${cfg.pulse ? "animate-bounce" : ""}`} />
      <span>{cfg.label}</span>
    </div>
  );
};

// ─── Event Row ─────────────────────────────────────────────────────────
const EventRow = ({ event, corner, club, isLive, onShowParticipants }) => {
  const cornerStyle =
    cornerConfig[corner?.cornerType] || cornerConfig.entertainment;
  const hasParticipants = event.participantCount > 0;

  return (
    <div
      className={`p-3 sm:p-4 border-b border-forest-light/20 transition-all duration-300 ${
        isLive
          ? "bg-gradient-to-r from-red-900/20 via-transparent to-red-900/20"
          : "hover:bg-forest-dark/50"
      }`}
    >
      {/* Mobile Layout */}
      <div className="md:hidden space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <StatusBadge status={event.status} />
            {hasParticipants && (
              <button
                onClick={() => onShowParticipants(event)}
                className="flex items-center gap-1 px-2 py-1 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-full text-purple-300 text-xs transition-colors"
                title="View Participants"
              >
                <Users className="w-3 h-3" />
                <span>{event.participantCount}</span>
              </button>
            )}
          </div>
          <div className="font-mono text-lg font-bold text-gold-light">
            {event.time || event.startTime || "--:--"}
          </div>
        </div>
        <div>
          <div className="font-cinzel font-bold text-cream text-base leading-tight">
            {event.nameEn || event.nameTr}
          </div>
          {event.nameTr && event.nameEn && (
            <div className="text-sm text-emucon-text-secondary mt-1 leading-tight">
              {event.nameTr}
            </div>
          )}
        </div>
        {event.description && (
          <div className="text-xs text-emucon-text-muted leading-relaxed">
            {event.description}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-forest-light flex-shrink-0" />
            <span className="text-xs text-emucon-text-secondary">
              {club?.nameEn || club?.nameTr || "Club"}
            </span>
          </div>
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${cornerStyle.bgColor} ${cornerStyle.borderColor} border self-start`}
          >
            {cornerStyle.icon && <cornerStyle.icon className="w-4 h-4" />}
            <span className={`text-sm font-medium ${cornerStyle.textColor}`}>
              {corner?.nameEn || cornerStyle.name}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <StatusBadge status={event.status} />
            {hasParticipants && (
              <button
                onClick={() => onShowParticipants(event)}
                className="flex items-center gap-1 px-2 py-1 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 rounded-full text-purple-300 text-xs transition-colors"
                title="View Participants"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{event.participantCount}</span>
              </button>
            )}
          </div>
        </div>
        <div className="col-span-1 text-center">
          <div className="font-mono text-xl font-bold text-gold-light">
            {event.time || event.startTime || "--:--"}
          </div>
        </div>
        <div className="col-span-4">
          <div className="font-cinzel font-bold text-cream text-lg">
            {event.nameEn || event.nameTr}
          </div>
          {event.nameTr && event.nameEn && (
            <div className="text-sm text-emucon-text-secondary mt-0.5">
              {event.nameTr}
            </div>
          )}
        </div>
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-forest-light flex-shrink-0" />
            <span className="text-sm text-emucon-text-secondary truncate">
              {club?.nameEn || club?.nameTr || "Club"}
            </span>
          </div>
        </div>
        <div className="col-span-3">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${cornerStyle.bgColor} ${cornerStyle.borderColor} border`}
          >
            {cornerStyle.icon && <cornerStyle.icon className="w-5 h-5" />}
            <span className={`text-base font-medium ${cornerStyle.textColor}`}>
              {corner?.nameEn || cornerStyle.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Demo Component ───────────────────────────────────────────────
const EmuconDemoLive = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [syncCountdown, setSyncCountdown] = useState(30);

  // Participants modal state
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participantsData, setParticipantsData] = useState([]);
  const [participantsEventName, setParticipantsEventName] = useState("");

  const containerRef = useRef(null);
  const upcomingScrollRef = useRef(null);
  const completedScrollRef = useRef(null);
  const userInteractedRef = useRef(false);
  const autoScrollIntervalRef = useRef(null);

  // ── Mock "participant fetch" ──
  const handleShowParticipants = (event) => {
    setParticipantsEventName(event.nameEn || event.nameTr);
    setShowParticipantsModal(true);
    // Return a slice of mock participants proportional to participantCount
    const count = Math.min(
      event.participantCount || 0,
      emuconMockParticipants.length,
    );
    setParticipantsData(emuconMockParticipants.slice(0, count));
  };

  // ── Load mock data (replaces API call) ──
  const loadMockData = useCallback(() => {
    const cornersObj = emuconMockCorners;
    const cornersArray = Object.values(cornersObj);

    const events = [];
    cornersArray.forEach((corner) => {
      const clubsArray = Object.values(corner.clubs || {});
      clubsArray.forEach((club) => {
        (club.events?.scheduled || []).forEach((event) => {
          events.push({
            ...event,
            eventType: "scheduled",
            corner: {
              id: corner.id,
              nameEn: corner.nameEn,
              nameTr: corner.nameTr,
              cornerType: corner.id,
            },
            club: { id: club.id, nameEn: club.nameEn, nameTr: club.nameTr },
          });
        });
        (club.events?.continuous || []).forEach((event) => {
          events.push({
            ...event,
            eventType: "continuous",
            corner: {
              id: corner.id,
              nameEn: corner.nameEn,
              nameTr: corner.nameTr,
              cornerType: corner.id,
            },
            club: { id: club.id, nameEn: club.nameEn, nameTr: club.nameTr },
          });
        });
        (club.events?.standTime || []).forEach((event) => {
          events.push({
            ...event,
            eventType: "standTime",
            corner: {
              id: corner.id,
              nameEn: corner.nameEn,
              nameTr: corner.nameTr,
              cornerType: corner.id,
            },
            club: { id: club.id, nameEn: club.nameEn, nameTr: club.nameTr },
          });
        });
      });
    });

    // Sort: live first, then upcoming by time, then completed
    events.sort((a, b) => {
      const statusOrder = { live: 0, upcoming: 1, completed: 2 };
      const statusDiff =
        (statusOrder[a.status] || 1) - (statusOrder[b.status] || 1);
      if (statusDiff !== 0) return statusDiff;
      const timeA = a.time || a.startTime || "99:99";
      const timeB = b.time || b.startTime || "99:99";
      return timeA.localeCompare(timeB);
    });

    setAllEvents(events);
    setLastUpdate(new Date());
    setSyncCountdown(30);
    setIsLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    // Small delay to show the loading spinner briefly (feels more realistic)
    const t = setTimeout(loadMockData, 600);
    return () => clearTimeout(t);
  }, [loadMockData]);

  // Fake sync every 30 seconds (just resets countdown)
  useEffect(() => {
    const syncInterval = setInterval(() => {
      setSyncCountdown(30);
    }, 30 * 1000);
    return () => clearInterval(syncInterval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setSyncCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, []);

  // Update current time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScrollEnabled || userInteractedRef.current) return;

    const scrollContainers = [
      upcomingScrollRef.current,
      completedScrollRef.current,
    ].filter(Boolean);

    if (scrollContainers.length === 0) return;

    let currentContainerIndex = 0;
    let scrollDirection = 1;

    const autoScroll = () => {
      if (!autoScrollEnabled || userInteractedRef.current) return;
      const container = scrollContainers[currentContainerIndex];
      if (!container) return;
      const maxScroll = container.scrollHeight - container.clientHeight;
      const scrollSpeed = 1;
      const newScrollTop = container.scrollTop + scrollSpeed * scrollDirection;
      if (newScrollTop >= maxScroll && scrollDirection === 1) {
        scrollDirection = -1;
      } else if (newScrollTop <= 0 && scrollDirection === -1) {
        scrollDirection = 1;
        currentContainerIndex =
          (currentContainerIndex + 1) % scrollContainers.length;
      } else {
        container.scrollTop = newScrollTop;
      }
    };

    autoScrollIntervalRef.current = setInterval(autoScroll, 50);
    return () => {
      if (autoScrollIntervalRef.current)
        clearInterval(autoScrollIntervalRef.current);
    };
  }, [autoScrollEnabled]);

  // Handle user scroll interaction
  useEffect(() => {
    const handleUserScroll = () => {
      userInteractedRef.current = true;
      setTimeout(() => {
        userInteractedRef.current = false;
      }, 5000);
    };
    const containers = [
      upcomingScrollRef.current,
      completedScrollRef.current,
    ].filter(Boolean);
    containers.forEach((c) => {
      c?.addEventListener("wheel", handleUserScroll);
      c?.addEventListener("touchstart", handleUserScroll);
    });
    return () => {
      containers.forEach((c) => {
        c?.removeEventListener("wheel", handleUserScroll);
        c?.removeEventListener("touchstart", handleUserScroll);
      });
    };
  }, [allEvents]);

  // Fullscreen
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

  // Filter events
  const liveContinuousEvents = allEvents.filter(
    (e) => e.status === "live" && e.eventType === "continuous",
  );
  const liveEvents = allEvents.filter(
    (e) => e.status === "live" && e.eventType !== "continuous",
  );
  const upcomingEvents = allEvents.filter(
    (e) => e.status === "upcoming" && e.eventType !== "continuous",
  );
  const completedEvents = allEvents.filter(
    (e) => e.status === "completed" && e.eventType !== "continuous",
  );

  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-forest-dark via-forest-deep to-forest-dark flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 sm:w-16 sm:h-16 text-gold-light animate-spin mx-auto mb-4" />
          <p className="font-cinzel text-lg sm:text-xl text-cream">
            Loading Demo Events...
          </p>
        </div>
      </div>
    );
  }

  // ── Render ──
  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-b from-forest-dark via-forest-deep to-forest-dark text-cream ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* ─── DEMO BANNER ─── */}
      <div className="bg-gradient-to-r from-indigo-700 via-violet-600 to-indigo-700 text-white text-center py-2 px-4 text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
        <Info className="w-4 h-4 flex-shrink-0" />
        <span>
          <strong>DEMO MODE</strong> — This is a showcase with mock data. The
          real event has concluded.
        </span>
      </div>

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-forest-dark via-forest-deep to-forest-dark border-b-2 border-gold-light/30 shadow-lg shadow-black/50 backdrop-blur-sm">
        <div className="max-w-[1800px] mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Link
              to="/demo/emucon"
              className="p-1.5 sm:p-2 rounded-lg bg-forest-medium/50 hover:bg-forest-medium transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gold-light" />
            </Link>
            <div className="min-w-0">
              <h1 className="font-cinzel text-base sm:text-2xl md:text-3xl font-bold text-gold-light flex items-center gap-2 sm:gap-3">
                <Radio className="w-5 h-5 sm:w-8 sm:h-8 text-red-500 animate-pulse flex-shrink-0" />
                <span className="truncate">EMUCON Live</span>
              </h1>
              <p className="text-xs sm:text-sm text-emucon-text-secondary hidden sm:block">
                Real-time Event Board / Canlı Etkinlik Panosu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Compact Stats */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-red-900/30 border border-red-500/40 rounded-lg">
                <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-red-400">
                  {liveEvents.length}
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-900/30 border border-amber-500/40 rounded-lg">
                <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-bold text-amber-400">
                  {upcomingEvents.length}
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-800/30 border border-gray-500/40 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <span className="text-xs sm:text-sm font-bold text-gray-400">
                  {completedEvents.length}
                </span>
              </div>
            </div>

            {/* Current Time */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-forest-medium/50 rounded-lg border border-forest-light/30">
              <Clock className="w-5 h-5 text-gold-light" />
              <span className="font-mono text-xl font-bold text-gold-light">
                {currentTime.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>

            {/* Sync indicator */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-forest-medium/50 rounded-lg border border-forest-light/30">
              <RefreshCw
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-forest-light ${
                  syncCountdown <= 3 ? "animate-spin" : ""
                }`}
              />
              <span className="text-xs sm:text-sm text-forest-light font-mono">
                {syncCountdown}s
              </span>
            </div>

            {/* Auto-scroll toggle */}
            <button
              onClick={() => {
                setAutoScrollEnabled(!autoScrollEnabled);
                userInteractedRef.current = false;
              }}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors border border-forest-light/30 ${
                autoScrollEnabled
                  ? "bg-forest-light/30 hover:bg-forest-light/40"
                  : "bg-forest-medium/50 hover:bg-forest-medium"
              }`}
              title={
                autoScrollEnabled ? "Pause Auto-Scroll" : "Resume Auto-Scroll"
              }
            >
              {autoScrollEnabled ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-gold-light" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-gold-light" />
              )}
            </button>

            {/* Manual refresh (just resets countdown in demo) */}
            <button
              onClick={loadMockData}
              className="p-1.5 sm:p-2 rounded-lg bg-forest-medium/50 hover:bg-forest-medium transition-colors border border-forest-light/30"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-gold-light" />
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="hidden sm:block p-2 rounded-lg bg-forest-medium/50 hover:bg-forest-medium transition-colors border border-forest-light/30"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-gold-light" />
              ) : (
                <Maximize2 className="w-5 h-5 text-gold-light" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-[1800px] mx-auto px-3 sm:px-4 pt-6 sm:pt-8 pb-16 sm:pb-20 space-y-4 sm:space-y-6">
        {/* CONTINUOUS EVENTS */}
        {liveContinuousEvents.length > 0 && (
          <section className="bg-gradient-to-br from-emerald-900/40 via-forest-deep/50 to-emerald-900/40 rounded-xl sm:rounded-2xl border-2 border-emerald-500/50 overflow-hidden shadow-2xl shadow-emerald-900/40">
            <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin flex-shrink-0" />
                <h2 className="font-cinzel text-xs sm:text-lg font-bold text-white">
                  <span className="hidden sm:inline">
                    CONTINUOUS ACTIVITIES / SÜREKLİ ETKİNLİKLER
                  </span>
                  <span className="sm:hidden">CONTINUOUS</span>
                </h2>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-white/20 rounded-full">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                <span className="font-bold text-white text-xs sm:text-base">
                  {liveContinuousEvents.length}
                </span>
              </div>
            </div>
            <div className="hidden sm:grid grid-cols-12 gap-2 md:gap-4 px-3 sm:px-4 py-2 bg-emerald-900/40 text-xs uppercase tracking-wider text-emerald-300/70 font-semibold border-b border-emerald-500/30">
              <div className="col-span-4 md:col-span-2">Status</div>
              <div className="col-span-2 md:col-span-1 text-center">Time</div>
              <div className="col-span-6 md:col-span-4">Activity</div>
              <div className="hidden md:block col-span-2">Club</div>
              <div className="hidden md:block col-span-3">Corner</div>
            </div>
            <div className="divide-y divide-emerald-500/20">
              {liveContinuousEvents.map((event, idx) => (
                <EventRow
                  key={event.id || idx}
                  event={event}
                  corner={event.corner}
                  club={event.club}
                  isLive={true}
                  onShowParticipants={handleShowParticipants}
                />
              ))}
            </div>
          </section>
        )}

        {/* LIVE EVENTS */}
        {liveEvents.length > 0 && (
          <section className="bg-gradient-to-br from-red-900/30 via-forest-deep/50 to-red-900/30 rounded-xl sm:rounded-2xl border-2 border-red-500/40 overflow-hidden shadow-2xl shadow-red-900/30">
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse flex-shrink-0" />
                <h2 className="font-cinzel text-xs sm:text-lg font-bold text-white">
                  <span className="hidden sm:inline">
                    HAPPENING NOW / ŞİMDİ OLUYOR
                  </span>
                  <span className="sm:hidden">LIVE NOW</span>
                </h2>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-white/20 rounded-full">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-bounce" />
                <span className="font-bold text-white text-xs sm:text-base">
                  {liveEvents.length}
                </span>
              </div>
            </div>
            <div className="hidden sm:grid grid-cols-12 gap-2 md:gap-4 px-3 sm:px-4 py-2 bg-red-900/40 text-xs uppercase tracking-wider text-red-300/70 font-semibold border-b border-red-500/30">
              <div className="col-span-4 md:col-span-2">Status</div>
              <div className="col-span-2 md:col-span-1 text-center">Time</div>
              <div className="col-span-6 md:col-span-4">Event</div>
              <div className="hidden md:block col-span-2">Club</div>
              <div className="hidden md:block col-span-3">Corner</div>
            </div>
            <div className="divide-y divide-red-500/20">
              {liveEvents.map((event, idx) => (
                <EventRow
                  key={event.id || idx}
                  event={event}
                  corner={event.corner}
                  club={event.club}
                  isLive={true}
                  onShowParticipants={handleShowParticipants}
                />
              ))}
            </div>
          </section>
        )}

        {/* UPCOMING EVENTS */}
        {upcomingEvents.length > 0 && (
          <section className="bg-gradient-to-br from-amber-900/30 via-forest-deep/50 to-amber-900/30 rounded-xl sm:rounded-2xl border border-amber-500/30 overflow-hidden shadow-xl shadow-amber-900/20">
            <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                <h2 className="font-cinzel text-xs sm:text-base font-bold text-white">
                  <span className="hidden sm:inline">UPCOMING / YAKINDA</span>
                  <span className="sm:hidden">UPCOMING</span>
                </h2>
              </div>
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/20 rounded-full text-xs sm:text-sm font-bold text-white">
                {upcomingEvents.length}
              </span>
            </div>
            <div className="hidden sm:grid grid-cols-12 gap-2 md:gap-4 px-3 sm:px-4 py-2 bg-amber-900/40 text-xs uppercase tracking-wider text-amber-300/70 font-semibold border-b border-amber-500/30">
              <div className="col-span-4 md:col-span-2">Status</div>
              <div className="col-span-2 md:col-span-1 text-center">Time</div>
              <div className="col-span-6 md:col-span-4">Event</div>
              <div className="hidden md:block col-span-2">Club</div>
              <div className="hidden md:block col-span-3">Corner</div>
            </div>
            <div
              ref={upcomingScrollRef}
              className="divide-y divide-amber-500/20 max-h-[400px] overflow-y-auto"
            >
              {upcomingEvents.map((event, idx) => (
                <EventRow
                  key={event.id || idx}
                  event={event}
                  corner={event.corner}
                  club={event.club}
                  isLive={false}
                  onShowParticipants={handleShowParticipants}
                />
              ))}
            </div>
          </section>
        )}

        {/* COMPLETED EVENTS */}
        {completedEvents.length > 0 && (
          <section className="bg-gradient-to-br from-gray-800/30 via-forest-deep/50 to-gray-800/30 rounded-xl sm:rounded-2xl border border-gray-500/30 overflow-hidden shadow-xl shadow-gray-900/20 opacity-75">
            <div className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                <h2 className="font-cinzel text-xs sm:text-base font-bold text-white">
                  <span className="hidden sm:inline">
                    COMPLETED / TAMAMLANDI
                  </span>
                  <span className="sm:hidden">COMPLETED</span>
                </h2>
              </div>
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/20 rounded-full text-xs sm:text-sm font-bold text-white">
                {completedEvents.length}
              </span>
            </div>
            <div className="hidden sm:grid grid-cols-12 gap-2 md:gap-4 px-3 sm:px-4 py-2 bg-gray-800/40 text-xs uppercase tracking-wider text-gray-400/70 font-semibold border-b border-gray-500/30">
              <div className="col-span-4 md:col-span-2">Status</div>
              <div className="col-span-2 md:col-span-1 text-center">Time</div>
              <div className="col-span-6 md:col-span-4">Event</div>
              <div className="hidden md:block col-span-2">Club</div>
              <div className="hidden md:block col-span-3">Corner</div>
            </div>
            <div
              ref={completedScrollRef}
              className="divide-y divide-gray-500/20 max-h-[300px] overflow-y-auto"
            >
              {completedEvents.map((event, idx) => (
                <EventRow
                  key={event.id || idx}
                  event={event}
                  corner={event.corner}
                  club={event.club}
                  isLive={false}
                  onShowParticipants={handleShowParticipants}
                />
              ))}
            </div>
          </section>
        )}

        {/* No Events State */}
        {allEvents.length === 0 && (
          <div className="text-center py-12 sm:py-20">
            <Calendar className="w-16 h-16 sm:w-20 sm:h-20 text-forest-light mx-auto mb-4 sm:mb-6 opacity-50" />
            <h2 className="font-cinzel text-xl sm:text-2xl text-cream mb-2">
              No Events Yet
            </h2>
            <p className="text-sm sm:text-base text-emucon-text-secondary">
              Events will appear here once EMUCON starts
            </p>
          </div>
        )}
      </main>

      {/* ─── PARTICIPANTS MODAL ─── */}
      {showParticipantsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-forest-dark to-forest-deep border border-forest-light/30 rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-forest-light/20 flex items-center justify-between bg-forest-dark/50">
              <h3 className="font-cinzel text-lg text-cream flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                Participants
              </h3>
              <button
                onClick={() => setShowParticipantsModal(false)}
                className="text-emucon-text-secondary hover:text-cream transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-amber-300 text-sm mb-3 font-medium">
                {participantsEventName}
              </p>
              {participantsData.length > 0 ? (
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {participantsData.map((participant, idx) => (
                    <div
                      key={participant.id || idx}
                      className="bg-forest-dark/50 rounded-lg p-3 border border-forest-light/10"
                    >
                      <p className="text-cream font-medium">
                        {participant.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-emucon-text-secondary text-center py-8">
                  No participants registered yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── FOOTER ─── */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-forest-dark via-forest-deep to-forest-dark border-t border-forest-light/20 py-2 px-3 sm:px-4 backdrop-blur-sm">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between text-[10px] sm:text-xs text-emucon-text-secondary">
          <span className="truncate">EMUCON 2025 - Live Board (Demo)</span>
          <span className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Clock className="w-3 h-3" />
            <span className="hidden sm:inline">Last sync: </span>
            {lastUpdate ? lastUpdate.toLocaleTimeString() : "Loading..."}
          </span>
        </div>
      </footer>

      {/* Custom styles */}
      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(13, 31, 13, 0.5);
          border-radius: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(74, 124, 74, 0.6), rgba(45, 74, 45, 0.8));
          border-radius: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(74, 124, 74, 0.8), rgba(45, 74, 45, 1));
        }
        @media (max-width: 640px) {
          .overflow-y-auto {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  );
};

export default EmuconDemoLive;
