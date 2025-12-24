import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Home, Users, Scroll, Settings, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import logoYellow from "../../assets/logo/LOGO_YELLOW.png";
import logoBlue from "../../assets/logo/LOGO_LIGHTBLUE.png";

/**
 * CharrollerNavbar - Custom navigation for Charroller pages
 * Supports both arcane (landing) and tavern (manager) themes
 */
const CharrollerNavbar = ({ 
  theme = "arcane",  // "arcane" | "tavern"
  onLanguageSwitch,
  onSettingsOpen
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme configuration
  const themeConfig = {
    arcane: {
      bg: "rgba(15, 30, 50, 0.95)",
      bgScrolled: "rgba(15, 30, 50, 0.98)",
      border: "rgba(74, 158, 255, 0.3)",
      accent: "#4a9eff",
      accentHover: "rgba(74, 158, 255, 0.2)",
      text: "#e2e8f0",
      textMuted: "#94a3b8",
      logo: logoBlue,
      shadow: "0 4px 30px rgba(74, 158, 255, 0.15)"
    },
    tavern: {
      bg: "rgba(42, 26, 15, 0.95)",
      bgScrolled: "rgba(42, 26, 15, 0.98)",
      border: "rgba(139, 69, 19, 0.4)",
      accent: "#ffaa33",
      accentHover: "rgba(255, 170, 51, 0.2)",
      text: "#d4a574",
      textMuted: "#a67c52",
      logo: logoYellow,
      shadow: "0 4px 30px rgba(139, 69, 19, 0.2)"
    }
  };

  const colors = themeConfig[theme] || themeConfig.arcane;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isOnManager = location.pathname.includes("/manager");
  const isOnLanding = location.pathname === "/charroller";

  const handleLanguageToggle = () => {
    const newLang = i18n.language === "en" ? "tr" : "en";
    i18n.changeLanguage(newLang);
    if (onLanguageSwitch) onLanguageSwitch(newLang);
  };

  const navLinks = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Characters", icon: Users, href: "/charroller/manager", active: isOnManager },
    { label: "About", icon: Scroll, href: "/charroller", active: isOnLanding && !isOnManager },
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled ? colors.bgScrolled : colors.bg,
        borderBottom: `1px solid ${colors.border}`,
        boxShadow: isScrolled ? colors.shadow : "none",
        backdropFilter: "blur(10px)"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo - at very left */}
          <div className="flex items-center gap-3">
            <img 
              src={colors.logo}
              alt="Charroller"
              className="w-10 h-10 drop-shadow-md"
            />
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-cinzel font-bold text-lg" style={{ color: colors.text }}>
                Charroller
              </span>
              <span 
                className="px-1.5 py-0.5 text-[10px] font-bold rounded"
                style={{ 
                  background: `${colors.accent}22`,
                  color: colors.accent,
                  border: `1px solid ${colors.accent}44`
                }}
              >
                BETA
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${link.active ? "font-medium" : ""}
                `}
                style={{
                  color: link.active ? colors.accent : colors.textMuted,
                  background: link.active ? colors.accentHover : "transparent"
                }}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={handleLanguageToggle}
              className="p-2 rounded-lg transition-colors"
              style={{ color: colors.textMuted }}
              title="Switch Language"
            >
              <Globe className="w-5 h-5" />
            </button>

            {/* Settings (only on manager) */}
            {isOnManager && onSettingsOpen && (
              <button
                onClick={onSettingsOpen}
                className="p-2 rounded-lg transition-colors"
                style={{ color: colors.textMuted }}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: colors.text }}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden py-4 border-t"
            style={{ borderColor: colors.border }}
          >
            <div className="space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => {
                    navigate(link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                  style={{
                    color: link.active ? colors.accent : colors.text,
                    background: link.active ? colors.accentHover : "transparent"
                  }}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

CharrollerNavbar.propTypes = {
  theme: PropTypes.oneOf(["arcane", "tavern"]),
  onLanguageSwitch: PropTypes.func,
  onSettingsOpen: PropTypes.func
};

export default CharrollerNavbar;
