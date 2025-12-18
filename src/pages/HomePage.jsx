import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FaDiceD20,
  FaDiscord,
  FaWhatsapp,
  FaCalendar,
  FaScroll,
  FaBookOpen,
  FaUser,
  FaDice,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  SocialButton,
  GameMasterCard,
  SectionTitle,
  Navbar,
  InstagramGrid,
  FireButton,
  MainFooter,
  HomePageEventList,
} from "../components";
import ParallaxBackground from "../components/ParallaxBackground";
import * as photos from "../assets/member_photos";
import emurpgLogo from "../assets/logo/LOGO_WHITE.png";
import { config, rpgQuotes } from "../config";

const HomePage = ({ onLanguageSwitch }) => {
  const { t } = useTranslation();
  const [diceQuote, setDiceQuote] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "EMURPG Club - Home";
    const loadTimer = setTimeout(() => setIsLoading(false), 1500);

    return () => {
      clearTimeout(loadTimer);
    };
  }, []);

  const rollDice = () => {
    setDiceQuote(rpgQuotes[Math.floor(Math.random() * rpgQuotes.length)]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl text-yellow-500"
        >
          <FaDiceD20 />
        </motion.div>
      </div>
    );
  }

  const handleJoinButton_discord = () => {
    window.open(config.DISCORD_LINK, "_blank");
  };

  const handleJoinButton_whatsapp = () => {
    window.open(config.WHATSAPP_LINK, "_blank");
  };

  const handleJoinButton_events = () => {
    window.location.href = "/events";
  };

  return (
    <>
      <Navbar onLanguageSwitch={onLanguageSwitch} />
      <Navbar
        onLanguageSwitch={onLanguageSwitch}
        buttons={[
          {
            label: t("navbar.events"),
            onClick: () => (window.location.href = "/events"),
            disabled: false,
          },
          {
            label: t("navbar.character_roller"),
            disabled: true,
            badge: t("events_page.soon_badge"),
            onClick: () => {},
          },
        ]}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-900 relative"
      >
        {/* Parallax Background */}
        <ParallaxBackground />

        {/* Content wrapper with z-index */}
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="relative h-screen flex items-center justify-center">
            {/* Subtle overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/40" />

            <div className="relative z-10 text-center px-4">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <img
                  src={emurpgLogo}
                  alt="EMURPG Logo"
                  className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                  style={{ filter: "brightness(1.1)" }}
                />
              </motion.div>

              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl md:text-7xl font-bold mb-6 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                {t("homepage.hero_title")}
              </motion.h1>
              <div className="flex flex-col items-center">
                <motion.p
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-xl md:text-2xl mb-8 text-slate-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                >
                  {t("homepage.hero_subtitle")}
                </motion.p>

                {/* EMUCON Button - Huge, between logo and register button */}
                <motion.button
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  onClick={() => (window.location.href = "/emucon")}
                  className="my-8 px-12 py-6 rounded-2xl bg-gradient-to-br from-yellow-500 via-yellow-600 to-amber-700 text-4xl md:text-5xl font-extrabold text-gray-900 shadow-2xl border-4 border-yellow-400 hover:scale-105 hover:shadow-yellow-400/40 transition-all duration-300 tracking-widest uppercase"
                  style={{ letterSpacing: "0.15em" }}
                >
                  EMUCON
                </motion.button>
              </div>
              <FireButton
                onClick={handleJoinButton_events}
                text={t("homepage.register_events")}
              ></FireButton>
              <br />
              <FireButton
                onClick={handleJoinButton_discord}
                color1="blue"
                textcolor="red"
                text={<FaDiscord size={20} />}
              ></FireButton>
              <FireButton
                onClick={handleJoinButton_whatsapp}
                color1="green"
                text={<FaWhatsapp size={20} />}
              ></FireButton>
            </div>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-20"
            >
              <button
                className="text-white/70 transition-colors bg-transparent hover:bg-transparent hover:text-white"
                onClick={() =>
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: "smooth",
                  })
                }
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

          {/* About Section */}
          <section className="py-24 bg-gray-800/50">
            <div className="container mx-auto px-4">
              <SectionTitle icon={FaScroll}>
                {t("homepage.about_title")}
              </SectionTitle>
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-xl text-gray-300 mb-8">
                  {t("homepage.about_text_1")}
                  <br />
                  <br />
                  {t("homepage.about_text_2")}
                </p>
              </div>
            </div>
          </section>

          {/* Events Section */}
          <section className="relative py-24 bg-gray-900/50">
            <div className="container mx-auto px-4">
              <SectionTitle icon={FaScroll}>
                {t("homepage.upcoming_events")}
              </SectionTitle>

              <HomePageEventList />
            </div>
          </section>
          {/* Interactive Dice Section */}
          <section className="py-16 bg-gray-900/80">
            <SectionTitle icon={FaDice} className="mx-auto">
              {t("homepage.roll_dice")}
            </SectionTitle>
            <div className="container mx-auto px-4 text-center ">
              <motion.button
                whileHover={{ scale: 1.15, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                onClick={rollDice}
                className="text-6xl text-yellow-500 ease-in-out transition-all duration-300 rounded-full p-4 
                border-2 border-yellow-500/50
                bg-transparent
                hover:bg-transparent
                md:hover:text-yellow-400 
                md:hover:bg-transparent
                md:hover:border-yellow-400 
                md:hover:border-opacity-0 
                md:hover:shadow-[0_0px_35px_5px_rgba(255,255,153,0.10)]"
              >
                <FaDiceD20 size={80} />
              </motion.button>
              {diceQuote && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-xl text-yellow-300 italic"
                >
                  {diceQuote}
                </motion.p>
              )}
            </div>
          </section>
          {/* Game Masters Section */}
          <section className="py-24 bg-gray-800/50">
            <div className="container mx-auto px-4">
              <SectionTitle icon={FaUser}>{t("homepage.meet_gm")}</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <GameMasterCard
                  name="Ayberk Onaylı"
                  title={t("homepage.gm_president")}
                  description="Always rolls 1"
                  image={photos.photo_ayberk}
                />
                <GameMasterCard
                  name="Cevdet Baran Oral"
                  title={t("homepage.gm_dungeon_master")}
                  description="El. Psy. Kongroo."
                  image={photos.photo_baran}
                  socials={{
                    instagram: "https://www.instagram.com/baranbvb/",
                    linkedin: "https://www.linkedin.com/in/cevdetbaranoral/",
                    github: "https://github.com/barandev",
                    website: "https://cevdetbaran.com/",
                  }}
                />
                <GameMasterCard
                  name="Çağan Meriç"
                  title={t("homepage.gm_game_master")}
                  description="A terrifying presence has entered the room..."
                  image={photos.photo_cagan}
                  socials={{
                    instagram: "https://www.instagram.com/caganmeric.77",
                  }}
                />
                <GameMasterCard
                  name="Yunus Bahadır"
                  title={t("homepage.gm_game_master")}
                  description="Hope is born in the shadowed depths of darkness, not in the brilliance of light."
                  image={photos.photo_yunus}
                  socials={{
                    instagram: "https://www.instagram.com/ynsbahadir",
                    linkedin:
                      "https://www.linkedin.com/in/yunus-bahadır-565090341",
                  }}
                />
                <GameMasterCard
                  name="Yusuf Mete Kuzu"
                  title={t("homepage.gm_game_master")}
                  description=""
                  image={photos.photo_mete}
                />
                <GameMasterCard
                  name="Deha Deniz Kurtoğlu"
                  title={t("Design | General support")}
                  description="But in the end, you lack the stomach. For the agony you'll bring upon yourself."
                  image={photos.photo_deha}
                />
                <GameMasterCard
                  name="Mehmet Sevban Karaman"
                  title={t("homepage.gm_game_master")}
                  description="I regret nothing."
                  socials={{
                    instagram: "https://www.instagram.com/sewbeni_02/",
                  }}
                  image={photos.photo_mehmet}
                />
                <GameMasterCard
                  name="Araklon RPG"
                  title={t("homepage.gm_instructor")}
                  description=""
                  image={photos.photo_roman}
                  socials={{
                    instagram: "https://www.instagram.com/araklonrpg/",
                    youtube: "https://www.youtube.com/@araklon",
                    website: "https://www.araklon.com/",
                    discord: "https://discord.gg/2QKj3tyVYX",
                  }}
                />
              </div>
            </div>
          </section>
          {/* Testimonials Section */}

          {/* <section className="py-24 bg-gray-900/50">
          <div className="container mx-auto px-4">
            <SectionTitle icon={FaQuoteLeft}>Member Experiences</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TestimonialCard quote="Placeholder" author="Placeholder" />
            </div>
          </div>
        </section>*/}

          {/* Gallery Section */}
          <section className="py-24 bg-gray-900/50">
            <SectionTitle icon={FaBookOpen}>
              {t("homepage.adventure_gallery")}
            </SectionTitle>
            <InstagramGrid />
          </section>

          {/* News Section */}
          {/*  <section className="py-24 bg-gray-800/50">
          <div className="container mx-auto px-4">
            <SectionTitle icon={FaNewspaper}>Latest News</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <NewsCard
                title="How the Dungeon of Doom Session Ended in Chaos"
                date="May 15, 2024"
                excerpt="An epic tale of adventure, mishaps, and unexpected triumphs..."
              />
              <NewsCard
                title="New Dice Sets Available for Members!"
                date="May 10, 2024"
                excerpt="Check out our newest collection of premium dice sets..."
              />
            </div>
          </div>
        </section>*/}

          {/* Team Photo */}

          {/* Join CTA Section */}
          <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
            <div className="container mx-auto px-4 text-center items-center justify-center">
              <h2 className="text-4xl font-bold mb-8 text-yellow-500">
                {t("homepage.ready_to_join")}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <SocialButton
                  icon={<FaDiscord />}
                  text={t("homepage.join_discord")}
                  onClick={() => window.open(config.DISCORD_LINK, "_blank")}
                />

                <SocialButton
                  icon={<FaCalendar />}
                  text={t("homepage.view_events")}
                  onClick={() => window.open("/events", "_blank")}
                />
              </div>
            </div>
          </section>

          {/* Footer */}
          <MainFooter />
        </div>
      </motion.div>
    </>
  );
};

HomePage.propTypes = {
  onLanguageSwitch: PropTypes.func,
};

export default HomePage;
