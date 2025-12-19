import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  RefreshCw,
  Gamepad2,
  Table2,
  UserCheck,
  AlertCircle,
  Clock,
  Award,
} from "lucide-react";
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";
import LoadingSpinner from "./shared/LoadingSpinner";
import AdminButton from "./shared/AdminButton";

const AnalyticsPanel = () => {
  const [analytics, setAnalytics] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = config.backendUrl;
  const apiKey = getApiKey();

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch analytics data
      const analyticsResponse = await fetch(
        `${backendUrl}/api/admin/reports/analytics`,
        {
          headers: { apiKey },
        }
      );

      if (!analyticsResponse.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const analyticsData = await analyticsResponse.json();
      setAnalytics(analyticsData);

      // Fetch events for additional stats
      const eventsResponse = await fetch(`${backendUrl}/api/admin/events`, {
        headers: { apiKey },
      });

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err.message || "Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, apiKey]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const calculateStats = () => {
    if (!events.length) {
      return {
        totalEvents: 0,
        activeEvents: 0,
        finishedEvents: 0,
        totalTables: 0,
        totalPlayers: 0,
        avgTablesPerEvent: 0,
        avgPlayersPerTable: 0,
        gameEvents: 0,
        generalEvents: 0,
      };
    }

    const activeEvents = events.filter((e) => e.status === "active").length;
    const finishedEvents = events.filter((e) => e.status === "finished").length;
    const gameEvents = events.filter((e) => e.type === "game").length;
    const generalEvents = events.filter((e) => e.type === "general").length;

    let totalTables = 0;
    let totalPlayers = 0;

    events.forEach((event) => {
      if (event.tables) {
        totalTables += event.tables.length;
        event.tables.forEach((table) => {
          if (table.players) {
            totalPlayers += table.players.filter(
              (p) => p.status === "approved"
            ).length;
          }
        });
      }
    });

    return {
      totalEvents: events.length,
      activeEvents,
      finishedEvents,
      totalTables,
      totalPlayers,
      avgTablesPerEvent:
        events.length > 0 ? (totalTables / events.length).toFixed(1) : 0,
      avgPlayersPerTable:
        totalTables > 0 ? (totalPlayers / totalTables).toFixed(1) : 0,
      gameEvents,
      generalEvents,
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-400 mb-4">{error}</p>
        <AdminButton
          onClick={fetchAnalytics}
          variant="secondary"
          icon={RefreshCw}
        >
          Retry
        </AdminButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-cinzel">
            Analytics Dashboard
          </h2>
          <p className="text-gray-400 text-sm">
            Overview of club statistics and metrics
          </p>
        </div>
        <AdminButton
          onClick={fetchAnalytics}
          variant="secondary"
          icon={RefreshCw}
        >
          Refresh
        </AdminButton>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#d00000]/20 to-[#9d0208]/10 border border-[#d00000]/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-[#dc2f02]" />
            <span className="text-[#e85d04] text-xs bg-[#d00000]/20 px-2 py-1 rounded-full">
              Events
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalEvents}</p>
          <p className="text-gray-400 text-sm">Total Events</p>
        </div>

        <div className="bg-gradient-to-br from-[#e85d04]/20 to-[#dc2f02]/10 border border-[#e85d04]/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Table2 className="w-8 h-8 text-[#f48c06]" />
            <span className="text-[#faa307] text-xs bg-[#e85d04]/20 px-2 py-1 rounded-full">
              Tables
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalTables}</p>
          <p className="text-gray-400 text-sm">Total Tables</p>
        </div>

        <div className="bg-gradient-to-br from-[#9d0208]/20 to-[#6a040f]/10 border border-[#9d0208]/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-[#d00000]" />
            <span className="text-[#dc2f02] text-xs bg-[#9d0208]/20 px-2 py-1 rounded-full">
              Players
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalPlayers}</p>
          <p className="text-gray-400 text-sm">Total Players</p>
        </div>

        <div className="bg-gradient-to-br from-[#faa307]/20 to-[#f48c06]/10 border border-[#faa307]/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-[#ffba08]" />
            <span className="text-[#faa307] text-xs bg-[#f48c06]/20 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.activeEvents}</p>
          <p className="text-gray-400 text-sm">Active Events</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Type Distribution */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-white">Event Types</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-blue-500" />
                  Game Events
                </span>
                <span className="text-white font-medium">
                  {stats.gameEvents}
                </span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{
                    width: `${
                      stats.totalEvents > 0
                        ? (stats.gameEvents / stats.totalEvents) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  General Events
                </span>
                <span className="text-white font-medium">
                  {stats.generalEvents}
                </span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{
                    width: `${
                      stats.totalEvents > 0
                        ? (stats.generalEvents / stats.totalEvents) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between text-sm">
            <span className="text-gray-500">Total Events</span>
            <span className="text-white font-medium">{stats.totalEvents}</span>
          </div>
        </div>

        {/* Event Status Distribution */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-white">Event Status</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  Active
                </span>
                <span className="text-white font-medium">
                  {stats.activeEvents}
                </span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{
                    width: `${
                      stats.totalEvents > 0
                        ? (stats.activeEvents / stats.totalEvents) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  Finished
                </span>
                <span className="text-white font-medium">
                  {stats.finishedEvents}
                </span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all"
                  style={{
                    width: `${
                      stats.totalEvents > 0
                        ? (stats.finishedEvents / stats.totalEvents) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between text-sm">
            <span className="text-gray-500">Completion Rate</span>
            <span className="text-white font-medium">
              {stats.totalEvents > 0
                ? Math.round((stats.finishedEvents / stats.totalEvents) * 100)
                : 0}
              %
            </span>
          </div>
        </div>
      </div>

      {/* Averages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Table2 className="w-4 h-4 text-[#dc2f02]" />
            <span className="text-gray-400 text-sm">Avg Tables/Event</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.avgTablesPerEvent}
          </p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="w-4 h-4 text-[#f48c06]" />
            <span className="text-gray-400 text-sm">Avg Players/Table</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.avgPlayersPerTable}
          </p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-[#9d0208]" />
            <span className="text-gray-400 text-sm">Players/Event</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.totalEvents > 0
              ? (stats.totalPlayers / stats.totalEvents).toFixed(1)
              : 0}
          </p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 className="w-4 h-4 text-[#ffba08]" />
            <span className="text-gray-400 text-sm">Game Event %</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {stats.totalEvents > 0
              ? Math.round((stats.gameEvents / stats.totalEvents) * 100)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* API Analytics Data */}
      {analytics && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-[#ffba08]" />
            <h3 className="text-lg font-semibold text-white">
              Server Analytics
            </h3>
          </div>

          <div className="space-y-4">
            {Object.entries(analytics).map(([key, value]) => (
              <div key={key}>
                <h4 className="text-sm font-semibold text-[#faa307] mb-2 capitalize">
                  {key.replace(/_/g, " ")}
                </h4>
                {typeof value === "object" && value !== null ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {Object.entries(value).map(([subKey, subValue]) => (
                      <div
                        key={subKey}
                        className="bg-gray-900/50 rounded-lg p-3"
                      >
                        <p className="text-gray-400 text-xs mb-1 capitalize">
                          {subKey.replace(/_/g, " ")}
                        </p>
                        <p className="text-lg font-bold text-white">
                          {typeof subValue === "number"
                            ? subValue.toLocaleString()
                            : String(subValue)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-xl font-bold text-white">
                      {typeof value === "number"
                        ? value.toLocaleString()
                        : String(value)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Events List */}
      {events.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5 text-[#ffba08]" />
            <h3 className="text-lg font-semibold text-white">Recent Events</h3>
          </div>

          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.slug}
                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      event.status === "active" ? "bg-green-500" : "bg-gray-500"
                    }`}
                  />
                  <div>
                    <p className="text-white font-medium">{event.name}</p>
                    <p className="text-gray-500 text-sm">{event.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">
                    {event.tables?.length || 0} tables
                  </p>
                  <p className="text-gray-500 text-xs">
                    {event.type === "game" ? "Game" : "General"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPanel;
