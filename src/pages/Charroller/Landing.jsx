import { useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ChevronDown,
  Sparkles,
  Dice1,
  Shield,
  Scroll,
  Zap,
  Heart,
  BookOpen,
} from "lucide-react";
import {
  CharrollerFooter,
  CharrollerNavbar,
  TavernPlayer,
  TavernBackground,
} from "../../components";
import { useGlobalAudio } from "../../contexts/GlobalAudioContext";
import emurpgLogo from "../../assets/logo/LOGO_WHITE.png";

/**
 * CharrollerLandingPage - Introduction/landing page for Charroller
 * Uses site conventions: Navbar with scroll effect, parallax background
 */
const CharrollerLandingPage = ({ onLanguageSwitch }) => {
  const { t } = useTranslation();
  const infoSectionRef = useRef(null);
  const navigate = useNavigate();
  const { unlockAudio } = useGlobalAudio();

  const scrollToInfo = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEnterCharroller = async () => {
    await unlockAudio();
    navigate("/charroller/manager");
  };

  return (
    <>
      {/* Navbar with tavern theme */}
      <CharrollerNavbar onLanguageSwitch={onLanguageSwitch} />

      <div className="min-h-screen bg-gray-900 relative animate-fadeIn">
        {/* Parallax Background */}
        <TavernBackground />

        {/* Music Player — desktop only (mobile uses navbar play button) */}
        <div className="hidden md:block fixed bottom-6 right-6 z-50">
          <TavernPlayer />
        </div>

        {/* Content wrapper with z-index */}
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="relative h-screen flex items-center justify-center">
            {/* Subtle overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-950/20 to-stone-950/40" />

            <div className="relative z-10 text-center px-4">
              {/* Logo */}
              <div className="animate-scaleIn">
                <img
                  src={emurpgLogo}
                  alt="EMURPG Logo"
                  className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 drop-shadow-[0_0_40px_rgba(255,170,51,0.5)]"
                  style={{ filter: "brightness(1.1)" }}
                />
              </div>

              {/* Title with BETA badge */}
              <div className="flex items-center justify-center gap-3 mb-4 animate-slideDown">
                <h1 className="font-cinzel text-5xl md:text-7xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,170,51,0.5)]">
                  {t("charroller.hero_title")}
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl mb-4 text-amber-200 drop-shadow-[0_0_10px_rgba(255,170,51,0.3)] animate-fadeIn">
                {t("charroller.hero_subtitle")}
              </p>

              {/* Description */}
              <p className="text-lg text-stone-300 mb-10 max-w-2xl mx-auto animate-fadeIn">
                {t("charroller.hero_description")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn">
                <button
                  type="button"
                  onClick={handleEnterCharroller}
                  className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold rounded-lg 
                             border-2 border-amber-500 uppercase tracking-wider
                             transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,170,51,0.5)]"
                  style={{
                    background: "linear-gradient(135deg, #5a3a1a, #7a4a22)",
                  }}
                >
                  <Users className="w-5 h-5" />
                  {t("charroller.cta_enter")}
                </button>

                <button
                  onClick={scrollToInfo}
                  className="inline-flex items-center gap-2 px-6 py-4 text-stone-300 font-medium rounded-lg 
                             border border-stone-500 uppercase tracking-wider
                             transition-all duration-300 hover:text-white hover:border-stone-400"
                >
                  {t("charroller.cta_learn_more")}
                  <ChevronDown className="w-4 h-4 animate-bounce" />
                </button>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-20 animate-fadeIn">
              <button
                className="text-white/70 transition-colors bg-transparent hover:bg-transparent hover:text-white"
                onClick={scrollToInfo}
              >
                <svg
                  className="w-4 h-4 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>
            </div>
          </section>

          {/* Info Section */}
          <section
            ref={infoSectionRef}
            className="py-24 px-4 bg-gradient-to-b from-stone-950/80 via-amber-950/30 to-stone-950/80"
          >
            <div className="max-w-6xl mx-auto">
              {/* Section Title */}
              <div className="text-center mb-20">
                <h2 className="font-cinzel text-4xl md:text-5xl text-white mb-6 drop-shadow-[0_0_10px_rgba(255,170,51,0.4)]">
                  {t("charroller.info_title")}
                </h2>
                <p className="text-stone-300 text-lg md:text-xl max-w-2xl mx-auto">
                  {t("charroller.info_description")}
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                <FeatureCard
                  icon={<Sparkles className="w-8 h-8" />}
                  title={t("charroller.feature_ai_title")}
                  description={t("charroller.feature_ai_desc")}
                />
                <FeatureCard
                  icon={<Dice1 className="w-8 h-8" />}
                  title={t("charroller.feature_dice_title")}
                  description={t("charroller.feature_dice_desc")}
                />
                <FeatureCard
                  icon={<Shield className="w-8 h-8" />}
                  title={t("charroller.feature_systems_title")}
                  description={t("charroller.feature_systems_desc")}
                />
                <FeatureCard
                  icon={<Scroll className="w-8 h-8" />}
                  title={t("charroller.feature_pdf_title")}
                  description={t("charroller.feature_pdf_desc")}
                />
                <FeatureCard
                  icon={<Heart className="w-8 h-8" />}
                  title={t("charroller.feature_save_title")}
                  description={t("charroller.feature_save_desc")}
                />
                <FeatureCard
                  icon={<Zap className="w-8 h-8" />}
                  title={t("charroller.feature_fast_title")}
                  description={t("charroller.feature_fast_desc")}
                />
              </div>

              {/* How It Works */}
              <div
                className="rounded-3xl p-8 md:p-12 mb-20"
                style={{
                  background: "rgba(90, 58, 26, 0.4)",
                  border: "1px solid rgba(255, 170, 51, 0.3)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <h3 className="font-cinzel text-3xl text-white text-center mb-12">
                  {t("charroller.how_it_works")}
                </h3>
                <div className="grid md:grid-cols-3 gap-10">
                  <StepCard
                    number="1"
                    title={t("charroller.step1_title")}
                    description={t("charroller.step1_desc")}
                  />
                  <StepCard
                    number="2"
                    title={t("charroller.step2_title")}
                    description={t("charroller.step2_desc")}
                  />
                  <StepCard
                    number="3"
                    title={t("charroller.step3_title")}
                    description={t("charroller.step3_desc")}
                  />
                </div>
              </div>

              {/* Testimonial */}
              <div className="text-center mb-20 px-4">
                <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-6 opacity-80" />
                <blockquote className="text-xl md:text-3xl text-stone-300 italic max-w-4xl mx-auto mb-6 font-serif leading-relaxed">
                  &quot;{t("charroller.testimonial")}&quot;
                </blockquote>
                <p className="text-amber-400 font-cinzel tracking-wider uppercase text-sm">
                  - {t("charroller.testimonial_author")}
                </p>
              </div>

              {/* Final CTA */}
              <div className="text-center pb-12">
                <p className="text-stone-300 text-lg mb-8">
                  {t("charroller.cta_ready")}
                </p>
                <button
                  type="button"
                  onClick={handleEnterCharroller}
                  className="inline-flex items-center gap-3 px-10 py-5 text-white font-bold rounded-xl 
                             uppercase tracking-wider transition-all duration-300 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #5a3a1a, #7a4a22)",
                    boxShadow: "0 0 40px rgba(255, 170, 51, 0.3)",
                    fontSize: "1.1rem",
                    border: "2px solid rgba(255, 170, 51, 0.5)",
                  }}
                >
                  <Users className="w-6 h-6" />
                  {t("charroller.cta_start")}
                </button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <CharrollerFooter />
        </div>
      </div>
    </>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div
    className="p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2"
    style={{
      background: "rgba(90, 58, 26, 0.4)",
      border: "1px solid rgba(255, 170, 51, 0.2)",
      backdropFilter: "blur(5px)",
    }}
  >
    <div className="text-amber-400 mb-6 bg-amber-500/10 w-16 h-16 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <h3 className="font-cinzel text-xl text-white mb-3">{title}</h3>
    <p className="text-stone-400 text-base leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="text-center relative z-10">
    <div
      className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center font-cinzel text-2xl text-white font-bold"
      style={{
        background: "linear-gradient(135deg, #5a3a1a, #7a4a22)",
        boxShadow: "0 0 20px rgba(255, 170, 51, 0.3)",
        border: "3px solid rgba(255, 170, 51, 0.5)",
      }}
    >
      {number}
    </div>
    <h4 className="font-cinzel text-xl text-white mb-3">{title}</h4>
    <p className="text-stone-400 text-sm px-4">{description}</p>
  </div>
);

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

StepCard.propTypes = {
  number: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

CharrollerLandingPage.propTypes = {
  onLanguageSwitch: PropTypes.func,
};

export default CharrollerLandingPage;
