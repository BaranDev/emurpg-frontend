import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { config } from "../../config";
import GameGuideModal from "./GameGuideModal";
import { useWebSocket } from "../../hooks/useWebSocket";

const TableList = ({ eventSlug }) => {
  const { t } = useTranslation();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = config.backendUrl;
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameDetails, setGameDetails] = useState({});
  const [themes, setThemes] = useState({});

  const fetchTables = useCallback(() => {
    fetch(`${config.backendUrl}/api/events/${eventSlug}/tables`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tables");
        return res.json();
      })
      .then((data) => {
        setTables(data);
        setError(null);
      })
      .catch((err) => {
        console.log("Failed to fetch tables:", err.message);
        setError(err.message);
        setTables([]);
      })
      .finally(() => setLoading(false));
  }, [eventSlug]);

  useWebSocket("tables", fetchTables);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/games`);
        if (!response.ok) return;
        const data = await response.json();
        console.log("Games loaded:", data);
      } catch (err) {
        console.log("Error fetching games:", err.message);
      }
    };

    const fetchThemes = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/themes`);
        if (!response.ok) return;
        const data = await response.json();
        const themesMap = {};
        data.forEach((theme) => {
          themesMap[theme.id] = theme;
        });
        setThemes(themesMap);
      } catch (err) {
        console.log("Error fetching themes:", err.message);
      }
    };

    fetchTables();
    fetchGames();
    fetchThemes();
  }, [eventSlug, backendUrl, fetchTables]);

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

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
        <p className="text-lg text-yellow-500">
          {t("table_list.loading_tables")}
        </p>
      </div>
    );
  }

  // Error or empty state
  if (error || tables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
        <p className="text-lg text-gray-300 mb-4">
          {t("table_list.event_being_created")}
        </p>
        <p className="text-lg text-gray-300 mb-4">
          {t("table_list.make_sure_join")}{" "}
          <a
            href={config.WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-400 underline"
          >
            WhatsApp
          </a>{" "}
          {t("table_list.and_our")}{" "}
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
        {t("table_list.welcome_adventurer")}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {tables.map((table) => {
          const gameData = table.game_id ? gameDetails[table.game_id] : null;
          console.log(`Table ${table.slug} game data:`, gameData);

          return tableListFunction(table, gameData, setSelectedGame, t, themes);
        })}

        {/* Host your own table card */}
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 border-2 border-purple-500 flex flex-col h-full">
          <div className="w-full h-32 overflow-hidden bg-purple-900 flex items-center justify-center">
            <div className="text-5xl text-purple-300">🎲</div>
          </div>
          <div className="p-6 flex-grow flex flex-col items-center justify-center">
            <h3 className="text-xl font-bold text-purple-400 mb-4 text-center font-medieval">
              {t("table_list.want_to_host")}
            </h3>
            <p className="text-sm text-gray-300 mb-6 text-center">
              {t("table_list.share_favorite_game")}
            </p>
          </div>
          <div className="p-4 bg-gray-700">
            <a
              href="mailto:emufrpclub@gmail.com"
              className="block w-full text-center bg-purple-600 text-white px-4 py-2 rounded-md transition-colors hover:bg-purple-700"
            >
              {t("table_list.mail_us")}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

TableList.propTypes = {
  eventSlug: PropTypes.string.isRequired,
};

export default TableList;
function tableListFunction(table, gameData, setSelectedGame, t, themes) {
  const theme =
    table.theme_id && themes[table.theme_id]
      ? themes[table.theme_id]
      : themes["default"] || {
          background_styles: "bg-gray-800",
          card_styles: "rounded-lg border-2 border-yellow-600",
          hover_animations: "transition-transform transform hover:scale-105",
          button_styles: "bg-yellow-600 hover:bg-yellow-700 text-white",
        };

  return (
    <div
      key={table.slug}
      className={`shadow-lg !flex !flex-col h-full min-h-[420px] overflow-hidden relative ${theme.background_styles || "bg-gray-800"} ${theme.card_styles} ${theme.hover_animations}`}
    >
      {theme.background_image_url && config.ENABLE_R2 && (
        <div className="absolute inset-0 z-0">
          <img
            src={theme.background_image_url}
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
        </div>
      )}
      <div className="flex flex-col h-full relative z-10">
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
          <h3
            className={`text-xl font-bold mb-2 text-center font-medieval ${
              !theme.id || theme.id === "default" ? "text-yellow-500" : ""
            }`}
          >
            {table.game_name}
          </h3>

          {table.language && (
            <p className="text-sm text-red-500 mb-1 text-center">
              {table.language}
            </p>
          )}

          <p className="text-sm text-gray-300 mb-1 text-center">
            {t("table_list.quest_master")}: {table.game_master}
          </p>

          <p className="text-sm text-center text-gray-400 mb-2">
            ⏱️ ~
            {gameData ? gameData.avg_play_time : table.game_play_time || "?"}{" "}
            {t("table_list.minutes")}
          </p>

          {!table.is_marked_full && (
            <p className="text-sm text-center text-green-400 mb-3">
              {table.player_quota} {t("table_list.seats")}
            </p>
          )}
        </div>

        <div className="p-4 bg-gray-700">
          <div className="flex gap-2">
            <Link
              to={`/table/${table.slug}`}
              className={`flex-1 text-center ${
                table.is_marked_full
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : theme.button_styles
              } px-4 py-2 rounded-md transition-colors`}
              onClick={(e) => table.is_marked_full && e.preventDefault()}
            >
              {table.is_marked_full
                ? t("table_list.full")
                : t("table_list.register")}
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
                    },
                  );
                }, 300);
              }}
              className="text-center text-sm bg-blue-600/50 hover:bg-blue-600/70 text-white px-3 py-2 rounded-md transition-colors"
            >
              {t("table_list.game_info")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
