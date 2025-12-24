import { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Users, ChevronDown, Sparkles, Dice1, Shield, Scroll, Zap, Heart, BookOpen } from "lucide-react";
import CharrollerBackground from "../components/Charroller/CharrollerBackground";
import { CharrollerFooter, CharrollerNavbar, MusicPlayer } from "../components/Charroller";
import emurpgLogo from "../assets/logo/LOGO_WHITE.png";

/**
 * CharrollerLandingPage - Introduction/landing page for Charroller
 * Uses site conventions: Navbar with scroll effect, parallax background
 * Music starts playing automatically here
 */
const CharrollerLandingPage = ({ onLanguageSwitch }) => {
  const { t } = useTranslation();
  const infoSectionRef = useRef(null);

  const scrollToInfo = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Navbar with arcane theme */}
      <CharrollerNavbar
        theme="arcane"
        onLanguageSwitch={onLanguageSwitch}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-900 relative"
      >
        {/* Parallax Background */}
        <CharrollerBackground />

        {/* Music Player (autoplay, fixed position) */}
        <div className="fixed bottom-6 right-6 z-50">
          <MusicPlayer autoPlay={true} theme="arcane" />
        </div>

        {/* Content wrapper with z-index */}
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="relative h-screen flex items-center justify-center">
            {/* Subtle overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/40" />

            <div className="relative z-10 text-center px-4">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <img
                  src={emurpgLogo}
                  alt="EMURPG Logo"
                  className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 drop-shadow-[0_0_40px_rgba(74,158,255,0.5)]"
                  style={{ filter: "brightness(1.1)" }}
                />
              </motion.div>

              {/* Title with BETA badge */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-center gap-3 mb-4"
              >
                <h1
                  className="font-cinzel text-5xl md:text-7xl font-bold text-white drop-shadow-[0_0_20px_rgba(74,158,255,0.5)]"
                >
                  {t("charroller.hero_title")}
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-xl md:text-2xl mb-4 text-blue-200 drop-shadow-[0_0_10px_rgba(74,158,255,0.3)]"
              >
                {t("charroller.hero_subtitle")}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto"
              >
                {t("charroller.hero_description")}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link
                  to="/charroller/manager"
                  className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold rounded-lg 
                             border-2 border-blue-400 uppercase tracking-wider
                             transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(74,158,255,0.5)]"
                  style={{
                    background: "linear-gradient(135deg, #1e3a5f, #2d5a87)",
                  }}
                >
                  <Users className="w-5 h-5" />
                  {t("charroller.cta_enter")}
                </Link>

                <button
                  onClick={scrollToInfo}
                  className="inline-flex items-center gap-2 px-6 py-4 text-slate-300 font-medium rounded-lg 
                             border border-slate-500 uppercase tracking-wider
                             transition-all duration-300 hover:text-white hover:border-slate-400"
                >
                  {t("charroller.cta_learn_more")}
                  <ChevronDown className="w-4 h-4 animate-bounce" />
                </button>
              </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-20"
            >
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
            </motion.div>
          </section>

          {/* Info Section */}
          <section
            ref={infoSectionRef}
            className="py-24 px-4 bg-gradient-to-b from-slate-950/80 via-blue-950/30 to-slate-950/80"
          >
            <div className="max-w-6xl mx-auto">
              {/* Section Title */}
              <div className="text-center mb-20">
                <h2 className="font-cinzel text-4xl md:text-5xl text-white mb-6 drop-shadow-[0_0_10px_rgba(74,158,255,0.4)]">
                  {t("charroller.info_title")}
                </h2>
                <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
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
                  background: "rgba(30, 58, 95, 0.4)",
                  border: "1px solid rgba(74, 158, 255, 0.3)",
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
                <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-6 opacity-80" />
                <blockquote className="text-xl md:text-3xl text-slate-300 italic max-w-4xl mx-auto mb-6 font-serif leading-relaxed">
                  "{t("charroller.testimonial")}"
                </blockquote>
                <p className="text-blue-400 font-cinzel tracking-wider uppercase text-sm">
                  - {t("charroller.testimonial_author")}
                </p>
              </div>

              {/* Final CTA */}
              <div className="text-center pb-12">
                <p className="text-slate-300 text-lg mb-8">
                  {t("charroller.cta_ready")}
                </p>
                <Link
                  to="/charroller/manager"
                  className="inline-flex items-center gap-3 px-10 py-5 text-white font-bold rounded-xl 
                             uppercase tracking-wider transition-all duration-300 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #1e3a5f, #2d5a87)",
                    boxShadow: "0 0 40px rgba(74, 158, 255, 0.3)",
                    fontSize: "1.1rem",
                    border: "2px solid rgba(74, 158, 255, 0.5)",
                  }}
                >
                  <Users className="w-6 h-6" />
                  {t("charroller.cta_start")}
                </Link>
              </div>
            </div>
          </section>

          {/* Footer */}
          <CharrollerFooter />
        </div>
      </motion.div>
    </>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="p-8 rounded-2xl transition-all duration-300"
    style={{
      background: "rgba(30, 58, 95, 0.4)",
      border: "1px solid rgba(74, 158, 255, 0.2)",
      backdropFilter: "blur(5px)",
    }}
  >
    <div className="text-blue-400 mb-6 bg-blue-500/10 w-16 h-16 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <h3 className="font-cinzel text-xl text-white mb-3">{title}</h3>
    <p className="text-slate-400 text-base leading-relaxed">{description}</p>
  </motion.div>
);

const StepCard = ({ number, title, description }) => (
  <div className="text-center relative z-10">
    <div
      className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center font-cinzel text-2xl text-white font-bold"
      style={{
        background: "linear-gradient(135deg, #1e3a5f, #2d5a87)",
        boxShadow: "0 0 20px rgba(74, 158, 255, 0.3)",
        border: "3px solid rgba(74, 158, 255, 0.5)",
      }}
    >
      {number}
    </div>
    <h4 className="font-cinzel text-xl text-white mb-3">{title}</h4>
    <p className="text-slate-400 text-sm px-4">{description}</p>
  </div>
);

export default CharrollerLandingPage;
