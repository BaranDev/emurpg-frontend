import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Calendar,
  Users,
  Clock,
  Edit3,
  Plus,
  Link2,
  Copy,
  Check,
  RefreshCw,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { config } from "../../../config";
import AdminModal from "../shared/AdminModal";
import AdminButton from "../shared/AdminButton";
import LoadingSpinner from "../shared/LoadingSpinner";

const EmuconManagerDashboard = ({ clubId, clubName, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [showRegistrationLinkModal, setShowRegistrationLinkModal] =
    useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    eventName: "",
    eventNameTr: "",
    clubName: "",
    clubNameTr: "",
  });

  // Available reschedule slots
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Participants
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    studentNumber: "",
  });

  // Registration link
  const [registrationLink, setRegistrationLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  const backendUrl = config.backendUrl;
  const loginData = JSON.parse(localStorage.getItem("login") || "{}");

  // Fetch club's events
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/emucon/manager/events/${clubId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, clubId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Fetch available periods for reschedule (only for scheduled event types)
  const fetchAvailableSlots = async (event) => {
    // Only scheduled events can be rescheduled by managers
    if (event.eventType && event.eventType !== "scheduled") {
      setAvailableSlots([]);
      return;
    }
    try {
      const response = await fetch(
        `${backendUrl}/api/emucon/manager/available-periods/${clubId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        const data = await response.json();
        // Filter out the current period if event already has one
        const slots = (data.periods || []).filter(
          (period) => period.id !== event.periodId
        );
        setAvailableSlots(slots);
      }
    } catch (error) {
      console.error("Failed to fetch available periods:", error);
      setAvailableSlots([]);
    }
  };

  // Fetch participants for an event
  const fetchParticipants = async (eventId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/emucon/corner/${eventId}/participants`
      );
      if (response.ok) {
        const data = await response.json();
        setParticipants(data.participants || []);
      }
    } catch (error) {
      console.error("Failed to fetch participants:", error);
    }
  };

  // Open edit modal
  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEditForm({
      eventName: event.activityEn || "",
      eventNameTr: event.activity || "",
      clubName: event.clubNameEn || "",
      clubNameTr: event.clubName || "",
    });
    setShowEditModal(true);
  };

  // Save event changes
  const handleSaveEvent = async () => {
    if (!selectedEvent) return;
    setIsSaving(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/emucon/manager/event/${selectedEvent.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activityEn: editForm.eventName,
            activity: editForm.eventNameTr,
            clubNameEn: editForm.clubName,
            clubName: editForm.clubNameTr,
          }),
        }
      );

      if (response.ok) {
        fetchEvents();
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Failed to save event:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Open reschedule modal
  const handleOpenReschedule = async (event) => {
    setSelectedEvent(event);
    await fetchAvailableSlots(event);
    setShowRescheduleModal(true);
  };

  // Submit reschedule request (auto-approved if slot is available)
  const handleRequestReschedule = async () => {
    if (!selectedEvent || !selectedSlot) return;
    setIsSaving(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/emucon/manager/reschedule/${selectedEvent.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newPeriodId: selectedSlot.id,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        fetchEvents();
        setShowRescheduleModal(false);
        setSelectedSlot(null);
        // Show success message based on result
        if (result.autoApproved) {
          // Could add a toast notification here
          console.log("Reschedule auto-approved");
        }
      } else {
        const error = await response.json();
        console.error("Reschedule failed:", error.detail);
        // Could show error toast here
      }
    } catch (error) {
      console.error("Failed to request reschedule:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Open participants modal
  const handleViewParticipants = async (event) => {
    setSelectedEvent(event);
    await fetchParticipants(event.id);
    setShowParticipantsModal(true);
  };

  // Normalize name: First letter uppercase, rest lowercase for each word
  const normalizeName = (name) => {
    return name
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Add participant manually
  const handleAddParticipant = async () => {
    if (!newParticipant.name.trim() || !selectedEvent) return;
    setIsSaving(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/emucon/manager/add-participant`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: selectedEvent.id,
            name: normalizeName(newParticipant.name),
            studentNumber: newParticipant.studentNumber || null,
          }),
        }
      );

      if (response.ok) {
        await fetchParticipants(selectedEvent.id);
        setNewParticipant({ name: "", studentNumber: "" });
        setShowAddParticipantModal(false);
      }
    } catch (error) {
      console.error("Failed to add participant:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Remove participant
  const handleRemoveParticipant = async (participantId) => {
    if (!selectedEvent) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/emucon/manager/remove-participant/${selectedEvent.id}/${participantId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        await fetchParticipants(selectedEvent.id);
      }
    } catch (error) {
      console.error("Failed to remove participant:", error);
    }
  };

  // Generate registration link
  const handleGenerateLink = async (event) => {
    setSelectedEvent(event);
    try {
      const response = await fetch(
        `${backendUrl}/api/emucon/manager/registration-link/${event.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRegistrationLink(data.link);
        setShowRegistrationLinkModal(true);
      }
    } catch (error) {
      console.error("Failed to generate link:", error);
    }
  };

  // Copy link to clipboard
  const copyLink = () => {
    navigator.clipboard.writeText(registrationLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // Update event status
  const handleUpdateStatus = async (eventId, newStatus) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/emucon/manager/event/${eventId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-forest-dark to-forest-deep">
        <LoadingSpinner message="Loading your events..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-dark to-forest-deep text-cream">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-forest-light/30 bg-forest-dark/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-metamorphous text-lg font-bold text-gold sm:text-2xl">
              {clubName}
            </h1>
            <p className="text-xs text-forest-glow sm:text-sm">
              EMUCON Manager
            </p>
          </div>
          <AdminButton variant="ghost" onClick={onLogout}>
            Logout
          </AdminButton>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-forest-light/30 bg-forest-deep/50 p-3 text-center sm:p-4">
            <Calendar className="mx-auto mb-1.5 h-6 w-6 text-gold sm:mb-2 sm:h-8 sm:w-8" />
            <p className="text-xl font-bold text-gold-light sm:text-2xl">
              {events.length}
            </p>
            <p className="text-xs text-forest-glow/80 sm:text-sm">Events</p>
          </div>
          <div className="rounded-xl border border-forest-light/30 bg-forest-deep/50 p-3 text-center sm:p-4">
            <Users className="mx-auto mb-1.5 h-6 w-6 text-forest-glow sm:mb-2 sm:h-8 sm:w-8" />
            <p className="text-xl font-bold text-forest-light sm:text-2xl">
              {events.reduce((sum, e) => sum + (e.participantCount || 0), 0)}
            </p>
            <p className="text-xs text-forest-glow/80 sm:text-sm">
              Participants
            </p>
          </div>
          <div className="rounded-xl border border-forest-light/30 bg-forest-deep/50 p-3 text-center sm:p-4">
            <Clock className="mx-auto mb-1.5 h-6 w-6 text-purple-400 sm:mb-2 sm:h-8 sm:w-8" />
            <p className="text-xl font-bold text-purple-200 sm:text-2xl">
              {events.filter((e) => e.status === "live").length}
            </p>
            <p className="text-xs text-forest-glow/80 sm:text-sm">Live</p>
          </div>
          <div className="rounded-xl border border-forest-light/30 bg-forest-deep/50 p-3 text-center sm:p-4">
            <RefreshCw className="mx-auto mb-1.5 h-6 w-6 text-cyan-400 sm:mb-2 sm:h-8 sm:w-8" />
            <p className="text-xl font-bold text-cyan-200 sm:text-2xl">
              {events.filter((e) => e.rescheduleRequested).length}
            </p>
            <p className="text-xs text-forest-glow/80 sm:text-sm">Pending</p>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="font-metamorphous text-lg font-bold text-gold sm:text-xl">
            Your Events
          </h2>

          {events.length === 0 ? (
            <div className="rounded-xl border border-forest-light/30 bg-forest-deep/50 p-6 text-center sm:p-8">
              <AlertCircle className="mx-auto mb-3 h-10 w-10 text-gold/50 sm:mb-4 sm:h-12 sm:w-12" />
              <p className="text-sm text-forest-glow sm:text-base">
                No events assigned to your club yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={() => handleEditEvent(event)}
                  onReschedule={() => handleOpenReschedule(event)}
                  onViewParticipants={() => handleViewParticipants(event)}
                  onGenerateLink={() => handleGenerateLink(event)}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Event Modal */}
      <AdminModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Event Details"
        size="md"
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gold/80">
                Event Name (English)
              </label>
              <input
                type="text"
                value={editForm.eventName}
                onChange={(e) =>
                  setEditForm({ ...editForm, eventName: e.target.value })
                }
                className="w-full rounded-lg border border-forest-light/30 bg-forest-dark/70 px-4 py-2.5 text-cream focus:border-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gold/80">
                Event Name (Turkish)
              </label>
              <input
                type="text"
                value={editForm.eventNameTr}
                onChange={(e) =>
                  setEditForm({ ...editForm, eventNameTr: e.target.value })
                }
                className="w-full rounded-lg border border-forest-light/30 bg-forest-dark/70 px-4 py-2.5 text-cream focus:border-gold/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gold/80">
                Club Name (English)
              </label>
              <input
                type="text"
                value={editForm.clubName}
                onChange={(e) =>
                  setEditForm({ ...editForm, clubName: e.target.value })
                }
                className="w-full rounded-lg border border-forest-light/30 bg-forest-dark/70 px-4 py-2.5 text-cream focus:border-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gold/80">
                Club Name (Turkish)
              </label>
              <input
                type="text"
                value={editForm.clubNameTr}
                onChange={(e) =>
                  setEditForm({ ...editForm, clubNameTr: e.target.value })
                }
                className="w-full rounded-lg border border-forest-light/30 bg-forest-dark/70 px-4 py-2.5 text-cream focus:border-gold/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <AdminButton
              variant="secondary"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </AdminButton>
            <AdminButton onClick={handleSaveEvent} loading={isSaving}>
              Save Changes
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Reschedule Modal */}
      <AdminModal
        isOpen={showRescheduleModal}
        onClose={() => {
          setShowRescheduleModal(false);
          setSelectedSlot(null);
        }}
        title="Reschedule Event"
        size="md"
      >
        <div className="space-y-4">
          {selectedEvent && (
            <div className="rounded-lg border border-forest-light/30 bg-forest-deep/40 p-4">
              <p className="text-sm text-forest-glow">Current Schedule</p>
              <p className="font-medium text-gold-light">
                {selectedEvent.time} - {selectedEvent.location}
              </p>
              {selectedEvent.periodName && (
                <p className="text-sm text-forest-glow/70">
                  Period: {selectedEvent.periodName}
                </p>
              )}
            </div>
          )}

          {/* Check if event type allows rescheduling */}
          {selectedEvent?.eventType &&
          selectedEvent.eventType !== "scheduled" ? (
            <div className="rounded-lg border border-red-900/30 bg-red-950/20 p-4 text-center">
              <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-400" />
              <p className="text-red-300">
                This event type ({selectedEvent.eventType}) cannot be
                rescheduled by managers.
              </p>
              <p className="mt-1 text-sm text-forest-glow/60">
                Please contact EMURPG admins for schedule changes.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-forest-glow/80">
                Select an available time period for your event. Changes will be
                applied immediately.
              </p>

              {availableSlots.length === 0 ? (
                <div className="rounded-lg border border-red-900/30 bg-red-950/20 p-4 text-center">
                  <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-400" />
                  <p className="text-red-300">
                    No available periods at this time.
                  </p>
                  <p className="mt-1 text-sm text-forest-glow/60">
                    All activity periods are occupied.
                  </p>
                </div>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full rounded-lg border p-3 text-left transition-all ${
                        selectedSlot?.id === slot.id
                          ? "border-gold bg-gold/20"
                          : "border-forest-light/30 bg-forest-dark/50 hover:bg-forest-dark"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-cream">
                            {slot.startTime} - {slot.endTime}
                          </p>
                          <p className="text-sm text-forest-glow">
                            {slot.name}
                          </p>
                        </div>
                        {selectedSlot?.id === slot.id && (
                          <Check className="h-5 w-5 text-gold" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <AdminButton
                  variant="secondary"
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setSelectedSlot(null);
                  }}
                >
                  Cancel
                </AdminButton>
                <AdminButton
                  onClick={handleRequestReschedule}
                  disabled={!selectedSlot}
                  loading={isSaving}
                >
                  Reschedule Now
                </AdminButton>
              </div>
            </>
          )}
        </div>
      </AdminModal>

      {/* Participants Modal */}
      <AdminModal
        isOpen={showParticipantsModal}
        onClose={() => setShowParticipantsModal(false)}
        title={`Participants - ${selectedEvent?.activityEn || ""}`}
        size="lg"
      >
        <div className="space-y-4">
          {/* Add Participant Button */}
          <div className="flex justify-between">
            <p className="text-sm text-forest-glow">
              {participants.length} participant(s) registered
            </p>
            <AdminButton
              size="sm"
              icon={Plus}
              onClick={() => setShowAddParticipantModal(true)}
            >
              Add Participant
            </AdminButton>
          </div>

          {/* Participants List */}
          {participants.length === 0 ? (
            <div className="rounded-lg border border-forest-light/30 bg-forest-deep/50 p-8 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-gold/50" />
              <p className="text-forest-glow">No participants yet.</p>
            </div>
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {participants.map((participant, index) => (
                <div
                  key={participant.id || index}
                  className="flex items-center justify-between rounded-lg border border-forest-light/20 bg-forest-deep/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-cream">
                        {participant.name}
                      </p>
                      {participant.studentNumber && (
                        <p className="text-sm text-forest-glow/70">
                          {participant.studentNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveParticipant(participant.id)}
                    className="rounded p-1.5 text-red-400/60 transition-all hover:bg-red-900/20 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminModal>

      {/* Add Participant Modal */}
      <AdminModal
        isOpen={showAddParticipantModal}
        onClose={() => {
          setShowAddParticipantModal(false);
          setNewParticipant({ name: "", studentNumber: "" });
        }}
        title="Add Participant"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gold/80">
              Name *
            </label>
            <input
              type="text"
              value={newParticipant.name}
              onChange={(e) =>
                setNewParticipant({ ...newParticipant, name: e.target.value })
              }
              placeholder="Enter participant name"
              className="w-full rounded-lg border border-forest-light/30 bg-forest-dark/70 px-4 py-2.5 text-cream focus:border-gold/50 focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gold/80">
              Student Number (Optional)
            </label>
            <input
              type="text"
              value={newParticipant.studentNumber}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  studentNumber: e.target.value,
                })
              }
              placeholder="e.g., 12345678"
              className="w-full rounded-lg border border-forest-light/30 bg-forest-dark/70 px-4 py-2.5 text-cream focus:border-gold/50 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <AdminButton
              variant="secondary"
              onClick={() => {
                setShowAddParticipantModal(false);
                setNewParticipant({ name: "", studentNumber: "" });
              }}
            >
              Cancel
            </AdminButton>
            <AdminButton
              onClick={handleAddParticipant}
              disabled={!newParticipant.name.trim()}
              loading={isSaving}
            >
              Add
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Registration Link Modal */}
      <AdminModal
        isOpen={showRegistrationLinkModal}
        onClose={() => setShowRegistrationLinkModal(false)}
        title="Registration Link"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-forest-glow">
            Share this link to allow people to register for your event:
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={registrationLink}
              readOnly
              className="flex-1 rounded-lg border border-forest-light/30 bg-forest-dark/70 px-4 py-2.5 text-cream"
            />
            <AdminButton onClick={copyLink} icon={linkCopied ? Check : Copy}>
              {linkCopied ? "Copied!" : "Copy"}
            </AdminButton>
          </div>

          <div className="rounded-lg border border-forest-light/30 bg-forest-deep/40 p-4">
            <p className="text-sm text-gold-light">
              Participants registering through this link will appear in your
              participants list.
            </p>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

// Event Card Component
const EventCard = ({
  event,
  onEdit,
  onReschedule,
  onViewParticipants,
  onGenerateLink,
  onUpdateStatus,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors = {
    live: "bg-red-500/20 text-red-300 border-red-500/30",
    upcoming: "bg-gold/20 text-gold border-gold/30",
    completed: "bg-forest-light/20 text-forest-light border-forest-light/30",
    pending: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  };

  // Event types: scheduled, continuous, standTime, liveStage
  // Only "scheduled" events can be rescheduled by managers
  const canReschedule = !event.eventType || event.eventType === "scheduled";

  const eventTypeLabels = {
    scheduled: "Scheduled",
    continuous: "All Day",
    standTime: "Stand Time",
    liveStage: "Live Stage",
  };

  return (
    <div className="group overflow-hidden rounded-xl border border-forest-light/20 bg-gradient-to-br from-forest-deep/80 to-forest-dark/60 shadow-lg transition-all duration-300 hover:border-gold/40 hover:shadow-xl hover:shadow-gold/10 sm:rounded-2xl">
      {/* Card Header */}
      <div
        className="flex cursor-pointer flex-col gap-3 p-3 transition-colors hover:bg-forest-deep/40 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm whitespace-nowrap sm:px-3 sm:py-1.5 ${
                statusColors[event.status] || statusColors.upcoming
              }`}
            >
              {event.status === "live" && (
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
              )}
              {event.status?.toUpperCase() || "UPCOMING"}
            </div>
            {event.eventType && event.eventType !== "scheduled" && (
              <div className="rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-0.5 text-xs font-medium text-cyan-300 sm:px-3 sm:py-1">
                {eventTypeLabels[event.eventType] || event.eventType}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 truncate font-cinzel text-base font-semibold text-gold-light sm:text-lg">
              {event.activityEn}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-forest-glow/80 sm:gap-3 sm:text-sm">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {event.time}
              </span>
              <span className="text-forest-glow/40">•</span>
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-forest-light/20 bg-forest-dark/50 px-3 py-1.5 sm:flex-col sm:rounded-xl sm:px-4 sm:py-2">
            <Users className="h-4 w-4 text-forest-glow" />
            <span className="font-semibold text-cream">
              {event.participantCount || 0}
            </span>
            <p className="text-xs text-forest-glow/60 sm:mt-0.5">
              Participants
            </p>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 shrink-0 text-gold transition-transform group-hover:scale-110" />
          ) : (
            <ChevronDown className="h-5 w-5 shrink-0 text-gold transition-transform group-hover:scale-110" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-forest-light/10 bg-forest-dark/40 p-4 sm:p-6">
          <div className="mb-4 grid gap-3 sm:mb-6 sm:gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-forest-light/10 bg-forest-deep/40 p-3 sm:rounded-xl sm:p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-forest-glow/60 sm:mb-1.5">
                Turkish Name
              </p>
              <p className="text-sm font-medium text-cream sm:text-base">
                {event.activity}
              </p>
            </div>
            <div className="rounded-lg border border-forest-light/10 bg-forest-deep/40 p-3 sm:rounded-xl sm:p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-forest-glow/60 sm:mb-1.5">
                Club
              </p>
              <p className="text-sm font-medium text-cream sm:text-base">
                {event.clubNameEn}
              </p>
            </div>
          </div>

          {event.rescheduleRequested && (
            <div className="mb-4 rounded-lg border border-purple-500/30 bg-purple-950/30 p-3 shadow-lg sm:mb-6 sm:rounded-xl sm:p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-purple-300 sm:h-5 sm:w-5" />
                <p className="text-sm font-medium text-purple-200 sm:text-base">
                  Schedule change requested - pending approval
                </p>
              </div>
            </div>
          )}

          {/* Status Control */}
          <div className="mb-4 rounded-lg border border-forest-light/10 bg-forest-deep/40 p-3 sm:mb-6 sm:rounded-xl sm:p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-forest-glow/60 sm:mb-3">
              Event Status
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus(event.id, "upcoming");
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase transition-all sm:px-4 sm:py-2 ${
                  event.status === "upcoming"
                    ? "border-gold bg-gold/20 text-gold shadow-md"
                    : "border-forest-light/30 bg-forest-dark/50 text-forest-glow/70 hover:border-gold/50 hover:bg-forest-dark"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus(event.id, "live");
                }}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase transition-all sm:px-4 sm:py-2 ${
                  event.status === "live"
                    ? "border-red-500 bg-red-500/20 text-red-300 shadow-md"
                    : "border-forest-light/30 bg-forest-dark/50 text-forest-glow/70 hover:border-red-500/50 hover:bg-forest-dark"
                }`}
              >
                {event.status === "live" && (
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
                )}
                Live
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus(event.id, "completed");
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase transition-all sm:px-4 sm:py-2 ${
                  event.status === "completed"
                    ? "border-forest-light bg-forest-light/20 text-forest-light shadow-md"
                    : "border-forest-light/30 bg-forest-dark/50 text-forest-glow/70 hover:border-forest-light/50 hover:bg-forest-dark"
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <AdminButton
              size="sm"
              variant="ghost"
              icon={Edit3}
              onClick={onEdit}
            >
              Edit Details
            </AdminButton>
            {canReschedule && (
              <AdminButton
                size="sm"
                variant="ghost"
                icon={ArrowRightLeft}
                onClick={onReschedule}
                disabled={event.rescheduleRequested}
              >
                Reschedule
              </AdminButton>
            )}
            <AdminButton
              size="sm"
              variant="ghost"
              icon={Users}
              onClick={onViewParticipants}
            >
              Participants
            </AdminButton>
            <AdminButton
              size="sm"
              variant="ghost"
              icon={Link2}
              onClick={onGenerateLink}
            >
              Registration Link
            </AdminButton>
          </div>
        </div>
      )}
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    activity: PropTypes.string,
    activityEn: PropTypes.string,
    clubName: PropTypes.string,
    clubNameEn: PropTypes.string,
    time: PropTypes.string,
    location: PropTypes.string,
    status: PropTypes.string,
    participantCount: PropTypes.number,
    rescheduleRequested: PropTypes.bool,
    eventType: PropTypes.oneOf([
      "scheduled",
      "continuous",
      "standTime",
      "liveStage",
    ]),
    periodId: PropTypes.string,
    periodName: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onReschedule: PropTypes.func.isRequired,
  onViewParticipants: PropTypes.func.isRequired,
  onGenerateLink: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
};

EmuconManagerDashboard.propTypes = {
  clubId: PropTypes.string.isRequired,
  clubName: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default EmuconManagerDashboard;
