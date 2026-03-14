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
  Phone,
  Clock,
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

// ─── player list modal ────────────────────────────────────────────────────────

const PlayerListModal = ({ table, onClose, isAnonymized }) => {
  const players = table?.players ?? [];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-700 gap-4 shrink-0">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">{table.game_name}</h3>
            <p className="text-sm text-gray-400 mt-0.5">
              GM: <span className="text-gray-300">{table.game_master || "—"}</span>
              {"  ·  "}
              <span className="text-yellow-400 font-semibold">
                {table.player_count}/{table.quota}
              </span>
              <span className="text-gray-500"> players</span>
              {table.fill_rate != null && (
                <span className="text-gray-500"> ({Math.round(table.fill_rate)}% fill)</span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors shrink-0 mt-0.5"
            aria-label="Close"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* player list */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {players.length === 0 ? (
            <div className="text-center py-10">
              <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No player data available for this table.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="grid grid-cols-[1.5rem_1fr_7rem_9rem] gap-x-3 px-3 pb-2 mb-1 border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
                <span>#</span>
                <span>Name</span>
                <span>Student ID</span>
                <span>Contact / Registered</span>
              </div>
              {players.map((player, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1.5rem_1fr_7rem_9rem] gap-x-3 px-3 py-2.5 rounded-lg bg-gray-800/50 hover:bg-gray-800/80 transition-colors items-start"
                >
                  <span className="text-xs text-gray-600 pt-0.5">{idx + 1}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {player.name || "—"}
                    </p>
                    {player.seat_id != null && (
                      <p className="text-xs text-gray-600">Seat {player.seat_id}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 font-mono truncate">
                    {player.student_id || "—"}
                  </p>
                  <div className="min-w-0">
                    {player.contact ? (
                      <p className="text-sm text-gray-300 truncate flex items-center gap-1">
                        <Phone className="h-3 w-3 shrink-0 text-gray-500" />
                        {player.contact}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">—</p>
                    )}
                    {player.registered_at && (
                      <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0" />
                        {formatDateTime(player.registered_at)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="px-6 py-3 border-t border-gray-700 shrink-0 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {players.length} player{players.length !== 1 ? "s" : ""}
          </span>
          {isAnonymized && (
            <span className="text-xs text-yellow-500 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Personal data has been anonymized
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── registration list (general events) ──────────────────────────────────────

const RegistrationList = ({ registrations }) => {
  if (!registrations || registrations.length === 0) {
    return (
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 text-center">
        <Users className="h-7 w-7 text-gray-600 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">
          Registration data was cleared when this event concluded.
        </p>
        <p className="text-gray-600 text-xs mt-1">
          Download the Excel report to access a permanent copy.
        </p>
      </div>
    );
  }

  const statusColor = (s) => {
    if (s === "approved") return "text-emerald-400";
    if (s === "rejected") return "text-red-400";
    return "text-yellow-400";
  };

  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-[1.5rem_1fr_7rem_6rem_7rem] gap-x-3 px-3 pb-2 mb-1 border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
        <span>#</span>
        <span>Name / Student ID</span>
        <span>Contact</span>
        <span>Status</span>
        <span>Registered</span>
      </div>
      {registrations.map((reg, idx) => (
        <div
          key={idx}
          className="grid grid-cols-[1.5rem_1fr_7rem_6rem_7rem] gap-x-3 px-3 py-2.5 rounded-lg bg-gray-800/50 hover:bg-gray-800/80 transition-colors items-start"
        >
          <span className="text-xs text-gray-600 pt-0.5">{idx + 1}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{reg.name || "—"}</p>
            <p className="text-xs text-gray-500 font-mono">{reg.student_id || "—"}</p>
          </div>
          <p className="text-sm text-gray-300 truncate">{reg.contact || "—"}</p>
          <span className={`text-xs font-medium capitalize ${statusColor(reg.status)}`}>
            {reg.status || "—"}
          </span>
          <p className="text-xs text-gray-500">
            {reg.registered_at ? formatDateTime(reg.registered_at) : "—"}
          </p>
        </div>
      ))}
    </div>
  );
};

// ─── event card ──────────────────────────────────────────────────────────────

const EventCard = ({ event, onAnonymize, onDownloadExcel }) => {
  const [expanded, setExpanded] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [confirmAnon, setConfirmAnon] = useState(false);
  const [anonLoading, setAnonLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

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
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <TableProperties className="h-4 w-4 text-gray-500" />
                  Tables
                  <span className="text-xs text-gray-500 font-normal">— click a table to see attendees</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {event.tables.map((table, idx) => (
                    <button
                      key={table.id ?? idx}
                      type="button"
                      onClick={() => setSelectedTable(table)}
                      className="bg-gray-900/60 border border-gray-700 rounded-lg p-3 text-left hover:border-yellow-600/60 hover:bg-gray-800/70 transition-all group cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-600/50"
                    >
                      <p className="font-medium text-white text-sm truncate group-hover:text-yellow-400 transition-colors">
                        {table.game_name}
                      </p>
                      {table.game_master && (
                        <p className="text-xs text-gray-400 truncate">
                          GM: {table.game_master}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {table.player_count ?? 0} / {table.quota ?? "?"}
                        </span>
                        {table.fill_rate != null && (
                          <span className="text-xs text-yellow-400 font-medium">
                            {Math.round(table.fill_rate)}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-700 group-hover:text-gray-500 mt-1.5 transition-colors">
                        View attendees →
                      </p>
                    </button>
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

            {/* registrations (general events) */}
            {!isGame && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  Registrations
                </h4>
                <RegistrationList registrations={event.registrations} />
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

      {selectedTable && (
        <PlayerListModal
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
          isAnonymized={event.is_anonymized}
        />
      )}
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
