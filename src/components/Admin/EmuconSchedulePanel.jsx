import { useState, useEffect, useCallback } from "react";
import {
  Clock,
  RefreshCw,
  Edit3,
  Save,
  X,
  AlertTriangle,
  Check,
  Calendar,
  Play,
  Pause,
  Plus,
  Trash2,
} from "lucide-react";
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";
import AdminModal from "./shared/AdminModal";
import AdminButton from "./shared/AdminButton";
import LoadingSpinner from "./shared/LoadingSpinner";
import ConfirmDialog from "./shared/ConfirmDialog";

const PERIOD_TYPE_COLORS = {
  opening: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  activity: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  performance: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  stand: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  closing: "bg-red-500/20 text-red-300 border-red-500/30",
};

const PERIOD_TYPE_LABELS = {
  opening: "Opening",
  activity: "Activity",
  performance: "Performance",
  stand: "Stand Time",
  closing: "Closing",
};

const EmuconSchedulePanel = () => {
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmDeletePeriod, setConfirmDeletePeriod] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    startTime: "",
    endTime: "",
    type: "activity",
    isEditable: true,
  });
  const [createForm, setCreateForm] = useState({
    name: "",
    startTime: "",
    endTime: "",
    type: "activity",
    isEditable: true,
  });
  const [error, setError] = useState(null);

  const backendUrl = config.backendUrl;
  const apiKey = getApiKey();

  const fetchPeriods = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/api/emucon/periods`, {
        headers: { apiKey },
      });
      if (response.ok) {
        const data = await response.json();
        setPeriods(data.periods || []);
      } else {
        setError("Failed to fetch periods");
      }
    } catch (err) {
      console.error("Error fetching periods:", err);
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, apiKey]);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  const handleEditPeriod = (period) => {
    setEditingPeriod(period);
    setEditForm({
      name: period.name || "",
      startTime: period.startTime || "",
      endTime: period.endTime || "",
      type: period.type || "activity",
      isEditable: period.isEditable !== false,
    });
  };

  const handleSavePeriod = async () => {
    if (!editingPeriod) return;
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/emucon/periods/${editingPeriod.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            apiKey,
          },
          body: JSON.stringify({
            name: editForm.name,
            startTime: editForm.startTime,
            endTime: editForm.endTime,
            type: editForm.type,
            isEditable: editForm.isEditable,
          }),
        }
      );

      if (response.ok) {
        await fetchPeriods();
        setEditingPeriod(null);
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to update period");
      }
    } catch (err) {
      console.error("Error updating period:", err);
      setError("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetPeriods = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/emucon/periods/reset`,
        {
          method: "POST",
          headers: { apiKey },
        }
      );

      if (response.ok) {
        await fetchPeriods();
        setShowResetConfirm(false);
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to reset periods");
      }
    } catch (err) {
      console.error("Error resetting periods:", err);
      setError("Failed to reset periods");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreatePeriod = async () => {
    if (!createForm.name || !createForm.startTime || !createForm.endTime) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`${backendUrl}/api/admin/emucon/periods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey,
        },
        body: JSON.stringify(createForm),
      });

      if (response.ok) {
        await fetchPeriods();
        setShowCreateModal(false);
        setCreateForm({
          name: "",
          startTime: "",
          endTime: "",
          type: "activity",
          isEditable: true,
        });
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to create period");
      }
    } catch (err) {
      console.error("Error creating period:", err);
      setError("Failed to create period");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePeriod = async (periodId) => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/emucon/periods/${periodId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            apiKey,
          },
          body: JSON.stringify({ deleteEvents: true }),
        }
      );

      if (response.ok) {
        await fetchPeriods();
        setConfirmDeletePeriod(null);
      } else {
        const data = await response.json();
        setError(data.detail || "Failed to delete period");
      }
    } catch (err) {
      console.error("Error deleting period:", err);
      setError("Failed to delete period");
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate time slot position for visual timeline
  const getTimePosition = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    // Schedule runs from 09:00 to 21:00 (12 hours)
    const startHour = 9;
    const totalMinutes = (hours - startHour) * 60 + minutes;
    const totalDuration = 12 * 60; // 12 hours
    return (totalMinutes / totalDuration) * 100;
  };

  const getTimeWidth = (startTime, endTime) => {
    const startPos = getTimePosition(startTime);
    const endPos = getTimePosition(endTime);
    return endPos - startPos;
  };

  const getDuration = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    const totalMinutes =
      endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-cinzel flex items-center gap-3">
            <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
            EMUCON Schedule
          </h2>
          <p className="text-gray-400 mt-1 text-sm">
            Manage time periods for the event day
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <AdminButton
            variant="primary"
            icon={Plus}
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto"
          >
            Add Period
          </AdminButton>
          <AdminButton
            variant="secondary"
            icon={RefreshCw}
            onClick={fetchPeriods}
            className="w-full sm:w-auto"
          >
            Refresh
          </AdminButton>
          <AdminButton
            variant="danger"
            icon={AlertTriangle}
            onClick={() => setShowResetConfirm(true)}
            className="w-full sm:w-auto"
          >
            Reset to Default
          </AdminButton>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Visual Timeline */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          Day Timeline Overview
        </h3>

        {/* Timeline container - scrollable on mobile */}
        <div className="relative overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Time markers - Top */}
            <div className="relative mb-2">
              <div className="flex justify-between text-xs font-medium text-gray-400">
                {[
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                  "20:00",
                  "21:00",
                ].map((time) => (
                  <span key={time} className="flex flex-col items-center">
                    {time}
                  </span>
                ))}
              </div>
            </div>

            {/* Timeline bar with grid */}
            <div className="relative h-24 bg-gray-900/50 rounded-lg border border-gray-700">
              {/* Hour grid lines */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: 13 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-r border-gray-700/30 last:border-r-0"
                  />
                ))}
              </div>
              {/* Period blocks */}
              <div className="absolute inset-0">
                {periods.map((period) => {
                  const left = getTimePosition(period.startTime);
                  const width = getTimeWidth(period.startTime, period.endTime);
                  const duration = getDuration(
                    period.startTime,
                    period.endTime
                  );
                  const typeColor =
                    PERIOD_TYPE_COLORS[period.type] ||
                    PERIOD_TYPE_COLORS.activity;

                  return (
                    <div
                      key={period.id}
                      className={`absolute top-2 bottom-2 rounded-lg cursor-pointer transition-all hover:scale-105 hover:z-10 hover:shadow-lg group ${typeColor
                        .replace("text-", "bg-")
                        .replace("/20", "/50")} border-2`}
                      style={{
                        left: `${left}%`,
                        width: `${Math.max(width, 2)}%`,
                      }}
                      onClick={() => handleEditPeriod(period)}
                      title={`${period.name}: ${period.startTime} - ${period.endTime} (${duration})`}
                    >
                      <div className="h-full flex flex-col items-center justify-center overflow-hidden px-2">
                        <span className="text-xs font-bold text-white truncate">
                          {width > 6 ? period.name : ""}
                        </span>
                        {width > 8 && (
                          <span className="text-[10px] text-white/80 mt-0.5">
                            {duration}
                          </span>
                        )}
                      </div>
                      {/* Edit indicator on hover */}
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time markers - Bottom */}
            <div className="relative mt-2">
              <div className="flex justify-between text-xs text-gray-500">
                {[
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                  "20:00",
                  "21:00",
                ].map((time) => (
                  <span key={time}>{time}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-700">
          {Object.entries(PERIOD_TYPE_LABELS).map(([type, label]) => (
            <div key={type} className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded ${PERIOD_TYPE_COLORS[
                  type
                ]
                  ?.replace("text-", "bg-")
                  .replace("/20", "/60")}`}
              />
              <span className="text-[10px] sm:text-xs text-gray-400">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Periods List */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-white">
            All Periods
          </h3>
        </div>

        <div className="divide-y divide-gray-700/50">
          {periods.map((period) => (
            <div
              key={period.id}
              className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-900/30 transition-colors"
            >
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
                <div
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                    PERIOD_TYPE_COLORS[period.type] ||
                    PERIOD_TYPE_COLORS.activity
                  }`}
                >
                  {PERIOD_TYPE_LABELS[period.type] || period.type}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">
                    {period.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {period.startTime} - {period.endTime}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {period.isEditable === false && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Pause className="w-3 h-3" />
                    <span className="hidden sm:inline">Non-schedulable</span>
                    <span className="sm:hidden">Locked</span>
                  </span>
                )}
                {period.isEditable !== false && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    <span className="hidden sm:inline">
                      Manager schedulable
                    </span>
                    <span className="sm:hidden">Open</span>
                  </span>
                )}
                <AdminButton
                  size="sm"
                  variant="ghost"
                  icon={Edit3}
                  onClick={() => handleEditPeriod(period)}
                >
                  <span className="hidden sm:inline">Edit</span>
                </AdminButton>
                <AdminButton
                  size="sm"
                  variant="ghost"
                  icon={Trash2}
                  onClick={() => setConfirmDeletePeriod(period)}
                  className="text-red-400 hover:text-red-300"
                >
                  Delete
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Period Modal */}
      <AdminModal
        isOpen={!!editingPeriod}
        onClose={() => setEditingPeriod(null)}
        title="Edit Period"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Period Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={editForm.startTime}
                onChange={(e) =>
                  setEditForm({ ...editForm, startTime: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={editForm.endTime}
                onChange={(e) =>
                  setEditForm({ ...editForm, endTime: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Period Type
            </label>
            <select
              value={editForm.type}
              onChange={(e) =>
                setEditForm({ ...editForm, type: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
            >
              {Object.entries(PERIOD_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isEditable"
              checked={editForm.isEditable}
              onChange={(e) =>
                setEditForm({ ...editForm, isEditable: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-amber-500 focus:ring-amber-500/30"
            />
            <label htmlFor="isEditable" className="text-sm text-gray-300">
              Allow managers to schedule events in this period
            </label>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 text-sm text-gray-400">
            <p className="font-medium text-gray-300 mb-1">Period Types:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                <strong>Activity</strong> - Regular club activities (managers
                can schedule)
              </li>
              <li>
                <strong>Performance</strong> - Live stage performances (admin
                only)
              </li>
              <li>
                <strong>Stand</strong> - Stand time for all corners
              </li>
              <li>
                <strong>Opening/Closing</strong> - Ceremony periods
              </li>
            </ul>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <AdminButton
              variant="secondary"
              icon={X}
              onClick={() => setEditingPeriod(null)}
              className="w-full sm:w-auto"
            >
              Cancel
            </AdminButton>
            <AdminButton
              icon={Save}
              onClick={handleSavePeriod}
              loading={isSaving}
              className="w-full sm:w-auto"
            >
              Save Changes
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetPeriods}
        title="Reset Periods"
        message="Are you sure you want to reset all periods to their default values? This will restore the original schedule and cannot be undone."
        confirmText="Reset"
        confirmVariant="danger"
        isLoading={isSaving}
      />

      {/* Create Period Modal */}
      <AdminModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Period"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Period Name *
            </label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm({ ...createForm, name: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
              placeholder="Activity Slot 6"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                value={createForm.startTime}
                onChange={(e) =>
                  setCreateForm({ ...createForm, startTime: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Time *
              </label>
              <input
                type="time"
                value={createForm.endTime}
                onChange={(e) =>
                  setCreateForm({ ...createForm, endTime: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Period Type
            </label>
            <select
              value={createForm.type}
              onChange={(e) =>
                setCreateForm({ ...createForm, type: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:border-amber-500/50 focus:outline-none"
            >
              {Object.entries(PERIOD_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="createIsEditable"
              checked={createForm.isEditable}
              onChange={(e) =>
                setCreateForm({ ...createForm, isEditable: e.target.checked })
              }
              className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-amber-500 focus:ring-amber-500/30"
            />
            <label htmlFor="createIsEditable" className="text-sm text-gray-300">
              Allow managers to schedule events in this period
            </label>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <AdminButton
              variant="secondary"
              icon={X}
              onClick={() => setShowCreateModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </AdminButton>
            <AdminButton
              icon={Plus}
              onClick={handleCreatePeriod}
              loading={isSaving}
              className="w-full sm:w-auto"
            >
              Create Period
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Delete Period Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDeletePeriod}
        onClose={() => setConfirmDeletePeriod(null)}
        onConfirm={() => handleDeletePeriod(confirmDeletePeriod?.id)}
        title="Delete Period"
        message={`Are you sure you want to delete "${
          confirmDeletePeriod?.name ||
          confirmDeletePeriod?.label ||
          "this period"
        }"? This will also delete all events scheduled in this period.`}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={isSaving}
      />
    </div>
  );
};

export default EmuconSchedulePanel;
