import React from "react";
import { FaCalendar } from "react-icons/fa";
import { motion } from "framer-motion";
import { Footer, Navbar, EventList, ErrorBoundary, SectionTitle } from "../components";

// Use the same background pattern as HomePage
const PATTERN_BG = `data:image/svg+xml,${encodeURIComponent(`
  <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="60" fill="#1F2937"/>
    <path d="M0 0h60v60H0z" fill="#374151" fill-opacity="0.4"/>
    <circle cx="30" cy="30" r="2" fill="#9CA3AF" fill-opacity="0.4"/>
  </svg>
`)}`;

const EventsPage = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen bg-gray-900 text-gray-100 flex flex-col"
    style={{ backgroundImage: `url(${PATTERN_BG})` }}
  >
    <Navbar
      buttons={[
        {
          label: "Homepage",
          onClick: () => (window.location.href = "/"),
        },
        {
          label: "Character Roller",
          badge: "Soon",
          disabled: true,
        },
      ]}
      scrollEffectEnabled={false}
    />
    
    <main className="flex-grow py-24">
      <div className="container mx-auto px-4">
        <SectionTitle icon={FaCalendar}>Upcoming Events</SectionTitle>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <div className="bg-gray-800/50 rounded-lg border border-yellow-500/20 shadow-2xl p-6 md:p-8
            backdrop-blur-sm hover:border-yellow-500/30 transition-all duration-300">
            <ErrorBoundary>
              <EventList />
            </ErrorBoundary>
          </div>
        </motion.div>
      </div>
    </main>
    
    <Footer />
  </motion.div>
);

export default EventsPage;
