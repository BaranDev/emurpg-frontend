import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Search,
  Users,
  Lock,
  Unlock,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserPlus,
  ClipboardList,
  MessageCircle,
  Copy,
} from "lucide-react";
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";
import AdminModal from "./shared/AdminModal";
import AdminButton from "./shared/AdminButton";
import LoadingSpinner from "./shared/LoadingSpinner";
import ConfirmDialog from "./shared/ConfirmDialog";
import { useWebSocket } from "../../hooks/useWebSocket";
import { findDuplicatePlayers } from "../../utils/duplicateDetection";

const TablesAdminPanel = () => {
  const [events, setEvents] = useState([]);
  const [games, setGames] = useState([]);
  const [themes, setThemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState("all");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPlayersModalOpen, setIsPlayersModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [players, setPlayers] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const [tableForm, setTableForm] = useState({
    game_name: "",
    game_master: "",
    player_quota: "",
    language: "Turkish",
    game_id: null,
    game_image: "",
    game_play_time: 0,
    game_guide_text: "",
    game_guide_video: "",
    theme_id: "default",
  });

  const [editForm, setEditForm] = useState({
    gameName: "",
    gameMaster: "",
    playerQuota: "",
    language: "",
    themeId: "default",
  });

  const [newPlayer, setNewPlayer] = useState({
    name: "",
    student_id: "",
    contact: "",
  });

  const [selectedGameId, setSelectedGameId] = useState("");
  const [isCustomGame, setIsCustomGame] = useState(false);

  const [hostRequests, setHostRequests] = useState({});
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [selectedApplicationsEvent, setSelectedApplicationsEvent] = useState(null);
  const [isDuplicatesModalOpen, setIsDuplicatesModalOpen] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const selectedTableRef = useRef(null);
  const isPlayersModalOpenRef = useRef(false);

  const backendUrl = config.backendUrl;
  const apiKey = getApiKey();

  useEffect(() => {
    selectedTableRef.current = selectedTable;
  }, [selectedTable]);

  useEffect(() => {
    isPlayersModalOpenRef.current = isPlayersModalOpen;
  }, [isPlayersModalOpen]);

  const fetchEventsAndRequests = useCallback(async () => {
    const eventsRes = await fetch(`${backendUrl}/api/admin/events`, {
      headers: { apiKey },
    });

    if (!eventsRes.ok) {
      throw new Error("Failed to fetch events");
    }

    const eventsData = await eventsRes.json();
    const eventsWithTables = await Promise.all(
      eventsData.map(async (event) => {
        const tableDetails = await Promise.all(
          (event.tables || []).map(async (tableSlug) => {
            try {
              const tableRes = await fetch(
                `${backendUrl}/api/admin/table/${tableSlug}`,
                {
                  headers: { apiKey },
                },
              );
              if (tableRes.ok) {
                const { data } = await tableRes.json();
                return data;
              }
              return null;
            } catch {
              return null;
            }
          }),
        );
        return { ...event, tableDetails: tableDetails.filter(Boolean) };
      }),
    );

    const gameEvents = eventsData.filter(
      (e) => e.is_ongoing && e.event_type === "game",
    );
    const requestResults = await Promise.all(
      gameEvents.map(async (event) => {
        try {
          const res = await fetch(
            `${backendUrl}/api/admin/host-requests/${event.slug}`,
            { headers: { apiKey } },
          );
          return { slug: event.slug, data: res.ok ? await res.json() : [] };
        } catch {
          return { slug: event.slug, data: [] };
        }
      }),
    );

    const requestsMap = {};
    requestResults.forEach(({ slug, data }) => {
      requestsMap[slug] = data;
    });

    return { eventsWithTables, requestsMap };
  }, [backendUrl, apiKey]);

  const fetchData = useCallback(async (options = {}) => {
    const { showLoading = false, includeCatalog = false } = options;
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const { eventsWithTables, requestsMap } = await fetchEventsAndRequests();
      setEvents(eventsWithTables);
      setHostRequests(requestsMap);

      const activeTable = selectedTableRef.current;
      if (activeTable) {
        const refreshedTable = eventsWithTables
          .flatMap((event) => event.tableDetails || [])
          .find((table) => table.slug === activeTable.slug);
        if (refreshedTable) {
          setSelectedTable(refreshedTable);
          if (isPlayersModalOpenRef.current) {
            setPlayers(getAllPlayers(refreshedTable));
          }
        }
      }

      if (includeCatalog) {
        const [gamesRes, themesRes] = await Promise.all([
          fetch(`${backendUrl}/api/games`, { headers: { apiKey } }),
          fetch(`${backendUrl}/api/themes`, { headers: { apiKey } }),
        ]);

        if (themesRes.ok) {
          setThemes(await themesRes.json());
        }

        if (gamesRes.ok) {
          setGames(await gamesRes.json());
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, [
    apiKey,
    backendUrl,
    fetchEventsAndRequests,
  ]);

  useWebSocket("tables", () => {
    fetchData();
  });

  useEffect(() => {
    fetchData({ showLoading: true, includeCatalog: true });
  }, [fetchData]);

  const handleCreateTable = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/create_table/${selectedEvent.slug}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", apiKey },
          body: JSON.stringify(tableForm),
        },
      );

      if (!response.ok) throw new Error("Failed to create table");

      setIsCreateModalOpen(false);
      resetTableForm();
      fetchData();
    } catch (error) {
      console.error("Error creating table:", error);
      alert("Failed to create table");
    }
  };

  const handleUpdateTable = async (e) => {
    e.preventDefault();
    if (!selectedTable) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/table/${selectedTable.slug}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", apiKey },
          body: JSON.stringify({
            game_name: editForm.gameName,
            game_master: editForm.gameMaster,
            player_quota: editForm.playerQuota,
            total_joined_players: selectedTable.total_joined_players,
            joined_players: selectedTable.joined_players,
            slug: selectedTable.slug,
            language: editForm.language,
            created_at: selectedTable.created_at,
            theme_id: editForm.themeId,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to update table");

      setIsEditModalOpen(false);
      setSelectedTable(null);
      fetchData();
    } catch (error) {
      console.error("Error updating table:", error);
      alert("Failed to update table");
    }
  };

  const handleDeleteTable = async (table) => {
    setConfirmDialog({
      open: true,
      title: "Delete Table",
      message: `Are you sure you want to delete "${table.game_name}"? This will remove all players.`,
      onConfirm: async () => {
        try {
          const response = await fetch(
            `${backendUrl}/api/admin/table/${table.slug}`,
            {
              method: "DELETE",
              headers: { apiKey },
            },
          );

          if (!response.ok) throw new Error("Failed to delete table");
          fetchData();
        } catch (error) {
          console.error("Error deleting table:", error);
          alert("Failed to delete table");
        }
        setConfirmDialog({
          open: false,
          title: "",
          message: "",
          onConfirm: null,
        });
      },
    });
  };

  const handleToggleTableFull = async (table) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/set_table_full/${table.slug}`,
        {
          method: "POST",
          headers: { apiKey },
        },
      );

      if (!response.ok) throw new Error("Failed to toggle table status");
      fetchData();
    } catch (error) {
      console.error("Error toggling table status:", error);
      alert("Failed to toggle table status");
    }
  };

  const openPlayersModal = async (table) => {
    setSelectedTable(table);
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/get_players/${table.slug}`,
        {
          headers: { apiKey },
        },
      );

      if (response.ok) {
        const data = await response.json();
        // Merge all player lists, deduplicating by student_id
        const seen = new Set();
        const allPlayers = [];
        for (const list of [
          data.players,
          data.approved_players,
          data.backup_players,
          data.rejected_players,
        ]) {
          for (const p of list || []) {
            if (!seen.has(p.student_id)) {
              seen.add(p.student_id);
              allPlayers.push(p);
            }
          }
        }
        setPlayers(allPlayers);
        setIsPlayersModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      alert("Failed to fetch players");
    }
  };

  const getAllPlayers = (table) => {
    const seen = new Set();
    const result = [];
    // Show joined (pending) first, then approved, backup, rejected
    for (const list of [
      table.joined_players,
      table.approved_players,
      table.backup_players,
      table.rejected_players,
    ]) {
      for (const p of list || []) {
        if (!seen.has(p.student_id)) {
          seen.add(p.student_id);
          result.push(p);
        }
      }
    }
    return result;
  };

  const refreshPlayers = async (tableSlug) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/table/${tableSlug}`,
        {
          headers: { apiKey },
        },
      );
      if (response.ok) {
        const { data } = await response.json();
        setSelectedTable(data);
        setPlayers(getAllPlayers(data));
      }
    } catch (error) {
      console.error("Error refreshing players:", error);
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!selectedTable) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/add_player/${selectedTable.slug}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", apiKey },
          body: JSON.stringify({ ...newPlayer, table_id: selectedTable.slug }),
        },
      );

      if (!response.ok) throw new Error("Failed to add player");

      setNewPlayer({ name: "", student_id: "", contact: "" });
      refreshPlayers(selectedTable.slug);
    } catch (error) {
      console.error("Error adding player:", error);
      alert("Failed to add player");
    }
  };

  const handlePlayerAction = async (action, studentId) => {
    if (!selectedTable) return;

    const endpoints = {
      approve: `approve_player`,
      backup: `backup_player`,
      reject: `reject_player`,
    };

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/${endpoints[action]}/${selectedTable.slug}/${studentId}`,
        { method: "POST", headers: { apiKey } },
      );

      if (!response.ok) throw new Error(`Failed to ${action} player`);
      refreshPlayers(selectedTable.slug);
    } catch (error) {
      console.error(`Error ${action} player:`, error);
      alert(`Failed to ${action} player`);
    }
  };

  const handleDeletePlayer = async (studentId) => {
    if (!selectedTable) return;

    setConfirmDialog({
      open: true,
      title: "Remove Player",
      message: "Are you sure you want to remove this player from the table?",
      onConfirm: async () => {
        try {
          const response = await fetch(
            `${backendUrl}/api/admin/delete_player/${selectedTable.slug}/${studentId}`,
            { method: "DELETE", headers: { apiKey } },
          );

          if (!response.ok) throw new Error("Failed to delete player");
          refreshPlayers(selectedTable.slug);
        } catch (error) {
          console.error("Error deleting player:", error);
          alert("Failed to delete player");
        }
        setConfirmDialog({
          open: false,
          title: "",
          message: "",
          onConfirm: null,
        });
      },
    });
  };

  const handleDuplicateReject = async (player) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/reject_player/${player._tableSlug}/${player.student_id}`,
        { method: "POST", headers: { apiKey } },
      );
      if (!response.ok) throw new Error("Failed to reject player");
      setDuplicateGroups((prev) =>
        prev
          .map((group) => ({
            ...group,
            apps: group.apps.map((app) =>
              app._tableSlug === player._tableSlug &&
              app.student_id === player.student_id
                ? { ...app, _status: "rejected" }
                : app,
            ),
          }))
          .filter((group) => group.apps.length >= 2),
      );
      fetchData();
    } catch (error) {
      console.error("Error rejecting player:", error);
      alert("Failed to reject player");
    }
  };

  const handleDuplicateRemove = (player) => {
    setConfirmDialog({
      open: true,
      title: "Remove Player",
      message: `Are you sure you want to remove "${player.name}" from "${player._tableName}"?`,
      onConfirm: async () => {
        try {
          const response = await fetch(
            `${backendUrl}/api/admin/delete_player/${player._tableSlug}/${player.student_id}`,
            { method: "DELETE", headers: { apiKey } },
          );
          if (!response.ok) throw new Error("Failed to remove player");
          setDuplicateGroups((prev) =>
            prev
              .map((group) => ({
                ...group,
                apps: group.apps.filter(
                  (app) =>
                    !(
                      app._tableSlug === player._tableSlug &&
                      app.student_id === player.student_id
                    ),
                ),
              }))
              .filter((group) => group.apps.length >= 2),
          );
          fetchData();
        } catch (error) {
          console.error("Error removing player:", error);
          alert("Failed to remove player");
        }
        setConfirmDialog({
          open: false,
          title: "",
          message: "",
          onConfirm: null,
        });
      },
    });
  };

  const getPlayerStatus = (studentId) => {
    if (!selectedTable) return "pending";
    if (selectedTable.approved_players?.some((p) => p.student_id === studentId))
      return "approved";
    if (selectedTable.backup_players?.some((p) => p.student_id === studentId))
      return "backup";
    if (selectedTable.rejected_players?.some((p) => p.student_id === studentId))
      return "rejected";
    return "pending";
  };


  const handleHostRequestAction = async (eventSlug, studentId, action) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/admin/host-requests/${eventSlug}/${studentId}/${action}`,
        { method: "POST", headers: { apiKey } },
      );
      if (!res.ok) throw new Error(`Failed to ${action} request`);
      setHostRequests((prev) => ({
        ...prev,
        [eventSlug]: (prev[eventSlug] ?? []).map((r) =>
          r.student_id === studentId
            ? { ...r, status: action === "accept" ? "accepted" : "rejected" }
            : r,
        ),
      }));
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} request`);
    }
  };

  const handleAcceptApplication = async (app) => {
    const eventSlug = selectedApplicationsEvent.slug;
    try {
      const res = await fetch(
        `${backendUrl}/api/admin/host-requests/${eventSlug}/${app.student_id}/accept`,
        { method: "POST", headers: { apiKey } },
      );
      if (!res.ok) throw new Error("Failed to accept request");

      setHostRequests((prev) => ({
        ...prev,
        [eventSlug]: (prev[eventSlug] ?? []).map((r) =>
          r.student_id === app.student_id ? { ...r, status: "accepted" } : r,
        ),
      }));

      const matchedGame = app.game_id
        ? games.find((g) => g.id === app.game_id)
        : null;

      if (matchedGame) {
        setTableForm({
          game_name: matchedGame.name,
          game_master: app.game_master,
          player_quota: String(app.player_quota),
          language: app.language,
          game_id: matchedGame.id,
          game_image: matchedGame.image_url || "",
          game_play_time: matchedGame.avg_play_time || 0,
          game_guide_text: matchedGame.guide_text || "",
          game_guide_video: matchedGame.guide_video_url || "",
          theme_id: "default",
        });
        setSelectedGameId(matchedGame.id);
        setIsCustomGame(false);
      } else {
        setTableForm({
          game_name: app.game_name,
          game_master: app.game_master,
          player_quota: String(app.player_quota),
          language: app.language,
          game_id: null,
          game_image: "",
          game_play_time: 0,
          game_guide_text: "",
          game_guide_video: "",
          theme_id: "default",
        });
        setSelectedGameId("custom");
        setIsCustomGame(true);
      }

      setSelectedEvent(selectedApplicationsEvent);
      setIsApplicationsModalOpen(false);
      setIsCreateModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to accept request");
    }
  };

  const resetTableForm = () => {
    setTableForm({
      game_name: "",
      game_master: "",
      player_quota: "",
      language: "Turkish",
      game_id: null,
      game_image: "",
      game_play_time: 0,
      game_guide_text: "",
      game_guide_video: "",
      theme_id: "default",
    });
    setSelectedGameId("");
    setIsCustomGame(false);
  };

  const handleGameSelect = (gameId) => {
    setSelectedGameId(gameId);
    if (gameId === "custom") {
      setIsCustomGame(true);
      setTableForm({ ...tableForm, game_id: null, game_name: "" });
    } else {
      setIsCustomGame(false);
      const game = games.find((g) => g.id === gameId);
      if (game) {
        setTableForm({
          ...tableForm,
          game_name: game.name,
          game_id: game.id,
          game_image: game.image_url,
          game_play_time: game.avg_play_time,
          game_guide_text: game.guide_text,
          game_guide_video: game.guide_video_url,
        });
      }
    }
  };

  const ongoingEvents = events.filter(
    (e) => e.is_ongoing && e.event_type === "game",
  );
  const filteredEvents =
    selectedEventFilter === "all"
      ? ongoingEvents
      : ongoingEvents.filter((e) => e.slug === selectedEventFilter);

  const allTables = filteredEvents.flatMap((e) =>
    (e.tableDetails || []).map((t) => ({
      ...t,
      eventName: e.name,
      eventSlug: e.slug,
    })),
  );

  const stats = {
    total: allTables.length,
    open: allTables.filter((t) => !t.is_marked_full).length,
    full: allTables.filter((t) => t.is_marked_full).length,
    totalPlayers: allTables.reduce(
      (sum, t) => sum + (t.total_joined_players || 0),
      0,
    ),
    applications: Object.values(hostRequests).reduce(
      (sum, reqs) => sum + reqs.length,
      0,
    ),
  };

  const handleCheckDuplicates = () => {
    const groups = findDuplicatePlayers(ongoingEvents);
    setDuplicateGroups(groups);
    setIsDuplicatesModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-cinzel">
            Tables Management
          </h2>
          <p className="text-gray-400 text-sm">
            Manage game tables and players
          </p>
        </div>
        <div className="flex gap-2">
          <AdminButton
            onClick={() => fetchData({ showLoading: true, includeCatalog: true })}
            variant="secondary"
            icon={RefreshCw}
          >
            Refresh
          </AdminButton>
          <AdminButton
            onClick={handleCheckDuplicates}
            variant="secondary"
            icon={Copy}
            disabled={Object.keys(hostRequests).length === 0}
          >
            Duplicate Applicants
          </AdminButton>
          <AdminButton
            onClick={() => setIsCreateModalOpen(true)}
            icon={Plus}
            disabled={ongoingEvents.length === 0}
          >
            New Table
          </AdminButton>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-400 text-sm">Total Tables</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Unlock className="w-4 h-4 text-green-500" />
            <span className="text-gray-400 text-sm">Open</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{stats.open}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-red-500" />
            <span className="text-gray-400 text-sm">Full</span>
          </div>
          <p className="text-2xl font-bold text-red-400">{stats.full}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-gray-400 text-sm">Total Players</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {stats.totalPlayers}
          </p>
        </div>
        <div className="bg-gray-800/50 border border-purple-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400 text-sm">Applications</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">
            {stats.applications}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
          />
        </div>
        <select
          value={selectedEventFilter}
          onChange={(e) => setSelectedEventFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
        >
          <option value="all">All Events</option>
          {ongoingEvents.map((event) => (
            <option key={event.slug} value={event.slug}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      {filteredEvents.map((event) => (
        <div
          key={event.slug}
          className="bg-gray-800/30 border border-gray-700 rounded-xl p-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-yellow-500">
              {event.name}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedApplicationsEvent(event);
                  setIsApplicationsModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/40 hover:bg-purple-900/70 border border-purple-600/50 text-purple-300 rounded-lg text-sm transition-colors"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                Table Applications
                {(hostRequests[event.slug]?.length ?? 0) > 0 && (
                  <span className="ml-0.5 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {hostRequests[event.slug].length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {event.tableDetails?.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No tables for this event
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(event.tableDetails || [])
                .filter(
                  (t) =>
                    t.game_name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    t.game_master
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()),
                )
                .map((table) => (
                  <div
                    key={table.slug}
                    className={`border rounded-lg p-4 transition-all ${
                      table.is_marked_full
                        ? "border-red-500 bg-red-900/20"
                        : "border-green-500 bg-green-900/10"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4
                          className={`font-bold ${
                            table.is_marked_full
                              ? "text-red-400"
                              : "text-yellow-500"
                          }`}
                        >
                          {table.game_name}
                        </h4>
                        <p className="text-sm text-gray-400">
                          GM: {table.game_master}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-bold ${
                          table.is_marked_full
                            ? "bg-red-900/50 text-red-400 border border-red-500"
                            : "bg-green-900/50 text-green-400 border border-green-500"
                        }`}
                      >
                        {table.is_marked_full ? "FULL" : "OPEN"}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-300 mb-3">
                      <p>
                        Players: {table.total_joined_players} /{" "}
                        {table.player_quota}
                      </p>
                      <p>Language: {table.language}</p>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            table.is_marked_full
                              ? "bg-red-500"
                              : table.total_joined_players >= table.player_quota
                                ? "bg-amber-500"
                                : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (table.total_joined_players /
                                table.player_quota) *
                                100,
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <AdminButton
                        onClick={() => {
                          setSelectedTable(table);
                          setEditForm({
                            gameName: table.game_name,
                            gameMaster: table.game_master,
                            playerQuota: table.player_quota,
                            language: table.language,
                            themeId: table.theme_id || "default",
                          });
                          setIsEditModalOpen(true);
                        }}
                        variant="secondary"
                        size="sm"
                        icon={Edit3}
                      >
                        Edit
                      </AdminButton>
                      <AdminButton
                        onClick={() => openPlayersModal(table)}
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                      >
                        Players
                      </AdminButton>
                      <AdminButton
                        onClick={() => handleToggleTableFull(table)}
                        variant={table.is_marked_full ? "secondary" : "danger"}
                        size="sm"
                        icon={table.is_marked_full ? Unlock : Lock}
                      >
                        {table.is_marked_full ? "Reopen" : "Mark Full"}
                      </AdminButton>
                      <AdminButton
                        onClick={() => handleDeleteTable(table)}
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                      >
                        Delete
                      </AdminButton>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No ongoing game events found</p>
        </div>
      )}

      {/* Create Table Modal */}
      <AdminModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetTableForm();
          setSelectedEvent(null);
        }}
        title="Create New Table"
      >
        <form onSubmit={handleCreateTable} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Select Event
            </label>
            <select
              value={selectedEvent?.slug || ""}
              onChange={(e) =>
                setSelectedEvent(
                  ongoingEvents.find((ev) => ev.slug === e.target.value),
                )
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              required
            >
              <option value="">Select an event</option>
              {ongoingEvents.map((event) => (
                <option key={event.slug} value={event.slug}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Game
            </label>
            <select
              value={selectedGameId}
              onChange={(e) => handleGameSelect(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
            >
              <option value="">Select a game</option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
              <option value="custom">Custom Game</option>
            </select>
          </div>

          {isCustomGame && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Game Name
                </label>
                <input
                  type="text"
                  value={tableForm.game_name}
                  onChange={(e) =>
                    setTableForm({ ...tableForm, game_name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={tableForm.game_image}
                  onChange={(e) =>
                    setTableForm({ ...tableForm, game_image: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Game Master
            </label>
            <input
              type="text"
              value={tableForm.game_master}
              onChange={(e) =>
                setTableForm({ ...tableForm, game_master: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Player Quota
              </label>
              <input
                type="number"
                value={tableForm.player_quota}
                onChange={(e) =>
                  setTableForm({ ...tableForm, player_quota: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Language
              </label>
              <input
                type="text"
                value={tableForm.language}
                onChange={(e) =>
                  setTableForm({ ...tableForm, language: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Table Theme
            </label>
            <select
              value={tableForm.theme_id}
              onChange={(e) =>
                setTableForm({ ...tableForm, theme_id: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
            >
              <option value="default">Default</option>
              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <AdminButton
              type="submit"
              className="flex-1"
              disabled={!selectedEvent}
            >
              Create Table
            </AdminButton>
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetTableForm();
                setSelectedEvent(null);
              }}
            >
              Cancel
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      {/* Edit Table Modal */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTable(null);
        }}
        title={`Edit Table: ${selectedTable?.game_name || ""}`}
      >
        <form onSubmit={handleUpdateTable} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Game Name
            </label>
            <input
              type="text"
              value={editForm.gameName}
              onChange={(e) =>
                setEditForm({ ...editForm, gameName: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Game Master
            </label>
            <input
              type="text"
              value={editForm.gameMaster}
              onChange={(e) =>
                setEditForm({ ...editForm, gameMaster: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Player Quota
              </label>
              <input
                type="number"
                value={editForm.playerQuota}
                onChange={(e) =>
                  setEditForm({ ...editForm, playerQuota: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Language
              </label>
              <input
                type="text"
                value={editForm.language}
                onChange={(e) =>
                  setEditForm({ ...editForm, language: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Table Theme
            </label>
            <select
              value={editForm.themeId}
              onChange={(e) =>
                setEditForm({ ...editForm, themeId: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
            >
              <option value="default">Default</option>
              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <AdminButton type="submit" className="flex-1">
              Update Table
            </AdminButton>
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedTable(null);
              }}
            >
              Cancel
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      {/* Players Modal */}
      <AdminModal
        isOpen={isPlayersModalOpen}
        onClose={() => {
          setIsPlayersModalOpen(false);
          setSelectedTable(null);
          setPlayers([]);
        }}
        title={`Players - ${selectedTable?.game_name || ""}`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Add Player Form */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add New Player
            </h4>
            <form onSubmit={handleAddPlayer} className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Name"
                value={newPlayer.name}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, name: e.target.value })
                }
                className="flex-1 min-w-[150px] px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-yellow-500 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Student ID"
                value={newPlayer.student_id}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, student_id: e.target.value })
                }
                className="w-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-yellow-500 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Contact"
                value={newPlayer.contact}
                onChange={(e) =>
                  setNewPlayer({ ...newPlayer, contact: e.target.value })
                }
                className="flex-1 min-w-[150px] px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-yellow-500 focus:outline-none"
              />
              <AdminButton type="submit" size="sm" icon={Plus}>
                Add
              </AdminButton>
            </form>
          </div>

          {/* Players List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {players.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                No players registered
              </p>
            ) : (
              players.map((player) => {
                const status = getPlayerStatus(player.student_id);
                return (
                  <div
                    key={player.student_id}
                    className="bg-gray-800/50 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                  >
                    <div>
                      <p className="font-medium text-white">{player.name}</p>
                      <p className="text-sm text-gray-400">
                        ID: {player.student_id}{" "}
                        {player.contact && `| ${player.contact}`}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          status === "approved"
                            ? "bg-green-500/20 text-green-400"
                            : status === "backup"
                              ? "bg-yellow-900/30 text-yellow-300"
                              : status === "rejected"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <AdminButton
                        onClick={() =>
                          handlePlayerAction("approve", player.student_id)
                        }
                        variant="secondary"
                        size="sm"
                        disabled={status === "approved"}
                        icon={CheckCircle}
                      >
                        Approve
                      </AdminButton>
                      <AdminButton
                        onClick={() =>
                          handlePlayerAction("backup", player.student_id)
                        }
                        variant="secondary"
                        size="sm"
                        disabled={status === "backup"}
                      >
                        Backup
                      </AdminButton>
                      <AdminButton
                        onClick={() =>
                          handlePlayerAction("reject", player.student_id)
                        }
                        variant="secondary"
                        size="sm"
                        disabled={status === "rejected"}
                        icon={XCircle}
                      >
                        Reject
                      </AdminButton>
                      <AdminButton
                        onClick={() => handleDeletePlayer(player.student_id)}
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                      >
                        Remove
                      </AdminButton>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </AdminModal>

      {/* Table Applications Modal */}
      <AdminModal
        isOpen={isApplicationsModalOpen}
        onClose={() => {
          setIsApplicationsModalOpen(false);
          setSelectedApplicationsEvent(null);
        }}
        title={`Table Applications — ${selectedApplicationsEvent?.name ?? ""}`}
        size="lg"
      >
        {(() => {
          const apps =
            hostRequests[selectedApplicationsEvent?.slug] ?? [];
          if (apps.length === 0) {
            return (
              <div className="text-center py-12 text-gray-400">
                <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No hosting applications yet.</p>
              </div>
            );
          }
          return (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {apps.map((app, idx) => {
                const status = app.status ?? "pending";
                const borderColor =
                  status === "accepted"
                    ? "border-green-600/60 bg-green-900/10"
                    : status === "rejected"
                      ? "border-red-600/60 bg-red-900/10"
                      : "border-gray-700 bg-gray-800/60";
                const badgeColor =
                  status === "accepted"
                    ? "bg-green-900/50 text-green-300 border-green-600/40"
                    : status === "rejected"
                      ? "bg-red-900/50 text-red-300 border-red-600/40"
                      : "bg-purple-900/50 text-purple-300 border-purple-600/40";
                const waNumber = (app.whatsapp ?? "").replace(/\D/g, "");
                return (
                  <div
                    key={app._id ?? idx}
                    className={`border rounded-lg p-4 transition-colors ${borderColor}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-white">{app.game_name}</p>
                        <p className="text-sm text-gray-400">
                          GM: {app.game_master}
                        </p>
                      </div>
                      <span
                        className={`text-xs border px-2 py-0.5 rounded-full ${badgeColor}`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-sm text-gray-300 mb-3">
                      <p>
                        <span className="text-gray-500">Quota:</span>{" "}
                        {app.player_quota}
                      </p>
                      <p>
                        <span className="text-gray-500">Language:</span>{" "}
                        {app.language}
                      </p>
                      <p>
                        <span className="text-gray-500">Student ID:</span>{" "}
                        {app.student_id}
                      </p>
                      <p>
                        <span className="text-gray-500">WhatsApp:</span>{" "}
                        {app.whatsapp}
                      </p>
                      <p className="col-span-2 text-xs text-gray-500">
                        Submitted:{" "}
                        {app.submitted_at
                          ? new Date(app.submitted_at).toLocaleString()
                          : "—"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <AdminButton
                        onClick={() => handleAcceptApplication(app)}
                        size="sm"
                        icon={CheckCircle}
                        disabled={status === "accepted"}
                      >
                        Accept
                      </AdminButton>
                      <AdminButton
                        onClick={() =>
                          handleHostRequestAction(
                            selectedApplicationsEvent.slug,
                            app.student_id,
                            "reject",
                          )
                        }
                        variant="danger"
                        size="sm"
                        icon={XCircle}
                        disabled={status === "rejected"}
                      >
                        Reject
                      </AdminButton>
                      {waNumber && (
                        <a
                          href={`https://wa.me/${waNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-800/40 hover:bg-green-700/60 border border-green-600/50 text-green-300 rounded-lg text-sm transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Message on WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </AdminModal>

      {/* Duplicate Applicants Modal */}
      <AdminModal
        isOpen={isDuplicatesModalOpen}
        onClose={() => {
          setIsDuplicatesModalOpen(false);
          setDuplicateGroups([]);
        }}
        title="Duplicate Applicants — All Events"
        size="lg"
      >
        {duplicateGroups.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Copy className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No duplicates found.</p>
            <p className="text-sm mt-1 text-gray-500">
              All applicants have unique names and student IDs across every
              event.
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-1">
            <p className="text-sm text-gray-400">
              Found{" "}
              <span className="text-amber-400 font-semibold">
                {duplicateGroups.length}
              </span>{" "}
              duplicate group{duplicateGroups.length !== 1 ? "s" : ""} spanning{" "}
              {duplicateGroups.reduce((s, g) => s + g.apps.length, 0)}{" "}
              applications.
            </p>
            {duplicateGroups.map((group, gi) => (
              <div
                key={gi}
                className="border border-amber-700/40 bg-amber-900/10 rounded-xl p-4"
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Copy className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1.5">
                    {group.reasons.map((r, ri) => (
                      <span
                        key={ri}
                        className="text-xs text-amber-200 bg-amber-900/50 border border-amber-700/50 px-2 py-0.5 rounded-full"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                  <span className="ml-auto text-xs text-amber-500 bg-amber-900/40 border border-amber-700/40 px-2 py-0.5 rounded-full flex-shrink-0">
                    {group.apps.length} entries
                  </span>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-800/80 text-gray-400 text-xs uppercase tracking-wider">
                        <th className="text-left px-3 py-2">Event</th>
                        <th className="text-left px-3 py-2">Table</th>
                        <th className="text-left px-3 py-2">Player Name</th>
                        <th className="text-left px-3 py-2">Student ID</th>
                        <th className="text-left px-3 py-2">Contact</th>
                        <th className="text-left px-3 py-2">Status</th>
                        <th className="text-left px-3 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {group.apps.map((player, ai) => {
                        const statusColor =
                          player._status === "approved"
                            ? "text-green-400"
                            : player._status === "rejected"
                              ? "text-red-400"
                              : player._status === "backup"
                                ? "text-yellow-400"
                                : "text-blue-400";
                        return (
                          <tr
                            key={`${player._tableSlug}-${player.student_id}-${ai}`}
                            className="bg-gray-800/30 hover:bg-gray-800/60 transition-colors"
                          >
                            <td className="px-3 py-2 text-yellow-400/80 text-xs font-medium whitespace-nowrap">
                              {player._eventName}
                            </td>
                            <td className="px-3 py-2 text-gray-300 whitespace-nowrap">
                              {player._tableName}
                            </td>
                            <td className="px-3 py-2 text-white font-medium">
                              {player.name}
                            </td>
                            <td className="px-3 py-2 font-mono text-gray-300">
                              {player.student_id || "—"}
                            </td>
                            <td className="px-3 py-2 text-gray-300">
                              {player.contact || "—"}
                            </td>
                            <td className={`px-3 py-2 font-medium ${statusColor}`}>
                              {player._status}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="flex gap-1.5">
                                {player._status !== "rejected" && (
                                  <button
                                    onClick={() => handleDuplicateReject(player)}
                                    className="px-2 py-1 text-xs font-medium rounded border text-orange-300 bg-orange-900/30 border-orange-700/40 hover:bg-orange-900/60 transition-colors"
                                  >
                                    Reject
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDuplicateRemove(player)}
                                  className="px-2 py-1 text-xs font-medium rounded border text-red-300 bg-red-900/30 border-red-700/40 hover:bg-red-900/60 transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminModal>

      <ConfirmDialog
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() =>
          setConfirmDialog({
            open: false,
            title: "",
            message: "",
            onConfirm: null,
          })
        }
      />
    </div>
  );
};

export default TablesAdminPanel;
