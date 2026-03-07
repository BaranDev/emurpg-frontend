import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import PropTypes from "prop-types";
import AdminLayout from "./AdminLayout";
import LoadingSpinner from "./shared/LoadingSpinner";
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";
import { Calendar, Users, Table2, Clock, Sparkles } from "lucide-react";

// Lazy load panels for better performance
const EmuconAdminPanel = lazy(() => import("./EmuconAdminPanel"));
const EmuconManagersPanel = lazy(() => import("./EmuconManagersPanel"));
const EmuconSchedulePanel = lazy(() => import("./EmuconSchedulePanel"));
const EventsAdminPanel = lazy(() => import("./EventsAdminPanel"));
const TablesAdminPanel = lazy(() => import("./TablesAdminPanel"));
const ThemesAdminPanel = lazy(() => import("./ThemesAdminPanel"));
const GamesLibraryPanel = lazy(() => import("./GamesLibraryPanel"));
const RegistrationsPanel = lazy(() => import("./RegistrationsPanel"));
const ReportsPanel = lazy(() => import("./ReportsPanel"));
const AnalyticsPanel = lazy(() => import("./AnalyticsPanel"));
const TeamMembersPanel = lazy(() => import("./TeamMembersPanel"));
const AdminAccountsPanel = lazy(() => import("./AdminAccountsPanel"));

// Panel Loading Fallback
const PanelLoader = () => (
  <div className="flex items-center justify-center h-64">
    <LoadingSpinner size="lg" />
  </div>
);

// Dashboard Overview Panel
const DashboardPanel = ({ stats, onNavigate }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-cinzel mb-2">
          Welcome to EMURPG Admin
        </h2>
        <p className="text-sm sm:text-base text-gray-400">
          Manage your events, tables, and EMUCON activities from one place.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
        <div
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4 cursor-pointer hover:border-[#f48c06]/30 transition-colors"
          onClick={() => onNavigate("events")}
        >
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="p-2 bg-[#dc2f02]/20 rounded-lg mb-2 sm:mb-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#e85d04]" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {stats?.totalEvents || 0}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">
                Active Events
              </p>
            </div>
          </div>
        </div>

        <div
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4 cursor-pointer hover:border-[#f48c06]/30 transition-colors"
          onClick={() => onNavigate("tables")}
        >
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="p-2 bg-[#f48c06]/20 rounded-lg mb-2 sm:mb-0">
              <Table2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#faa307]" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {stats?.totalTables || 0}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">
                Game Tables
              </p>
            </div>
          </div>
        </div>

        <div
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4 cursor-pointer hover:border-[#f48c06]/30 transition-colors"
          onClick={() => onNavigate("emucon")}
        >
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="p-2 bg-[#9d0208]/20 rounded-lg mb-2 sm:mb-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#d00000]" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {stats?.emuconCorners || 0}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">
                EMUCON Corners
              </p>
            </div>
          </div>
        </div>

        <div
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4 cursor-pointer hover:border-[#f48c06]/30 transition-colors"
          onClick={() => onNavigate("registrations")}
        >
          <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
            <div className="p-2 bg-[#ffba08]/20 rounded-lg mb-2 sm:mb-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#faa307]" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {stats?.totalRegistrations || 0}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">
                Registrations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        <button
          onClick={() => onNavigate("events")}
          className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-[#f48c06]/30 transition-all group"
        >
          <div className="p-2 sm:p-3 bg-[#dc2f02]/20 rounded-lg group-hover:bg-[#dc2f02]/30 transition-colors">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#e85d04]" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-sm sm:text-base">
              Manage Events
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Create and edit game events
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate("emucon")}
          className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-[#f48c06]/30 transition-all group"
        >
          <div className="p-2 sm:p-3 bg-[#9d0208]/20 rounded-lg group-hover:bg-[#9d0208]/30 transition-colors">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#d00000]" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-sm sm:text-base">
              EMUCON Corners
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Manage carousel activities
            </p>
          </div>
        </button>

        <button
          onClick={() => onNavigate("managers")}
          className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-[#f48c06]/30 transition-all group"
        >
          <div className="p-2 sm:p-3 bg-[#f48c06]/20 rounded-lg group-hover:bg-[#f48c06]/30 transition-colors">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#faa307]" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-sm sm:text-base">
              EMUCON Managers
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Club manager accounts
            </p>
          </div>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffba08]" />
          Quick Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          <div className="p-3 sm:p-4 bg-gray-900/50 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">
              Active EMUCON Managers
            </p>
            <p className="text-lg sm:text-xl font-bold text-white">
              {stats?.activeManagers || 0}
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-gray-900/50 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">
              Total Players Registered
            </p>
            <p className="text-lg sm:text-xl font-bold text-white">
              {stats?.totalPlayers || 0}
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-gray-900/50 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">
              Games in Library
            </p>
            <p className="text-lg sm:text-xl font-bold text-white">
              {stats?.totalGames || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardPanel.propTypes = {
  stats: PropTypes.object,
  onNavigate: PropTypes.func.isRequired,
};

const AdminMain = ({ onLogout }) => {
  const [activePanel, setActivePanel] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const backendUrl = config.backendUrl;
  const apiKey = getApiKey();

  const fetchStats = useCallback(async () => {
    try {
      // Fetch EMURPG stats
      const eventsRes = await fetch(`${backendUrl}/api/events`, {
        headers: { apiKey },
      });
      const events = eventsRes.ok ? await eventsRes.json() : [];

      const gamesRes = await fetch(`${backendUrl}/api/games`, {
        headers: { apiKey },
      });
      const games = gamesRes.ok ? await gamesRes.json() : [];

      // Fetch EMUCON stats
      const emuconRes = await fetch(`${backendUrl}/api/admin/emucon/stats`, {
        headers: { apiKey },
      });
      const emuconStats = emuconRes.ok ? (await emuconRes.json()).stats : {};

      // Calculate table count
      let tableCount = 0;
      let playerCount = 0;
      for (const event of events) {
        if (event.tables) {
          tableCount += event.tables.length;
          for (const table of event.tables) {
            playerCount += table.total_joined || 0;
          }
        }
      }

      setStats({
        totalEvents: events.length,
        totalTables: tableCount,
        totalPlayers: playerCount,
        totalGames: games.length,
        emuconCorners: emuconStats.totalCorners || 0,
        activeManagers: emuconStats.activeManagers || 0,
        totalRegistrations: emuconStats.totalParticipants || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [backendUrl, apiKey]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const renderPanel = () => {
    switch (activePanel) {
      case "dashboard":
        return <DashboardPanel stats={stats} onNavigate={setActivePanel} />;

      case "emucon":
        return (
          <Suspense fallback={<PanelLoader />}>
            <EmuconAdminPanel />
          </Suspense>
        );

      case "managers":
        return (
          <Suspense fallback={<PanelLoader />}>
            <EmuconManagersPanel />
          </Suspense>
        );

      case "emucon-schedule":
        return (
          <Suspense fallback={<PanelLoader />}>
            <EmuconSchedulePanel />
          </Suspense>
        );

      case "events":
        return (
          <Suspense fallback={<PanelLoader />}>
            <EventsAdminPanel />
          </Suspense>
        );

      case "tables":
        return (
          <Suspense fallback={<PanelLoader />}>
            <TablesAdminPanel />
          </Suspense>
        );

      case "themes":
        return (
          <Suspense fallback={<PanelLoader />}>
            <ThemesAdminPanel />
          </Suspense>
        );

      case "games":
        return (
          <Suspense fallback={<PanelLoader />}>
            <GamesLibraryPanel />
          </Suspense>
        );

      case "registrations":
        return (
          <Suspense fallback={<PanelLoader />}>
            <RegistrationsPanel />
          </Suspense>
        );

      case "reports":
        return (
          <Suspense fallback={<PanelLoader />}>
            <ReportsPanel />
          </Suspense>
        );

      case "analytics":
        return (
          <Suspense fallback={<PanelLoader />}>
            <AnalyticsPanel />
          </Suspense>
        );

      case "team-members":
        return (
          <Suspense fallback={<PanelLoader />}>
            <TeamMembersPanel />
          </Suspense>
        );

      case "admin-accounts":
        return (
          <Suspense fallback={<PanelLoader />}>
            <AdminAccountsPanel />
          </Suspense>
        );

      default:
        return <DashboardPanel stats={stats} onNavigate={setActivePanel} />;
    }
  };

  return (
    <AdminLayout
      activePanel={activePanel}
      onPanelChange={setActivePanel}
      onLogout={onLogout}
    >
      {renderPanel()}
    </AdminLayout>
  );
};

AdminMain.propTypes = {
  onLogout: PropTypes.func,
};

export default AdminMain;
