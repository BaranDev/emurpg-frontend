import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import RegistrationForm from "../components/events/RegistrationForm";
import { config } from "../config";
import { useWebSocket } from "../hooks/useWebSocket";

const NEBULA_BG = [
  "radial-gradient(ellipse 80% 60% at 20% 10%,  #0d1230 0%, transparent 60%)",
  "radial-gradient(ellipse 60% 50% at 80% 80%,  #110a2e 0%, transparent 55%)",
  "radial-gradient(ellipse 100% 80% at 50% 50%, #070b18 0%, #0a0d1a 100%)",
].join(", ");

const TableDetailPage = () => {
  const { slug } = useParams();
  const [table, setTable] = useState(null);
  const backendUrl = config.backendUrl;

  useEffect(() => {
    document.title = "EMURPG - Table Details";
  }, []);

  const fetchTableData = useCallback(() => {
    fetch(`${backendUrl}/api/table/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setTable(data.data);
      })
      .catch((error) => {
        console.error("Error fetching table data:", error);
      });
  }, [backendUrl, slug]);

  useWebSocket("tables", fetchTableData);

  useEffect(() => {
    fetchTableData();
  }, [slug, backendUrl, fetchTableData]);

  if (!table) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: NEBULA_BG }}
      >
        <p className="font-cinzel text-amber-200/70 tracking-wide">Loading…</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-gray-100 relative select-none"
      style={{ background: NEBULA_BG }}
    >
      {/* Floating back button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-lg text-amber-200/90 hover:text-amber-100 transition-all duration-200 text-sm font-cinzel group hover:scale-105"
          style={{
            background: "rgba(10, 12, 22, 0.75)",
            border: "1px solid rgba(201,162,39,0.2)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
          onClick={() => (window.location.href = "/events")}
          aria-label="Back to events"
        >
          <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
          <span>Events</span>
        </button>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {/* Page header */}
        <div className="text-center mb-8">
          <div className="text-3xl mb-3 select-none text-amber-200/30" aria-hidden="true">
            ⚔
          </div>
          <h1 className="text-2xl md:text-3xl font-cinzel font-bold text-amber-100 mb-2 leading-tight">
            {table.game_name}
          </h1>
          <p className="text-xs font-cinzel tracking-widest text-stone-600 uppercase mb-1">
            Quest Master
          </p>
          <p className="text-sm text-stone-300">{table.game_master}</p>
        </div>

        {/* Arcane card wrapper */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            border: "1px solid rgba(201,162,39,0.25)",
            boxShadow: [
              "0 32px 64px -16px rgba(0,0,0,0.95)",
              "inset 0  1px 0   rgba(201,162,39,0.16)",
              "inset 0 -1px 0   rgba(0,0,0,0.5)",
              "inset 0  0  120px rgba(201,162,39,0.02)",
            ].join(", "),
          }}
        >
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
    </div>
  );
};

export default TableDetailPage;
