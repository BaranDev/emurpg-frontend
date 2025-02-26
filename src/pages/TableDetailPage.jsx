import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import RegistrationForm from "../components/RegistrationForm";
import { config } from "../config";
import { FaArrowAltCircleLeft, FaDiceD20 } from "react-icons/fa";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";

const TableDetailPage = () => {
  const { slug } = useParams();
  const [table, setTable] = useState(null);
  const [seatId, setSeatId] = useState(null); // Use state for seatId
  const [canJoin, setCanJoin] = useState(false); // Use state for canJoin
  const backendUrl = config.backendUrl;
  const [ws, setWs] = useState(null); // WebSocket state to manage connection
  const wsConnected = useRef(false); // Ref to track WebSocket connection status

  // Function to fetch the table data
  const fetchTableData = () => {
    fetch(`${backendUrl}/api/table/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        data = data.data;
        setTable(data); // Set the table data
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
        console.log("WebSocket connected");
        wsConnected.current = true;
      };

      socket.onmessage = (event) => {
        console.log("Received WebSocket message:", event.data);
        // Only fetch table data if WebSocket is connected
        if (wsConnected.current) {
          fetchTableData();
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
  }, [slug, backendUrl]); // Dependencies

  // Display loading message while data is being fetched
  if (!table) {
    return <div className="text-center text-gray-100">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-center bg-gray-900 text-gray-100 flex items-center justify-center bg-medieval-pattern relative select-none">
      <div className="container w-full md:w-[50%] px-4 md:px-0 py-8 relative">
        <button
          className="absolute top-12 left-8 text-yellow-500 bg-gray-800 rounded-full p-0 hover:text-yellow-400 hover:opacity-50 transition duration-300 flex items-center gap-2"
          onClick={() => (window.location.href = "/events")}
        >
          <FaArrowAltCircleLeft size={24} />
        </button>
        <div className="bg-gray-800 rounded-lg border-4 border-yellow-600 shadow-2xl p-1">
          <div className="flex justify-center">
            <FaCaretLeft className="text-6xl py-2 text-yellow-500" />
            <FaDiceD20 className="text-6xl py-2 text-yellow-500" />
            <FaCaretRight className="text-6xl py-2 text-yellow-500" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-yellow-500 mb-2">
            {table.game_name}
          </h1>
          <p className="text-[10px] text-gray-400">GM</p>
          <h2 className="text-lg md:text-sm text-gray-300 m-0">
            {table.game_master}
          </h2>
          <p className="text-base md:text-xs mb-2 my-0">
            Player Quota: {table.player_quota}
          </p>
          <RegistrationForm tableSlug={table.slug} tableId={table.slug} />
        </div>
      </div>
    </div>
  );
};

export default TableDetailPage;
