import { useState, useEffect } from "react";import EventCard from "./EventCard";
import { motion } from "framer-motion";
import { config } from "../config";
import { FaDragon } from "react-icons/fa";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-yellow-600">Loading events...</div>
      </div>
    );
  }

  const StayTunedCard = () => (
    <EventCard
      title="Please stay tuned!"
      date="We are currently planning our next adventure."
      description="Events are frequently updated, so be sure to check back soon!"
      icon={FaDragon}
    />
  );

  if (error || events.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <StayTunedCard />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {events.map((event) => (
          <EventCard
            key={event.slug}
            title={event.name}
            date={
              `${
                event.start_date === event.end_date
                  ? ` ${event.start_date}`
                  : `${event.start_date} - ${event.end_date}`
              }` || "No date available"
            }
            description={event.description || "No description available"}
            icon={FaDragon}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default HomePageEventList;
