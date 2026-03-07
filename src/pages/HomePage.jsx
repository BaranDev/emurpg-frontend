import { useState, useEffect, useRef } from "react";
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
import emurpgLogo from "../assets/logo/LOGO_WHITE.png";
import { config, rpgQuotes } from "../config";

const HomePage = ({ onLanguageSwitch }) => {
  const { t, i18n } = useTranslation();
  const [diceQuote, setDiceQuote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const teamSectionRef = useRef(null);
  const teamFetchedRef = useRef(false);

  useEffect(() => {
    document.title = "EMURPG Club - Home";
    const loadTimer = setTimeout(() => setIsLoading(false), 1500);

    return () => {
      clearTimeout(loadTimer);
    };
  }, []);

  // Lazy-load team members with Intersection Observer + localStorage cache
  useEffect(() => {
    const CACHE_KEY = "emurpg_team_members";
    const CACHE_TTL = 60 * 60 * 1000; // 1 hour

    const fetchTeamMembers = async () => {
      try {
        const res = await fetch(`${config.backendUrl}/api/team-members`);
        if (!res.ok) return;
        const data = await res.json();
        setTeamMembers(data);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data, fetched_at: Date.now() }),
        );
      } catch {
        // silently fail - cached data or empty list is fine
      }
    };

    const loadFromCacheOrFetch = () => {
      if (teamFetchedRef.current) return;
      teamFetchedRef.current = true;

      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
        if (cached?.data?.length) {
          setTeamMembers(cached.data);
          // Stale-while-revalidate: show cached, refresh if stale
          if (Date.now() - cached.fetched_at > CACHE_TTL) {
            fetchTeamMembers();
          }
          return;
        }
      } catch {
        // invalid cache, fetch fresh
      }
      fetchTeamMembers();
    };

    const node = teamSectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadFromCacheOrFetch();
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isLoading]);

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
      <Navbar
        onLanguageSwitch={onLanguageSwitch}
        scrollEffectEnabled={false}
        buttons={[
          {
            label: t("navbar.events"),
            onClick: () => (window.location.href = "/events"),
            disabled: false,
          },
          {
            label: t("navbar.character_roller"),
            disabled: false,
            onClick: () => (window.location.href = "/charroller"),
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

          {/* EMUCON'25 MEMORIES Section */}
          <section className="py-24 bg-gradient-to-b from-gray-900/80 via-yellow-900/20 to-gray-900/80">
            <div className="container mx-auto px-4">
              <SectionTitle icon={FaScroll}>
                {t("homepage.emucon_memories_title")}
              </SectionTitle>
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-xl text-gray-300 mb-8">
                  {t("homepage.emucon_memories_text")}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-yellow-500/30">
                    <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">
                      42+
                    </div>
                    <div className="text-gray-400 text-sm">
                      {t("homepage.emucon_stat_clubs")}
                    </div>
                  </div>
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-yellow-500/30">
                    <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">
                      40+
                    </div>
                    <div className="text-gray-400 text-sm">
                      {t("homepage.emucon_stat_activities")}
                    </div>
                  </div>
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-yellow-500/30">
                    <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">
                      5
                    </div>
                    <div className="text-gray-400 text-sm">
                      {t("homepage.emucon_stat_performances")}
                    </div>
                  </div>
                  <div className="bg-gray-800/60 rounded-xl p-4 border border-yellow-500/30">
                    <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">
                      600+
                    </div>
                    <div className="text-gray-400 text-sm">
                      {t("homepage.emucon_stat_visitors")}
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = "/emucon")}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 text-xl font-bold text-gray-900 shadow-lg hover:shadow-yellow-500/30 transition-all duration-300"
                >
                  {t("homepage.emucon_see_memories")}
                </motion.button>
              </div>
            </div>
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
          <section ref={teamSectionRef} className="py-24 bg-gray-800/50">
            <div className="container mx-auto px-4">
              <SectionTitle icon={FaUser}>{t("homepage.meet_gm")}</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                  <GameMasterCard
                    key={member._id}
                    name={member.name}
                    title={member.title}
                    description={member.description || ""}
                    image={member.photo_url}
                    socials={member.socials}
                  />
                ))}
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
