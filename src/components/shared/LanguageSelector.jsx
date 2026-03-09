import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { FaDiceD20 } from "react-icons/fa";

const LanguageSelector = ({ onLanguageSelect }) => {
  const { t } = useTranslation();

  const handleLanguageSelect = (language) => {
    // Cache the language selection
    localStorage.setItem("selectedLanguage", language);
    onLanguageSelect(language);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div
        className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-8 md:p-12 rounded-xl 
                   border-4 border-yellow-600/40 shadow-2xl max-w-lg w-full mx-4 animate-scaleIn"
        style={{
          boxShadow:
            "0 0 30px rgba(234, 179, 8, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-6 h-6 border-l-4 border-t-4 border-yellow-500/60 rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-6 h-6 border-r-4 border-t-4 border-yellow-500/60 rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-4 border-b-4 border-yellow-500/60 rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-4 border-b-4 border-yellow-500/60 rounded-br-lg" />

        <div className="text-center relative z-10">
          {/* Static dice icon - no animation */}
          <div className="flex justify-center mb-6">
            <FaDiceD20 className="text-7xl md:text-8xl text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
          </div>

          <h2
            className="text-3xl md:text-4xl font-bold text-yellow-400 mb-3 
                       drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]
                       font-serif tracking-wide"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
          >
            {t("language_selection.title")}
          </h2>

          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-6 rounded-full" />

          <p className="text-gray-300 mb-10 text-base md:text-lg font-serif">
            {t("language_selection.description")}
          </p>

          <div className="space-y-5">
            {/* English Button - Simplified hover effect */}
            <button
              onClick={() => handleLanguageSelect("en")}
              className="w-full bg-yellow-600 hover:bg-yellow-500
                         text-white font-bold py-4 px-8 rounded-lg
                         transition-colors duration-200
                         border-2 border-yellow-500/50 hover:border-yellow-400
                         shadow-lg text-lg md:text-xl"
              style={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              <span className="flex items-center justify-center gap-3">
                <span className="text-2xl md:text-3xl">🇺🇸</span>
                <span className="font-serif tracking-wide">
                  {t("language_selection.english")}
                </span>
              </span>
            </button>

            {/* Turkish Button - Simplified hover effect */}
            <button
              onClick={() => handleLanguageSelect("tr")}
              className="w-full bg-yellow-600 hover:bg-yellow-500
                         text-white font-bold py-4 px-8 rounded-lg
                         transition-colors duration-200
                         border-2 border-yellow-500/50 hover:border-yellow-400
                         shadow-lg text-lg md:text-xl"
              style={{
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              <span className="flex items-center justify-center gap-3">
                <span className="text-2xl md:text-3xl">🇹🇷</span>
                <span className="font-serif tracking-wide">
                  {t("language_selection.turkish")}
                </span>
              </span>
            </button>
          </div>

          <p className="mt-8 text-gray-500 text-sm italic font-serif">
            &quot;Choose your preferred language, brave adventurer...&quot;
          </p>
        </div>
      </div>
    </div>
  );
};

LanguageSelector.propTypes = {
  onLanguageSelect: PropTypes.func.isRequired,
};

export default LanguageSelector;
