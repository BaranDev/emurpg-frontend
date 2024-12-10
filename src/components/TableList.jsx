import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { config } from "../config";

const TableList = ({ eventSlug }) => {
  const [tables, setTables] = useState([]);
  const backendUrl = config.backendUrl;
  const [ws, setWs] = useState(null); // WebSocket state to manage connection
  const wsConnected = useRef(false); // Ref to track WebSocket connection status
  const wsConnectionAttempted = useRef(false);

  useEffect(() => {
    // Function to fetch tables from the backend
    const fetchTables = () => {
      fetch(`${config.backendUrl}/api/events/${eventSlug}/tables`)
        .then((res) => res.json())
        .then((data) => setTables(data));
    };

    // Establish the WebSocket connection
    const connectWebSocket = () => {
      const socket = new WebSocket(`${backendUrl}/ws/updates`);

      socket.onopen = () => {
        console.log("WebSocket connected");
        wsConnected.current = true; // Mark WebSocket as connected
      };

      socket.onmessage = (event) => {
        console.log("Received message from WebSocket", event.data);

        // Only fetch tables if WebSocket is connected and no ongoing fetch
        if (wsConnected.current) {
          fetchTables();
        }
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
        wsConnected.current = false; // Mark WebSocket as disconnected
      };

      socket.onerror = (error) => {
        console.log("WebSocket error:", error);
        wsConnected.current = false; // Mark WebSocket as disconnected on error
      };

      return socket;
    };

    // Initial fetch on component mount
    fetchTables();

    // Establish WebSocket connection if it hasn't been attempted yet
    if (!wsConnectionAttempted.current) {
      const socket = connectWebSocket();
      setWs(socket);
      wsConnectionAttempted.current = true; // Mark that a connection attempt has been made
    }

    // Cleanup WebSocket connection when the component unmounts
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [eventSlug]);

  if (tables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
        <p className="text-lg text-gray-300 mb-4">
          Event is full, stay tuned for our next event!
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
    <>
      <p className="text-lg md:text-xl text-center mb-4 md:mb-8 font-medieval">
        Welcome, brave adventurer, to the realm of tabletop quests and epic
        tales!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {tables.map((table) => {
          const isFull = table.player_quota <= table.total_joined_players;
          return (
            <div
              key={table.slug}
              className="bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 border-2 border-yellow-600 flex flex-col h-full"
            >
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-yellow-500 mb-2 text-center font-medieval">
                  {table.game_name}
                </h3>
                <p className="text-sm text-gray-300 mb-1 text-center">
                  Quest Master: {table.game_master}
                </p>
                <p
                  className={`text-sm text-center ${
                    isFull ? "text-red-400" : "text-green-400"
                  } mb-3`}
                >
                  {isFull
                    ? "Party Full"
                    : `Spaces in Party: ${
                        table.player_quota - table.total_joined_players
                      }`}
                </p>
              </div>
              <div className="p-4 bg-gray-700">
                {!isFull ? (
                  <Link
                    to={`/table/${table.slug}`}
                    className="block w-full text-center bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors hover:bg-yellow-700"
                  >
                    View Quest
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full bg-gray-600 text-gray-400 px-4 py-2 rounded-md cursor-not-allowed"
                  >
                    Party Full
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TableList;
