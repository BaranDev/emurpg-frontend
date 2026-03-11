import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import RegistrationForm from "../components/events/RegistrationForm";
import { config } from "../config";
import { FaArrowAltCircleLeft, FaDiceD20 } from "react-icons/fa";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";
import { useWebSocket } from "../hooks/useWebSocket";

const TableDetailPage = () => {
  const { slug } = useParams();
  const [table, setTable] = useState(null);
  const backendUrl = config.backendUrl;

  useEffect(() => {
    document.title = "EMURPG - Table Details";
  }, []);

  // Function to fetch the table data
  const fetchTableData = useCallback(() => {
    fetch(`${backendUrl}/api/table/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        data = data.data;
        setTable(data);
      })
      .catch((error) => {
        console.error("Error fetching table data:", error);
      });
  }, [backendUrl, slug]);

  useWebSocket("tables", fetchTableData);

  useEffect(() => {
    fetchTableData();
  }, [slug, backendUrl, fetchTableData]);

  // Display loading message while data is being fetched
  if (!table) {
    return <div className="text-center text-gray-100">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 bg-medieval-pattern relative select-none">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          className="fixed top-4 left-4 z-50 text-yellow-500 bg-gray-800 rounded-full p-0 hover:text-yellow-400 hover:opacity-50 transition duration-300 flex items-center gap-2"
          onClick={() => (window.location.href = "/events")}
        >
          <FaArrowAltCircleLeft size={32} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-4">
            <FaCaretLeft className="text-4xl md:text-5xl text-yellow-500" />
            <FaDiceD20 className="text-4xl md:text-5xl text-yellow-500" />
            <FaCaretRight className="text-4xl md:text-5xl text-yellow-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-500">
            {table.game_name}
          </h1>
          <p className="text-sm text-gray-400 mt-1">Game Master</p>
          <h2 className="text-lg text-gray-300">{table.game_master}</h2>
        </div>

        {/* Registration Form with Game Info */}
        <RegistrationForm
          tableSlug={table.slug}
          tableId={table.slug}
          gameName={table.game_name}
          gameMaster={table.game_master}
          playerQuota={table.player_quota}
          gameInfo={table.game_info}
        />
      </div>
    </div>
  );
};

export default TableDetailPage;
