import PropTypes from "prop-types";
import { LogOut, Bell, RefreshCw, User, Swords } from "lucide-react";
import { useServerHealth } from "./shared/useServerHealth";

const STATUS_CONFIG = {
  checking: {
    dotClass: "bg-amber-400 animate-pulse",
    label: "Checking Server Connection...",
    labelClass: "text-amber-400",
  },
  online: {
    dotClass: "bg-emerald-500",
    label: "Server Online",
    labelClass: "text-emerald-400",
  },
  degraded: {
    dotClass: "bg-amber-500 animate-pulse",
    label: "Server is slow",
    labelClass: "text-amber-400",
  },
  offline: {
    dotClass: "bg-red-500",
    label: "Server Offline(don't refresh)",
    labelClass: "text-red-400",
  },
};

export const ServerStatus = () => {
  const { status, responseMs } = useServerHealth();
  const { dotClass, label, labelClass } = STATUS_CONFIG[status];

  return (
    <div
      className="flex items-center gap-2 rounded-md border border-amber-800/40 bg-gray-800/80 px-3 py-1.5 text-xs"
      title="API server health — checked every 30s"
    >
      <Swords className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
      <div className={`h-2 w-2 flex-shrink-0 rounded-full ${dotClass}`} />
      <span className={`font-medium ${labelClass}`}>{label}</span>
      {responseMs !== null && (
        <>
          <span className="text-gray-500">·</span>
          <span
            className={
              responseMs >= 800
                ? "text-red-400"
                : responseMs >= 300
                  ? "text-amber-400"
                  : "text-emerald-400"
            }
          >
            {responseMs}ms
          </span>
        </>
      )}
    </div>
  );
};

export const ServerStatusDot = () => {
  const { status } = useServerHealth();
  const { dotClass, label } = STATUS_CONFIG[status];

  return (
    <div
      className="flex items-center justify-center p-1.5 rounded-md border border-amber-800/40 bg-gray-800/80"
      title={`${label} — checked every 30s`}
    >
      <div className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
    </div>
  );
};

const AdminHeader = ({ lastSyncTime }) => {
  const formatLastSync = (time) => {
    if (!time) return "Never";
    const diff = Date.now() - new Date(time).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-amber-900/30 bg-gradient-to-r from-gray-900/95 via-gray-900/95 to-gray-950/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Server status + last sync */}
        <div className="flex items-center gap-3">
          <ServerStatus />
          {adminType === "emurpg" && lastSyncTime && (
            <div className="hidden items-center gap-2 rounded-lg border border-amber-900/30 bg-gray-900/50 px-3 py-1.5 text-xs text-amber-400/70 sm:flex">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Synced: {formatLastSync(lastSyncTime)}
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Sync Button (EMURPG admin only) */}
          {adminType === "emurpg" && onSync && (
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="flex items-center gap-2 rounded-lg border border-amber-900/30 bg-gray-900/50 px-3 py-2 text-sm text-amber-400 transition-all hover:bg-amber-900/20 hover:text-amber-300 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
              />
              {isSyncing ? "Syncing..." : "Sync Now"}
            </button>
          )}

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-amber-400/60 transition-all hover:bg-amber-900/20 hover:text-amber-300">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 border-l border-amber-900/30 pl-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-amber-100">{username}</p>
                <p className="text-xs text-amber-400/50">
                  {adminType === "emurpg" ? "Administrator" : "Event Manager"}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="rounded-lg p-2 text-red-400/70 transition-all hover:bg-red-900/20 hover:text-red-300"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

AdminHeader.propTypes = {
  username: PropTypes.string.isRequired,
  adminType: PropTypes.oneOf(["emurpg", "emucon_manager"]).isRequired,
  onLogout: PropTypes.func.isRequired,
  onSync: PropTypes.func,
  isSyncing: PropTypes.bool,
  lastSyncTime: PropTypes.string,
};

export default AdminHeader;
