import React, { useState, useEffect, useRef } from "react";
import { config } from "../config";
import { FaArrowRightFromBracket as LogoutIcon } from "react-icons/fa6";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [updateData, setUpdateData] = useState({
    playerQuota: "",
    totalJoined: "",
    gameMaster: "",
    gameName: "",
  });
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isCreateTableModalOpen, setIsCreateTableModalOpen] = useState(false);
  const [isPlayersModalOpen, setIsPlayersModalOpen] = useState(false);
  const [isEditingTableModalOpen, setIsEditingTableModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });
  const [newTable, setNewTable] = useState({
    game_name: "",
    game_master: "",
    player_quota: "",
    language: "Turkish",
    game_id: null,
    game_image: "",
    game_play_time: 0,
    game_guide_text: "",
    game_guide_video: "",
  });
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    student_id: "",
    table_id: "",
    contact: "",
  });
  const [isGeneratingTable, setIsGeneratingTable] = useState(false);
  const backendUrl = config.backendUrl; //http://localhost:8000 or https://api.emurpg.com
  const API_KEY = localStorage.getItem("apiKey");
  const [ws, setWs] = useState(null); // WebSocket state to manage connection
  const wsConnected = useRef(false); // Ref to track WebSocket connection status
  const wsConnectionAttempted = useRef(false);
  const [playerWs, setPlayerWs] = useState(null);
  const playerWsConnected = useRef(false);
  const playerWsConnectionAttempted = useRef(false);
  const [eventsWithTables, setEventsWithTables] = useState([]);
  const [isEditingEventModalOpen, setIsEditingEventModalOpen] = useState(false);
  const [eventUpdateData, setEventUpdateData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });
  // Add state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportLanguage, setReportLanguage] = useState("en");
  const [showGameFormModal, setShowGameFormModal] = useState(false);
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState("");
  const [isCustomGame, setIsCustomGame] = useState(false);
  const [newGame, setNewGame] = useState({
    id: "",
    name: "",
    avg_play_time: 0,
    min_players: 1,
    max_players: 8,
    image_url: "",
    guide_text: "",
    guide_video_url: "",
  });
  const [isGameListModalOpen, setIsGameListModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading events...");
  const [loadingRetryCount, setLoadingRetryCount] = useState(0);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/games`, {
          headers: { apiKey: API_KEY },
        });
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  // Player WebSocket connection
  useEffect(() => {
    const connectPlayerWebSocket = () => {
      if (!selectedTable || !isPlayersModalOpen) return null;

      const socket = new WebSocket(`${backendUrl}/ws/updates`);

      socket.onopen = () => {
        console.log("Player WebSocket connected");
        playerWsConnected.current = true;
      };

      socket.onmessage = (event) => {
        console.log("Received message from Player WebSocket", event.data);
        if (playerWsConnected.current) {
          // Fetch updated player list
          fetchPlayers(selectedTable.slug);
        }
      };

      socket.onclose = () => {
        console.log("Player WebSocket disconnected");
        playerWsConnected.current = false;
      };

      socket.onerror = (error) => {
        console.log("Player WebSocket error:", error);
        playerWsConnected.current = false;
      };

      return socket;
    };

    // Create a function to fetch players
    const fetchPlayers = async (tableSlug) => {
      try {
        const response = await fetch(
          `${backendUrl}/api/admin/table/${tableSlug}`,
          {
            headers: {
              "Content-Type": "application/json",
              apiKey: API_KEY,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch table details");
        const data = await response.json();
        setSelectedTable(data.data);
        setPlayers(data.data.joined_players || []);
      } catch (error) {
        console.error("Error fetching table details:", error);
      }
    };

    // Connect player WebSocket when modal opens
    if (
      isPlayersModalOpen &&
      selectedTable &&
      !playerWsConnectionAttempted.current
    ) {
      const socket = connectPlayerWebSocket();
      setPlayerWs(socket);
      playerWsConnectionAttempted.current = true;
      // Initial fetch of players
      fetchPlayers(selectedTable.slug);
    }

    // Cleanup function
    return () => {
      if (playerWs) {
        playerWs.close();
        setPlayerWs(null);
        playerWsConnected.current = false;
        playerWsConnectionAttempted.current = false;
      }
    };
  }, [isPlayersModalOpen, selectedTable]);

  useEffect(() => {
    const fetchAndUpdateEvents = async (retryCount = 0, maxRetries = 5) => {
      setIsLoading(true);
      if (retryCount > 0) {
        setLoadingRetryCount(retryCount);
        setLoadingMessage(
          `Loading events... (Attempt ${retryCount + 1}/${maxRetries})`
        );
      }
      try {
        const response = await fetchWithTimeout(
          `${backendUrl}/api/admin/events`,
          { headers: { apiKey: API_KEY } },
          60000 // 60 seconds timeout
        );

        if (!response.ok)
          throw new Error(`Error fetching events: ${response.status}`);

        const events = await response.json();
        const withTableDetails = await Promise.all(
          events.map(async (event) => {
            const tableDetails = await Promise.all(
              event.tables.map((tableSlug) => fetchTableDetails(tableSlug))
            );
            return {
              ...event,
              tableDetails: tableDetails.filter((table) => table !== null),
            };
          })
        );
        setEventsWithTables(withTableDetails);
        setIsLoading(false);
        setLoadingRetryCount(0);
      } catch (error) {
        console.error(
          `Error fetching events (attempt ${retryCount + 1}/${maxRetries}):`,
          error
        );

        // Add more aggressive retry logic with exponential backoff
        if (retryCount < maxRetries) {
          const delay = 2000 * Math.pow(2, retryCount); // Exponential backoff: 2s, 4s, 8s, 16s, 32s
          console.log(`Retrying in ${delay / 1000} seconds...`);
          setTimeout(
            () => fetchAndUpdateEvents(retryCount + 1, maxRetries),
            delay
          );
        } else {
          // Only show failure message after all retries are exhausted
          setIsLoading(false);
          alert(
            "Failed to load events after multiple attempts. Please check your connection and try again."
          );
        }
      }
    };

    const connectEventWebSocket = () => {
      try {
        const socket = new WebSocket(`${backendUrl}/ws/updates`);

        socket.onopen = () => {
          console.log("Events WebSocket connected");
          wsConnected.current = true;
        };

        socket.onmessage = () => {
          if (wsConnected.current) {
            fetchAndUpdateEvents();
          }
        };

        socket.onclose = () => {
          console.log("Events WebSocket disconnected");
          wsConnected.current = false;
          setTimeout(() => {
            if (!wsConnected.current) connectEventWebSocket();
          }, 3000);
        };

        return socket;
      } catch (error) {
        console.error("WebSocket connection error:", error);
        return null;
      }
    };

    // Initial fetch
    fetchAndUpdateEvents();

    // Connect WebSocket
    const socket = connectEventWebSocket();
    if (socket) setWs(socket);

    return () => {
      if (ws) ws.close();
    };
  }, [backendUrl, API_KEY]);

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setIsEditingTableModalOpen(true);
    setUpdateData({
      playerQuota: table.player_quota,
      totalJoined: table.total_joined_players,
      gameMaster: table.game_master,
      gameName: table.game_name,
      language: table.language,
    });
  };

  const handleApprovePlayer = async (studentId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/approve_player/${selectedTable.slug}/${studentId}`,
        {
          method: "POST",
          headers: { apiKey: API_KEY },
        }
      );

      if (!response.ok) throw new Error("Failed to approve player");
      alert("Player approved successfully!");
    } catch (error) {
      console.error("Error approving player:", error);
      alert("Failed to approve player");
    }
  };

  const handleBackupPlayer = async (studentId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/backup_player/${selectedTable.slug}/${studentId}`,
        {
          method: "POST",
          headers: { apiKey: API_KEY },
        }
      );

      if (!response.ok) throw new Error("Failed to set player as backup");
      alert("Player added to backup successfully!");
    } catch (error) {
      console.error("Error setting player as backup:", error);
      alert("Failed to set player as backup");
    }
  };

  const handleRejectPlayer = async (studentId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/reject_player/${selectedTable.slug}/${studentId}`,
        {
          method: "POST",
          headers: { apiKey: API_KEY },
        }
      );

      if (!response.ok) throw new Error("Failed to reject player");
      alert("Player rejected successfully!");
    } catch (error) {
      console.error("Error rejecting player:", error);
      alert("Failed to reject player");
    }
  };

  const handleUpdateTable = async (e) => {
    e.preventDefault();
    if (!selectedTable) return;

    const updated_table = JSON.stringify({
      game_name: updateData.gameName,
      game_master: updateData.gameMaster,
      player_quota: updateData.playerQuota,
      total_joined_players: updateData.totalJoined,
      joined_players: selectedTable.joined_players,
      slug: selectedTable.slug,
      language: updateData.language,
      created_at: selectedTable.created_at,
    });

    const response = await fetch(
      `${backendUrl}/api/admin/table/${selectedTable.slug}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: API_KEY,
        },
        body: updated_table,
      }
    );

    if (response.ok) {
      alert("Table updated successfully!");
      setSelectedTable(null);
      const newTablesResponse = await fetch(`${backendUrl}/api/tables`);
      const newTablesData = await newTablesResponse.json();
      setTables(newTablesData);
    } else {
      alert("Failed to update table.");
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/events/${selectedEvent.slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            apiKey: API_KEY,
          },
          body: JSON.stringify(eventUpdateData),
        }
      );

      if (!response.ok) throw new Error("Failed to update event");

      alert("Event updated successfully!");
      setIsEditingEventModalOpen(false);
      const updatedEvents = await fetch(`${backendUrl}/api/admin/events`, {
        headers: { apiKey: API_KEY },
      }).then((res) => res.json());
      setEvents(updatedEvents);
    } catch (error) {
      alert("Failed to update event");
    }
  };

  const handleDeleteTable = async (slug) => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/table/${slug}`, {
        method: "DELETE",
        headers: { apiKey: API_KEY },
      });

      if (!response.ok) throw new Error("Failed to delete table");

      const updatedEventsResponse = await fetch(
        `${backendUrl}/api/admin/events`,
        {
          headers: { apiKey: API_KEY },
        }
      );

      if (!updatedEventsResponse.ok)
        throw new Error("Failed to fetch updated events");

      const updatedEvents = await updatedEventsResponse.json();
      const withTableDetails = await Promise.all(
        updatedEvents.map(async (event) => {
          const tableDetails = await Promise.all(
            event.tables.map((tableSlug) => fetchTableDetails(tableSlug))
          );
          return {
            ...event,
            tableDetails: tableDetails.filter((table) => table !== null),
          };
        })
      );

      setEventsWithTables(withTableDetails);
      alert("Table deleted successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete table");
    }
  };

  const handleGenerateTableImage = async () => {
    setIsGeneratingTable(true);
    try {
      // First, validate that we have tables data
      if (!tables || tables.length === 0) {
        throw new Error("No tables available to generate image");
      }

      // Convert tables data to the required format with proper validation
      const formattedData = tables
        .map((table) => {
          // Ensure joined_players exists and is an array
          const joinedPlayers = Array.isArray(table.joined_players)
            ? table.joined_players
            : [];

          // Create the game master entry
          const gameMasterEntry = {
            name: table.game_master || "Unknown GM",
            is_manager: 1,
            manager_name: "",
            game_played: table.game_name || "Unknown Game",
          };

          // Create player entries with validation
          const playerEntries = joinedPlayers.map((player) => ({
            name: player.name || "Unknown Player",
            is_manager: 0,
            manager_name: table.game_master || "Unknown GM",
            game_played: "",
          }));

          // Return both GM and players in an array
          return [gameMasterEntry, ...playerEntries];
        })
        .flat();

      // Validate the formatted data
      if (formattedData.length === 0) {
        throw new Error("No valid data to generate table layout");
      }

      // Generate CSV content
      const csvContent = generateCSVContent(formattedData);

      // Validate CSV content
      if (!csvContent) {
        throw new Error("Failed to generate CSV content");
      }

      const csvFile = new File([csvContent], "tables.csv", {
        type: "text/csv",
      });
      const formData = new FormData();
      formData.append("file", csvFile, "tables.csv");

      const response = await fetch(`${backendUrl}/api/admin/generate-tables`, {
        method: "POST",
        headers: {
          apiKey: API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          JSON.stringify(errorData.detail) || "Failed to generate table layout"
        );
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = imageUrl;
      a.download = "table_layout.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(imageUrl);
    } catch (error) {
      console.error("Table generation error:", error);
      alert(`Failed to generate table layout: ${error.message}`);
    } finally {
      setIsGeneratingTable(false);
    }
  };

  const fetchWithTimeout = async (url, options, timeout = 30000) => {
    // 30 seconds timeout
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  const handleGenerateEventTableImage = async (event) => {
    setIsGeneratingTable(true);
    try {
      if (!event.tableDetails?.length)
        throw new Error("No tables in this event");

      const formattedData = event.tableDetails
        .map((table) => ({
          name: table.game_master,
          is_manager: 1,
          manager_name: "",
          game_played: table.game_name,
          player_quota: table.player_quota,
          joined_players:
            table.joined_players?.map((player) => ({
              name: player.name,
              is_manager: 0,
              manager_name: table.game_master,
            })) || [],
        }))
        .flat();

      const csvContent = generateEventCSVContent(formattedData);
      if (!csvContent) throw new Error("Failed to generate CSV");

      const csvFile = new File([csvContent], "tables.csv", {
        type: "text/csv",
      });
      const formData = new FormData();
      formData.append("file", csvFile);

      const response = await fetch(`${backendUrl}/api/admin/generate-tables`, {
        method: "POST",
        headers: { apiKey: API_KEY },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to generate layout");

      const blob = await response.blob();
      downloadImage(blob, "table_layout.png");
    } catch (error) {
      alert(`Failed to generate: ${error.message}`);
    } finally {
      setIsGeneratingTable(false);
    }
  };

  const generateEventCSVContent = (data) => {
    if (!Array.isArray(data) || !data.length) return null;

    const csvRows = [
      [
        "isim",
        "yonetici_mi",
        "birlikte_oynadigi_yonetici",
        "oynattigi_oyun",
        "player_quota",
      ],
    ];

    data.forEach((table) => {
      csvRows.push([
        table.name,
        "1",
        "",
        table.game_played,
        table.player_quota,
      ]);

      table.joined_players?.forEach((player) =>
        csvRows.push([player.name, "0", table.name, "", ""])
      );
    });

    return csvRows
      .map((row) =>
        row.map((cell) => `"${(cell || "").toString().replace(/"/g, '""')}"`)
      )
      .join("\n");
  };

  const generateEventReport = (event) => {
    const tables = event.tableDetails || [];
    const report = [
      ["Event Report"],
      [`Event Name: ${event.name}`],
      [
        `Event Period: ${new Date(
          event.start_date
        ).toLocaleDateString()} - ${new Date(
          event.end_date
        ).toLocaleDateString()}`,
      ],
      [`Status: ${event.is_ongoing ? "Ongoing" : "Finished"}`],
      [""],
      ["Table Statistics"],
      ["Game Name", "Game Master", "Players", "Quota", "Fill Rate (%)"],
    ];

    tables.forEach((table) => {
      const fillRate = (
        (table.total_joined_players / table.player_quota) *
        100
      ).toFixed(1);
      report.push([
        table.game_name,
        table.game_master,
        table.total_joined_players.toString(),
        table.player_quota.toString(),
        fillRate,
      ]);
    });

    const totalPlayers = tables.reduce(
      (sum, t) => sum + t.total_joined_players,
      0
    );
    const totalQuota = tables.reduce(
      (sum, t) => sum + parseInt(t.player_quota || 0),
      0
    );
    const overallFillRate = totalQuota
      ? ((totalPlayers / totalQuota) * 100).toFixed(1)
      : "0.0";

    report.push(
      [""],
      ["Summary"],
      [`Total Tables: ${tables.length}`],
      [`Total Players: ${totalPlayers}`],
      [`Overall Capacity: ${totalQuota}`],
      [`Overall Fill Rate: ${overallFillRate}%`]
    );

    const csv = report
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    downloadCSV(csv, `${event.name}_report.csv`);
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCSVContent = (data) => {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid data format for CSV generation");
      }

      const csvRows = [
        [
          "isim",
          "yonetici_mi",
          "birlikte_oynadigi_yonetici",
          "oynattigi_oyun",
          "player_quota",
        ],
      ];

      data.forEach((table) => {
        // Add game master entry
        csvRows.push([
          table.game_master,
          "1",
          "",
          table.game_name,
          table.player_quota,
        ]);

        // Add players
        if (Array.isArray(table.joined_players)) {
          table.joined_players.forEach((player) => {
            csvRows.push([player.name, "0", table.game_master, "", ""]);
          });
        }
      });

      return csvRows
        .map((row) =>
          row
            .map((cell) => `"${(cell || "").toString().replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");
    } catch (error) {
      console.error("Error generating CSV content:", error);
      return null;
    }
  };

  const convertToCSV = (l_tables) => {
    const headers =
      "isim,yonetici_mi,birlikte_oynadigi_yonetici,oynattigi_oyun\n";
    const players = [];
    l_tables.forEach((table) => {
      players.push({
        name: table.game_master,
        isGameMaster: 1,
        gameMaster: "",
        gameName: table.game_name,
      });

      table.joined_players.forEach((player) => {
        players.push({
          name: player.name,
          isGameMaster: 0,
          gameMaster: table.game_master,
          gameName: "",
        });
      });
    });

    const rows = players
      .map((player) => {
        return `${player.name},${player.isGameMaster},${player.gameMaster},${player.gameName}`;
      })
      .join("\n");

    return headers + rows;
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const response = await fetch(`${backendUrl}/api/admin/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apiKey: API_KEY },
      body: JSON.stringify(newEvent),
    });

    if (response.ok) {
      alert("Event created successfully!");
      setIsCreateEventModalOpen(false);
      setNewEvent({ name: "", description: "", start_date: "", end_date: "" });
      const updatedEventsResponse = await fetch(
        `${backendUrl}/api/admin/events`,
        {
          headers: { apiKey: API_KEY },
        }
      );
      const updatedEvents = await updatedEventsResponse.json();
      setEvents(updatedEvents);
    } else {
      alert("Failed to create event.");
    }
  };

  const handleFinishEvent = async (slug) => {
    const response = await fetch(
      `${backendUrl}/api/admin/events/${slug}/finish`,
      {
        method: "PUT",
        headers: { apiKey: API_KEY },
      }
    );

    if (response.ok) {
      alert("Event finished successfully!");
      const updatedEventsResponse = await fetch(
        `${backendUrl}/api/admin/events`,
        {
          headers: { apiKey: API_KEY },
        }
      );
      const updatedEvents = await updatedEventsResponse.json();
      setEvents(updatedEvents);
    } else {
      alert("Failed to finish event.");
    }
  };

  const handleDeleteEvent = async (slug) => {
    const response = await fetch(`${backendUrl}/api/admin/events/${slug}`, {
      method: "DELETE",
      headers: { apiKey: API_KEY },
    });

    if (response.ok) {
      alert("Event deleted successfully!");
      const updatedEventsResponse = await fetch(
        `${backendUrl}/api/admin/events`,
        {
          headers: { apiKey: API_KEY },
        }
      );
      const updatedEvents = await updatedEventsResponse.json();
      setEvents(updatedEvents);
    } else {
      alert("Failed to delete event.");
    }
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const response = await fetch(
      `${backendUrl}/api/admin/create_table/${selectedEvent.slug}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", apiKey: API_KEY },
        body: JSON.stringify(newTable),
      }
    );

    if (response.ok) {
      alert("Table created successfully!");
      setIsCreateTableModalOpen(false);
      setNewTable({ game_name: "", game_master: "", player_quota: "" });
      const updatedEventsResponse = await fetch(
        `${backendUrl}/api/admin/events`,
        {
          headers: { apiKey: API_KEY },
        }
      );
      const updatedEvents = await updatedEventsResponse.json();
      setEvents(updatedEvents);
    } else {
      alert("Failed to create table.");
    }
  };

  const handleShowPlayersModal = async (tableSlug) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/get_players/${tableSlug}`,
        {
          headers: {
            "Content-Type": "application/json",
            apiKey: API_KEY,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch players");

      const data = await response.json();
      setPlayers(data.players || []);
      setIsPlayersModalOpen(true);
      // Reset player WebSocket connection state
      playerWsConnectionAttempted.current = false;
    } catch (error) {
      console.error("Error fetching players:", error);
      alert("Failed to fetch players");
    }
  };

  const handleClosePlayersModal = () => {
    if (playerWs) {
      playerWs.close();
      setPlayerWs(null);
      playerWsConnected.current = false;
      playerWsConnectionAttempted.current = false;
    }
    setIsPlayersModalOpen(false);
    setSelectedTable(null);
  };

  const handleGenerateReport = async (type) => {
    setIsGeneratingReport(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: API_KEY,
        },
        body: JSON.stringify({
          type,
          language: reportLanguage,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate report");

      const data = await response.json();

      const blob = new Blob([data.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `event_report_${type}_${reportLanguage}_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setIsReportModalOpen(false);
    } catch (error) {
      alert("Failed to generate report");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!selectedTable) return;

    try {
      const playerData = {
        ...newPlayer,
        table_id: selectedTable.slug,
      };

      const response = await fetch(
        `${backendUrl}/api/admin/add_player/${selectedTable.slug}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey: API_KEY,
          },
          body: JSON.stringify(playerData),
        }
      );

      if (!response.ok) throw new Error("Failed to add player");

      alert("Player added successfully!");
      setNewPlayer({
        name: "",
        student_id: "",
        table_id: "",
        contact: "",
      });
      // WebSocket will handle the update
    } catch (error) {
      console.error("Error adding player:", error);
      alert("Failed to add player");
    }
  };

  const handleUpdatePlayer = async (e) => {
    e.preventDefault();
    if (!selectedTable || !selectedPlayer) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/update_player/${selectedTable.slug}/${selectedPlayer.student_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            apiKey: API_KEY,
          },
          body: JSON.stringify(selectedPlayer),
        }
      );

      if (!response.ok) throw new Error("Failed to update player");

      alert("Player updated successfully!");
      setSelectedPlayer(null);
      // WebSocket will handle the update
    } catch (error) {
      console.error("Error updating player:", error);
      alert("Failed to update player");
    }
  };

  const handleDeletePlayer = async (studentId) => {
    if (!selectedTable) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/delete_player/${selectedTable.slug}/${studentId}`,
        {
          method: "DELETE",
          headers: {
            apiKey: API_KEY,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete player");

      alert("Player deleted successfully!");
      // WebSocket will handle the update
    } catch (error) {
      console.error("Error deleting player:", error);
      alert("Failed to delete player");
    }
  };

  const downloadImage = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem("apiKey");
    window.location.reload();
  };

  const fetchTableDetails = async (
    tableSlug,
    retryCount = 0,
    maxRetries = 5
  ) => {
    try {
      const response = await fetchWithTimeout(
        `${backendUrl}/api/admin/table/${tableSlug}`,
        { headers: { apiKey: API_KEY } },
        30000 // 30 seconds timeout
      );

      if (!response.ok) throw new Error("Failed to fetch table");
      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error(
        `Error fetching table ${tableSlug} (attempt ${
          retryCount + 1
        }/${maxRetries}):`,
        error
      );

      if (retryCount < maxRetries) {
        const delay = 1000 * Math.pow(1.5, retryCount); // Different backoff: 1s, 1.5s, 2.25s, 3.4s, 5s
        await new Promise((r) => setTimeout(r, delay));
        return fetchTableDetails(tableSlug, retryCount + 1, maxRetries);
      }
      return null;
    }
  };

  const getPlayerStatus = (studentId) => {
    if (!selectedTable) return null;

    // Check arrays in selectedTable
    const isApproved = selectedTable.approved_players?.some(
      (p) => p.student_id === studentId
    );
    const isBackup = selectedTable.backup_players?.some(
      (p) => p.student_id === studentId
    );
    const isRejected = selectedTable.rejected_players?.some(
      (p) => p.student_id === studentId
    );

    if (isApproved) return "approved";
    if (isBackup) return "backup";
    if (isRejected) return "rejected";
    return "pending"; // Default status for new registrations
  };

  const handleCreateGame = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/admin/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: API_KEY,
        },
        body: JSON.stringify(newGame),
      });

      if (response.ok) {
        alert("Game created successfully!");
        setShowGameFormModal(false);
        setNewGame({
          id: "",
          name: "",
          avg_play_time: 0,
          min_players: 1,
          max_players: 8,
          image_url: "",
          guide_text: "",
          guide_video_url: "",
        });

        // Fetch updated game list
        const updatedResponse = await fetch(`${backendUrl}/api/games`, {
          headers: { apiKey: API_KEY },
        });
        const updatedData = await updatedResponse.json();
        setGames(updatedData);
      } else {
        alert("Failed to create game");
      }
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Error creating game");
    }
  };

  return (
    <div className="admin-dashboard grid text-center w-screen">
      <button
        onClick={handleLogout}
        className="absolute top-4 left-4 text-yellow-500 hover:text-yellow-300 bg-gray-800 rounded px-3 py-1"
      >
        <LogoutIcon className="inline-block rotate-180" />
      </button>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border-2 border-yellow-600 p-6 rounded-lg shadow-lg text-center max-w-md">
            <div className="mx-auto mb-5 w-16 h-16 relative">
              {/* Medieval-style hourglass animation instead of spinner */}
              <svg
                className="animate-pulse"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C8 2 4 3 4 6V10C4 12 7 14 10 15C7 16 4 18 4 20V22H20V20C20 18 17 16 14 15C17 14 20 12 20 10V6C20 3 16 2 12 2Z"
                  fill="#D4AF37"
                  stroke="#FFF"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-yellow-500 font-serif">
              {loadingMessage}
            </p>
            {loadingRetryCount > 0 && (
              <p className="text-yellow-300 mt-3 italic text-sm">
                The scrolls are taking time to unfurl. Please await the royal
                data...
              </p>
            )}
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold text-yellow-500 mb-4 py-4">
        Admin Dashboard
      </h1>

      {/* Events List */}
      <div className="events-list grid grid-cols-1 gap-4 mx-auto w-screen px-4 sm:px-10 mb-8">
        {eventsWithTables.map((event) => (
          <div key={event.slug} className="event-item border p-4 mb-2">
            <div className="event-header flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-xl font-bold text-yellow-500">
                  {event.name}
                </h2>
                <p className="text-sm text-gray-400">{event.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.is_ongoing && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsCreateTableModalOpen(true);
                      }}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Add Table
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setEventUpdateData({
                          name: event.name,
                          description: event.description,
                          start_date: event.start_date,
                          end_date: event.end_date,
                        });
                        setIsEditingEventModalOpen(true);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit Event
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            `${backendUrl}/api/admin/events/${event.slug}/announcement`,
                            {
                              headers: { apiKey: API_KEY },
                            }
                          );
                          if (!response.ok)
                            throw new Error("Failed to generate announcement");

                          const blob = await response.blob();
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = `${event.name}_announcement.png`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          URL.revokeObjectURL(url);
                        } catch (error) {
                          alert("Failed to generate announcement image");
                        }
                      }}
                      className="bg-cyan-600 text-white px-3 py-1 rounded"
                    >
                      Generate Announcement
                    </button>
                    <button
                      onClick={() => generateEventReport(event)}
                      className="bg-purple-600 text-white px-3 py-1 rounded"
                    >
                      Generate Report
                    </button>
                    <button
                      onClick={() => handleFinishEvent(event.slug)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Finish Event
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.slug)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete Event
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="event-info grid grid-cols-3 gap-4 mb-4">
              <div className="text-left">
                <p className="text-gray-400">Start Date:</p>
                <p>{new Date(event.start_date).toLocaleDateString()}</p>
              </div>
              <div className="text-left">
                <p className="text-gray-400">End Date:</p>
                <p>{new Date(event.end_date).toLocaleDateString()}</p>
              </div>
              <div className="text-left">
                <p className="text-gray-400">Status:</p>
                <p
                  className={
                    event.is_ongoing ? "text-green-500" : "text-red-500"
                  }
                >
                  {event.is_ongoing ? "Ongoing" : "Finished"}
                </p>
              </div>
            </div>
            {/* Tables List */}
            <div className="tables-list mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {event.tableDetails?.map((table) => (
                <div
                  key={table.slug}
                  className="table-item border p-4 rounded-lg"
                >
                  <h3 className="font-bold text-yellow-500">
                    {table.game_name}
                  </h3>
                  <p className="text-sm">GM: {table.game_master}</p>
                  <p className="text-sm">
                    Applied Players: {table.total_joined_players}
                  </p>
                  <p className="text-sm">Player Quota: {table.player_quota}</p>
                  <p className="text-sm">Language: {table.language}</p>
                  <p className="text-xs text-gray-500">ID: {table.slug}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedTable(table);
                        setUpdateData({
                          gameName: table.game_name,
                          gameMaster: table.game_master,
                          playerQuota: table.player_quota,
                          totalJoined: table.total_joined_players,
                        });
                        setIsEditingTableModalOpen(true);
                      }}
                      className="bg-blue-600 text-white px-2 py-1 text-xs sm:text-sm rounded flex-grow sm:flex-grow-0"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        // Close any existing WebSocket connection before opening a new one
                        if (playerWs) {
                          playerWs.close();
                          setPlayerWs(null);
                          playerWsConnected.current = false;
                          playerWsConnectionAttempted.current = false;
                        }
                        setSelectedTable(table);
                        handleShowPlayersModal(table.slug);
                      }}
                      className="bg-purple-600 text-white px-2 py-1 text-xs sm:text-sm rounded flex-grow sm:flex-grow-0"
                    >
                      Players
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            `${backendUrl}/api/admin/set_table_full/${table.slug}`,
                            {
                              method: "POST",
                              headers: { apiKey: API_KEY },
                            }
                          );

                          if (!response.ok)
                            throw new Error("Failed to mark table as full");
                          alert("Table marked as full successfully!");
                        } catch (error) {
                          console.error("Error marking table as full:", error);
                          alert("Failed to mark table as full");
                        }
                      }}
                      className="bg-amber-600 text-white px-2 py-1 text-xs sm:text-sm rounded flex-grow sm:flex-grow-0"
                    >
                      Full
                    </button>
                    <button
                      onClick={() => handleDeleteTable(table.slug)}
                      className="bg-red-600 text-white px-2 py-1 text-xs sm:text-sm rounded flex-grow sm:flex-grow-0"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Global Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mt-4 px-2">
        <button
          onClick={() => setShowGameFormModal(true)}
          className="bg-lime-600 text-white px-3 py-2 text-sm sm:text-base sm:px-4 rounded flex-1 sm:flex-none min-w-0"
        >
          Add Game
        </button>
        <button
          onClick={() => setIsCreateEventModalOpen(true)}
          className="bg-green-500 text-white px-3 py-2 text-sm sm:text-base sm:px-5 rounded flex-1 sm:flex-none min-w-0"
        >
          New Event
        </button>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="bg-blue-500 text-white px-3 py-2 text-sm sm:text-base sm:px-5 rounded flex-1 sm:flex-none min-w-0"
        >
          Reports
        </button>
        <button
          onClick={() => setIsGameListModalOpen(true)}
          className="bg-violet-500 text-white px-3 py-2 text-sm sm:text-base sm:px-5 rounded flex-1 sm:flex-none min-w-0"
        >
          Games
        </button>
      </div>
      {/* Game Creation Modal */}
      {showGameFormModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-75 rounded-lg p-8 w-96 relative">
            <button
              onClick={() => setShowGameFormModal(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300 text-xl"
            >
              ×
            </button>
            <h2 className="text-lg font-bold text-yellow-500 mb-4">
              Add New Game
            </h2>
            <form onSubmit={handleCreateGame}>
              <div className="mb-4">
                <label className="block text-white mb-2">Game ID:</label>
                <input
                  type="text"
                  value={newGame.id}
                  onChange={(e) =>
                    setNewGame({ ...newGame, id: e.target.value })
                  }
                  placeholder="e.g., dnd-5e, catan"
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Game Name:</label>
                <input
                  type="text"
                  value={newGame.name}
                  onChange={(e) =>
                    setNewGame({ ...newGame, name: e.target.value })
                  }
                  placeholder="e.g., Dungeons & Dragons"
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">
                  Avg. Play Time (min):
                </label>
                <input
                  type="number"
                  value={newGame.avg_play_time}
                  onChange={(e) =>
                    setNewGame({
                      ...newGame,
                      avg_play_time: parseInt(e.target.value),
                    })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Min Players:</label>
                <input
                  type="number"
                  value={newGame.min_players}
                  onChange={(e) =>
                    setNewGame({
                      ...newGame,
                      min_players: parseInt(e.target.value),
                    })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Max Players:</label>
                <input
                  type="number"
                  value={newGame.max_players}
                  onChange={(e) =>
                    setNewGame({
                      ...newGame,
                      max_players: parseInt(e.target.value),
                    })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Image URL:</label>
                <input
                  type="text"
                  value={newGame.image_url}
                  onChange={(e) =>
                    setNewGame({ ...newGame, image_url: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="border p-2 rounded w-full text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Guide Text:</label>
                <textarea
                  value={newGame.guide_text}
                  onChange={(e) =>
                    setNewGame({ ...newGame, guide_text: e.target.value })
                  }
                  placeholder="Game description and how to play..."
                  className="border p-2 rounded w-full text-white"
                  rows="4"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">
                  Guide Video URL:
                </label>
                <input
                  type="text"
                  value={newGame.guide_video_url}
                  onChange={(e) =>
                    setNewGame({ ...newGame, guide_video_url: e.target.value })
                  }
                  placeholder="https://www.youtube.com/embed/..."
                  className="border p-2 rounded w-full text-white"
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-600 text-white px-4 py-2 rounded mt-2 w-full hover:bg-yellow-700"
              >
                Create Game
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Game List Modal */}
      {isGameListModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-75 rounded-lg p-4 sm:p-8 w-full max-w-6xl mx-2 my-4 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsGameListModalOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300 text-xl z-50"
            >
              ×
            </button>
            <h2 className="text-xl font-bold text-yellow-500 mb-6 top-0 bg-black bg-opacity-75 py-2">
              Game List
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="game-item border border-gray-700 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors flex flex-col"
                >
                  <h3 className="font-bold text-yellow-500 text-lg mb-2 truncate">
                    {game.name}
                  </h3>
                  <div className="relative h-40 mb-3">
                    <img
                      src={game.image_url || "https://picsum.photos/200/300"}
                      className="w-full h-full object-cover rounded-md absolute inset-0"
                      alt={game.name}
                      onError={(e) => {
                        e.target.src = "https://picsum.photos/200/300";
                      }}
                    />
                  </div>
                  <div className="space-y-1 text-gray-300 text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold">ID:</span>
                      <span className="truncate ml-2">{game.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Play Time:</span>
                      <span>{game.avg_play_time} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Players:</span>
                      <span>
                        {game.min_players} - {game.max_players}
                      </span>
                    </div>
                    <div className="space-y-1 mt-2">
                      <details className="cursor-pointer">
                        <summary className="font-semibold">Image URL</summary>
                        <p className="text-xs break-all mt-1 pl-2">
                          {game.image_url || "N/A"}
                        </p>
                      </details>
                      <details className="cursor-pointer">
                        <summary className="font-semibold">Guide Text</summary>
                        <p className="text-xs break-all mt-1 pl-2">
                          {game.guide_text || "N/A"}
                        </p>
                      </details>
                      <details className="cursor-pointer">
                        <summary className="font-semibold">Video URL</summary>
                        <p className="text-xs break-all mt-1 pl-2">
                          {game.guide_video_url || "N/A"}
                        </p>
                      </details>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Report Generation Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-75 rounded-lg p-8 w-96 relative">
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300 text-xl"
            >
              ×
            </button>
            <h2 className="text-lg font-bold text-yellow-500 mb-6">
              Generate Event Report
            </h2>

            {/* Language Selection */}
            <div className="mb-6">
              <label className="block text-white mb-2">Report Language:</label>
              <select
                value={reportLanguage}
                onChange={(e) => setReportLanguage(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              >
                <option value="en">English</option>
                <option value="tr">Turkish</option>
              </select>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleGenerateReport("current")}
                disabled={isGeneratingReport}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Current Events Report
              </button>
              <button
                onClick={() => handleGenerateReport("previous")}
                disabled={isGeneratingReport}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
              >
                Previous Events Report
              </button>
              <button
                onClick={() => handleGenerateReport("all")}
                disabled={isGeneratingReport}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                All Events Report
              </button>
            </div>

            {isGeneratingReport && (
              <p className="text-yellow-500 text-center mt-4">
                Generating report...
              </p>
            )}
          </div>
        </div>
      )}
      {/* Create Event Modal */}
      {isCreateEventModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-75 rounded-lg p-8 w-96 relative">
            <button
              onClick={() => setIsCreateEventModalOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300 text-xl"
            >
              ×
            </button>
            <h2 className="text-lg font-bold text-yellow-500 mb-4">
              Create New Event
            </h2>
            <form onSubmit={handleCreateEvent}>
              <div className="mb-4">
                <label className="block text-white mb-2">Event Name:</label>
                <input
                  type="text"
                  value={newEvent.name}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, name: e.target.value })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Description:</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  className="border p-2 rounded w-full text-white"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Start Date:</label>
                <input
                  type="date"
                  value={newEvent.start_date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, start_date: e.target.value })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">End Date:</label>
                <input
                  type="date"
                  value={newEvent.end_date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, end_date: e.target.value })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-600 text-white px-4 py-2 rounded mt-2 w-full hover:bg-yellow-700"
              >
                Create Event
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Table Modal */}
      {isCreateTableModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-75 rounded-lg p-8 w-96 relative">
            <button
              onClick={() => setIsCreateTableModalOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300 text-xl"
            >
              ×
            </button>
            <h2 className="text-lg font-bold text-yellow-500 mb-4">
              Create New Table for {selectedEvent.name}
            </h2>
            <form onSubmit={handleCreateTable}>
              <div className="mb-4">
                <label className="block text-white mb-2">Game:</label>
                <select
                  value={selectedGameId || ""}
                  onChange={(e) => {
                    const gameId = e.target.value;
                    setSelectedGameId(gameId);

                    if (gameId === "custom") {
                      setIsCustomGame(true);
                      setNewTable({
                        ...newTable,
                        game_id: null,
                        game_image: "",
                        game_play_time: 0,
                        game_guide_text: "",
                        game_guide_video: "",
                      });
                    } else {
                      setIsCustomGame(false);
                      const game = games.find((g) => g.id === gameId);
                      if (game) {
                        setNewTable({
                          ...newTable,
                          game_name: game.name,
                          game_id: game.id,
                          game_image: game.image_url,
                          game_play_time: game.avg_play_time,
                          game_guide_text: game.guide_text,
                          game_guide_video: game.guide_video_url,
                        });
                      }
                    }
                  }}
                  className="border p-2 rounded w-full text-white"
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
                  <div className="mb-4">
                    <label className="block text-white mb-2">Image URL:</label>
                    <input
                      type="text"
                      value={newTable.game_image || ""}
                      onChange={(e) =>
                        setNewTable({ ...newTable, game_image: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                      className="border p-2 rounded w-full text-white"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-white mb-2">
                      Avg. Play Time (min):
                    </label>
                    <input
                      type="number"
                      value={newTable.game_play_time || 0}
                      onChange={(e) =>
                        setNewTable({
                          ...newTable,
                          game_play_time: parseInt(e.target.value),
                        })
                      }
                      className="border p-2 rounded w-full text-white"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-white mb-2">Guide Text:</label>
                    <textarea
                      value={newTable.game_guide_text || ""}
                      onChange={(e) =>
                        setNewTable({
                          ...newTable,
                          game_guide_text: e.target.value,
                        })
                      }
                      placeholder="Game description and how to play..."
                      className="border p-2 rounded w-full text-white"
                      rows="4"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-white mb-2">
                      Guide Video URL:
                    </label>
                    <input
                      type="text"
                      value={newTable.game_guide_video || ""}
                      onChange={(e) =>
                        setNewTable({
                          ...newTable,
                          game_guide_video: e.target.value,
                        })
                      }
                      placeholder="https://www.youtube.com/embed/..."
                      className="border p-2 rounded w-full text-white"
                    />
                  </div>
                </>
              )}
              <div className="mb-4">
                <label className="block text-white mb-2">Game Master:</label>
                <input
                  type="text"
                  value={newTable.game_master}
                  onChange={(e) =>
                    setNewTable({ ...newTable, game_master: e.target.value })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Player Quota:</label>
                <input
                  type="number"
                  value={newTable.player_quota}
                  onChange={(e) =>
                    setNewTable({ ...newTable, player_quota: e.target.value })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                  min="1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Language:</label>
                <input
                  type="text"
                  value={newTable.language}
                  onChange={(e) =>
                    setNewTable({ ...newTable, language: e.target.value })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-600 text-white px-4 py-2 rounded mt-2 w-full hover:bg-yellow-700"
              >
                Create Table
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {isEditingTableModalOpen && selectedTable && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-75 rounded-lg p-8 w-96 relative">
            <button
              onClick={() => setIsEditingTableModalOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300 text-xl"
            >
              ×
            </button>
            <h2 className="text-lg font-bold text-yellow-500 mb-4">
              Edit Table: {selectedTable.game_name}
            </h2>
            <form onSubmit={handleUpdateTable}>
              <div className="mb-4">
                <label className="block text-white mb-2">Game Name:</label>
                <input
                  type="text"
                  value={updateData.gameName}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, gameName: e.target.value })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Game Master:</label>
                <input
                  type="text"
                  value={updateData.gameMaster}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, gameMaster: e.target.value })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Player Quota:</label>
                <input
                  type="number"
                  value={updateData.playerQuota}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      playerQuota: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                  min="1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">
                  Total Joined Players:
                </label>
                <input
                  type="number"
                  value={updateData.totalJoined}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      totalJoined: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Language:</label>
                <input
                  type="text"
                  value={updateData.language}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, language: e.target.value })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-600 text-white px-4 py-2 rounded mt-2 w-full hover:bg-yellow-700"
              >
                Update Table
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Players Modal */}
      {isPlayersModalOpen && selectedTable && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-75 rounded-lg p-8 w-[80%] max-h-[90vh] relative overflow-auto">
            <div className="sticky top-2 right-2 flex justify-end z-50">
              <button
                onClick={() => {
                  setIsPlayersModalOpen(false);
                  setSelectedTable(null);
                }}
                className="text-white hover:text-gray-300 text-xl"
              >
                ×
              </button>
            </div>
            <h2 className="text-lg font-bold text-yellow-500 mb-4">
              Players for {selectedTable.game_name}
            </h2>

            {/* Add Player Form */}
            <div className="mb-6">
              <h3 className="text-white font-bold mb-2">Add New Player</h3>
              <form
                onSubmit={handleAddPlayer}
                className="grid grid-cols-1 md:grid-cols-5 gap-4"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={newPlayer.name}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, name: e.target.value })
                  }
                  className="border p-2 rounded text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Student ID"
                  value={newPlayer.student_id}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, student_id: e.target.value })
                  }
                  className="border p-2 rounded text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Contact"
                  value={newPlayer.contact}
                  onChange={(e) =>
                    setNewPlayer({ ...newPlayer, contact: e.target.value })
                  }
                  className="border p-2 rounded text-white"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add Player
                </button>
              </form>
            </div>

            {/* Players Table */}
            <div className="overflow-x-auto">
              {/* Desktop version */}
              <table className="w-full text-left hidden md:table">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3 text-yellow-500">Name</th>
                    <th className="p-3 text-yellow-500">Student ID</th>
                    <th className="p-3 text-yellow-500">Contact</th>
                    <th className="p-3 text-yellow-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr
                      key={player.student_id}
                      className="border-b border-gray-700"
                    >
                      <td className="p-3 text-white">{player.name}</td>
                      <td className="p-3 text-white">{player.student_id}</td>
                      <td className="p-3 text-white">
                        {player.contact || "N/A"}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() =>
                              handleApprovePlayer(player.student_id)
                            }
                            className="bg-stone-800 text-white px-2 py-1 rounded hover:bg-stone-700 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-lime-700"
                            disabled={
                              getPlayerStatus(player.student_id) === "approved"
                            }
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleBackupPlayer(player.student_id)
                            }
                            className="bg-stone-800 text-white px-2 py-1 rounded hover:bg-stone-700 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-lime-700"
                            disabled={
                              getPlayerStatus(player.student_id) === "backup"
                            }
                          >
                            Backup
                          </button>
                          <button
                            onClick={() =>
                              handleRejectPlayer(player.student_id)
                            }
                            className="bg-stone-800 text-white px-2 py-1 rounded hover:bg-stone-700 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-lime-700"
                            disabled={
                              getPlayerStatus(player.student_id) === "rejected"
                            }
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => setSelectedPlayer(player)}
                            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeletePlayer(player.student_id)
                            }
                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile version */}
              <div className="md:hidden space-y-4">
                {players.map((player) => (
                  <div
                    key={player.student_id}
                    className="bg-gray-800 p-4 rounded-lg"
                  >
                    <div className="mb-2">
                      <div className="text-yellow-500 text-sm">Name</div>
                      <div className="text-white">{player.name}</div>
                    </div>
                    <div className="mb-2">
                      <div className="text-yellow-500 text-sm">Student ID</div>
                      <div className="text-white">{player.student_id}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-yellow-500 text-sm">Contact</div>
                      <div className="text-white">
                        {player.contact || "N/A"}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedPlayer(player)}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePlayer(player.student_id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleApprovePlayer(player.student_id)}
                        className="bg-stone-800 text-white px-2 py-1 rounded hover:bg-stone-700 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-lime-700"
                        disabled={
                          getPlayerStatus(player.student_id) === "approved"
                        }
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleBackupPlayer(player.student_id)}
                        className="bg-stone-800 text-white px-2 py-1 rounded hover:bg-stone-700 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-lime-700"
                        disabled={
                          getPlayerStatus(player.student_id) === "backup"
                        }
                      >
                        Backup
                      </button>
                      <button
                        onClick={() => handleRejectPlayer(player.student_id)}
                        className="bg-stone-800 text-white px-2 py-1 rounded hover:bg-stone-700 col-span-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-lime-700"
                        disabled={
                          getPlayerStatus(player.student_id) === "rejected"
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Player Edit Modal */}
            {selectedPlayer && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-black bg-opacity-75 rounded-lg p-8 w-96 relative">
                  <button
                    onClick={() => setSelectedPlayer(null)}
                    className="absolute top-2 right-2 text-white hover:text-gray-300 text-xl"
                  >
                    ×
                  </button>
                  <h2 className="text-lg font-bold text-yellow-500 mb-4">
                    Edit Player
                  </h2>
                  <form onSubmit={handleUpdatePlayer}>
                    <div className="mb-4">
                      <label className="block text-white mb-2">Name:</label>
                      <input
                        type="text"
                        value={selectedPlayer.name}
                        onChange={(e) =>
                          setSelectedPlayer({
                            ...selectedPlayer,
                            name: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full text-white"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-white mb-2">
                        Student ID:
                      </label>
                      <input
                        type="text"
                        value={selectedPlayer.student_id}
                        onChange={(e) =>
                          setSelectedPlayer({
                            ...selectedPlayer,
                            student_id: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full text-white"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-white mb-2">Contact:</label>
                      <input
                        type="text"
                        value={selectedPlayer.contact}
                        onChange={(e) =>
                          setSelectedPlayer({
                            ...selectedPlayer,
                            contact: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-yellow-600 text-white px-4 py-2 rounded mt-2 w-full hover:bg-yellow-700"
                    >
                      Update Player
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Event Editing Modal */}
      {isEditingEventModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-75 rounded-lg p-8 w-96 relative">
            <button
              onClick={() => setIsEditingEventModalOpen(false)}
              className="absolute top-2 right-2 text-white hover:text-gray-300 text-xl"
            >
              ×
            </button>
            <h2 className="text-lg font-bold text-yellow-500 mb-4">
              Edit Event: {selectedEvent.name}
            </h2>
            <form onSubmit={handleUpdateEvent}>
              <div className="mb-4">
                <label className="block text-white mb-2">Name:</label>
                <input
                  type="text"
                  value={eventUpdateData.name}
                  onChange={(e) =>
                    setEventUpdateData({
                      ...eventUpdateData,
                      name: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Description:</label>
                <textarea
                  value={eventUpdateData.description}
                  onChange={(e) =>
                    setEventUpdateData({
                      ...eventUpdateData,
                      description: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full text-white"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Start Date:</label>
                <input
                  type="date"
                  value={eventUpdateData.start_date}
                  onChange={(e) =>
                    setEventUpdateData({
                      ...eventUpdateData,
                      start_date: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">End Date:</label>
                <input
                  type="date"
                  value={eventUpdateData.end_date}
                  onChange={(e) =>
                    setEventUpdateData({
                      ...eventUpdateData,
                      end_date: e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-600 text-white px-4 py-2 rounded mt-2 w-full hover:bg-yellow-700"
              >
                Update Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
