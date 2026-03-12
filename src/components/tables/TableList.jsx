import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { config } from "../../config";
import GameGuideModal from "./GameGuideModal";
import HostTableModal from "./HostTableModal";
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
  const [hostModalOpen, setHostModalOpen] = useState(false);

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
        console.error("Failed to fetch tables:", err.message);
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
        await response.json();
      } catch (err) {
        console.error("Error fetching games:", err.message);
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
        console.error("Error fetching themes:", err.message);
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
        <p className="text-lg font-cinzel tracking-wide text-amber-200/70">
          {t("table_list.loading_tables")}
        </p>
      </div>
    );
  }

  // Error or empty state
  if (error || tables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
        <p className="text-lg text-stone-300 mb-4">
          {t("table_list.event_being_created")}
        </p>
        <p className="text-lg text-stone-300 mb-4">
          {t("table_list.make_sure_join")}{" "}
          <a
            href={config.WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 underline"
          >
            WhatsApp
          </a>{" "}
          {t("table_list.and_our")}{" "}
          <a
            href={config.DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline"
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
      <HostTableModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
        eventSlug={eventSlug}
      />
      <p className="text-lg md:text-xl font-cinzel text-center mb-4 md:mb-8 text-amber-100/80 tracking-wide">
        {t("table_list.welcome_adventurer")}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {tables.map((table) => {
          const gameData = table.game_id ? gameDetails[table.game_id] : null;

          return tableListFunction(table, gameData, setSelectedGame, t, themes);
        })}

        {/* Host your own table card */}
        <div
          className="relative flex flex-col h-full min-h-[420px] overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: "rgba(20, 10, 40, 0.82)",
            borderTop: "3px solid rgba(167, 139, 250, 0.55)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div
            className="w-full h-24 flex items-center justify-center"
            style={{ background: "rgba(30, 10, 60, 0.5)" }}
          >
            <span className="text-4xl opacity-50">🎲</span>
          </div>
          <div className="p-5 flex-grow flex flex-col items-center justify-center text-center gap-3">
            <h3 className="text-lg font-cinzel font-semibold text-violet-200">
              {t("table_list.want_to_host")}
            </h3>
            <p className="text-sm text-stone-400">
              {t("table_list.share_favorite_game")}
            </p>
          </div>
          <div
            className="p-3"
            style={{
              background: "rgba(6, 8, 16, 0.7)",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <button
              onClick={() => setHostModalOpen(true)}
              className="block w-full text-center text-sm bg-violet-900/50 text-violet-200 border border-violet-500/35 hover:bg-violet-800/65 hover:border-violet-400/55 px-4 py-2 rounded-lg transition-all duration-200"
            >
              {t("table_list.host_table_button")}
            </button>
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
      : themes["default"] || { id: "default" };

  const isDefaultTheme = !theme.id || theme.id === "default";
  const accentRgba = table.is_marked_full
    ? "rgba(251, 113, 133, 0.5)"
    : "rgba(110, 231, 183, 0.55)";

  return (
    <div
      key={table.slug}
      className={`relative !flex !flex-col h-full min-h-[420px] overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-0.5 ${
        isDefaultTheme
          ? ""
          : `${theme.background_styles || ""} ${theme.card_styles || ""} ${theme.hover_animations || ""}`
      }`}
      style={
        isDefaultTheme
          ? {
              background: "rgba(13, 16, 30, 0.82)",
              borderTop: `3px solid ${accentRgba}`,
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
            }
          : undefined
      }
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
        {(gameData?.image_url || table.game_image) ? (
          <div className="w-full h-36 overflow-hidden relative">
            <img
              src={gameData?.image_url || table.game_image}
              alt={table.game_name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/600x400/0d1020/c9a227?text=⚔";
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 50%, rgba(13,16,30,0.85) 100%)",
              }}
            />
          </div>
        ) : (
          <div
            className="w-full h-20 flex items-center justify-center"
            style={{ background: "rgba(8, 10, 20, 0.6)" }}
          >
            <span className="text-3xl opacity-25">⚔</span>
          </div>
        )}

        <div className="p-5 flex-grow flex flex-col gap-2">
          <h3 className="text-base font-cinzel font-semibold text-amber-100 text-center leading-snug">
            {table.game_name}
          </h3>

          {table.language && (
            <p className="text-center">
              <span className="px-2 py-0.5 rounded-full bg-red-950/60 text-red-300 border border-red-400/25 text-xs">
                {table.language}
              </span>
            </p>
          )}

          <p className="text-xs text-stone-400 text-center">
            {t("table_list.quest_master")}:{" "}
            <span className="text-stone-200">{table.game_master}</span>
          </p>

          <p className="text-xs text-center text-amber-200/60">
            ⏱ ~{gameData ? gameData.avg_play_time : table.game_play_time || "?"}{" "}
            {t("table_list.minutes")}
          </p>

          {!table.is_marked_full ? (
            <p className="text-center">
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-400/25 text-xs">
                {table.player_quota} {t("table_list.seats")}
              </span>
            </p>
          ) : (
            <p className="text-center">
              <span className="px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-400/25 text-xs">
                {t("table_list.full")}
              </span>
            </p>
          )}
        </div>

        <div
          className="p-3"
          style={{
            background: "rgba(6, 8, 16, 0.7)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex gap-2">
            <Link
              to={`/table/${table.slug}`}
              className={`flex-1 text-center text-sm px-3 py-2 rounded-lg border transition-all duration-200 ${
                table.is_marked_full
                  ? "bg-gray-800/60 text-gray-500 border-gray-700/40 cursor-not-allowed"
                  : isDefaultTheme
                    ? "bg-amber-900/50 text-amber-200 border-amber-500/35 hover:bg-amber-800/65 hover:border-amber-400/55"
                    : theme.button_styles
              }`}
              onClick={(e) => table.is_marked_full && e.preventDefault()}
            >
              {table.is_marked_full
                ? t("table_list.full")
                : t("table_list.register")}
            </Link>
            <button
              onClick={() => {
                window.scrollTo({ top: 400, behavior: "smooth" });
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
              className="text-center text-sm bg-indigo-950/60 hover:bg-indigo-900/70 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400/50 px-3 py-2 rounded-lg transition-all duration-200"
            >
              {t("table_list.game_info")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
