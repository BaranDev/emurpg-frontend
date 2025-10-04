import { useState, useEffect } from "react";
import { FaDiceD20, FaBars, FaTimes, FaGithub, FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const Navbar = ({
  buttons = [],
  scrollEffectEnabled = true,
  onLanguageSwitch,
}) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(!scrollEffectEnabled);
  const [lastScrollY, setLastScrollY] = useState(0);

  const currentLanguage = i18n.language;

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
      className={`px-3 py-2 rounded relative group ${
        button.disabled ? "text-gray-400 cursor-not-allowed" : "text-white-400"
      }`}
    >
      {button.label}
      {button.badge && (
        <span className="absolute -top-2 -right-2 bg-gray-600 text-xs px-2 py-1 rounded-full text-white">
          {button.badge}
        </span>
      )}
    </button>
  );

  return (
    <>
      {isVisible && (
        <nav
          className={`${
            scrollEffectEnabled ? "fixed animate-slideDown" : "relative"
          } top-0 left-0 right-0 bg-gray-800/50 backdrop-blur-[2px] border-b-2 border-yellow-600 z-50 transition-all duration-200`}
        >
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <FaDiceD20 className="text-yellow-500 text-2xl" />
                  <span className="ml-2 text-yellow-500 font-medieval text-lg">
                    EMU RPG Club
                  </span>
                </div>
                <div className="flex items-center text-[10px] text-yellow-500 mt-1">
                  {t("navbar.made_by")}
                  <FaGithub className="ml-1 mr-1" />
                  <a
                    href="https://github.com/barandev"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    Barandev
                  </a>
                </div>
              </div>

              {/* Desktop menu */}
              <div className="hidden md:flex items-center space-x-4">
                {buttons.map(renderButton)}
                {/* Language Switcher */}
                <button
                  onClick={onLanguageSwitch}
                  className="px-3 py-2 rounded relative group text-yellow-500 hover:text-yellow-400 flex items-center gap-2 border border-yellow-600/30 hover:border-yellow-500/50 transition-all"
                  title={t("navbar.language")}
                >
                  <FaGlobe className="text-lg" />
                  <span className="text-sm">
                    {currentLanguage === "en"
                      ? t("navbar.english")
                      : t("navbar.turkish")}
                  </span>
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-300 hover:text-yellow-500 focus:outline-none"
                >
                  {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
              <div className="md:hidden border-t border-gray-700 animate-fadeIn">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {buttons.map((button) => (
                    <button
                      key={button.label}
                      disabled={button.disabled}
                      onClick={button.onClick}
                      className={`block px-3 py-2 rounded w-full text-left relative ${
                        button.disabled
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-white-400"
                      }`}
                    >
                      {button.label}
                      {button.badge && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-600 text-xs px-2 py-1 rounded-full text-white">
                          {button.badge}
                        </span>
                      )}
                    </button>
                  ))}
                  {/* Language Switcher for Mobile */}
                  <button
                    onClick={onLanguageSwitch}
                    className="block px-3 py-2 rounded w-full text-left text-yellow-500 hover:text-yellow-400 flex items-center gap-2 border border-yellow-600/30 hover:border-yellow-500/50 transition-all"
                  >
                    <FaGlobe className="text-lg" />
                    <span>
                      {currentLanguage === "en"
                        ? t("navbar.english")
                        : t("navbar.turkish")}
                    </span>
                  </button>
                </div>
              </div>
            )}
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
