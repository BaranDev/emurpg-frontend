import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Trash2,
  UserPlus,
  Clock,
  Calendar,
  AlertCircle,
  Mail,
  Phone,
  Building2,
  ChevronDown,
  Download,
} from "lucide-react";
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";
import AdminModal from "./shared/AdminModal";
import AdminButton from "./shared/AdminButton";
import LoadingSpinner from "./shared/LoadingSpinner";
import ConfirmDialog from "./shared/ConfirmDialog";

const RegistrationsPanel = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clubMemberFilter, setClubMemberFilter] = useState("all");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    student_id: "",
    is_club_member: false,
  });

  const backendUrl = config.backendUrl;
  const apiKey = getApiKey();

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/events`, {
        headers: { apiKey },
      });

      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      // Filter only general events that can have registrations
      const generalEvents = data.filter((event) => event.type === "general");
      setEvents(generalEvents);

      // Auto-select first event if available
      if (generalEvents.length > 0 && !selectedEvent) {
        setSelectedEvent(generalEvents[0]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, apiKey, selectedEvent]);

  const fetchRegistrations = useCallback(async () => {
    if (!selectedEvent) return;

    setIsLoadingRegistrations(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/general_registrations/${selectedEvent.slug}`,
        { headers: { apiKey } },
      );

      if (!response.ok) throw new Error("Failed to fetch registrations");

      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      setRegistrations([]);
    } finally {
      setIsLoadingRegistrations(false);
    }
  }, [backendUrl, apiKey, selectedEvent]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (selectedEvent) {
      fetchRegistrations();
    }
  }, [selectedEvent, fetchRegistrations]);

  const handleApprove = async (registration) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/approve_general_registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey,
          },
          body: JSON.stringify({
            event_slug: selectedEvent.slug,
            email: registration.email,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to approve registration");
      fetchRegistrations();
    } catch (error) {
      console.error("Error approving registration:", error);
      alert("Failed to approve registration");
    }
  };

  const handleReject = async (registration) => {
    setConfirmDialog({
      open: true,
      title: "Reject Registration",
      message: `Are you sure you want to reject ${registration.name} ${registration.surname}'s registration?`,
      onConfirm: async () => {
        try {
          const response = await fetch(
            `${backendUrl}/api/admin/reject_general_registration`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apiKey,
              },
              body: JSON.stringify({
                event_slug: selectedEvent.slug,
                email: registration.email,
              }),
            },
          );

          if (!response.ok) throw new Error("Failed to reject registration");
          fetchRegistrations();
        } catch (error) {
          console.error("Error rejecting registration:", error);
          alert("Failed to reject registration");
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

  const handleDelete = async (registration) => {
    setConfirmDialog({
      open: true,
      title: "Delete Registration",
      message: `Are you sure you want to delete ${registration.name} ${registration.surname}'s registration? This cannot be undone.`,
      onConfirm: async () => {
        try {
          const response = await fetch(
            `${backendUrl}/api/admin/delete_general_registration/${selectedEvent.slug}/${registration.email}`,
            {
              method: "DELETE",
              headers: { apiKey },
            },
          );

          if (!response.ok) throw new Error("Failed to delete registration");
          fetchRegistrations();
        } catch (error) {
          console.error("Error deleting registration:", error);
          alert("Failed to delete registration");
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

  const handleAddRegistration = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/add_general_registration/${selectedEvent.slug}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) throw new Error("Failed to add registration");

      setIsAddModalOpen(false);
      resetForm();
      fetchRegistrations();
    } catch (error) {
      console.error("Error adding registration:", error);
      alert("Failed to add registration");
    }
  };

  const handleDownloadAttendance = async () => {
    if (!selectedEvent) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/events/${selectedEvent.slug}/attendance`,
        { headers: { apiKey } },
      );

      if (!response.ok) throw new Error("Failed to download attendance");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedEvent.slug}-attendance.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading attendance:", error);
      alert("Failed to download attendance");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      surname: "",
      email: "",
      phone: "",
      student_id: "",
      is_club_member: false,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-400 bg-green-400/10";
      case "rejected":
        return "text-red-400 bg-red-400/10";
      case "pending":
      default:
        return "text-yellow-300 bg-yellow-900/30";
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.student_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || reg.status === statusFilter;
    const matchesClub =
      clubMemberFilter === "all" ||
      (clubMemberFilter === "member" && reg.is_club_member) ||
      (clubMemberFilter === "non-member" && !reg.is_club_member);

    return matchesSearch && matchesStatus && matchesClub;
  });

  const stats = {
    total: registrations.length,
    approved: registrations.filter((r) => r.status === "approved").length,
    pending: registrations.filter((r) => r.status === "pending").length,
    rejected: registrations.filter((r) => r.status === "rejected").length,
    clubMembers: registrations.filter((r) => r.is_club_member).length,
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
            Event Registrations
          </h2>
          <p className="text-gray-400 text-sm">
            Manage registrations for general events
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <AdminButton
            onClick={fetchRegistrations}
            variant="secondary"
            icon={RefreshCw}
            className="flex-1 sm:flex-none"
          >
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh</span>
          </AdminButton>
          {selectedEvent && (
            <>
              <AdminButton
                onClick={handleDownloadAttendance}
                variant="secondary"
                icon={Download}
                className="flex-1 sm:flex-none"
              >
                <span className="hidden sm:inline">Attendance</span>
                <span className="sm:hidden">List</span>
              </AdminButton>
              <AdminButton
                onClick={() => setIsAddModalOpen(true)}
                icon={UserPlus}
                className="flex-1 sm:flex-none"
              >
                <span className="hidden sm:inline">Add Registration</span>
                <span className="sm:hidden">Add</span>
              </AdminButton>
            </>
          )}
        </div>
      </div>

      {/* Event Selector */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Event
        </label>
        <div className="relative">
          <select
            value={selectedEvent?.slug || ""}
            onChange={(e) => {
              const event = events.find((ev) => ev.slug === e.target.value);
              setSelectedEvent(event);
            }}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="" disabled>
              Select an event...
            </option>
            {events.map((event) => (
              <option key={event.slug} value={event.slug}>
                {event.name} ({event.date})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No general events found</p>
          <p className="text-sm mt-2">
            Create a general event first to manage registrations
          </p>
        </div>
      ) : selectedEvent ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-gray-400 text-sm">Total</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-400 text-sm">Approved</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {stats.approved}
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-400 text-sm">Pending</span>
              </div>
              <p className="text-2xl font-bold text-yellow-400">
                {stats.pending}
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-gray-400 text-sm">Rejected</span>
              </div>
              <p className="text-2xl font-bold text-red-400">
                {stats.rejected}
              </p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-purple-500" />
                <span className="text-gray-400 text-sm">Club Members</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">
                {stats.clubMembers}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or student ID..."
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={clubMemberFilter}
                onChange={(e) => setClubMemberFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              >
                <option value="all">All Members</option>
                <option value="member">Club Members</option>
                <option value="non-member">Non-Members</option>
              </select>
            </div>
          </div>

          {/* Registrations List */}
          {isLoadingRegistrations ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner />
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No registrations found</p>
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Student ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Club
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredRegistrations.map((reg, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              setSelectedRegistration(reg);
                              setIsDetailModalOpen(true);
                            }}
                            className="text-yellow-500 hover:text-yellow-400 font-medium text-left"
                          >
                            {reg.name} {reg.surname}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <p className="text-gray-300">{reg.email}</p>
                            {reg.phone && (
                              <p className="text-gray-500">{reg.phone}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-300 font-mono text-sm">
                            {reg.student_id || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              reg.status,
                            )}`}
                          >
                            {reg.status || "pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {reg.is_club_member ? (
                            <span className="text-purple-400 text-sm">
                              Member
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            {reg.status !== "approved" && (
                              <AdminButton
                                onClick={() => handleApprove(reg)}
                                variant="secondary"
                                size="sm"
                                icon={CheckCircle}
                                title="Approve"
                              />
                            )}
                            {reg.status !== "rejected" && (
                              <AdminButton
                                onClick={() => handleReject(reg)}
                                variant="secondary"
                                size="sm"
                                icon={XCircle}
                                title="Reject"
                              />
                            )}
                            <AdminButton
                              onClick={() => handleDelete(reg)}
                              variant="danger"
                              size="sm"
                              icon={Trash2}
                              title="Delete"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select an event to view registrations</p>
        </div>
      )}

      {/* Add Registration Modal */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Add Manual Registration"
      >
        <form onSubmit={handleAddRegistration} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                First Name
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
                Last Name
              </label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) =>
                  setFormData({ ...formData, surname: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Student ID
              </label>
              <input
                type="text"
                value={formData.student_id}
                onChange={(e) =>
                  setFormData({ ...formData, student_id: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_club_member"
              checked={formData.is_club_member}
              onChange={(e) =>
                setFormData({ ...formData, is_club_member: e.target.checked })
              }
              className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
            />
            <label htmlFor="is_club_member" className="text-gray-300">
              Club Member
            </label>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </AdminButton>
            <AdminButton type="submit" className="flex-1">
              Add Registration
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      {/* Registration Detail Modal */}
      <AdminModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedRegistration(null);
        }}
        title="Registration Details"
      >
        {selectedRegistration && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-500 mb-4">
                {selectedRegistration.name} {selectedRegistration.surname}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{selectedRegistration.email}</span>
                </div>
                {selectedRegistration.phone && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{selectedRegistration.phone}</span>
                  </div>
                )}
                {selectedRegistration.student_id && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="font-mono">
                      {selectedRegistration.student_id}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    selectedRegistration.status,
                  )}`}
                >
                  {selectedRegistration.status || "pending"}
                </span>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400 mb-1">Club Member</p>
                <span
                  className={`text-sm font-medium ${
                    selectedRegistration.is_club_member
                      ? "text-purple-400"
                      : "text-gray-500"
                  }`}
                >
                  {selectedRegistration.is_club_member ? "Yes" : "No"}
                </span>
              </div>
            </div>

            {selectedRegistration.registered_at && (
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Registered At</p>
                <p className="text-gray-300">
                  {new Date(
                    selectedRegistration.registered_at,
                  ).toLocaleString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              {selectedRegistration.status !== "approved" && (
                <AdminButton
                  onClick={() => {
                    handleApprove(selectedRegistration);
                    setIsDetailModalOpen(false);
                  }}
                  className="flex-1"
                  icon={CheckCircle}
                >
                  Approve
                </AdminButton>
              )}
              {selectedRegistration.status !== "rejected" && (
                <AdminButton
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleReject(selectedRegistration);
                  }}
                  variant="secondary"
                  className="flex-1"
                  icon={XCircle}
                >
                  Reject
                </AdminButton>
              )}
              <AdminButton
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleDelete(selectedRegistration);
                }}
                variant="danger"
                icon={Trash2}
                className="w-full sm:w-auto"
              >
                Delete
              </AdminButton>
            </div>
          </div>
        )}
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

export default RegistrationsPanel;
