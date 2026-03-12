import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  FileText,
  Image,
  Users,
  Table2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
// XCircle, ChevronDown, ChevronUp retained for event list expand/collapse UI
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";
import AdminModal from "./shared/AdminModal";
import AdminButton from "./shared/AdminButton";
import LoadingSpinner from "./shared/LoadingSpinner";
import ConfirmDialog from "./shared/ConfirmDialog";
import { useWebSocket } from "../../hooks/useWebSocket";

// ── Shared arcane input style helpers ────────────────────────────────────────
const INPUT_CLS =
  "w-full px-3 py-1.5 rounded-lg text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all duration-200";
const INPUT_STYLE = {
  background: "rgba(6, 8, 18, 0.85)",
  border: "1px solid rgba(201,162,39,0.2)",
};
const LABEL_CLS =
  "block text-xs text-stone-500 font-cinzel tracking-wide uppercase mb-1";

function AInput(props) {
  return <input {...props} className={INPUT_CLS} style={INPUT_STYLE} />;
}
function ATextarea(props) {
  return <textarea {...props} className={INPUT_CLS} style={INPUT_STYLE} />;
}
function ASelect(props) {
  return (
    <select
      {...props}
      className={`${INPUT_CLS} bg-[rgba(6,8,18,0.85)]`}
      style={INPUT_STYLE}
    />
  );
}

function FormDivider({ label }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <div
        className="h-px flex-1"
        style={{ background: "rgba(201,162,39,0.12)" }}
      />
      <span className="text-xs text-amber-500/40 font-cinzel tracking-widest uppercase flex-shrink-0">
        {label}
      </span>
      <div
        className="h-px flex-1"
        style={{ background: "rgba(201,162,39,0.12)" }}
      />
    </div>
  );
}

function EventFormFields({
  formData,
  onChange,
  clubInput,
  onClubInputChange,
  onAddClub,
  onRemoveClub,
  showClubs,
}) {
  return (
    <div className="space-y-3">
      {/* ── Identity ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className={LABEL_CLS}>Event Name</label>
          <AInput
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="e.g. EMURPG Spring 2025"
            required
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Type</label>
          <ASelect
            name="event_type"
            value={formData.event_type}
            onChange={onChange}
          >
            <option value="game">Game (RPG)</option>
            <option value="general">General (Club)</option>
          </ASelect>
        </div>
      </div>

      <div>
        <label className={LABEL_CLS}>Description</label>
        <ATextarea
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={2}
          placeholder="Brief event description…"
        />
      </div>

      {/* ── Schedule ────────────────────────────────────── */}
      <FormDivider label="Schedule" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLS}>Start Date</label>
          <AInput
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Start Time</label>
          <AInput
            type="text"
            name="start_time"
            value={formData.start_time}
            onChange={onChange}
            placeholder="10:00"
          />
        </div>
        <div>
          <label className={LABEL_CLS}>End Date</label>
          <AInput
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label className={LABEL_CLS}>End Time</label>
          <AInput
            type="text"
            name="end_time"
            value={formData.end_time}
            onChange={onChange}
            placeholder="18:00"
          />
        </div>
      </div>

      {/* ── Venue ───────────────────────────────────────── */}
      <FormDivider label="Location" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLS}>Venue Name</label>
          <AInput
            type="text"
            name="venue_name"
            value={formData.venue_name}
            onChange={onChange}
            placeholder="Kaleiçi Pasaj..."
          />
        </div>
        <div>
          <label className={LABEL_CLS}>Google Maps Link</label>
          <AInput
            type="url"
            name="location_url"
            value={formData.location_url}
            onChange={onChange}
            placeholder="https://maps.google.com/…"
          />
        </div>
      </div>

      {/* ── Announcement ────────────────────────────────── */}
      <FormDivider label="Announcement" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLS}>Title</label>
          <AInput
            type="text"
            name="announcement_title"
            value={formData.announcement_title}
            onChange={onChange}
            placeholder="Instagram Post"
          />
        </div>
        <div>
          <label className={LABEL_CLS}>URL</label>
          <AInput
            type="url"
            name="announcement_url"
            value={formData.announcement_url}
            onChange={onChange}
            placeholder="https://www.instagram.com/…"
          />
        </div>
      </div>

      {/* ── Transport ───────────────────────────────────── */}
      <FormDivider label="Transport" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className={LABEL_CLS}>Bus Time</label>
          <AInput
            type="text"
            name="bus_time"
            value={formData.bus_time}
            onChange={onChange}
            placeholder="09:00"
          />
        </div>
        <div>
          <label className={LABEL_CLS}>From</label>
          <AInput
            type="text"
            name="bus_from"
            value={formData.bus_from}
            onChange={onChange}
            placeholder="Main Gate"
          />
        </div>
        <div>
          <label className={LABEL_CLS}>To</label>
          <AInput
            type="text"
            name="bus_to"
            value={formData.bus_to}
            onChange={onChange}
            placeholder="Event Hall"
          />
        </div>
      </div>

      {/* ── Clubs (general events only) ─────────────────── */}
      {showClubs && (
        <>
          <FormDivider label="Participating Clubs" />
          <div>
            <div className="flex gap-2 mb-2">
              <AInput
                type="text"
                value={clubInput}
                onChange={(e) => onClubInputChange(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), onAddClub())
                }
                placeholder="Club name — press Enter or Add"
              />
              <button
                type="button"
                onClick={onAddClub}
                className="px-3 py-1.5 rounded-lg text-xs font-cinzel text-amber-200 transition-all"
                style={{
                  background: "rgba(120,80,10,0.4)",
                  border: "1px solid rgba(201,162,39,0.3)",
                }}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.clubs.map((club, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-amber-200"
                  style={{
                    background: "rgba(120,80,10,0.3)",
                    border: "1px solid rgba(201,162,39,0.25)",
                  }}
                >
                  {club}
                  <button
                    type="button"
                    onClick={() => onRemoveClub(club)}
                    className="text-stone-500 hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import PropTypes from "prop-types";

EventFormFields.propTypes = {
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  clubInput: PropTypes.string,
  onClubInputChange: PropTypes.func,
  onAddClub: PropTypes.func,
  onRemoveClub: PropTypes.func,
  showClubs: PropTypes.bool,
};

FormDivider.propTypes = {
  label: PropTypes.string.isRequired,
};

AInput.propTypes = { type: PropTypes.string };
ATextarea.propTypes = { rows: PropTypes.number };
ASelect.propTypes = { children: PropTypes.node };

const EventsAdminPanel = ({ onNavigate }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedEvent, setExpandedEvent] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    event_type: "game",
    clubs: [],
    start_time: "",
    end_time: "",
    venue_name: "",
    location_url: "",
    announcement_title: "",
    announcement_url: "",
    bus_time: "",
    bus_from: "",
    bus_to: "",
  });
  const [clubInput, setClubInput] = useState("");

  const backendUrl = config.backendUrl;
  const apiKey = getApiKey();

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/events`, {
        headers: { apiKey },
      });

      if (!response.ok) throw new Error("Failed to fetch events");

      const eventsData = await response.json();

      const eventsWithTables = await Promise.all(
        eventsData.map(async (event) => {
          const tableDetails = await Promise.all(
            (event.tables || []).map(async (tableSlug) => {
              try {
                const tableRes = await fetch(
                  `${backendUrl}/api/admin/table/${tableSlug}`,
                  {
                    headers: { apiKey },
                  },
                );
                if (tableRes.ok) {
                  const { data } = await tableRes.json();
                  return data;
                }
                return null;
              } catch {
                return null;
              }
            }),
          );
          return {
            ...event,
            tableDetails: tableDetails.filter(Boolean),
          };
        }),
      );

      setEvents(eventsWithTables);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, apiKey]);

  useWebSocket("events", fetchEvents);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/admin/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create event");

      setIsCreateModalOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event");
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/events/${selectedEvent.slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            apiKey,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) throw new Error("Failed to update event");

      setIsEditModalOpen(false);
      setSelectedEvent(null);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event");
    }
  };

  const handleFinishEvent = async (event) => {
    setConfirmDialog({
      open: true,
      title: "Finish Event",
      message: `Are you sure you want to finish "${event.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await fetch(
            `${backendUrl}/api/admin/events/${event.slug}/finish`,
            {
              method: "PUT",
              headers: { apiKey },
            },
          );

          if (!response.ok) throw new Error("Failed to finish event");
          fetchEvents();
        } catch (error) {
          console.error("Error finishing event:", error);
          alert("Failed to finish event");
        }
        setConfirmDialog({
          open: false,
          title: "",
          message: "",
          onConfirm: null,
        });
      },
    });
  };

  const handleDeleteEvent = async (event) => {
    setConfirmDialog({
      open: true,
      title: "Delete Event",
      message: `Are you sure you want to DELETE "${event.name}"? This will remove all associated data permanently.`,
      onConfirm: async () => {
        try {
          const response = await fetch(
            `${backendUrl}/api/admin/events/${event.slug}`,
            {
              method: "DELETE",
              headers: { apiKey },
            },
          );

          if (!response.ok) throw new Error("Failed to delete event");
          fetchEvents();
        } catch (error) {
          console.error("Error deleting event:", error);
          alert("Failed to delete event");
        }
        setConfirmDialog({
          open: false,
          title: "",
          message: "",
          onConfirm: null,
        });
      },
    });
  };

  const handleGenerateAnnouncement = async (event) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/events/${event.slug}/announcement`,
        {
          headers: { apiKey },
        },
      );

      if (!response.ok) throw new Error("Failed to generate announcement");

      const blob = await response.blob();
      downloadFile(blob, `${event.name}_announcement.png`);
    } catch (error) {
      console.error("Error generating announcement:", error);
      alert("Failed to generate announcement image");
    }
  };

  const handleGenerateReport = async (event) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/events/${event.slug}/report`,
        {
          headers: { apiKey },
        },
      );

      if (!response.ok) throw new Error("Failed to generate report");

      const blob = await response.blob();
      downloadFile(blob, `${event.name}_report.xlsx`);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report");
    }
  };

  const handleDownloadAttendance = async (event) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/events/${event.slug}/attendance`,
        {
          headers: { apiKey },
        },
      );

      if (!response.ok) throw new Error("Failed to generate attendance");

      const blob = await response.blob();
      downloadFile(blob, `${event.name}_attendance.xlsx`);
    } catch (error) {
      console.error("Error generating attendance:", error);
      alert("Failed to generate attendance list");
    }
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      event_type: "game",
      clubs: [],
      start_time: "",
      end_time: "",
      venue_name: "",
      location_url: "",
      announcement_title: "",
      announcement_url: "",
      bus_time: "",
      bus_from: "",
      bus_to: "",
    });
    setClubInput("");
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      description: event.description || "",
      start_date: event.start_date,
      end_date: event.end_date,
      event_type: event.event_type || "game",
      clubs: event.clubs || [],
      start_time: event.start_time || "",
      end_time: event.end_time || "",
      venue_name: event.venue_name || "",
      location_url: event.location_url || "",
      announcement_title: event.announcement_title || "",
      announcement_url: event.announcement_url || "",
      bus_time: event.bus_time || "",
      bus_from: event.bus_from || "",
      bus_to: event.bus_to || "",
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClub = () => {
    if (clubInput.trim() && !formData.clubs.includes(clubInput.trim())) {
      setFormData({
        ...formData,
        clubs: [...formData.clubs, clubInput.trim()],
      });
      setClubInput("");
    }
  };

  const handleRemoveClub = (club) => {
    setFormData({
      ...formData,
      clubs: formData.clubs.filter((c) => c !== club),
    });
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "ongoing" && event.is_ongoing) ||
      (statusFilter === "finished" && !event.is_ongoing);
    const matchesType = typeFilter === "all" || event.event_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: events.length,
    ongoing: events.filter((e) => e.is_ongoing).length,
    finished: events.filter((e) => !e.is_ongoing).length,
    game: events.filter((e) => e.event_type === "game").length,
    general: events.filter((e) => e.event_type === "general").length,
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-cinzel">
            EMURPG Events
          </h2>
          <p className="text-gray-400 text-sm">
            Manage game and general events
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <AdminButton
            onClick={fetchEvents}
            variant="secondary"
            icon={RefreshCw}
            className="flex-1 sm:flex-none"
          >
            Refresh
          </AdminButton>
          <AdminButton
            onClick={() => setIsCreateModalOpen(true)}
            icon={Plus}
            className="flex-1 sm:flex-none"
          >
            <span className="hidden sm:inline">New Event</span>
            <span className="sm:hidden">New</span>
          </AdminButton>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-400 text-sm">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-green-500" />
            <span className="text-gray-400 text-sm">Ongoing</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{stats.ongoing}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-gray-500" />
            <span className="text-gray-400 text-sm">Finished</span>
          </div>
          <p className="text-2xl font-bold text-gray-400">{stats.finished}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Table2 className="w-4 h-4 text-blue-500" />
            <span className="text-gray-400 text-sm">Game Events</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">{stats.game}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-purple-500" />
            <span className="text-gray-400 text-sm">General Events</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">{stats.general}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="finished">Finished</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="game">Game Events</option>
            <option value="general">General Events</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No events found</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.slug}
              className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-gray-800/70 transition-colors"
                onClick={() =>
                  setExpandedEvent(
                    expandedEvent === event.slug ? null : event.slug,
                  )
                }
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {event.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          event.is_ongoing
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        }`}
                      >
                        {event.is_ongoing ? "Ongoing" : "Finished"}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          event.event_type === "game"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        }`}
                      >
                        {event.event_type === "game" ? "Game" : "General"}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{event.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>
                        {new Date(event.start_date).toLocaleDateString()} -{" "}
                        {new Date(event.end_date).toLocaleDateString()}
                      </span>
                      {event.event_type === "game" && event.tableDetails && (
                        <span>{event.tableDetails.length} tables</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {expandedEvent === event.slug ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedEvent === event.slug && (
                <div className="border-t border-gray-700 p-4 bg-gray-900/30">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.is_ongoing && (
                      <>
                        <AdminButton
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(event);
                          }}
                          variant="secondary"
                          size="sm"
                          icon={Edit3}
                        >
                          Edit
                        </AdminButton>
                        <AdminButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateAnnouncement(event);
                          }}
                          variant="secondary"
                          size="sm"
                          icon={Image}
                        >
                          Announcement
                        </AdminButton>
                        <AdminButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateReport(event);
                          }}
                          variant="secondary"
                          size="sm"
                          icon={FileText}
                        >
                          Report
                        </AdminButton>
                        {event.event_type === "general" && (
                          <AdminButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadAttendance(event);
                            }}
                            variant="secondary"
                            size="sm"
                            icon={Download}
                          >
                            Attendance
                          </AdminButton>
                        )}
                        <AdminButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFinishEvent(event);
                          }}
                          variant="warning"
                          size="sm"
                          icon={CheckCircle}
                        >
                          Finish
                        </AdminButton>
                        <AdminButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event);
                          }}
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                        >
                          Delete
                        </AdminButton>
                      </>
                    )}
                    {onNavigate && (
                      <AdminButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate("tables");
                        }}
                        variant="secondary"
                        size="sm"
                        icon={Table2}
                      >
                        Add Tables
                      </AdminButton>
                    )}
                  </div>

                  {event.event_type === "game" &&
                    event.tableDetails &&
                    event.tableDetails.length > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                          <Table2 className="w-4 h-4" />
                          Table Summary
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-green-400">Open:</span>
                            <span className="ml-2 font-bold text-white">
                              {
                                event.tableDetails.filter(
                                  (t) => !t.is_marked_full,
                                ).length
                              }
                            </span>
                          </div>
                          <div>
                            <span className="text-red-400">Full:</span>
                            <span className="ml-2 font-bold text-white">
                              {
                                event.tableDetails.filter(
                                  (t) => t.is_marked_full,
                                ).length
                              }
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">
                              Total Players:
                            </span>
                            <span className="ml-2 font-bold text-white">
                              {event.tableDetails.reduce(
                                (sum, t) => sum + (t.total_joined_players || 0),
                                0,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                  {event.event_type === "general" &&
                    event.clubs &&
                    event.clubs.length > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Participating Clubs
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {event.clubs.map((club, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                            >
                              {club}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <AdminModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create New Event"
      >
        <form onSubmit={handleCreateEvent}>
          <EventFormFields
            formData={formData}
            onChange={handleInputChange}
            clubInput={clubInput}
            onClubInputChange={setClubInput}
            onAddClub={handleAddClub}
            onRemoveClub={handleRemoveClub}
            showClubs={formData.event_type === "general"}
          />
          <div
            className="flex flex-col-reverse sm:flex-row gap-3 pt-5 mt-4"
            style={{ borderTop: "1px solid rgba(201,162,39,0.12)" }}
          >
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </AdminButton>
            <AdminButton type="submit" className="flex-1">
              Create Event
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
          resetForm();
        }}
        title={`Edit: ${selectedEvent?.name || ""}`}
      >
        <form onSubmit={handleUpdateEvent}>
          <EventFormFields
            formData={formData}
            onChange={handleInputChange}
            clubInput={clubInput}
            onClubInputChange={setClubInput}
            onAddClub={handleAddClub}
            onRemoveClub={handleRemoveClub}
            showClubs={formData.event_type === "general"}
          />
          <div
            className="flex flex-col-reverse sm:flex-row gap-3 pt-5 mt-4"
            style={{ borderTop: "1px solid rgba(201,162,39,0.12)" }}
          >
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedEvent(null);
                resetForm();
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </AdminButton>
            <AdminButton type="submit" className="flex-1">
              Update Event
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() =>
          setConfirmDialog({
            open: false,
            title: "",
            message: "",
            onConfirm: null,
          })
        }
      />
    </div>
  );
};

export default EventsAdminPanel;
