import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';
import config from '../config';
import { FaDiceD20 } from 'react-icons/fa';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa6';

const TableDetailPage = () => {
  const { slug } = useParams();
  const [table, setTable] = useState(null);
  const [seatId, setSeatId] = useState(null);  // Use state for seatId
  const [canJoin, setCanJoin] = useState(false);  // Use state for canJoin
  const backendUrl = config.backendUrl;
  const [ws, setWs] = useState(null);  // WebSocket state to manage connection
  const wsConnected = useRef(false);  // Ref to track WebSocket connection status

  // Function to fetch the table data
  const fetchTableData = () => {
    fetch(`${backendUrl}/api/table/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        data = data.data;
        setTable(data);  // Set the table data
        if (data.total_joined_players < data.player_quota) {
          setCanJoin(true);
          setSeatId(data.total_joined_players + 1);
        } else {
          setCanJoin(false);
          setSeatId(null);
        }
      });
  };

  useEffect(() => {
    // Fetch data initially
    fetchTableData();

    // Establish the WebSocket connection
    const connectWebSocket = () => {
      const socket = new WebSocket(`${backendUrl}/ws/updates`);

      socket.onopen = () => {
        console.log('WebSocket connected');
        wsConnected.current = true;
      };

      socket.onmessage = (event) => {
        console.log('Received WebSocket message:', event.data);
        // Only fetch table data if WebSocket is connected
        if (wsConnected.current) {
          fetchTableData();
        }
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        wsConnected.current = false;
      };

      socket.onerror = (error) => {
        console.log('WebSocket error:', error);
        wsConnected.current = false;
      };

      setWs(socket);
    };

    // Connect WebSocket
    connectWebSocket();

    // Cleanup WebSocket on component unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [slug, backendUrl]);  // Dependencies

  // Display loading message while data is being fetched
  if (!table) {
    return <div className="text-center text-gray-100">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-center bg-gray-900 text-gray-100 flex items-center justify-center bg-medieval-pattern relative select-none">
      <button
        className="absolute top-4 left-4 text-yellow-500 hover:text-yellow-300 bg-gray-800 rounded px-3 py-1 transition duration-300"
        onClick={() => window.location.href = window.location.origin}
      >
        Back
      </button>
      <div className="container px-4 py-8">
        <div className="bg-gray-800 rounded-lg border-4 border-yellow-600 shadow-2xl p-8">
          <div className="flex justify-center">
            <FaCaretLeft className="text-6xl py-2 text-yellow-500" />
            <FaDiceD20 className="text-6xl py-2 text-yellow-500" />
            <FaCaretRight className="text-6xl py-2 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold text-yellow-500 mb-2">{table.game_name}</h1>
          <h2 className="text-2xl text-gray-300 mb-4">{table.game_master}</h2>
          {canJoin ? (
            <>
              <p className="text-lg mb-2">Game Master: {table.game_master}</p>
              <p className="text-lg mb-2">Player Quota: {table.player_quota}</p>
              <p className="text-lg mb-2">Total Joined Players: {table.total_joined_players}</p>
              <p className="text-lg mb-4">Seat Number: {seatId}</p>
              <RegistrationForm tableSlug={table.slug} seatId={seatId} tableId={table.slug} />
            </>
          ) : (
            <p className="text-lg text-red-500">Table is full.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableDetailPage;
