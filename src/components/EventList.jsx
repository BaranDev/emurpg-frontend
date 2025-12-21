import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import TableList from "./TableList";
import GeneralEventRegistrationForm from "./GeneralEventRegistrationForm";
import { config } from "../config";
import { motion } from "framer-motion";
import { FaCalendar, FaExclamationTriangle } from "react-icons/fa";

const EventList = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ws, setWs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const wsConnected = useRef(false);
  const wsConnectionAttempted = useRef(false);

  useEffect(() => {
    fetch(`${config.backendUrl}/api/events`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setError(null);
      })
      .catch((err) => {
        console.log("Failed to fetch events:", err.message);
        setError(err.message);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Skip WebSocket connection if backend is down (error state)
    if (error) return;

    const connectWebSocket = () => {
      try {
        const socket = new WebSocket(`${config.backendUrl}/ws/updates`);

        socket.onopen = () => {
          console.log("Events WebSocket connected");
          wsConnected.current = true;
        };

        socket.onmessage = () => {
          if (wsConnected.current) {
            // Fetch updated events
            fetch(`${config.backendUrl}/api/events`)
              .then((res) => res.json())
              .then((data) => setEvents(data))
              .catch(() => {});
          }
        };

        socket.onclose = () => {
          console.log("Events WebSocket disconnected");
          wsConnected.current = false;
          // Only retry if we had a successful connection before
          setTimeout(() => {
            if (!wsConnected.current && !error) connectWebSocket();
          }, 5000);
        };

        socket.onerror = () => {
          console.log("Events WebSocket error - backend may be offline");
          wsConnected.current = false;
        };

        return socket;
      } catch (e) {
        console.log("WebSocket connection failed:", e);
        return null;
      }
    };

    if (!wsConnectionAttempted.current) {
      const socket = connectWebSocket();
      if (socket) setWs(socket);
      wsConnectionAttempted.current = true;
    }

    return () => {
      if (ws) {
        ws.close();
        wsConnected.current = false;
        wsConnectionAttempted.current = false;
      }
    };
  }, [ws, error]);

  // Fallback for unsupported browsers
  if (!window.fetch || !window.WebSocket) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-900"
      >
        <FaExclamationTriangle className="text-6xl text-yellow-500 mb-6" />
        <h1 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-4">
          {t("event_list_component.browser_not_supported")}
        </h1>
        <p className="text-lg text-gray-300 mb-4">
          {t("event_list_component.use_modern_browser")}
        </p>
      </motion.div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center"
      >
        <div className="text-yellow-500 text-xl">Loading events...</div>
      </motion.div>
    );
  }

  if (error || events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-gray-800/50 rounded-lg shadow-xl"
      >
        <FaCalendar className="text-6xl text-yellow-500 mb-6" />
        <h1 className="text-3xl md:text-5xl font-bold text-yellow-500 mb-4">
          {selectedEvent
            ? selectedEvent.name
            : t("event_list_component.emurpg_events")}
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          {t("event_list_component.no_ongoing_events")}
        </p>
        <div className="flex gap-4">
          <a
            href={config.WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {t("event_list_component.join_whatsapp")}
          </a>
          <a
            href={config.DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {t("event_list_component.join_discord")}
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      {selectedEvent && (
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => setSelectedEvent(null)}
          className="mb-6 text-yellow-500 hover:text-yellow-400 flex items-center gap-2 text-lg"
        >
          ← {t("event_list_component.back_to_events")}
        </motion.button>
      )}

      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-6xl font-bold text-center text-yellow-500 mb-8 md:mb-12"
      >
        {selectedEvent
          ? selectedEvent.name
          : t("event_list_component.emurpg_events")}
      </motion.h1>

      {!selectedEvent ? (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid gap-6"
        >
          {events.map((event, index) => (
            <motion.div
              key={event.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() =>
                event.total_tables > 0 || event.event_type === "general"
                  ? setSelectedEvent(event)
                  : null
              }
              className={`bg-gray-800/50 rounded-lg border-2 border-yellow-600/50 p-6 
                ${
                  event.total_tables > 0 || event.event_type === "general"
                    ? "cursor-pointer hover:bg-gray-700/50 hover:border-yellow-500 transform hover:scale-[1.01] transition-all"
                    : "opacity-75"
                }`}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-yellow-500 mb-3">
                {event.name}
              </h2>
              <p className="text-gray-300 mb-4 text-lg">{event.description}</p>
              <div className="flex flex-wrap justify-between text-sm md:text-base gap-4">
                {event.event_type === "general" ? (
                  <span className="px-4 py-2 rounded-full bg-purple-900/50 text-purple-400 border border-purple-500">
                    {t("event_list_component.general_event") ||
                      "General Event - Registration Open"}
                  </span>
                ) : (
                  <span
                    className={`px-4 py-2 rounded-full ${
                      event.available_tables > 0
                        ? "bg-green-900/50 text-green-400"
                        : "bg-red-900/50 text-red-400"
                    }`}
                  >
                    {event.available_tables > 0
                      ? `${event.available_seats} ${t(
                          "event_list_component.seats_available"
                        )}`
                      : t("event_list_component.registrations_not_started")}
                  </span>
                )}
                <span className="text-gray-400 flex items-center gap-2">
                  <FaCalendar />
                  {new Date(event.start_date).toLocaleDateString()}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <>
          {selectedEvent.event_type === "general" ? (
            <GeneralEventRegistrationForm
              eventSlug={selectedEvent.slug}
              clubs={selectedEvent.clubs || []}
            />
          ) : (
            <TableList eventSlug={selectedEvent.slug} />
          )}
        </>
      )}
    </motion.div>
  );
};

export default EventList;
