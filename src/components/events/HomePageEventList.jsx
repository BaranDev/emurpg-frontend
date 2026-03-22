import { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { motion } from "framer-motion";
import { config } from "../../config";
import { FaScroll } from "react-icons/fa";

/* Slight rotations for organic feel — quest notices aren't perfectly aligned. */
const ROTATIONS = [-1.5, 1.0, -0.6, 1.8, -1.1, 0.8];

const SKELETON_QUOTES = [
  "Consulting the oracle\u2026",
  "Scouting the realm\u2026",
];

const EventSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
    {SKELETON_QUOTES.map((quote, i) => (
      <div
        key={i}
        className="pt-5 relative"
        style={{ transform: `rotate(${ROTATIONS[i]}deg)` }}
      >
        {/* Ghost wax seal */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
          <div className="w-11 h-11 rounded-full bg-red-900/15 animate-pulse" />
        </div>
        {/* Skeleton card */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-5 md:p-6">
          <div className="animate-pulse pt-3 space-y-3">
            <div className="h-4 w-3/4 rounded bg-slate-700" />
            <div className="h-3 w-1/3 rounded bg-slate-700" />
            <div className="space-y-1.5">
              <div className="h-3 rounded bg-slate-700" />
              <div className="h-3 w-2/3 rounded bg-slate-700" />
            </div>
          </div>
          <p className="text-yellow-500/20 italic text-xs text-right mt-4">
            {quote}
          </p>
        </div>
      </div>
    ))}
  </div>
);

const StayTuned = () => (
  <div className="flex justify-center">
    <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-6 md:p-8 max-w-sm w-full text-center">
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500/30 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-500/30 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500/30 rounded-br-lg" />

      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-yellow-500/30" />
        <FaScroll className="text-yellow-500/50 text-sm" />
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-yellow-500/30" />
      </div>
      <p className="font-cinzel text-sm font-semibold text-yellow-500/80 mb-1">
        The next adventure is being forged&hellip;
      </p>
      <p className="text-gray-500 text-xs">
        Check back soon for new quests
      </p>
    </div>
  </div>
);

const HomePageEventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/events`);
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const renderContent = () => {
    if (loading) return <EventSkeleton />;
    if (error || events.length === 0) return <StayTuned />;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
      >
        {events.map((event, i) => (
          <EventCard
            key={event.slug}
            title={event.name}
            date={
              event.start_date === event.end_date
                ? event.start_date
                : `${event.start_date} - ${event.end_date}`
            }
            description={event.description || "No description available"}
            rotation={ROTATIONS[i % ROTATIONS.length]}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      {renderContent()}
    </div>
  );
};

export default HomePageEventList;
