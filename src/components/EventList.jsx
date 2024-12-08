import React, { useEffect, useState, useRef } from "react";
import TableList from "./TableList";
import config from "../config";
const EventList = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [title, setTitle] = useState("EMU RPG Events");

  useEffect(() => {
    fetch(`${config.backendUrl}/api/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const [ws, setWs] = useState(null);
  const wsConnected = useRef(false);
  const wsConnectionAttempted = useRef(false);

  useEffect(() => {
    const connectWebSocket = () => {
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
            .then((data) => setEvents(data));
        }
      };

      socket.onclose = () => {
        console.log("Events WebSocket disconnected");
        wsConnected.current = false;
        setTimeout(() => {
          if (!wsConnected.current) connectWebSocket();
        }, 3000);
      };

      socket.onerror = (error) => {
        console.log("Events WebSocket error:", error);
        wsConnected.current = false;
      };

      return socket;
    };

    if (!wsConnectionAttempted.current) {
      const socket = connectWebSocket();
      setWs(socket);
      wsConnectionAttempted.current = true;
    }

    return () => {
      if (ws) {
        ws.close();
        wsConnected.current = false;
        wsConnectionAttempted.current = false;
      }
    };
  }, []);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-center text-yellow-500 mb-4 md:mb-8 font-medieval">
          {selectedEvent ? selectedEvent.name : "EMU RPG Events"}
        </h1>
        <p className="text-lg text-gray-300 mb-4">
          There are no ongoing events, stay tuned for our next events!
        </p>
        <p className="text-lg text-gray-300 mb-4">
          Make sure to join our{" "}
          <a
            href={config.WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-400 underline"
          >
            WhatsApp
          </a>{" "}
          and our{" "}
          <a
            href={config.DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:text-indigo-400 underline"
          >
            Discord
          </a>
          !
        </p>
      </div>
    );
  }

  return (
    <div>
      {(selectedEvent && (
        <button
          onClick={() => setSelectedEvent(null)}
          className="mb-4 text-yellow-200 hover:text-yellow-400 flex items-center"
        >
          ← Events
        </button>
      )) ||
        null}
      <h1 className="text-3xl md:text-5xl font-bold text-center text-yellow-500 mb-4 md:mb-8 font-medieval">
        {selectedEvent ? selectedEvent.name : "EMU RPG Events"}
      </h1>
      {!selectedEvent ? (
        <div className="grid gap-6">
          {events.map((event) => (
            <div
              key={event.slug}
              onClick={() =>
                event.total_tables > 0 ? setSelectedEvent(event) : null
              }
              className={`bg-gray-700 rounded-lg border-2 border-yellow-600 p-4 ${
                event.total_tables > 0
                  ? "cursor-pointer hover:bg-gray-600"
                  : "opacity-75"
              } transition`}
            >
              <h2 className="text-2xl font-medieval text-yellow-500 mb-2">
                {event.name}
              </h2>
              <p className="text-gray-300 mb-2">{event.description}</p>
              <div className="flex justify-between text-sm">
                <span
                  className={
                    event.available_tables > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {event.available_tables > 0
                    ? `Available Seats: ${event.available_seats}`
                    : "Event is full"}
                </span>
                <span>
                  {new Date(event.start_date).toLocaleDateString() ===
                  new Date(event.end_date).toLocaleDateString()
                    ? new Date(event.start_date).toLocaleDateString()
                    : `${new Date(
                        event.start_date
                      ).toLocaleDateString()} - ${new Date(
                        event.end_date
                      ).toLocaleDateString()}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <TableList eventSlug={selectedEvent.slug} />
        </div>
      )}
    </div>
  );
};

export default EventList;
