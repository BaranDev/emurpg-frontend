import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Settings, Globe, MessageSquare } from "lucide-react";
import { FaPlay, FaPause } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useGlobalAudio } from "../../contexts/GlobalAudioContext";
import logoYellow from "../../assets/logo/LOGO_YELLOW.png";

/**
 * CharrollerNavbar - Minimal tavern-themed navbar for Charroller pages.
 * Only a back arrow (to /) + logo on the left, music/language/settings on right.
 */
const CharrollerNavbar = ({ onLanguageSwitch, onSettingsOpen, onFeedbackOpen }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { isPlaying, togglePlay, hasUserInteracted, unlockAudio } =
    useGlobalAudio();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isOnManager = location.pathname.includes("/manager");

  const handleLanguageToggle = () => {
    const newLang = i18n.language === "en" ? "tr" : "en";
    i18n.changeLanguage(newLang);
    if (onLanguageSwitch) onLanguageSwitch(newLang);
  };

  const handleMusicToggle = async () => {
    if (!hasUserInteracted) {
      await unlockAudio();
    } else {
      await togglePlay();
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: isScrolled
          ? "rgba(42, 26, 15, 0.97)"
          : "rgba(42, 26, 15, 0.88)",
        borderBottom: "1px solid rgba(139, 69, 19, 0.3)",
        boxShadow: isScrolled
          ? "0 4px 32px rgba(80, 40, 10, 0.2), inset 0 -1px 0 rgba(139, 69, 19, 0.12)"
          : "none",
        backdropFilter: "blur(14px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left: back arrow + logo */}
          <div className="flex items-center gap-3">
            {/* Back to home */}
            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-2 px-2.5 py-1.5 -ml-2.5 rounded-lg transition-all duration-300"
              style={{ color: "#d4a574" }}
              title={t("events_page.homepage")}
            >
              <ArrowLeft
                className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
                style={{
                  filter: "drop-shadow(0 0 4px rgba(255, 170, 51, 0.5))",
                }}
              />
              <span
                className="hidden sm:inline text-sm font-medium tracking-wide opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  color: "#d4a574",
                  textShadow: "0 0 12px rgba(255, 170, 51, 0.3)",
                }}
              >
                {t("events_page.homepage")}
              </span>
            </button>

            {/* Divider */}
            <div
              className="hidden sm:block h-5 w-px"
              style={{ background: "rgba(139, 69, 19, 0.4)" }}
            />

            {/* Logo + brand */}
            <button
              onClick={() => navigate("/charroller")}
              className="flex items-center gap-2 transition-opacity duration-300 hover:opacity-90"
            >
              <img
                src={logoYellow}
                alt="Charroller"
                className="w-8 h-8"
                style={{
                  filter:
                    "drop-shadow(0 0 8px rgba(255, 170, 51, 0.4)) brightness(1.1)",
                }}
              />
              <span
                className="hidden sm:inline font-cinzel font-bold text-base tracking-wide"
                style={{
                  color: "#d4a574",
                  textShadow: "0 0 16px rgba(255, 170, 51, 0.25)",
                }}
              >
                Charroller
              </span>
              <span
                className="hidden sm:inline px-1.5 py-0.5 text-[9px] font-bold rounded"
                style={{
                  background: "rgba(255, 170, 51, 0.12)",
                  color: "#ffaa33",
                  border: "1px solid rgba(255, 170, 51, 0.25)",
                }}
              >
                BETA
              </span>
            </button>
          </div>

          {/* Right: music (mobile) + language + settings */}
          <div className="flex items-center gap-1">
            {/* Music toggle — mobile only */}
            <button
              onClick={handleMusicToggle}
              className="md:hidden p-2 rounded-lg transition-all duration-300"
              style={{
                color: isPlaying ? "#ffaa33" : "#8a7060",
                filter: isPlaying
                  ? "drop-shadow(0 0 6px rgba(255, 170, 51, 0.4))"
                  : "none",
              }}
              title={isPlaying ? "Pause music" : "Play music"}
            >
              {isPlaying ? (
                <FaPause className="w-4 h-4" />
              ) : (
                <FaPlay className="w-4 h-4" />
              )}
            </button>

            {/* Feedback — mobile only */}
            {onFeedbackOpen && (
              <button
                onClick={onFeedbackOpen}
                className="md:hidden p-2 rounded-lg transition-colors duration-300 hover:text-amber-300"
                style={{ color: "#8a7060" }}
                title="Feedback"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            )}

            {/* Language */}
            <button
              onClick={handleLanguageToggle}
              className="p-2 rounded-lg transition-colors duration-300 hover:text-amber-300"
              style={{ color: "#8a7060" }}
              title={t("navbar.language")}
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Settings — manager only */}
            {isOnManager && onSettingsOpen && (
              <button
                onClick={onSettingsOpen}
                className="p-2 rounded-lg transition-colors duration-300 hover:text-amber-300"
                style={{ color: "#8a7060" }}
                title={t("common.settings")}
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

CharrollerNavbar.propTypes = {
  onLanguageSwitch: PropTypes.func,
  onSettingsOpen: PropTypes.func,
  onFeedbackOpen: PropTypes.func,
};

export default CharrollerNavbar;
