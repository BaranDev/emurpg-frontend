import React, { useState, useEffect, useRef } from "react";import config from "../config";

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
  });
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    student_id: "",
    table_id: "",
    seat_id: "",
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
      } catch (error) {
        console.error("Error fetching players:", error);
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
    const fetchAndUpdateEvents = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/admin/events`, {
          headers: { apiKey: API_KEY },
        });
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
      } catch (error) {
        console.error("Error fetching events:", error);
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
    });
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
        seat_id: "",
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

  const fetchTableDetails = async (tableSlug) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/table/${tableSlug}`,
        {
          headers: { apiKey: API_KEY },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch table");
      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching table:", error);
      return null;
    }
  };

  return (
    <div className="admin-dashboard grid text-center w-screen">
      <button
        onClick={handleLogout}
        className="absolute top-4 left-4 text-yellow-500 hover:text-yellow-300 bg-gray-800 rounded px-3 py-1"
      >
        Logout
      </button>

      <h1 className="text-2xl font-bold text-yellow-500 mb-4 py-4">
        Admin Dashboard
      </h1>

      {/* Events List */}
      <div className="events-list grid grid-cols-1 gap-4 mx-auto w-screen px-10 mb-8">
        {eventsWithTables.map((event) => (
          <div key={event.slug} className="event-item border p-4 mb-2">
            <div className="event-header flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-yellow-500">
                  {event.name}
                </h2>
                <p className="text-sm text-gray-400">{event.description}</p>
              </div>
              <div className="flex gap-2">
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
                    Players: {table.total_joined_players}/{table.player_quota}
                  </p>
                  <p className="text-xs text-gray-500">ID: {table.slug}</p>
                  <div className="mt-2 flex gap-2">
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
                      className="bg-blue-600 text-white px-2 py-1 rounded"
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
                      className="bg-purple-600 text-white px-2 py-1 rounded"
                    >
                      Players
                    </button>
                    <button
                      onClick={() => handleDeleteTable(table.slug)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
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
      <div className="flex gap-4 justify-center mt-4">
        <button
          onClick={() => setIsCreateEventModalOpen(true)}
          className="bg-green-500 text-white px-5 py-2 rounded"
        >
          Create New Event
        </button>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="bg-blue-500 text-white px-5 py-2 rounded"
        >
          Generate Report
        </button>
      </div>
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
                <label className="block text-white mb-2">Game Name:</label>
                <input
                  type="text"
                  value={newTable.game_name}
                  onChange={(e) =>
                    setNewTable({ ...newTable, game_name: e.target.value })
                  }
                  className="border p-2 rounded w-full text-white"
                  required
                />
              </div>
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
          <div className="bg-black bg-opacity-75 rounded-lg p-8 w-3/4 max-h-[90vh] relative overflow-auto">
            <button
              onClick={() => {
                setIsPlayersModalOpen(false);
                setSelectedTable(null);
              }}
              className="absolute top-2 right-2 text-white hover:text-gray-300 text-xl"
            >
              ×
            </button>
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
                  type="number"
                  placeholder="Seat ID"
                  value={newPlayer.seat_id}
                  onChange={(e) =>
                    setNewPlayer({
                      ...newPlayer,
                      seat_id: parseInt(e.target.value),
                    })
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
              <table className="w-full text-left">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3 text-yellow-500">Name</th>
                    <th className="p-3 text-yellow-500">Student ID</th>
                    <th className="p-3 text-yellow-500">Seat ID</th>
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
                      <td className="p-3 text-white">{player.seat_id}</td>
                      <td className="p-3 text-white">{player.contact}</td>
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedPlayer(player)}
                          className="bg-blue-600 text-white px-2 py-1 rounded mr-2 hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player.student_id)}
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                      <label className="block text-white mb-2">Seat ID:</label>
                      <input
                        type="number"
                        value={selectedPlayer.seat_id}
                        onChange={(e) =>
                          setSelectedPlayer({
                            ...selectedPlayer,
                            seat_id: parseInt(e.target.value),
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
