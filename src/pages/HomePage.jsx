import React, { useState, useEffect } from "react";import {
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
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
  const [nextEventCountdown, setNextEventCountdown] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const rpgQuotes = [
    "You rolled a 20! The adventure begins!",
    "Critical success! Glory awaits!",
    "Natural 1... Maybe try diplomacy next time?",
    "The dice gods smile upon you!",
    "Your charisma check failed... awkward silence ensues.",
  ];

  const galleryImages = [
    "/api/placeholder/800/400",
    "/api/placeholder/800/400",
    "/api/placeholder/800/400",
  ];

  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoading(false), 1500);

    const countdownTimer = setInterval(() => {
      const nextEvent = new Date("2024-06-01").getTime();
      const now = new Date().getTime();
      const distance = nextEvent - now;

      if (distance < 0) {
        setNextEventCountdown("Event has started!");
        clearInterval(countdownTimer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        setNextEventCountdown(`${days} days until next major event!`);
      }
    }, 1000);

    // Gallery rotation
    const galleryTimer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(countdownTimer);
      clearInterval(galleryTimer);
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

  return (
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
            className="text-xl md:text-2xl mb-12 text-yellow-300"
          >
            Crafting Worlds, Rolling Dice, Building Legends
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden group bg-yellow-600 text-white font-bold py-4 px-8 rounded-lg transform transition-all duration-300"
          >
            <span className="relative z-10">Join the Adventure</span>
            <div className="absolute inset-0 bg-yellow-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
          </motion.button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <SectionTitle icon={FaScroll}>About Our Club</SectionTitle>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-gray-300 mb-8">
              We're the ultimate gathering of tabletop RPG enthusiasts at EMU,
              building fantastic worlds, forging epic stories, and creating
              unforgettable adventures since 2020. Our club is home to both
              seasoned veterans and newcomers alike, united by our passion for
              storytelling and adventure.
            </p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="relative py-24 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <SectionTitle icon={FaScroll}>Upcoming Events</SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <EventCard
              title="D&D One-Shot Night"
              date="June 1st, 2024"
              description="Join us for an epic one-shot adventure in the Forgotten Realms!"
              icon={FaDragon}
            />
            <EventCard
              title="Call of Cthulhu"
              date="June 15th, 2024"
              description="Descend into madness in this horror-themed session."
              icon={FaChessRook}
            />
            <EventCard
              title="Pathfinder Campaign"
              date="June 30th, 2024"
              description="Start a new adventure in the world of Golarion."
              icon={FaBookOpen}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-yellow-400 text-xl">{nextEventCountdown}</p>
          </motion.div>
        </div>
      </section>

      {/* Game Masters Section */}
      <section className="py-24 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <SectionTitle icon={FaUser}>Meet the Game Masters</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GameMasterCard
              name="Alex Thunder"
              title="Dungeon Master Supreme"
              description="Weaving epic tales since 2018"
              image="/api/placeholder/200/200"
            />
            <GameMasterCard
              name="Sarah Spellweaver"
              title="Lore Keeper"
              description="Master of intricate plot twists"
              image="/api/placeholder/200/200"
            />
            <GameMasterCard
              name="Mike Questmaster"
              title="Event Architect"
              description="Designing unforgettable encounters"
              image="/api/placeholder/200/200"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <SectionTitle icon={FaQuoteLeft}>Member Testimonials</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="Joining the RPG Club introduced me to amazing friends and unforgettable adventures!"
              author="Emily, 2nd Year"
            />
            <TestimonialCard
              quote="Best decision I made in college! The campaigns here are legendary!"
              author="James, 3rd Year"
            />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <SectionTitle icon={FaBookOpen}>Adventure Gallery</SectionTitle>
          <div className="relative w-full h-96 overflow-hidden rounded-lg">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIndex}
                src={galleryImages[activeImageIndex]}
                alt={`Gallery image ${activeImageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Interactive Dice Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
            onClick={rollDice}
            className="text-6xl text-yellow-500 hover:text-yellow-400 transition-colors duration-300"
          >
            <FaDiceD20 />
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

      {/* News Section */}
      <section className="py-24 bg-gray-800/50">
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
      </section>

      {/* Join CTA Section */}
      <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-yellow-500">
            Ready to Join the Quest?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <SocialButton icon={<FaDiscord />} text="Join Discord" />
            <SocialButton icon={<FaCalendar />} text="View Events" />
            <SocialButton icon={<FaMapMarkedAlt />} text="Find Us" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-400">
            <div>
              <h3 className="text-xl font-bold text-yellow-500 mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-500 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-500 transition-colors"
                  >
                    Events
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-yellow-500 transition-colors"
                  >
                    Contact
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
                href="mailto:contact@emurpg.com"
                className="text-yellow-500 hover:text-yellow-400"
              >
                contact@emurpg.com
              </a>
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-500 mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <SocialIcon icon={<FaDiscord />} />
                <SocialIcon icon={<FaEnvelope />} />
                <SocialIcon icon={<FaDice />} />
              </div>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500">
            <p>May your rolls be ever in your favor.</p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

const SectionTitle = ({ children, icon: Icon }) => (
  <div className="relative flex items-center justify-center mb-12 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent">
    <h2 className="relative px-6 text-4xl font-bold text-yellow-500 flex items-center gap-4 z-50">
      {Icon && <Icon className="text-3xl" />}
      {children}
    </h2>
  </div>
);

const EventCard = ({ title, date, description, icon: Icon }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="relative bg-gray-800 rounded-lg p-8 border border-yellow-500/20 transition-all duration-300 group"
  >
    <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent rounded-lg" />
    {Icon && <Icon className="text-4xl text-yellow-500 mb-4" />}
    <h3 className="text-2xl font-bold mb-2 text-yellow-500">{title}</h3>
    <p className="text-gray-300 mb-4">{date}</p>
    <p className="text-gray-400">{description}</p>
    <motion.div
      className="absolute inset-0 border-2 border-yellow-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      initial={false}
      whileHover={{ scale: 1.05 }}
    />
  </motion.div>
);

const GameMasterCard = ({ name, title, description, image }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-gray-800 rounded-lg overflow-hidden text-center p-6"
  >
    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    <h3 className="text-xl font-bold text-yellow-500 mb-2">{name}</h3>
    <p className="text-yellow-300 mb-2">{title}</p>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

const TestimonialCard = ({ quote, author }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800 rounded-lg p-6 relative"
  >
    <FaQuoteLeft className="text-3xl text-yellow-500/20 absolute top-4 left-4" />
    <blockquote className="text-gray-300 text-lg italic mt-6 mb-4">
      "{quote}"
    </blockquote>
    <p className="text-yellow-500 text-right">- {author}</p>
  </motion.div>
);

const NewsCard = ({ title, date, excerpt }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800 rounded-lg p-6"
  >
    <h3 className="text-xl font-bold text-yellow-500 mb-2">{title}</h3>
    <p className="text-gray-400 text-sm mb-4">{date}</p>
    <p className="text-gray-300">{excerpt}</p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      className="mt-4 text-yellow-500 hover:text-yellow-400"
    >
      Read More →
    </motion.button>
  </motion.div>
);

const SocialButton = ({ icon, text }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
  >
    {icon}
    <span>{text}</span>
  </motion.button>
);

const SocialIcon = ({ icon }) => (
  <motion.a
    href="#"
    whileHover={{ scale: 1.2 }}
    className="text-2xl text-yellow-500 hover:text-yellow-400 transition-colors"
  >
    {icon}
  </motion.a>
);

export default HomePage;
