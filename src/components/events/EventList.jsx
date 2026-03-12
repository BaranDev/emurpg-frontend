import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import TableList from "../tables/TableList";
import GeneralEventRegistrationForm from "./GeneralEventRegistrationForm";
import { config } from "../../config";
import { motion } from "framer-motion";
import { FaCalendar, FaExclamationTriangle } from "react-icons/fa";
import { useWebSocket } from "../../hooks/useWebSocket";

const EventList = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleWsUpdate = useCallback(() => {
    if (error) return;
    fetch(`${config.backendUrl}/api/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => {});
  }, [error]);

  useWebSocket("events", handleWsUpdate);
  useWebSocket("tables", handleWsUpdate);

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
        <div className="text-amber-200/70 text-xl font-cinzel tracking-wide">Loading events…</div>
      </motion.div>
    );
  }

  if (error || events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center rounded-xl shadow-xl"
        style={{ background: "rgba(15, 18, 35, 0.6)" }}
      >
        <FaCalendar className="text-6xl text-amber-200/60 mb-6" />
        <h1 className="text-3xl md:text-5xl font-cinzel font-bold text-amber-100 mb-4">
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
          className={`mb-6 flex items-center gap-2 text-lg transition-colors ${
            selectedEvent?.event_type === "general"
              ? "text-sky-300 hover:text-sky-200"
              : "text-rose-300 hover:text-rose-200"
          }`}
        >
          ← {t("event_list_component.back_to_events")}
        </motion.button>
      )}

      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl md:text-6xl font-cinzel font-bold text-center text-amber-100 mb-8 md:mb-12"
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
          {events.map((event, index) => {
            const isGeneral = event.event_type === "general";
            const accentRgba = isGeneral
              ? "rgba(125, 211, 252, 0.65)"
              : "rgba(253, 164, 175, 0.65)";
            const isClickable =
              event.total_tables > 0 || isGeneral;
            return (
              <motion.div
                key={event.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => isClickable ? setSelectedEvent(event) : null}
                className={`relative rounded-xl p-6 transition-all duration-300 ${
                  isClickable
                    ? "cursor-pointer hover:translate-x-1"
                    : "opacity-75"
                }`}
                style={{
                  background: "rgba(15, 18, 35, 0.75)",
                  borderLeft: `4px solid ${accentRgba}`,
                }}
              >
                <span
                  className="absolute top-4 left-[-2px] text-xs leading-none select-none"
                  style={{ color: accentRgba }}
                  aria-hidden="true"
                >
                  ◆
                </span>
                <h2
                  className={`text-2xl md:text-3xl font-cinzel font-bold mb-3 ${
                    isGeneral ? "text-sky-200" : "text-rose-200"
                  }`}
                >
                  {event.name}
                </h2>
                <p className="text-stone-300 mb-4 text-lg">{event.description}</p>
                {/* Meta strip — only render if any metadata field is present */}
                {(event.start_time || event.end_time || event.venue_name ||
                  (event.announcement_title && event.announcement_url) ||
                  event.bus_time || event.bus_from || event.bus_to) && (
                  <div className="flex flex-wrap gap-2 mb-4 pt-3 border-t border-white/5">
                    {(event.start_time || event.end_time) && (
                      <span
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: accentRgba.replace("0.65", "0.08"), color: accentRgba }}
                      >
                        🕐 {[event.start_time, event.end_time].filter(Boolean).join(" – ")}
                      </span>
                    )}
                    {event.venue_name && (
                      event.location_url ? (
                        <a
                          href={event.location_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-75"
                          style={{ background: accentRgba.replace("0.65", "0.08"), color: accentRgba }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          📍 {event.venue_name} ↗
                        </a>
                      ) : (
                        <span
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                          style={{ background: accentRgba.replace("0.65", "0.08"), color: accentRgba }}
                        >
                          📍 {event.venue_name}
                        </span>
                      )
                    )}
                    {event.announcement_title && event.announcement_url && (
                      <a
                        href={event.announcement_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-75"
                        style={{ background: accentRgba.replace("0.65", "0.08"), color: accentRgba }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        📢 {event.announcement_title} ↗
                      </a>
                    )}
                    {(event.bus_time || event.bus_from || event.bus_to) && (
                      <span
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                        style={{ background: accentRgba.replace("0.65", "0.08"), color: accentRgba }}
                      >
                        🚌{" "}
                        {[
                          event.bus_time,
                          event.bus_from && event.bus_to
                            ? `${event.bus_from} → ${event.bus_to}`
                            : event.bus_from || event.bus_to,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap justify-between text-sm md:text-base gap-4">
                  {isGeneral ? (
                    <span className="px-4 py-2 rounded-full bg-sky-950/60 text-sky-200 border border-sky-400/30">
                      {t("event_list_component.general_event") ||
                        "General Event - Registration Open"}
                    </span>
                  ) : (
                    <span
                      className={`px-4 py-2 rounded-full ${
                        event.available_tables > 0
                          ? "bg-emerald-950/60 text-emerald-300 border border-emerald-400/30"
                          : "bg-rose-950/60 text-rose-300 border border-rose-400/30"
                      }`}
                    >
                      {event.available_tables > 0
                        ? `${event.available_seats} ${t(
                            "event_list_component.seats_available",
                          )}`
                        : t("event_list_component.registrations_not_started")}
                    </span>
                  )}
                  <span className="text-amber-200/70 flex items-center gap-1.5 text-sm">
                    ✦ {new Date(event.start_date).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            );
          })}
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
