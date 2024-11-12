import React, { useState, useEffect, useRef } from 'react';
import config from '../config';

const AdminDashboard = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [updateData, setUpdateData] = useState({ playerQuota: '', totalJoined: '', gameMaster: '', gameName: '' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPlayersModalOpen, setIsPlayersModalOpen] = useState(false);
  const [isEditingTableModalOpen, setIsEditingTableModalOpen] = useState(false);
  const [newTable, setnewTable] = useState({ game_name: '', game_master: '', player_quota: '' });
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [newPlayer, setNewPlayer] = useState({ name: '', student_id: '', table_id: '', seat_id: '', contact: '' });
  const [isGeneratingTable, setIsGeneratingTable] = useState(false);
  const backendUrl = config.backendUrl; //http://localhost:8000 or https://api.emurpg.com
  const API_KEY = localStorage.getItem("apiKey");
  const [ws, setWs] = useState(null);  // WebSocket state to manage connection
  const [playerWs, setPlayerWs] = useState(null);
  const wsConnected = useRef(false);  // Ref to track WebSocket connection status
  const playerWsConnected = useRef(false);
  const wsConnectionAttempted = useRef(false);
  const playerWsConnectionAttempted = useRef(false);
  
  useEffect(() => {
    // Existing table WebSocket logic
    const fetchTables = () => {
      fetch(`${backendUrl}/api/tables`)
        .then((res) => res.json())
        .then((data) => setTables(data));
    };

    const connectWebSocket = () => {
      const socket = new WebSocket(`${backendUrl}/ws/updates`);

      socket.onopen = () => {
        console.log('Table WebSocket connected');
        wsConnected.current = true;
      };

      socket.onmessage = (event) => {
        console.log('Received message from Table WebSocket', event.data);
        if (wsConnected.current) {
          fetchTables();
        }
      };

      socket.onclose = () => {
        console.log('Table WebSocket disconnected');
        wsConnected.current = false;
      };

      socket.onerror = (error) => {
        console.log('Table WebSocket error:', error);
        wsConnected.current = false;
      };

      return socket;
    };

    if (!wsConnectionAttempted.current) {
      const socket = connectWebSocket();
      setWs(socket);
      wsConnectionAttempted.current = true;
    }
    fetchTables();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

// New useEffect for player WebSocket
useEffect(() => {
  const connectPlayerWebSocket = () => {
    if (!selectedTable || !isPlayersModalOpen) return null;

    const socket = new WebSocket(`${backendUrl}/ws/updates`);

    socket.onopen = () => {
      console.log('Player WebSocket connected');
      playerWsConnected.current = true;
    };

    socket.onmessage = (event) => {
      console.log('Received message from Player WebSocket', event.data);
      if (playerWsConnected.current) {
        // Fetch updated player list
        fetch(`${backendUrl}/api/admin/get_players/${selectedTable.slug}`, {
          headers: { 'Content-Type': 'application/json', 'apiKey': API_KEY },
        })
          .then(res => res.json())
          .then(data => setPlayers(data.players))
          .catch(error => console.error('Error fetching players:', error));
      }
    };

    socket.onclose = () => {
      console.log('Player WebSocket disconnected');
      playerWsConnected.current = false;
    };

    socket.onerror = (error) => {
      console.log('Player WebSocket error:', error);
      playerWsConnected.current = false;
    };

    return socket;
  };

  // Connect player WebSocket when modal opens
  if (isPlayersModalOpen && selectedTable && !playerWsConnectionAttempted.current) {
    const socket = connectPlayerWebSocket();
    setPlayerWs(socket);
    playerWsConnectionAttempted.current = true;
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

  
  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setIsEditingTableModalOpen(true);
    setUpdateData({ playerQuota: table.player_quota, totalJoined: table.total_joined_players, gameMaster: table.game_master, gameName: table.game_name });
  };

  const handleUpdate = async (e) => {
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

    const response = await fetch(`${backendUrl}/api/admin/table/${selectedTable.slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': API_KEY,
      },
      body: updated_table,
    });

    if (response.ok) {
      alert('Table updated successfully!');
      setSelectedTable(null);
      const newTablesResponse = await fetch(`${backendUrl}/api/tables`);
      const newTablesData = await newTablesResponse.json();
      setTables(newTablesData);
    } else {
      alert('Failed to update table.');
    }
  };

  const handleDelete = async (slug) => {
    const response = await fetch(`${backendUrl}/api/admin/table/${slug}`, {
      method: 'DELETE',
      headers: {
        'apiKey': API_KEY,
      },
    });

    if (response.ok) {
      alert('Table deleted successfully!');
      const newTablesResponse = await fetch(`${backendUrl}/api/tables`);
      const newTablesData = await newTablesResponse.json();
      setTables(newTablesData);
    } else {
      alert('Failed to delete table.');
    }
  };

  const handleGenerateTableImage = async () => {
    setIsGeneratingTable(true);
    try {
      // First, validate that we have tables data
      if (!tables || tables.length === 0) {
        throw new Error('No tables available to generate image');
      }

      // Convert tables data to the required format with proper validation
      const formattedData = tables.map(table => {
        // Ensure joined_players exists and is an array
        const joinedPlayers = Array.isArray(table.joined_players) ? table.joined_players : [];
        
        // Create the game master entry
        const gameMasterEntry = {
          name: table.game_master || 'Unknown GM',
          is_manager: 1,
          manager_name: "",
          game_played: table.game_name || 'Unknown Game'
        };

        // Create player entries with validation
        const playerEntries = joinedPlayers.map(player => ({
          name: player.name || 'Unknown Player',
          is_manager: 0,
          manager_name: table.game_master || 'Unknown GM',
          game_played: ""
        }));

        // Return both GM and players in an array
        return [gameMasterEntry, ...playerEntries];
      }).flat();

      // Validate the formatted data
      if (formattedData.length === 0) {
        throw new Error('No valid data to generate table layout');
      }

      // Generate CSV content
      const csvContent = generateCSVContent(formattedData);
      
      // Validate CSV content
      if (!csvContent) {
        throw new Error('Failed to generate CSV content');
      }

      const csvFile = new File([csvContent], "tables.csv", { type: "text/csv" });
      const formData = new FormData();
      formData.append("file", csvFile);

      const response = await fetch(`${backendUrl}/api/admin/generate-tables`, {
        method: "POST",
        headers: {
          "apiKey": API_KEY
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate table layout');
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = 'table_layout.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(imageUrl);
      
    } catch (error) {
      console.error('Table generation error:', error);
      alert(`Failed to generate table layout: ${error.message}`);
    } finally {
      setIsGeneratingTable(false);
    }
  };

  const generateCSVContent = (data) => {
    try {
      // Validate input data
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid data format for CSV generation');
      }

      const headers = ["isim", "yonetici_mi", "birlikte_oynadigi_yonetici", "oynattigi_oyun"];
      const csvRows = [headers];

      data.forEach(item => {
        // Validate each row data
        const row = [
          (item.name || '').toString(),
          (item.is_manager || 0).toString(),
          (item.manager_name || '').toString(),
          (item.game_played || '').toString()
        ];
        csvRows.push(row);
      });

      return csvRows.map(row => row.join(",")).join("\n");
    } catch (error) {
      console.error('Error generating CSV content:', error);
      return null;
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = convertToCSV(tables);
    downloadCSV(csvContent, 'tables.csv');
  };

  const convertToCSV = (data) => {
    const headers = "isim,yonetici_mi,birlikte_oynadigi_yonetici,oynattigi_oyun\n";
    const players = [];
    data.forEach((table) => {
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

    const rows = players.map(player => {
      return `${player.name},${player.isGameMaster},${player.gameMaster},${player.gameName}`;
    }).join("\n");

    return headers + rows;
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    const response = await fetch(`${backendUrl}/api/admin/create_table`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apiKey': API_KEY },
      body: JSON.stringify({
        game_name: newTable.game_name,
        game_master: newTable.game_master,
        player_quota: parseInt(newTable.player_quota),
        total_joined_players: 0,
        joined_players: [],
        created_at: new Date(),
      }),
    });

    if (response.ok) {
      alert('Table created successfully!');
      setIsCreateModalOpen(false);
      setnewTable({ game_name: '', game_master: '', player_quota: '' });
      const updatedTablesResponse = await fetch(`${backendUrl}/api/tables`);
      const updatedTables = await updatedTablesResponse.json();
      setTables(updatedTables);
    } else {
      alert('Failed to create table.');
    }
  };

  // Modify handleShowPlayersModal to reset WebSocket state
  const handleShowPlayersModal = async (slug) => {
    const response = await fetch(`${backendUrl}/api/admin/get_players/${slug}`, {
      headers: { 'Content-Type': 'application/json', 'apiKey': API_KEY },
    });
    
    if (response.ok) {
      setIsEditingTableModalOpen(false);
      const data = await response.json();
      setPlayers(data.players);
      setIsPlayersModalOpen(true);
      // Reset player WebSocket connection state
      playerWsConnectionAttempted.current = false;
    } else {
      alert('Failed to fetch players.');
    }
  };

  // Modify handleClosePlayersModal to cleanup WebSocket
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

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    const response = await fetch(`${backendUrl}/api/admin/add_player/${selectedTable.slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apiKey': API_KEY },
      body: JSON.stringify(newPlayer),
    });

    if (response.ok) {
      alert('Player added successfully!');
      setNewPlayer({ name: '', student_id: '', table_id: '', seat_id: '', contact: '' });
      handleShowPlayersModal(selectedTable.slug);
    } else {
      alert('Failed to add player.');
    }
  };

  const handleUpdatePlayer = async (e) => {
    e.preventDefault();
    const response = await fetch(`${backendUrl}/api/admin/update_player/${selectedTable.slug}/${selectedPlayer.student_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': API_KEY,
      },
      body: JSON.stringify(selectedPlayer),
    });

    if (response.ok) {
      alert('Player updated successfully!');
      setSelectedPlayer(null);
      handleShowPlayersModal(selectedTable.slug);
    } else {
      alert('Failed to update player.');
    }
  };

  const handleDeletePlayer = async (studentId) => {
    const response = await fetch(`${backendUrl}/api/admin/delete_player/${selectedTable.slug}/${studentId}`, {
      method: 'DELETE',
      headers: {
        'apiKey': API_KEY,
      },
    });

    if (response.ok) {
      alert('Player deleted successfully!');
      handleShowPlayersModal(selectedTable.slug);
    } else {
      alert('Failed to delete player.');
    }
  };

   const handleLogout = () => {
    // Clear the API key from localStorage
    localStorage.removeItem("login");

    // Redirect to the login page or home page
    window.location.href = "https://events.emurpg.com";
  };

  return (
    <div className="admin-dashboard grid text-center w-screen">
         {/* Logout button at top-left */}
         <button
        onClick={handleLogout}
        className="absolute top-4 left-4 text-yellow-500 hover:text-yellow-300 bg-gray-800 rounded px-3 py-1 transition duration-300"
      >
        Logout
      </button>
      <h1 className="sm:text-2xl text-base text-center font-bold text-yellow-500 mb-4 py-4 w-screen justify-center items-center ">Admin Dashboard</h1>

      <div className="table-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mx-auto w-screen px-10">
        {tables.map(table => (
          <div key={table.slug} className="table-item border p-4  mb-2">
            <h2 className='py-1'>{table.game_name}</h2>
            <p className='text-red-900 text-xs py-1'>ID: {table.slug}</p>
            <p>Game Master: {table.game_master}</p>
            <p>Player Quota: {table.player_quota}</p>
            <p>Total Joined Players: {table.total_joined_players}</p>
            <button
              onClick={() => handleTableSelect(table)}
              className="bg-yellow-600 text-white px-2 py-1 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(table.slug)}
              className="bg-red-600 text-white px-2 py-1 rounded mr-2"
            >
              Delete
            </button>
            <button
              onClick={() => {
                setSelectedTable(table);
                handleShowPlayersModal(table.slug);
              }}
              className="bg-blue-600 text-white px-2 py-1 rounded"
            >
              Players
            </button>
          </div>
        ))}
      </div>

      {(selectedTable && isEditingTableModalOpen) && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-75 rounded-lg p-8 w-96 relative">
            <button
              onClick={() => setSelectedTable(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl py-2 font-bold text-yellow-500 mb-4">
              Update Table: {selectedTable.game_name}
            </h2>
            <form onSubmit={handleUpdate} className="update-form">
              <div className="mb-4">
                <label>Game Name</label>
                <input 
                  type="text" 
                  value={updateData.gameName} 
                  onChange={(e) => setUpdateData({ ...updateData, gameName: e.target.value })} 
                  className="border p-2 rounded w-full" 
                />
              </div>
              <div className="mb-4">
                <label>Game Master</label>
                <input 
                  type="text" 
                  value={updateData.gameMaster} 
                  onChange={(e) => setUpdateData({ ...updateData, gameMaster: e.target.value })} 
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label>Player Quota</label>
                <input
                  type="number"
                  value={updateData.playerQuota}
                  onChange={(e) => setUpdateData({ ...updateData, playerQuota: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label>Total Joined Players</label>
                <input
                  type="number"
                  value={updateData.totalJoined}
                  onChange={(e) => setUpdateData({ ...updateData, totalJoined: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded mt-2 w-full">
                Update Table
              </button>
            </form>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-75 rounded-lg p-8 w-96 relative">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold text-yellow-500 mb-4">Create New Table</h2>
            <form onSubmit={handleCreateTable}>
              <div className="mb-4">
                <label>Game Name:</label>
                <input
                  type="text"
                  value={newTable.game_name}
                  onChange={(e) => setnewTable({ ...newTable, game_name: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label>Game Master:</label>
                <input
                  type="text"
                  value={newTable.game_master}
                  onChange={(e) => setnewTable({ ...newTable, game_master: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label>Player Quota:</label>
                <input
                  type="number"
                  value={newTable.player_quota}
                  onChange={(e) => setnewTable({ ...newTable, player_quota: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded mt-2 w-full">
                Create Table
              </button>
            </form>
          </div>
        </div>
      )}

      {isPlayersModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-75 rounded-lg p-8 w-3/4 h-3/4 relative overflow-auto">
            <div className="w-full">
            <button
              onClick={handleClosePlayersModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold text-yellow-500 mb-4">Players for {selectedTable.game_name}</h2>
            
            <div className="mb-4">
              <h3 className="text-md font-bold text-yellow-500 mb-2">Add New Player</h3>
              <form onSubmit={handleAddPlayer} className="grid grid-cols-5 gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Student ID"
                  value={newPlayer.student_id}
                  onChange={(e) => setNewPlayer({ ...newPlayer, student_id: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Table ID"
                  value={newPlayer.table_id=selectedTable.slug}
                  onChange={(e) => setNewPlayer({ ...newPlayer, table_id: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Seat ID"
                  value={newPlayer.seat_id}
                  onChange={(e) => setNewPlayer({ ...newPlayer, seat_id: e.target.value })}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Contact"
                  value={newPlayer.contact}
                  onChange={(e) => setNewPlayer({ ...newPlayer, contact: e.target.value })}
                  className="border p-2 rounded"
                />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mx-auto">
                  Add Player
                </button>
              </form>
            </div>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Student ID</th>
                  <th className="border px-4 py-2">Table ID</th>
                  <th className="border px-4 py-2">Seat ID</th>
                  <th className="border px-4 py-2">Contact</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.student_id}>
                    <td className="border px-4 py-2">{player.name}</td>
                    <td className="border px-4 py-2">{player.student_id}</td>
                    <td className="border px-4 py-2">{player.table_id}</td>
                    <td className="border px-4 py-2">{player.seat_id}</td>
                    <td className="border px-4 py-2">{player.contact}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => setSelectedPlayer(player)}
                        className="bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePlayer(player.student_id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedPlayer && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-75 rounded-lg p-8 w-96 relative">
            <button
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold text-yellow-500 mb-4">Edit Player</h2>
            <form onSubmit={handleUpdatePlayer}>
              <div className="mb-4">
                <label>Name:</label>
                <input
                  type="text"
                  value={selectedPlayer.name}
                  onChange={(e) => setSelectedPlayer({ ...selectedPlayer, name: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label>Student ID:</label>
                <input
                  type="text"
                  value={selectedPlayer.student_id}
                  onChange={(e) => setSelectedPlayer({ ...selectedPlayer, student_id: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label>Table ID:</label>
                <input
                  type="text"
                  value={selectedPlayer.table_id}
                  onChange={(e) => setSelectedPlayer({ ...selectedPlayer, table_id: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label>Seat ID:</label>
                <input
                  type="number"
                  value={selectedPlayer.seat_id}
                  onChange={(e) => setSelectedPlayer({ ...selectedPlayer, seat_id: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label>Contact:</label>
                <input
                  type="text"
                  value={selectedPlayer.contact}
                  onChange={(e) => setSelectedPlayer({ ...selectedPlayer, contact: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              </div>
              <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded mt-2 w-full">
                Update Player
              </button>
            </form>
          </div>
        </div>
      )}
      <div className='bottoms-buttons grid w-screen'>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-green-500 text-white px-5 py-2 rounded mt-4 mx-auto"
        >
          Create New Table
        </button>
        <button
        onClick={handleGenerateTableImage}
        disabled={isGeneratingTable || tables.length === 0} // Added check for empty tables
        className={`${
          isGeneratingTable || tables.length === 0 ? 'bg-gray-500' : 'bg-blue-500'
        } text-white px-5 py-2 rounded mt-4 mx-auto flex items-center justify-center`}
      >
        {isGeneratingTable ? (
          <>
            <span className="animate-spin mr-2">⚙️</span>
            Generating...
          </>
        ) : tables.length === 0 ? (
          'No Tables Available'
        ) : (
          'Generate Table Layout'
        )}
      </button>
      <button
        onClick={handleDownloadCSV}
        disabled={tables.length === 0}
        className={`${
          tables.length === 0 ? 'bg-gray-500' : 'bg-yellow-500'
        } text-white px-5 py-2 rounded mt-4 mx-auto`}
      >
        Download CSV
      </button>
      </div>
    </div>
  );
};

export default AdminDashboard;