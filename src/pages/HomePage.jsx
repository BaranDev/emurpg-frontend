import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FaDiceD20,
  FaDiscord,
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
import * as photos from "../assets/member_photos";
import { config, rpgQuotes } from "../config";

// Background pattern
const PATTERN_BG = `data:image/svg+xml,${encodeURIComponent(`
  <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="60" fill="#1F2937"/>
    <path d="M0 0h60v60H0z" fill="#374151" fill-opacity="0.4"/>
    <circle cx="30" cy="30" r="2" fill="#9CA3AF" fill-opacity="0.4"/>
  </svg>
`)}`;

const HomePage = ({ onLanguageSwitch }) => {
  const { t } = useTranslation();
  const [diceQuote, setDiceQuote] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        className="min-h-screen bg-gray-900"
        style={{ backgroundImage: `url(${PATTERN_BG})` }}
      >
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900" />

          <div className="relative z-10 text-center px-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <FaDiceD20 className="text-8xl text-yellow-500 mx-auto mb-8" />
            </motion.div>

            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-6xl md:text-7xl font-bold mb-6 text-yellow-500 drop-shadow-lg"
            >
              {t("homepage.hero_title")}
            </motion.h1>

            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xl md:text-2xl mb-8 text-yellow-300"
            >
              {t("homepage.hero_subtitle")}
            </motion.p>

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
          </div>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-20"
          >
            <button
              className="text-yellow-500 transition-colors bg-transparent hover:bg-transparent hover:text-yellow-400"
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
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
                name="Ata Hunu"
                title={t("homepage.gm_president")}
                description=""
                image={photos.photo_ata}
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
                name="Ayberk Onaylı"
                title={t("homepage.gm_master_cards")}
                description="Always rolls 1"
                image={photos.photo_ayberk}
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
                name="Kerem Ata Bakim"
                title={t("homepage.gm_game_master")}
                description="Someone who lives his life differently"
                image={photos.photo_kerem}
              />
              <GameMasterCard
                name="Yusuf Mete Kuzu"
                title={t("homepage.gm_game_master")}
                description=""
                image={photos.photo_mete}
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
      </motion.div>
    </>
  );
};

HomePage.propTypes = {
  onLanguageSwitch: PropTypes.func,
};

export default HomePage;
