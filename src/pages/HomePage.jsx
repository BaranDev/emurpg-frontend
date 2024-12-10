import React, { useState, useEffect } from "react";
import {
  FaDiceD20,
  FaDiscord,
  FaCalendar,
  FaMapMarkedAlt,
  FaScroll,
  FaBookOpen,
  FaDragon,
  FaChessRook,
  FaUser,
  FaQuoteLeft,
  FaNewspaper,
  FaEnvelope,
  FaDice,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  NewsCard,
  TestimonialCard,
  SocialButton,
  SocialIcon,
  GameMasterCard,
  SectionTitle,
  EventCard,
  Navbar,
  Footer,
  InstagramGrid,
  FireButton,
} from "../components";
import {
  photo_ata,
  photo_ayberk,
  photo_baran,
  photo_cagan,
  photo_kaya,
  photo_kerem,
  photo_yunus,
} from "../assets/member_photos";
import { config, rpgQuotes } from "../config";

// Background pattern
const PATTERN_BG = `data:image/svg+xml,${encodeURIComponent(`
  <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="60" fill="#1F2937"/>
    <path d="M0 0h60v60H0z" fill="#374151" fill-opacity="0.4"/>
    <circle cx="30" cy="30" r="2" fill="#9CA3AF" fill-opacity="0.4"/>
  </svg>
`)}`;

const HomePage = () => {
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

  const handleJoinButton = () => {
    window.open(config.DISCORD_LINK, "_blank");
  };

  return (
    <>
      <Navbar />
      <Navbar
        buttons={[
          {
            label: "Events",
            onClick: () => (window.location.href = "/events"),
            disabled: false,
          },
          {
            label: "Character Roller",
            disabled: true,
            badge: "Soon",
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
              EMU RPG Club
            </motion.h1>

            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xl md:text-2xl mb-8 text-yellow-300"
            >
              Crafting Worlds, Rolling Dice, Building Legends
            </motion.p>

            <FireButton onClick={handleJoinButton}>
              Join the Adventure
            </FireButton>
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
            <SectionTitle icon={FaScroll}>About Our Club</SectionTitle>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-xl text-gray-300 mb-8">
                We're not just your average RPG club - we're a community of
                gamers who love all sorts of adventures!
                <br />
                <br />
                From epic D&D campaigns to exciting board game nights, we know
                how to have a fun while rolling dice and telling stories.
                Whether you're an experienced player or just curious about
                tabletop gaming, our doors are always open for new friends who
                want to join in on the fun since 2023.
              </p>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="relative py-24 bg-gray-900/50">
          <div className="container mx-auto px-4">
            <SectionTitle icon={FaScroll}>Upcoming Events</SectionTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              <EventCard
                title="Please stay tuned!"
                date="We are currently planning our next adventure."
                description="Events are frequently updated, so be sure to check back soon!"
                icon={FaDragon}
              />
            </div>
          </div>
        </section>
        {/* Interactive Dice Section */}
        <section className="py-16 bg-gray-900/80">
          <SectionTitle icon={FaDice} className="mx-auto">
            Roll the Dice!
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
            <SectionTitle icon={FaUser}>Meet the Game Masters</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GameMasterCard
                name="Cevdet Baran Oral"
                title="Dungeon Master / Activity Manager / Software Developer"
                description="El. Psy. Kongroo."
                image={photo_baran}
              />
              <GameMasterCard
                name="Kaya Acarbay"
                title="Dungeon Master"
                description=""
                image={photo_kaya}
              />
              <GameMasterCard
                name="Ayberk Onaylı"
                title=""
                description=""
                image={photo_ayberk}
              />
              <GameMasterCard
                name="Çağan Meriç"
                title=""
                description=""
                image={photo_cagan}
              />
              <GameMasterCard
                name="Ata Hunu"
                title="President / Game Master"
                description=""
                image={photo_ata}
              />
              <GameMasterCard
                name="Kerem Ata Bakim"
                title=""
                description=""
                image={photo_kerem}
              />
              <GameMasterCard
                name="Yunus Bahadır"
                title=""
                description="Hope is born in the shadowed depths of darkness, not in the brilliance of light."
                image={photo_yunus}
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
          <SectionTitle icon={FaBookOpen}>Adventure Gallery</SectionTitle>
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
        </section>}

        {/* Join CTA Section */}
        <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="container mx-auto px-4 text-center items-center justify-center">
            <h2 className="text-4xl font-bold mb-8 text-yellow-500">
              Ready to Join the Quest?
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <SocialButton
                icon={<FaDiscord />}
                text="Join Discord"
                onClick={() => window.open(config.DISCORD_LINK, "_blank")}
              />

              <SocialButton
                icon={<FaCalendar />}
                text="View Events"
                onClick={() => window.open("/events", "_blank")}
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 py-12">
          <div className="container mx-auto px-4 items-center justify-center text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-400 text-center">
              <div>
                <h3 className="text-xl font-bold text-yellow-500 mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/events"
                      className="hover:text-yellow-500 transition-colors"
                    >
                      Events
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-500 mb-4">
                  Contact Us
                </h3>
                <p>Send your ravens to:</p>
                <a
                  href="mailto:emufrpclub@gmail.com"
                  className="text-yellow-500 hover:text-yellow-400"
                >
                  emufrpclub@gmail.com
                </a>
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-500 mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-4 text-center items-center justify-center">
                  <SocialIcon icon={<FaDiscord />} href={config.DISCORD_LINK} />
                  <SocialIcon
                    icon={<FaInstagram />}
                    href={config.INSTAGRAM_LINK}
                  />
                  <SocialIcon
                    icon={<FaLinkedin />}
                    href={config.LINKEDIN_LINK}
                  />
                </div>
              </div>
            </div>
            <div className="text-center mt-8 text-gray-500">
              <p>{config.FOOTER_TEXT}</p>
            </div>
          </div>
        </footer>
      </motion.div>
    </>
  );
};

export default HomePage;
