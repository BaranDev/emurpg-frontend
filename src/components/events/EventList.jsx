import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import TableList from "../tables/TableList";
import GeneralEventRegistrationForm from "./GeneralEventRegistrationForm";
import { config } from "../../config";
import { motion } from "framer-motion";
import { FaCalendar, FaExclamationTriangle } from "react-icons/fa";
import { Clock, MapPin, Megaphone, Bus, ExternalLink } from "lucide-react";
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
            const accentColor = isGeneral
              ? "rgba(125, 211, 252, 0.65)"
              : "rgba(253, 164, 175, 0.65)";
            const iconStyle = { color: isGeneral ? "rgba(125,211,252,0.55)" : "rgba(253,164,175,0.55)" };
            const linkStyle = { color: isGeneral ? "rgba(125,211,252,0.85)" : "rgba(253,164,175,0.85)" };
            const isClickable = event.total_tables > 0 || isGeneral;

            const hasMeta =
              event.start_time || event.end_time || event.venue_name ||
              (event.announcement_title && event.announcement_url) ||
              event.bus_time || event.bus_from || event.bus_to;

            const busText = [
              event.bus_time,
              event.bus_from && event.bus_to
                ? `${event.bus_from} → ${event.bus_to}`
                : event.bus_from || event.bus_to,
            ].filter(Boolean).join("  ·  ");

            const StatusBadge = ({ compact = false }) => isGeneral ? (
              <span className={`rounded-full bg-sky-950/60 text-sky-200 border border-sky-400/30 text-xs ${compact ? "px-2.5 py-1" : "px-3 py-1.5"}`}>
                {t("event_list_component.general_event") || "General Event — Registration Open"}
              </span>
            ) : (
              <span className={`rounded-full text-xs ${compact ? "px-2.5 py-1" : "px-3 py-1.5"} ${
                event.available_tables > 0
                  ? "bg-emerald-950/60 text-emerald-300 border border-emerald-400/30"
                  : "bg-rose-950/60 text-rose-300 border border-rose-400/30"
              }`}>
                {event.available_tables > 0
                  ? `${event.available_seats} ${t("event_list_component.seats_available")}`
                  : t("event_list_component.registrations_not_started")}
              </span>
            );

            return (
              <motion.div
                key={event.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => isClickable ? setSelectedEvent(event) : null}
                className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                  isClickable ? "cursor-pointer hover:translate-x-1" : "opacity-75"
                }`}
                style={{
                  background: "rgba(15, 18, 35, 0.75)",
                  borderLeft: `4px solid ${accentColor}`,
                }}
              >
                {/* Corner ornament — inside padding area so overflow-hidden keeps it */}
                <span
                  className="absolute top-4 left-[1px] text-xs leading-none select-none z-10"
                  style={{ color: accentColor }}
                  aria-hidden="true"
                >◆</span>

                {/* ── WIDE LAYOUT (lg+): 3-column grid ── */}
                <div
                  className="hidden lg:grid"
                  style={{ gridTemplateColumns: "1fr 210px 152px" }}
                >
                  {/* Col 1: Identity */}
                  <div className="px-6 pt-5 pb-5">
                    <h2
                      className={`text-2xl font-cinzel font-bold leading-snug mb-2.5 ${
                        isGeneral ? "text-sky-200" : "text-rose-200"
                      }`}
                    >
                      {event.name}
                    </h2>
                    <div
                      className="mb-3 h-px"
                      style={{
                        background: isGeneral
                          ? "linear-gradient(to right, rgba(125,211,252,0.30), transparent)"
                          : "linear-gradient(to right, rgba(253,164,175,0.30), transparent)",
                      }}
                    />
                    <p className="text-stone-400 text-sm leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  {/* Col 2: Logistics */}
                  <div
                    className="py-5 px-4 flex flex-col justify-center gap-2.5"
                    style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <p
                      className="font-cinzel text-[10px] tracking-widest uppercase mb-0.5"
                      style={{ color: isGeneral ? "rgba(125,211,252,0.30)" : "rgba(253,164,175,0.30)" }}
                    >Details</p>
                    {(event.start_time || event.end_time) && (
                      <div className="flex items-center gap-2 text-xs text-stone-400">
                        <Clock size={11} className="flex-shrink-0" style={iconStyle} />
                        <span>{[event.start_time, event.end_time].filter(Boolean).join(" – ")}</span>
                      </div>
                    )}
                    {event.venue_name && (
                      <div className="flex items-center gap-2 text-xs min-w-0">
                        <MapPin size={11} className="flex-shrink-0" style={iconStyle} />
                        {event.location_url ? (
                          <a
                            href={event.location_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-2 transition-opacity hover:opacity-75 truncate"
                            style={linkStyle}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="truncate">{event.venue_name}</span>
                            <ExternalLink size={9} className="flex-shrink-0 opacity-70" />
                          </a>
                        ) : (
                          <span className="text-stone-400 truncate">{event.venue_name}</span>
                        )}
                      </div>
                    )}
                    {event.announcement_title && event.announcement_url && (
                      <div className="flex items-center gap-2 text-xs min-w-0">
                        <Megaphone size={11} className="flex-shrink-0" style={iconStyle} />
                        <a
                          href={event.announcement_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 underline decoration-dotted underline-offset-2 transition-opacity hover:opacity-75 truncate"
                          style={linkStyle}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="truncate">{event.announcement_title}</span>
                          <ExternalLink size={9} className="flex-shrink-0 opacity-70" />
                        </a>
                      </div>
                    )}
                    {busText && (
                      <div className="flex items-center gap-2 text-xs text-stone-400">
                        <Bus size={11} className="flex-shrink-0" style={iconStyle} />
                        <span className="truncate">{busText}</span>
                      </div>
                    )}
                    {!hasMeta && <span className="text-stone-700 text-xs">—</span>}
                  </div>

                  {/* Col 3: Status + Date */}
                  <div
                    className="py-5 px-4 flex flex-col items-center justify-center gap-3"
                    style={{
                      borderLeft: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(6, 8, 18, 0.30)",
                    }}
                  >
                    <StatusBadge />
                    <span
                      className="font-cinzel text-xs tracking-wide text-center"
                      style={{ color: "rgba(251,191,36,0.45)" }}
                    >
                      ✦ {new Date(event.start_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* ── COMPACT LAYOUT (< lg): stacked + chip rail ── */}
                <div className="lg:hidden">
                  {/* Name + description */}
                  <div className="px-5 pt-5 pb-3">
                    <h2
                      className={`text-lg sm:text-xl font-cinzel font-bold leading-snug mb-1.5 ${
                        isGeneral ? "text-sky-200" : "text-rose-200"
                      }`}
                    >
                      {event.name}
                    </h2>
                    <p className="text-stone-400 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  {/* Scrollable meta chip rail */}
                  {hasMeta && (
                    <div
                      className="flex items-center gap-2 px-5 pb-3 overflow-x-auto"
                      style={{ scrollbarWidth: "none" }}
                    >
                      {(event.start_time || event.end_time) && (
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full whitespace-nowrap text-xs text-stone-400 flex-shrink-0"
                          style={{ background: "rgba(6,8,18,0.65)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                          <Clock size={10} style={iconStyle} />
                          {[event.start_time, event.end_time].filter(Boolean).join("–")}
                        </span>
                      )}
                      {event.venue_name && (
                        event.location_url ? (
                          <a
                            href={event.location_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full whitespace-nowrap text-xs flex-shrink-0 transition-opacity hover:opacity-75 underline decoration-dotted underline-offset-2"
                            style={{ background: "rgba(6,8,18,0.65)", border: "1px solid rgba(255,255,255,0.07)", color: linkStyle.color }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MapPin size={10} style={iconStyle} />
                            {event.venue_name}
                            <ExternalLink size={9} className="opacity-70" />
                          </a>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full whitespace-nowrap text-xs text-stone-400 flex-shrink-0"
                            style={{ background: "rgba(6,8,18,0.65)", border: "1px solid rgba(255,255,255,0.07)" }}
                          >
                            <MapPin size={10} style={iconStyle} />
                            {event.venue_name}
                          </span>
                        )
                      )}
                      {event.announcement_title && event.announcement_url && (
                        <a
                          href={event.announcement_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full whitespace-nowrap text-xs flex-shrink-0 transition-opacity hover:opacity-75 underline decoration-dotted underline-offset-2"
                          style={{ background: "rgba(6,8,18,0.65)", border: "1px solid rgba(255,255,255,0.07)", color: linkStyle.color }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Megaphone size={10} style={iconStyle} />
                          {event.announcement_title}
                          <ExternalLink size={9} className="opacity-70" />
                        </a>
                      )}
                      {busText && (
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full whitespace-nowrap text-xs text-stone-400 flex-shrink-0"
                          style={{ background: "rgba(6,8,18,0.65)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                          <Bus size={10} style={iconStyle} />
                          {busText}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer strip */}
                  <div
                    className="flex flex-wrap items-center justify-between gap-2 px-5 py-3"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <StatusBadge compact />
                    <span className="text-amber-200/50 text-xs flex items-center gap-1.5">
                      ✦ {new Date(event.start_date).toLocaleDateString()}
                    </span>
                  </div>
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
