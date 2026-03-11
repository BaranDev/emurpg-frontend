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
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";
import AdminModal from "./shared/AdminModal";
import AdminButton from "./shared/AdminButton";
import LoadingSpinner from "./shared/LoadingSpinner";
import ConfirmDialog from "./shared/ConfirmDialog";
import { useWebSocket } from "../../hooks/useWebSocket";

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
    });
    setIsEditModalOpen(true);
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
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Event Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Event Type
            </label>
            <select
              value={formData.event_type}
              onChange={(e) =>
                setFormData({ ...formData, event_type: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
            >
              <option value="game">Game Event (Tables & RPG)</option>
              <option value="general">General Event (Club Registration)</option>
            </select>
          </div>

          {formData.event_type === "general" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Clubs
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={clubInput}
                  onChange={(e) => setClubInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddClub())
                  }
                  placeholder="Enter club name"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                />
                <AdminButton type="button" onClick={handleAddClub} size="sm">
                  Add
                </AdminButton>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.clubs.map((club, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-yellow-900/40 text-yellow-200 rounded-full text-sm flex items-center gap-2"
                  >
                    {club}
                    <button
                      type="button"
                      onClick={() => handleRemoveClub(club)}
                      className="hover:text-red-400"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
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
        title={`Edit Event: ${selectedEvent?.name || ""}`}
      >
        <form onSubmit={handleUpdateEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Event Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
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
