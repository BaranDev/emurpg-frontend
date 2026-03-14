import { useState, useEffect, useCallback } from "react";
import {
  Download,
  FileText,
  Globe,
  AlertCircle,
  CheckCircle,
  History,
  FileSpreadsheet,
  Calendar,
  ChevronDown,
  ChevronRight,
  Shield,
  ShieldOff,
  Users,
  TableProperties,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";
import AdminButton from "./shared/AdminButton";
import ConfirmDialog from "./shared/ConfirmDialog";
import LoadingSpinner from "./shared/LoadingSpinner";

// ─── helpers ────────────────────────────────────────────────────────────────

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const filenameFromResponse = (response, fallback) => {
  const cd = response.headers.get("Content-Disposition");
  if (cd) {
    const m = cd.match(/filename="?([^"]+)"?/);
    if (m) return m[1];
  }
  return fallback;
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ─── sub-components ──────────────────────────────────────────────────────────

const Toast = ({ toast, onDismiss }) => {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-5 py-4 shadow-2xl transition-all ${
        isSuccess
          ? "bg-emerald-900/80 border-emerald-600 text-emerald-300"
          : "bg-red-900/80 border-red-600 text-red-300"
      }`}
    >
      {isSuccess ? (
        <CheckCircle className="h-5 w-5 flex-shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 flex-shrink-0" />
      )}
      <p className="text-sm">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
};

const SummaryCard = ({ label, value, color = "text-yellow-400" }) => (
  <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 flex flex-col gap-1">
    <span className="text-gray-400 text-sm">{label}</span>
    <span className={`text-3xl font-bold ${color}`}>{value}</span>
  </div>
);

const EventTypeBadge = ({ type }) => {
  if (type === "game") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-900/40 border border-blue-600/40 px-2 py-0.5 text-xs font-medium text-blue-300">
        Game
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-purple-900/40 border border-purple-600/40 px-2 py-0.5 text-xs font-medium text-purple-300">
      General
    </span>
  );
};

const AnonymizedBadge = () => (
  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-900/40 border border-yellow-600/40 px-2 py-0.5 text-xs font-medium text-yellow-300">
    <Shield className="h-3 w-3" />
    Anonymized
  </span>
);

const NoReportBadge = () => (
  <span className="inline-flex items-center gap-1 rounded-full bg-gray-700/60 border border-gray-600 px-2 py-0.5 text-xs font-medium text-gray-400">
    No Report
  </span>
);

// ─── event card ──────────────────────────────────────────────────────────────

const EventCard = ({ event, onAnonymize, onDownloadExcel }) => {
  const [expanded, setExpanded] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [confirmAnon, setConfirmAnon] = useState(false);
  const [anonLoading, setAnonLoading] = useState(false);

  const handleDownloadExcel = async () => {
    setDownloadingExcel(true);
    try {
      await onDownloadExcel(event.slug);
    } finally {
      setDownloadingExcel(false);
    }
  };

  const handleConfirmAnonymize = async () => {
    setAnonLoading(true);
    try {
      await onAnonymize(event.slug);
      setConfirmAnon(false);
    } finally {
      setAnonLoading(false);
    }
  };

  const isGame = event.event_type === "game";

  return (
    <>
      <div className="bg-gray-800/60 border border-gray-700 rounded-xl overflow-hidden">
        {/* card header – always visible */}
        <div
          className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none hover:bg-gray-700/30 transition-colors"
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="text-gray-400">
            {expanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-white truncate">
                {event.event_name}
              </span>
              <EventTypeBadge type={event.event_type} />
              {event.is_anonymized && <AnonymizedBadge />}
              {event.has_report === false && <NoReportBadge />}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDate(event.start_date)}
              {event.end_date && event.end_date !== event.start_date
                ? ` – ${formatDate(event.end_date)}`
                : ""}
            </p>
          </div>

          {/* quick stats */}
          <div className="hidden sm:flex items-center gap-4 text-sm text-gray-400 shrink-0">
            {isGame ? (
              <>
                <span className="flex items-center gap-1">
                  <TableProperties className="h-4 w-4" />
                  {event.tables_count ?? 0} tables
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {event.total_players ?? 0} players
                </span>
                {event.fill_rate != null && (
                  <span className="text-yellow-400 font-medium">
                    {Math.round(event.fill_rate)}% fill
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {event.total_registrations ?? 0} registered
                </span>
                {event.approved_count != null && (
                  <span className="text-emerald-400 font-medium">
                    {event.approved_count} approved
                  </span>
                )}
              </>
            )}
          </div>

          {/* action buttons – stop propagation so they don't toggle expand */}
          <div
            className="flex items-center gap-2 shrink-0 ml-2"
            onClick={(e) => e.stopPropagation()}
          >
            {event.has_report !== false && (
              <AdminButton
                size="sm"
                variant="secondary"
                icon={Download}
                onClick={handleDownloadExcel}
                loading={downloadingExcel}
                disabled={downloadingExcel}
              >
                Excel
              </AdminButton>
            )}
            {!event.is_anonymized && (
              <AdminButton
                size="sm"
                variant="danger"
                icon={ShieldOff}
                onClick={() => setConfirmAnon(true)}
              >
                Anonymize
              </AdminButton>
            )}
          </div>
        </div>

        {/* expanded detail */}
        {expanded && (
          <div className="border-t border-gray-700 px-5 py-4">
            {/* mobile quick stats */}
            <div className="flex sm:hidden flex-wrap gap-3 mb-4 text-sm text-gray-400">
              {isGame ? (
                <>
                  <span className="flex items-center gap-1">
                    <TableProperties className="h-4 w-4" />
                    {event.tables_count ?? 0} tables
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {event.total_players ?? 0} players
                  </span>
                  {event.fill_rate != null && (
                    <span className="text-yellow-400 font-medium">
                      {Math.round(event.fill_rate)}% fill
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {event.total_registrations ?? 0} registered
                  </span>
                  {event.approved_count != null && (
                    <span className="text-emerald-400 font-medium">
                      {event.approved_count} approved
                    </span>
                  )}
                </>
              )}
            </div>

            {/* tables detail (game events) */}
            {isGame && event.tables && event.tables.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">
                  Tables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {event.tables.map((table, idx) => (
                    <div
                      key={table.id ?? idx}
                      className="bg-gray-900/60 border border-gray-700 rounded-lg p-3"
                    >
                      <p className="font-medium text-white text-sm truncate">
                        {table.game_name}
                      </p>
                      {table.game_master && (
                        <p className="text-xs text-gray-400 truncate">
                          GM: {table.game_master}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {table.player_count ?? 0} / {table.quota ?? "?"}
                        </span>
                        {table.fill_rate != null && (
                          <span className="text-xs text-yellow-400 font-medium">
                            {Math.round(table.fill_rate)}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* club distribution (general events) */}
            {!isGame &&
              event.club_distribution &&
              event.club_distribution.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">
                    Club Distribution
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {event.club_distribution.map((entry, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-900/60 border border-gray-700 rounded-lg p-3 flex items-center justify-between gap-2"
                      >
                        <span className="text-sm text-gray-300 truncate">
                          {entry.club ?? entry.club_name ?? "Unknown"}
                        </span>
                        <span className="text-sm font-bold text-yellow-400 shrink-0">
                          {entry.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* generated_at */}
            {event.generated_at && (
              <p className="text-xs text-gray-500 mt-2">
                Report generated: {formatDateTime(event.generated_at)}
              </p>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmAnon}
        onClose={() => setConfirmAnon(false)}
        onConfirm={handleConfirmAnonymize}
        title="Anonymize Event Data"
        message={`This will permanently remove personal data for "${event.event_name}". This action cannot be undone.`}
        confirmText="Anonymize"
        cancelText="Cancel"
        variant="danger"
        loading={anonLoading}
      />
    </>
  );
};

// ─── bulk CSV section ─────────────────────────────────────────────────────────

const BulkCsvSection = ({ backendUrl, apiKey, onToast }) => {
  const [language, setLanguage] = useState("en");
  const [generating, setGenerating] = useState(null); // "current"|"previous"|"all"

  const generate = async (type) => {
    setGenerating(type);
    try {
      const response = await fetch(`${backendUrl}/api/admin/generate-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apiKey },
        body: JSON.stringify({ type, language }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to generate report");
      }
      const blob = await response.blob();
      const filename = filenameFromResponse(
        response,
        `emurpg-report-${type}-${new Date().toISOString().slice(0, 10)}.csv`
      );
      downloadBlob(blob, filename);
      onToast({ type: "success", message: `Downloaded ${type} events report` });
    } catch (err) {
      onToast({ type: "error", message: err.message || "Download failed" });
    } finally {
      setGenerating(null);
    }
  };

  const reportTypes = [
    { id: "current", label: "Current Events", icon: Calendar },
    { id: "previous", label: "Previous Events", icon: History },
    { id: "all", label: "All Events", icon: FileSpreadsheet },
  ];

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <Globe className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-white">Bulk CSV Export</h3>
      </div>

      {/* language selector */}
      <div className="flex gap-3 mb-5">
        {["en", "tr"].map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`flex-1 max-w-[120px] px-4 py-3 rounded-lg border-2 transition-all text-center ${
              language === lang
                ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"
            }`}
          >
            <span className="text-lg font-bold block">
              {lang.toUpperCase()}
            </span>
            <span className="text-xs">
              {lang === "en" ? "English" : "Turkish"}
            </span>
          </button>
        ))}
      </div>

      {/* download buttons */}
      <div className="flex flex-wrap gap-3">
        {reportTypes.map(({ id, label, icon }) => (
          <AdminButton
            key={id}
            variant="secondary"
            icon={generating === id ? undefined : icon}
            loading={generating === id}
            disabled={generating !== null}
            onClick={() => generate(id)}
          >
            {label}
          </AdminButton>
        ))}
      </div>
    </div>
  );
};

// ─── main component ───────────────────────────────────────────────────────────

const ReportsPanel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [toast, setToast] = useState(null);

  const backendUrl = config.backendUrl;
  const apiKey = getApiKey();

  const showToast = useCallback((t) => {
    setToast(t);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`${backendUrl}/api/admin/reports`, {
        headers: { apiKey },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setFetchError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, apiKey]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDownloadExcel = async (slug) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/admin/events/${slug}/report`,
        { headers: { apiKey } }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const filename = filenameFromResponse(res, `${slug}-report.xlsx`);
      downloadBlob(blob, filename);
      showToast({ type: "success", message: "Excel report downloaded" });
    } catch (err) {
      showToast({ type: "error", message: err.message || "Download failed" });
    }
  };

  const handleAnonymize = async (slug) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/admin/reports/${slug}/anonymize`,
        {
          method: "POST",
          headers: { apiKey },
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      showToast({ type: "success", message: "Event data anonymized" });
      // refresh list so the badge updates
      fetchReports();
    } catch (err) {
      showToast({ type: "error", message: err.message || "Anonymize failed" });
      throw err; // let EventCard re-throw so it closes dialog only on success
    }
  };

  // summary stats
  const totalParticipants = events.reduce((sum, e) => {
    if (e.event_type === "game") return sum + (e.total_players ?? 0);
    return sum + (e.total_registrations ?? 0);
  }, 0);
  const anonymizedCount = events.filter((e) => e.is_anonymized).length;

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-cinzel">Reports</h2>
          <p className="text-gray-400 text-sm">
            Finished event reports, downloads, and data management
          </p>
        </div>
        <AdminButton
          variant="secondary"
          icon={RefreshCw}
          onClick={fetchReports}
          disabled={loading}
          loading={loading}
        >
          Refresh
        </AdminButton>
      </div>

      {/* fetch error banner */}
      {fetchError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-400 flex-1">{fetchError}</p>
          <button
            onClick={() => setFetchError(null)}
            className="ml-auto text-red-400 hover:text-red-300 text-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* loading */}
      {loading && <LoadingSpinner message="Loading reports…" />}

      {/* content once loaded */}
      {!loading && !fetchError && (
        <>
          {/* summary bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard
              label="Finished Events"
              value={events.length}
              color="text-yellow-400"
            />
            <SummaryCard
              label="Total Participants"
              value={totalParticipants}
              color="text-blue-400"
            />
            <SummaryCard
              label="Anonymized"
              value={anonymizedCount}
              color="text-emerald-400"
            />
          </div>

          {/* event list */}
          {events.length === 0 ? (
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-10 text-center">
              <FileText className="h-10 w-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No finished events found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <EventCard
                  key={event.slug}
                  event={event}
                  onAnonymize={handleAnonymize}
                  onDownloadExcel={handleDownloadExcel}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* bulk CSV section */}
      <BulkCsvSection
        backendUrl={backendUrl}
        apiKey={apiKey}
        onToast={showToast}
      />

      {/* toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};

export default ReportsPanel;
