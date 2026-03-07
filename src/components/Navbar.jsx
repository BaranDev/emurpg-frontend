import { useState, useEffect } from "react";
import { FaGithub, FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import emurpgLogo from "../assets/logo/LOGO_DARKGRAY.png";

const Navbar = ({
  buttons = [],
  scrollEffectEnabled = true,
  onLanguageSwitch,
}) => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(!scrollEffectEnabled);
  const [lastScrollY, setLastScrollY] = useState(0);

  const currentLanguage = i18n.language;

  // Toggle language handler
  const handleLanguageToggle = () => {
    const nextLanguage = currentLanguage === "en" ? "tr" : "en";
    if (onLanguageSwitch) {
      onLanguageSwitch(nextLanguage);
    }
  };

  const emuconButton = {
    label: "EMUCON",
    onClick: () => (window.location.href = "/emucon/"),
    disabled: false,
  };

  useEffect(() => {
    const controlNavbar = () => {
      if (!scrollEffectEnabled) {
        setIsVisible(true);
        return;
      }

      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      setLastScrollY(window.scrollY);
    };

    controlNavbar(); // Initial call to set correct visibility
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY, scrollEffectEnabled]);

  const renderButton = (button) => (
    <button
      key={button.label}
      disabled={button.isDisabled}
      onClick={button.onClick}
      className={`px-4 py-2 rounded-lg relative group font-medium transition-all duration-300 ${
        button.disabled
          ? "text-gray-500 cursor-not-allowed opacity-50"
          : "text-white/80 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/20 backdrop-blur-sm"
      }`}
    >
      <span className="relative z-10">{button.label}</span>
      {button.badge && (
        <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-[10px] px-2 py-0.5 rounded-full text-white font-bold shadow-lg border border-white/30 backdrop-blur-sm">
          {button.badge}
        </span>
      )}
      {/* Magical glow underline effect */}
      {!button.disabled && (
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400/60 via-white/80 to-purple-400/60 group-hover:w-full transition-all duration-300 shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
      )}
    </button>
  );

  return (
    <>
      {isVisible && (
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
            scrollEffectEnabled ? "animate-slideDown" : ""
          }`}
          style={{
            background:
              "linear-gradient(to bottom, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.75) 50%, rgba(15, 23, 42, 0.85) 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {/* Cloud-like bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
            <svg
              className="absolute bottom-0 w-full h-full"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,120 Q200,80 400,100 T800,90 T1200,110 L1200,120 L0,120 Z"
                fill="rgba(15, 23, 42, 0.9)"
                opacity="0.6"
              />
              <path
                d="M0,120 Q150,70 350,95 T750,85 T1200,105 L1200,120 L0,120 Z"
                fill="rgba(15, 23, 42, 0.7)"
                opacity="0.4"
              />
            </svg>
          </div>

          {/* Misty fog effect */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          </div>

          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-20">
              {/* Logo Section - Redesigned */}
              <div
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => (window.location.href = "/")}
              >
                {/* Moon Logo */}
                <div className="relative">
                  {/* Moon glow - soft white/blue */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-white/20 to-blue-200/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />

                  {/* Moon phases glow rings */}
                  <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/30 transition-all duration-300" />
                  <div className="absolute inset-1 rounded-full border border-white/10" />

                  {/* Moon surface */}
                  <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-gradient-to-br from-slate-100/90 via-white/80 to-slate-200/90 p-1 shadow-[0_0_20px_rgba(255,255,255,0.3),inset_0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4),inset_0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500">
                    <img
                      src={emurpgLogo}
                      alt="EMURPG Logo"
                      className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))",
                      }}
                    />
                  </div>

                  {/* Moonlight rays */}
                  <div className="absolute -inset-2 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-0.5 h-4 bg-white/40 origin-bottom"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${
                            i * 45
                          }deg) translateY(-8px)`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Club name with magical forest styling */}
                <div className="flex flex-col">
                  <span className="text-white/90 font-bold text-lg md:text-xl tracking-wide group-hover:text-white transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    EMU RPG Club
                  </span>
                  <div className="flex items-center text-[10px] text-slate-400/70 mt-0.5">
                    {t("navbar.made_by")}
                    <FaGithub className="ml-1 mr-1 text-[9px]" />
                    <a
                      href="https://github.com/barandev"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-yellow-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Barandev
                    </a>
                  </div>
                </div>
              </div>

              {/* Desktop menu */}
              <div className="hidden md:flex items-center space-x-3">
                {[emuconButton, ...buttons].map(renderButton)}
                {/* Language Switcher */}
                <button
                  onClick={handleLanguageToggle}
                  className="px-4 py-2 rounded-lg relative group text-white/80 hover:text-white flex items-center gap-2 border border-white/20 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  title={t("navbar.language")}
                >
                  <FaGlobe className="text-base group-hover:rotate-180 transition-transform duration-500" />
                  <span className="text-sm font-medium">
                    {currentLanguage === "en"
                      ? t("navbar.english")
                      : t("navbar.turkish")}
                  </span>
                </button>
              </div>

              {/* Mobile language globe */}
              <button
                onClick={handleLanguageToggle}
                className="md:hidden p-2 rounded-lg text-white/80 hover:text-white transition-colors duration-300"
                title={t("navbar.language")}
                aria-label={t("navbar.language")}
              >
                <FaGlobe className="text-lg" />
              </button>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

Navbar.propTypes = {
  buttons: PropTypes.array,
  scrollEffectEnabled: PropTypes.bool,
  onLanguageSwitch: PropTypes.func,
};

export default Navbar;
