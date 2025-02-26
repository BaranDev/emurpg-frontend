import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { config } from "../config";
import GameGuideModal from "./GameGuideModal";

const TableList = ({ eventSlug }) => {
  const [tables, setTables] = useState([]);
  const backendUrl = config.backendUrl;
  const [ws, setWs] = useState(null);
  const wsConnected = useRef(false);
  const wsConnectionAttempted = useRef(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [games, setGames] = useState([]);
  const [gameDetails, setGameDetails] = useState({});

  useEffect(() => {
    const fetchTables = () => {
      fetch(`${config.backendUrl}/api/events/${eventSlug}/tables`)
        .then((res) => res.json())
        .then((data) => setTables(data));
    };

    const fetchGames = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/games`);
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    const connectWebSocket = () => {
      const socket = new WebSocket(`${backendUrl}/ws/updates`);

      socket.onopen = () => {
        console.log("WebSocket connected");
        wsConnected.current = true;
      };

      socket.onmessage = (event) => {
        console.log("Received message from WebSocket", event.data);
        if (wsConnected.current) {
          fetchTables();
        }
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
        wsConnected.current = false;
      };

      socket.onerror = (error) => {
        console.log("WebSocket error:", error);
        wsConnected.current = false;
      };

      return socket;
    };

    fetchTables();
    fetchGames();

    if (!wsConnectionAttempted.current) {
      const socket = connectWebSocket();
      setWs(socket);
      wsConnectionAttempted.current = true;
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [eventSlug]);

  useEffect(() => {
    const fetchGameDetails = async (gameId) => {
      try {
        const response = await fetch(`${config.backendUrl}/api/game/${gameId}`);
        if (!response.ok) {
          throw new Error(`Failed with status: ${response.status}`);
        }

        const data = await response.json();
        setGameDetails((prevDetails) => ({
          ...prevDetails,
          [gameId]: data,
        }));
      } catch (error) {
        console.error(`Error fetching game details for ID "${gameId}":`, error);
      }
    };

    // Fetch details for tables with game_id
    tables.forEach((table) => {
      if (table.game_id && !gameDetails[table.game_id]) {
        fetchGameDetails(table.game_id);
      }
    });
  }, [tables, gameDetails]);

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
      {selectedGame && (
        <GameGuideModal
          isOpen={!!selectedGame}
          onClose={() => setSelectedGame(null)}
          game={selectedGame}
          className="z-150"
        />
      )}
      <p className="text-lg md:text-xl text-center mb-4 md:mb-8 font-medieval">
        Welcome, brave adventurer, to the realm of tabletop quests and epic
        tales!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {tables.map((table) => {
          const gameData = table.game_id ? gameDetails[table.game_id] : null;
          console.log(`Table ${table.slug} game data:`, gameData);

          return (
            <div
              key={table.slug}
              className="bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 border-2 border-yellow-600 flex flex-col h-full"
            >
              {(gameData?.image_url || table.game_image) && (
                <div className="w-full h-32 overflow-hidden">
                  <img
                    src={gameData?.image_url || table.game_image}
                    alt={table.game_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Image failed to load:`, e.target.src);
                      e.target.src =
                        "https://placehold.co/600x400/333/CCC?text=Game+Image";
                    }}
                  />
                </div>
              )}
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-yellow-500 mb-2 text-center font-medieval">
                  {table.game_name}
                </h3>

                {table.language && (
                  <p className="text-sm text-red-500 mb-1 text-center">
                    {table.language}
                  </p>
                )}

                <p className="text-sm text-gray-300 mb-1 text-center">
                  Quest Master: {table.game_master}
                </p>

                <p className="text-sm text-center text-gray-400 mb-2">
                  ⏱️ ~
                  {gameData
                    ? gameData.avg_play_time
                    : table.game_play_time || "?"}{" "}
                  minutes
                </p>

                <p className="text-sm text-center text-green-400 mb-3">
                  {table.player_quota} seats
                </p>
              </div>

              <div className="p-4 bg-gray-700">
                <div className="flex gap-2">
                  <Link
                    to={`/table/${table.slug}`}
                    className="flex-1 text-center bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors hover:bg-yellow-700"
                  >
                    Register
                  </Link>
                  <button
                    onClick={() => {
                      // First scroll to top
                      window.scrollTo({
                        top: 400,
                        behavior: "smooth",
                      });
                      // Set a small timeout to ensure scroll completes before modal opens
                      setTimeout(() => {
                        setSelectedGame(
                          gameData || {
                            name: table.game_name,
                            image_url: table.game_image,
                            avg_play_time: table.game_play_time,
                            guide_text: table.game_guide_text,
                            guide_video_url: table.game_guide_video,
                            min_players: 1,
                            max_players: table.player_quota,
                          }
                        );
                      }, 300);
                    }}
                    className="text-center text-sm bg-blue-600/50 hover:bg-blue-600/70 text-white px-3 py-2 rounded-md transition-colors"
                  >
                    Game Info
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Host your own table card */}
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 border-2 border-purple-500 flex flex-col h-full">
          <div className="w-full h-32 overflow-hidden bg-purple-900 flex items-center justify-center">
            <div className="text-5xl text-purple-300">🎲</div>
          </div>
          <div className="p-6 flex-grow flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold text-purple-400 mb-4 text-center font-medieval">
              Want to host your own table?
            </h3>
            <p className="text-sm text-gray-300 mb-6 text-center">
              Share your favorite game with fellow friends!
            </p>
          </div>
          <div className="p-4 bg-gray-700">
            <a
              href="mailto:emufrpclub@gmail.com"
              className="block w-full text-center bg-purple-600 text-white px-4 py-2 rounded-md transition-colors hover:bg-purple-700"
            >
              Mail Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableList;
