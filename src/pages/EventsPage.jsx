import { FaCalendar } from "react-icons/fa";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  EventsFooter,
  Navbar,
  EventList,
  ErrorBoundary,
  SectionTitle,
} from "../components";

// Arcane magic circle tile — 200×200 repeating sigil
// Layers: dashed outer ring → solid outer ring → 8 tick marks → 8 spokes →
//         diamond arrowheads → mid ring → inner ring → innermost ring →
//         4 Elder-Futhark rune marks → center hub → edge connectors
const PATTERN_BG = `data:image/svg+xml,${encodeURIComponent(
  `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="92" stroke="#c9a227" stroke-opacity="0.035" fill="none" stroke-width="0.5" stroke-dasharray="2.5 3.5"/>
  <circle cx="100" cy="100" r="80" stroke="#c9a227" stroke-opacity="0.07"  fill="none" stroke-width="0.75"/>
  <circle cx="100" cy="100" r="55" stroke="#c9a227" stroke-opacity="0.045" fill="none" stroke-width="0.5"/>
  <circle cx="100" cy="100" r="30" stroke="#c9a227" stroke-opacity="0.07"  fill="none" stroke-width="0.75"/>
  <circle cx="100" cy="100" r="14" stroke="#c9a227" stroke-opacity="0.04"  fill="none" stroke-width="0.5"/>
  <g stroke="#c9a227" stroke-opacity="0.055" stroke-width="0.75" fill="none" stroke-linecap="round">
    <line x1="100" y1="20"   x2="100" y2="180"/>
    <line x1="20"  y1="100"  x2="180" y2="100"/>
    <line x1="43"  y1="43"   x2="157" y2="157"/>
    <line x1="157" y1="43"   x2="43"  y2="157"/>
  </g>
  <g fill="none" stroke="#c9a227" stroke-opacity="0.065" stroke-width="0.75">
    <polygon points="100,17 103.5,25 100,33 96.5,25"/>
    <polygon points="100,183 103.5,175 100,167 96.5,175"/>
    <polygon points="17,100 25,96.5 33,100 25,103.5"/>
    <polygon points="183,100 175,96.5 167,100 175,103.5"/>
  </g>
  <g stroke="#c9a227" stroke-opacity="0.055" stroke-width="0.75" stroke-linecap="round">
    <line x1="129" y1="30"  x2="131" y2="24"/>
    <line x1="170" y1="71"  x2="176" y2="69"/>
    <line x1="170" y1="129" x2="176" y2="131"/>
    <line x1="129" y1="170" x2="131" y2="176"/>
    <line x1="71"  y1="170" x2="69"  y2="176"/>
    <line x1="30"  y1="129" x2="24"  y2="131"/>
    <line x1="30"  y1="71"  x2="24"  y2="69"/>
    <line x1="71"  y1="30"  x2="69"  y2="24"/>
  </g>
  <g stroke="#c9a227" stroke-opacity="0.075" stroke-width="0.75" stroke-linecap="round">
    <line x1="124" y1="34" x2="124" y2="46"/>
    <line x1="124" y1="37" x2="130" y2="41"/>
    <line x1="124" y1="43" x2="130" y2="47"/>
    <line x1="124" y1="154" x2="124" y2="166"/>
    <line x1="124" y1="157" x2="130" y2="161"/>
    <line x1="124" y1="163" x2="130" y2="167"/>
    <line x1="76"  y1="154" x2="76"  y2="166"/>
    <line x1="70"  y1="157" x2="76"  y2="161"/>
    <line x1="70"  y1="163" x2="76"  y2="167"/>
    <line x1="76"  y1="34"  x2="76"  y2="46"/>
    <line x1="70"  y1="37"  x2="76"  y2="41"/>
    <line x1="70"  y1="43"  x2="76"  y2="47"/>
  </g>
  <circle cx="100" cy="100" r="2.5" fill="#c9a227" fill-opacity="0.1"/>
  <g fill="#c9a227" fill-opacity="0.045" stroke="none">
    <polygon points="100,0 102.5,5 100,10 97.5,5"/>
    <polygon points="100,200 102.5,195 100,190 97.5,195"/>
    <polygon points="0,100 5,97.5 10,100 5,102.5"/>
    <polygon points="200,100 195,97.5 190,100 195,102.5"/>
  </g>
  <circle cx="0"   cy="0"   r="1.5" fill="#c9a227" fill-opacity="0.045"/>
  <circle cx="200" cy="0"   r="1.5" fill="#c9a227" fill-opacity="0.045"/>
  <circle cx="200" cy="200" r="1.5" fill="#c9a227" fill-opacity="0.045"/>
  <circle cx="0"   cy="200" r="1.5" fill="#c9a227" fill-opacity="0.045"/>
</svg>`
)}`;

const EventsPage = ({ onLanguageSwitch }) => {
  const { t } = useTranslation();

  return (
    (document.title = "EMURPG - Events"),
    (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen text-gray-100 flex flex-col"
        style={{
          background: [
            "radial-gradient(ellipse 80% 60% at 20% 10%,  #0d1230 0%, transparent 60%)",
            "radial-gradient(ellipse 60% 50% at 80% 80%,  #110a2e 0%, transparent 55%)",
            "radial-gradient(ellipse 100% 80% at 50% 50%, #070b18 0%, #0a0d1a 100%)",
          ].join(", "),
        }}
      >
        <Navbar
          onLanguageSwitch={onLanguageSwitch}
          buttons={[
            {
              label: t("events_page.homepage"),
              onClick: () => (window.location.href = "/"),
            },
            {
              label: t("events_page.character_roller"),
              onClick: () => (window.location.href = "/charroller"),
            },
          ]}
          scrollEffectEnabled={false}
        />

        <main className="flex-grow py-24">
          <div className="container mx-auto px-4">
            <SectionTitle icon={FaCalendar}>
              {t("events_page.title")}
            </SectionTitle>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <div
                className="rounded-lg border border-yellow-500/30 p-6 md:p-8 backdrop-blur-sm transition-all duration-500 hover:border-yellow-400/50"
                style={{
                  backgroundColor: "rgba(15, 20, 30, 0.7)",
                  backgroundImage: [
                    "radial-gradient(ellipse 90% 40% at 50% 0%,   rgba(201,162,39,0.055) 0%, transparent 100%)",
                    "radial-gradient(ellipse 60% 30% at 50% 100%, rgba(120, 60,  0,0.04)  0%, transparent 100%)",
                    `url(${PATTERN_BG})`,
                  ].join(", "),
                  backgroundRepeat: "no-repeat, no-repeat, repeat",
                  backgroundSize:   "100% 100%, 100% 100%, 200px 200px",
                  boxShadow: [
                    "0 32px 64px -16px rgba(0,0,0,0.95)",
                    "inset 0  1px 0   rgba(201,162,39,0.22)",
                    "inset 0 -1px 0   rgba(0,0,0,0.5)",
                    "inset 0  0  120px rgba(201,162,39,0.03)",
                  ].join(", "),
                }}
              >
                <ErrorBoundary>
                  <EventList />
                </ErrorBoundary>
              </div>
            </motion.div>
          </div>
        </main>

        <EventsFooter />
      </motion.div>
    )
  );
};

EventsPage.propTypes = {
  onLanguageSwitch: PropTypes.func,
};

export default EventsPage;
