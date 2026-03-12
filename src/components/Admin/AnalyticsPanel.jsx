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

const formatValue = (v) => {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") return v.toLocaleString();
  if (typeof v !== "object") return String(v);
  // Flatten object/array into readable key: value lines
  const entries = Array.isArray(v) ? v.map((item, i) => [i, item]) : Object.entries(v);
  return entries
    .map(([k, val]) => `${String(k).replace(/_/g, " ")}: ${formatValue(val)}`)
    .join(", ");
};

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

      {/* Server Analytics — structured sections */}
      {analytics && (
        <div className="space-y-6">

          {/* Summary KPIs */}
          {analytics.summary && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-5 h-5 text-[#ffba08]" />
                <h3 className="text-lg font-semibold text-white">Report Summary</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-white">{analytics.summary.total_events_reported ?? 0}</p>
                  <p className="text-gray-400 text-xs mt-1">Events Reported</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-white">{(analytics.summary.total_registrations ?? 0).toLocaleString()}</p>
                  <p className="text-gray-400 text-xs mt-1">Total Registrations</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-400">{(analytics.summary.total_approved ?? 0).toLocaleString()}</p>
                  <p className="text-gray-400 text-xs mt-1">Approved</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-[#ffba08]">{analytics.summary.overall_approval_rate ?? 0}%</p>
                  <p className="text-gray-400 text-xs mt-1">Approval Rate</p>
                </div>
              </div>
            </div>
          )}

          {/* Club Totals */}
          {analytics.club_totals && Object.keys(analytics.club_totals).length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-[#ffba08]" />
                <h3 className="text-lg font-semibold text-white">Club Participation (All Time)</h3>
              </div>
              <div className="space-y-3">
                {Object.entries(analytics.club_totals)
                  .sort(([, a], [, b]) => b - a)
                  .map(([club, count]) => {
                    const max = Math.max(...Object.values(analytics.club_totals));
                    const pct = max > 0 ? Math.round((count / max) * 100) : 0;
                    return (
                      <div key={club}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{club}</span>
                          <span className="text-white font-semibold">{count.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#dc2f02] rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Per-Event Reports */}
          {analytics.event_reports && analytics.event_reports.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-[#ffba08]" />
                <h3 className="text-lg font-semibold text-white">Per-Event Reports</h3>
                <span className="ml-auto text-xs text-gray-500">{analytics.event_reports.length} reports</span>
              </div>
              <div className="space-y-4">
                {analytics.event_reports.map((report, i) => (
                  <details
                    key={report.event_slug ?? i}
                    className="bg-gray-900/50 rounded-xl overflow-hidden group"
                  >
                    <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <Award className="w-4 h-4 text-[#faa307] shrink-0" />
                        <div>
                          <p className="text-white font-medium text-sm">
                            {report.event_slug ?? `Report #${i + 1}`}
                          </p>
                          <p className="text-gray-500 text-xs capitalize">
                            {report.report_type?.replace(/_/g, " ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        {report.statistics && (
                          <>
                            <span className="text-gray-400">
                              <span className="text-white font-semibold">
                                {report.statistics.total_registrations ?? 0}
                              </span>{" "}
                              registered
                            </span>
                            <span className="text-emerald-400 font-semibold">
                              {report.statistics.approved ?? 0} approved
                            </span>
                          </>
                        )}
                        <svg className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </summary>

                    <div className="px-4 pb-4 space-y-4">
                      {/* Statistics breakdown */}
                      {report.statistics && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                          {Object.entries(report.statistics).map(([k, v]) => (
                            <div key={k} className="bg-gray-800/60 rounded-lg p-3 text-center">
                              <p className="text-lg font-bold text-white">
                                {typeof v === "number" ? v.toLocaleString() : String(v)}
                              </p>
                              <p className="text-gray-400 text-xs mt-0.5 capitalize">{k.replace(/_/g, " ")}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Club distribution */}
                      {report.club_distribution && Object.keys(report.club_distribution).length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-[#faa307] uppercase tracking-wide mb-2">Club Distribution</p>
                          <div className="space-y-2">
                            {Object.entries(report.club_distribution)
                              .sort(([, a], [, b]) => b - a)
                              .map(([club, count]) => {
                                const total = Object.values(report.club_distribution).reduce((s, n) => s + n, 0);
                                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                return (
                                  <div key={club}>
                                    <div className="flex justify-between text-xs mb-0.5">
                                      <span className="text-gray-300">{club}</span>
                                      <span className="text-white font-medium">{count} <span className="text-gray-500">({pct}%)</span></span>
                                    </div>
                                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-[#f48c06] rounded-full transition-all"
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      {/* Clubs list */}
                      {Array.isArray(report.clubs) && report.clubs.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-[#faa307] uppercase tracking-wide mb-2">Participating Clubs</p>
                          <div className="flex flex-wrap gap-2">
                            {report.clubs.map((club) => (
                              <span key={club} className="text-xs bg-gray-800 border border-gray-600 text-gray-300 px-2 py-1 rounded-full">
                                {club}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Any other top-level scalar fields */}
                      {(() => {
                        const skip = new Set(["report_type", "event_slug", "statistics", "club_distribution", "clubs"]);
                        const extras = Object.entries(report).filter(([k]) => !skip.has(k));
                        if (!extras.length) return null;
                        return (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {extras.map(([k, v]) => (
                              <div key={k} className="bg-gray-800/60 rounded-lg p-3">
                                <p className="text-gray-400 text-xs mb-1 capitalize">{k.replace(/_/g, " ")}</p>
                                <p className="text-sm font-semibold text-white break-words">{formatValue(v)}</p>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
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
