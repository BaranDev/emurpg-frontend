import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  Search,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
  Building2,
  Layers,
  AlertTriangle,
  Users,
  Link,
  Copy,
} from "lucide-react";
import { config } from "../../config";
import { getApiKey } from "../../utils/auth";
import AdminModal from "./shared/AdminModal";
import AdminButton from "./shared/AdminButton";
import LoadingSpinner from "./shared/LoadingSpinner";
import ConfirmDialog from "./shared/ConfirmDialog";

const CORNER_TYPES = [
  { value: "entertainment", label: "Entertainment", labelTr: "Eglence" },
  { value: "awareness", label: "Awareness", labelTr: "Farkindalik" },
  {
    value: "healthAndLifestyle",
    label: "Health & Lifestyle",
    labelTr: "Saglik & Yasam",
  },
  { value: "folkAndSocial", label: "Folk & Social", labelTr: "Halk & Sosyal" },
  { value: "art", label: "Art", labelTr: "Sanat" },
  { value: "technology", label: "Technology", labelTr: "Teknoloji" },
  { value: "science", label: "Science", labelTr: "Bilim" },
];

const EVENT_TYPES = [
  { value: "scheduled", label: "Scheduled", color: "bg-blue-500" },
  { value: "continuous", label: "Continuous", color: "bg-green-500" },
  { value: "standTime", label: "Stand Time", color: "bg-purple-500" },
  { value: "liveStage", label: "Live Stage", color: "bg-red-500" },
];

const STATUS_OPTIONS = [
  { value: "upcoming", label: "Upcoming", color: "bg-blue-500" },
  { value: "live", label: "Live", color: "bg-green-500" },
  { value: "completed", label: "Completed", color: "bg-gray-500" },
];

const EmuconAdminPanel = () => {
  const [corners, setCorners] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCorner, setExpandedCorner] = useState(null);
  const [expandedClub, setExpandedClub] = useState(null);

  // Modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [isEditClubModalOpen, setIsEditClubModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedCorner, setSelectedCorner] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmDeleteClub, setConfirmDeleteClub] = useState(null);
  const [conflict, setConflict] = useState(null);
  const [isCheckingConflict, setIsCheckingConflict] = useState(false);

  // Participants modal state
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participantsData, setParticipantsData] = useState({
    participants: [],
    count: 0,
  });
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [participantsEventName, setParticipantsEventName] = useState("");

  // Registration link state
  const [registrationLink, setRegistrationLink] = useState("");
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // Event form state
  const [eventFormData, setEventFormData] = useState({
    clubId: "",
    eventType: "scheduled",
    nameTr: "",
    nameEn: "",
    time: "",
    startTime: "",
    endTime: "",
    periodId: "",
    status: "upcoming",
  });

  // Club form state
  const [clubFormData, setClubFormData] = useState({
    id: "",
    cornerId: "",
    nameTr: "",
    nameEn: "",
    status: "active",
  });

  const backendUrl = config.backendUrl;
  const apiKey = getApiKey();

  const fetchCorners = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/admin/emucon/corners`, {
        headers: { apiKey },
      });
      if (response.ok) {
        const data = await response.json();
        setCorners(data.corners || []);
        setStats({
          totalCorners: data.totalCorners || data.corners?.length || 0,
          totalClubs: data.totalClubs || 0,
          totalEvents: data.totalEvents || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching corners:", error);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, apiKey]);

  const fetchPeriods = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/emucon/periods`, {
        headers: { apiKey },
      });
      if (response.ok) {
        const data = await response.json();
        setPeriods(data.periods || []);
      }
    } catch (error) {
      console.error("Error fetching periods:", error);
    }
  }, [backendUrl, apiKey]);

  const checkConflict = useCallback(
    async (cornerId, periodId, clubId, currentEventId) => {
      if (!cornerId || !periodId) {
        setConflict(null);
        return;
      }

      setIsCheckingConflict(true);
      try {
        const response = await fetch(
          `${backendUrl}/api/emucon/availability/${cornerId}/${periodId}`,
          {
            headers: { apiKey },
          },
        );

        if (response.ok) {
          const data = await response.json();

          // Check corner availability
          if (!data.cornerAvailable) {
            setConflict({
              type: "corner",
              message: `Corner conflict: ${
                data.conflictingEvent?.nameEn || "Another event"
              } is scheduled in this corner during this period.`,
            });
            return;
          }

          // Check club availability
          if (clubId) {
            const clubResponse = await fetch(
              `${backendUrl}/api/emucon/manager/available-periods/${clubId}`,
              {
                headers: { apiKey },
              },
            );

            if (clubResponse.ok) {
              const clubData = await clubResponse.json();
              const availablePeriod = clubData.availablePeriods?.find(
                (p) => p.periodId === periodId,
              );

              if (availablePeriod && !availablePeriod.available) {
                // Check if the conflict is with the current event being edited
                const isCurrentEvent =
                  availablePeriod.conflictingEventId === currentEventId;
                if (!isCurrentEvent) {
                  setConflict({
                    type: "club",
                    message: `Club conflict: This club has another event (${
                      availablePeriod.conflictingEventName || "Unknown"
                    }) scheduled during this period.`,
                  });
                  return;
                }
              }
            }
          }

          setConflict(null);
        }
      } catch (error) {
        console.error("Error checking conflict:", error);
      } finally {
        setIsCheckingConflict(false);
      }
    },
    [backendUrl, apiKey],
  );

  useEffect(() => {
    fetchCorners();
    fetchPeriods();
  }, [fetchCorners, fetchPeriods]);

  // Event CRUD handlers
  const handleCreateEvent = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/emucon/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey,
        },
        body: JSON.stringify(eventFormData),
      });
      if (response.ok) {
        await fetchCorners();
        setIsEventModalOpen(false);
        resetEventForm();
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/emucon/events/${selectedEvent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            apiKey,
          },
          body: JSON.stringify(eventFormData),
        },
      );
      if (response.ok) {
        await fetchCorners();
        setIsEditEventModalOpen(false);
        setSelectedEvent(null);
        resetEventForm();
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/emucon/events/${eventId}`,
        {
          method: "DELETE",
          headers: { apiKey },
        },
      );
      if (response.ok) {
        await fetchCorners();
        setConfirmDelete(null);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const openEditEventModal = (event, club) => {
    setSelectedEvent(event);
    setSelectedClub(club);
    setConflict(null);
    setEventFormData({
      clubId: event.clubId || club?.id || "",
      eventType: event.eventType || "scheduled",
      nameTr: event.nameTr || "",
      nameEn: event.nameEn || "",
      time: event.time || "",
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      periodId: event.periodId || "",
      status: event.status || "upcoming",
    });
    setIsEditEventModalOpen(true);
  };

  const openCreateEventModal = (club) => {
    setSelectedClub(club);
    setEventFormData({
      clubId: club.id,
      eventType: "scheduled",
      nameTr: "",
      nameEn: "",
      time: "",
      startTime: "",
      endTime: "",
      periodId: "",
      status: "upcoming",
    });
    setIsEventModalOpen(true);
  };

  const resetEventForm = () => {
    setEventFormData({
      clubId: "",
      eventType: "scheduled",
      nameTr: "",
      nameEn: "",
      time: "",
      startTime: "",
      endTime: "",
      periodId: "",
      status: "upcoming",
    });
    setSelectedClub(null);
  };

  const handleCreateClub = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/emucon/clubs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey,
        },
        body: JSON.stringify(clubFormData),
      });
      if (response.ok) {
        await fetchCorners();
        setIsClubModalOpen(false);
        resetClubForm();
      }
    } catch (error) {
      console.error("Error creating club:", error);
    }
  };

  const handleUpdateClub = async () => {
    if (!selectedClub) return;
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/emucon/clubs/${selectedClub.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            apiKey,
          },
          body: JSON.stringify(clubFormData),
        },
      );
      if (response.ok) {
        await fetchCorners();
        setIsEditClubModalOpen(false);
        setSelectedClub(null);
        resetClubForm();
      }
    } catch (error) {
      console.error("Error updating club:", error);
    }
  };

  const handleDeleteClub = async (clubId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/emucon/clubs/${clubId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            apiKey,
          },
          body: JSON.stringify({ deleteEvents: true }),
        },
      );
      if (response.ok) {
        await fetchCorners();
        setConfirmDeleteClub(null);
      }
    } catch (error) {
      console.error("Error deleting club:", error);
    }
  };

  const openEditClubModal = (club, corner) => {
    setSelectedClub(club);
    setSelectedCorner(corner);
    setClubFormData({
      id: club.id,
      cornerId: corner.id,
      nameTr: club.nameTr || "",
      nameEn: club.nameEn || "",
      status: club.status || "active",
    });
    setIsEditClubModalOpen(true);
  };

  const openCreateClubModal = (corner) => {
    setSelectedCorner(corner);
    setClubFormData({
      id: "",
      cornerId: corner.id,
      nameTr: "",
      nameEn: "",
      status: "active",
    });
    setIsClubModalOpen(true);
  };

  const resetClubForm = () => {
    setClubFormData({
      id: "",
      cornerId: "",
      nameTr: "",
      nameEn: "",
      status: "active",
    });
    setSelectedCorner(null);
  };

  // Fetch participants for an event
  const fetchParticipants = async (eventId, eventName) => {
    setParticipantsLoading(true);
    setParticipantsEventName(eventName);
    setIsParticipantsModalOpen(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/emucon/admin/event/${eventId}/participants`,
        { headers: { apiKey } },
      );
      if (response.ok) {
        const data = await response.json();
        setParticipantsData(data);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setParticipantsLoading(false);
    }
  };

  // Generate registration link for an event
  const generateRegistrationLink = async (eventId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/emucon/manager/registration-link/${eventId}`,
        {
          method: "POST",
          headers: { apiKey },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setRegistrationLink(data.link);
        setIsLinkModalOpen(true);
      }
    } catch (error) {
      console.error("Error generating link:", error);
    }
  };

  // Copy registration link to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const getStatusBadge = (status) => {
    const option = STATUS_OPTIONS.find((o) => o.value === status);
    return (
      <span
        className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium text-white ${
          option?.color || "bg-gray-500"
        }`}
      >
        {option?.label || status}
      </span>
    );
  };

  // Filter based on search
  const filteredCorners = corners.filter((corner) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    if (corner.nameEn?.toLowerCase().includes(term)) return true;
    if (corner.nameTr?.toLowerCase().includes(term)) return true;
    const clubs = corner.clubs ? Object.values(corner.clubs) : [];
    return clubs.some(
      (club) =>
        club.nameEn?.toLowerCase().includes(term) ||
        club.nameTr?.toLowerCase().includes(term),
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-900/40 rounded-lg">
                <Layers className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.totalCorners}
                </p>
                <p className="text-xs text-gray-400">Corners</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.totalClubs}
                </p>
                <p className="text-xs text-gray-400">Clubs</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.totalEvents}
                </p>
                <p className="text-xs text-gray-400">Events</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search corners, clubs..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          />
        </div>
        <AdminButton
          variant="secondary"
          icon={RefreshCw}
          onClick={fetchCorners}
          className="w-full sm:w-auto"
        >
          Refresh
        </AdminButton>
      </div>

      {/* Corners List (Nested Structure) */}
      <div className="space-y-4">
        {filteredCorners.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700">
            <Layers className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No corners found</p>
          </div>
        ) : (
          filteredCorners.map((corner) => {
            const clubs = corner.clubs ? Object.values(corner.clubs) : [];
            const isExpanded = expandedCorner === corner.id;

            return (
              <div
                key={corner.id}
                className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden"
              >
                {/* Corner Header */}
                <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-gray-700/30 transition-colors">
                  <div
                    className="flex items-center gap-3 sm:gap-4 flex-1 cursor-pointer"
                    onClick={() =>
                      setExpandedCorner(isExpanded ? null : corner.id)
                    }
                  >
                    <div className="p-2 bg-yellow-900/40 rounded-lg flex-shrink-0">
                      <Layers className="w-5 h-5 text-yellow-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {corner.nameEn}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">
                        {corner.nameTr}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {corner.clubCount || clubs.length} clubs
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {corner.eventCount || 0} events
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                  {/* Mobile stats */}
                  <div className="flex sm:hidden items-center gap-4 text-xs text-gray-400 pl-12">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {corner.clubCount || clubs.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {corner.eventCount || 0}
                    </span>
                  </div>
                  <AdminButton
                    variant="primary"
                    icon={Plus}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCreateClubModal(corner);
                    }}
                    className="w-full sm:w-auto"
                  >
                    Add Club
                  </AdminButton>
                </div>

                {/* Clubs (Expanded) */}
                {isExpanded && (
                  <div className="border-t border-gray-700">
                    {clubs.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No clubs in this corner
                      </div>
                    ) : (
                      clubs.map((club) => {
                        const allEvents = [
                          ...(club.events?.scheduled || []),
                          ...(club.events?.continuous || []),
                          ...(club.events?.standTime || []),
                        ];
                        const isClubExpanded = expandedClub === club.id;

                        return (
                          <div
                            key={club.id}
                            className="border-b border-gray-700/50 last:border-b-0"
                          >
                            {/* Club Header */}
                            <div
                              className="px-3 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-700/20 transition-colors"
                              onClick={() =>
                                setExpandedClub(isClubExpanded ? null : club.id)
                              }
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="p-1.5 bg-blue-500/20 rounded flex-shrink-0">
                                  <Building2 className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-white truncate">
                                    {club.nameEn}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {club.nameTr}
                                  </p>
                                  <p className="text-xs text-gray-600 font-mono truncate">
                                    ID: {club.id}
                                  </p>
                                </div>
                                <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
                                  {allEvents.length} events
                                </span>
                                {isClubExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                )}
                              </div>
                              {/* Mobile: event count */}
                              <span className="text-xs text-gray-400 sm:hidden pl-9">
                                {allEvents.length} events
                              </span>
                              <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap pl-9 sm:pl-0">
                                <AdminButton
                                  variant="secondary"
                                  icon={Plus}
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openCreateEventModal(club);
                                  }}
                                  className="text-xs"
                                >
                                  <span className="hidden sm:inline">
                                    Add Event
                                  </span>
                                  <span className="sm:hidden">Add</span>
                                </AdminButton>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditClubModal(club, corner);
                                  }}
                                  className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                                  title="Edit Club"
                                >
                                  <Edit3 className="w-4 h-4 text-gray-400" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDeleteClub(club);
                                  }}
                                  className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                                  title="Delete Club"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                              </div>
                            </div>

                            {/* Events (Club Expanded) */}
                            {isClubExpanded && (
                              <div className="bg-gray-900/30 px-3 sm:px-6 py-2 sm:py-3">
                                {allEvents.length === 0 ? (
                                  <p className="text-sm text-gray-500 text-center py-2">
                                    No events for this club
                                  </p>
                                ) : (
                                  <div className="space-y-1.5 sm:space-y-2">
                                    {/* Scheduled Events */}
                                    {club.events?.scheduled?.length > 0 && (
                                      <div>
                                        <p className="text-[10px] sm:text-xs font-medium text-blue-400 mb-1">
                                          Scheduled Events
                                        </p>
                                        {club.events.scheduled.map((event) => (
                                          <div
                                            key={event.id}
                                            className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 p-1.5 sm:p-2 bg-gray-800/50 rounded-lg mb-1"
                                          >
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs sm:text-sm text-white truncate">
                                                {event.nameEn}
                                              </p>
                                              <p className="text-[10px] sm:text-xs text-gray-500 truncate hidden sm:block">
                                                {event.nameTr}
                                              </p>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 flex-wrap">
                                              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
                                                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                <span>
                                                  {event.time ||
                                                    `${event.startTime}-${event.endTime}`}
                                                </span>
                                              </div>
                                              {getStatusBadge(event.status)}
                                              {/* Participant count badge for live events */}
                                              {event.participantCount > 0 && (
                                                <button
                                                  onClick={() =>
                                                    fetchParticipants(
                                                      event.id,
                                                      event.nameEn,
                                                    )
                                                  }
                                                  className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-[10px] sm:text-xs hover:bg-purple-500/30 transition-colors"
                                                  title="View Participants"
                                                >
                                                  <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                  {event.participantCount}
                                                </button>
                                              )}
                                              <div className="flex gap-0.5 sm:gap-1">
                                                <button
                                                  onClick={() =>
                                                    generateRegistrationLink(
                                                      event.id,
                                                    )
                                                  }
                                                  className="p-0.5 sm:p-1 hover:bg-green-500/20 rounded transition-colors"
                                                  title="Get Registration Link"
                                                >
                                                  <Link className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-400" />
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    openEditEventModal(
                                                      event,
                                                      club,
                                                    )
                                                  }
                                                  className="p-0.5 sm:p-1 hover:bg-gray-700 rounded transition-colors"
                                                >
                                                  <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    setConfirmDelete(event)
                                                  }
                                                  className="p-0.5 sm:p-1 hover:bg-red-500/20 rounded transition-colors"
                                                >
                                                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {/* Continuous Events */}
                                    {club.events?.continuous?.length > 0 && (
                                      <div>
                                        <p className="text-[10px] sm:text-xs font-medium text-green-400 mb-1">
                                          Continuous Events
                                        </p>
                                        {club.events.continuous.map((event) => (
                                          <div
                                            key={event.id}
                                            className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 p-1.5 sm:p-2 bg-gray-800/50 rounded-lg mb-1"
                                          >
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs sm:text-sm text-white truncate">
                                                {event.nameEn}
                                              </p>
                                              <p className="text-[10px] sm:text-xs text-gray-500 truncate hidden sm:block">
                                                {event.nameTr}
                                              </p>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 flex-wrap">
                                              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
                                                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                <span>
                                                  {event.time || "All Day"}
                                                </span>
                                              </div>
                                              {getStatusBadge(event.status)}
                                              {/* Participant count badge */}
                                              {event.participantCount > 0 && (
                                                <button
                                                  onClick={() =>
                                                    fetchParticipants(
                                                      event.id,
                                                      event.nameEn,
                                                    )
                                                  }
                                                  className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-[10px] sm:text-xs hover:bg-purple-500/30 transition-colors"
                                                  title="View Participants"
                                                >
                                                  <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                  {event.participantCount}
                                                </button>
                                              )}
                                              <div className="flex gap-0.5 sm:gap-1">
                                                <button
                                                  onClick={() =>
                                                    generateRegistrationLink(
                                                      event.id,
                                                    )
                                                  }
                                                  className="p-0.5 sm:p-1 hover:bg-green-500/20 rounded transition-colors"
                                                  title="Get Registration Link"
                                                >
                                                  <Link className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-400" />
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    openEditEventModal(
                                                      event,
                                                      club,
                                                    )
                                                  }
                                                  className="p-0.5 sm:p-1 hover:bg-gray-700 rounded transition-colors"
                                                >
                                                  <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    setConfirmDelete(event)
                                                  }
                                                  className="p-0.5 sm:p-1 hover:bg-red-500/20 rounded transition-colors"
                                                >
                                                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {/* Stand Time Events */}
                                    {club.events?.standTime?.length > 0 && (
                                      <div>
                                        <p className="text-[10px] sm:text-xs font-medium text-purple-400 mb-1">
                                          Stand Time Events
                                        </p>
                                        {club.events.standTime.map((event) => (
                                          <div
                                            key={event.id}
                                            className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 p-1.5 sm:p-2 bg-gray-800/50 rounded-lg mb-1"
                                          >
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs sm:text-sm text-white truncate">
                                                {event.nameEn}
                                              </p>
                                              <p className="text-[10px] sm:text-xs text-gray-500 truncate hidden sm:block">
                                                {event.nameTr}
                                              </p>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 flex-wrap">
                                              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
                                                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                <span>
                                                  {event.time || "Stand Time"}
                                                </span>
                                              </div>
                                              {getStatusBadge(event.status)}
                                              {/* Participant count badge */}
                                              {event.participantCount > 0 && (
                                                <button
                                                  onClick={() =>
                                                    fetchParticipants(
                                                      event.id,
                                                      event.nameEn,
                                                    )
                                                  }
                                                  className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-[10px] sm:text-xs hover:bg-purple-500/30 transition-colors"
                                                  title="View Participants"
                                                >
                                                  <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                  {event.participantCount}
                                                </button>
                                              )}
                                              <div className="flex gap-0.5 sm:gap-1">
                                                <button
                                                  onClick={() =>
                                                    generateRegistrationLink(
                                                      event.id,
                                                    )
                                                  }
                                                  className="p-0.5 sm:p-1 hover:bg-green-500/20 rounded transition-colors"
                                                  title="Get Registration Link"
                                                >
                                                  <Link className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-400" />
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    openEditEventModal(
                                                      event,
                                                      club,
                                                    )
                                                  }
                                                  className="p-0.5 sm:p-1 hover:bg-gray-700 rounded transition-colors"
                                                >
                                                  <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" />
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    setConfirmDelete(event)
                                                  }
                                                  className="p-0.5 sm:p-1 hover:bg-red-500/20 rounded transition-colors"
                                                >
                                                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Event Modal */}
      <AdminModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          resetEventForm();
        }}
        title={`Add Event - ${selectedClub?.nameEn || ""}`}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Event Type
              </label>
              <select
                value={eventFormData.eventType}
                onChange={(e) =>
                  setEventFormData({
                    ...eventFormData,
                    eventType: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                value={eventFormData.status}
                onChange={(e) =>
                  setEventFormData({ ...eventFormData, status: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Period
            </label>
            <select
              value={eventFormData.periodId}
              onChange={(e) =>
                setEventFormData({ ...eventFormData, periodId: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              <option value="">No period assigned</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name} ({period.startTime} - {period.endTime})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Admins can assign any event type to periods (including Live Stage)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Event Name (TR)
            </label>
            <input
              type="text"
              value={eventFormData.nameTr}
              onChange={(e) =>
                setEventFormData({ ...eventFormData, nameTr: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              placeholder="Etkinlik Adi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Event Name (EN)
            </label>
            <input
              type="text"
              value={eventFormData.nameEn}
              onChange={(e) =>
                setEventFormData({ ...eventFormData, nameEn: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              placeholder="Event Name"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Time Display
              </label>
              <input
                type="text"
                value={eventFormData.time}
                onChange={(e) =>
                  setEventFormData({ ...eventFormData, time: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                placeholder="14:20-15:00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={eventFormData.startTime}
                onChange={(e) =>
                  setEventFormData({
                    ...eventFormData,
                    startTime: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                placeholder="14:20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Time
              </label>
              <input
                type="text"
                value={eventFormData.endTime}
                onChange={(e) =>
                  setEventFormData({
                    ...eventFormData,
                    endTime: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                placeholder="15:00"
              />
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <AdminButton
              variant="secondary"
              onClick={() => {
                setIsEventModalOpen(false);
                resetEventForm();
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="primary"
              icon={Plus}
              onClick={handleCreateEvent}
              className="w-full sm:w-auto"
            >
              Create Event
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Edit Event Modal */}
      <AdminModal
        isOpen={isEditEventModalOpen}
        onClose={() => {
          setIsEditEventModalOpen(false);
          setSelectedEvent(null);
          resetEventForm();
        }}
        title="Edit Event"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Event Type
              </label>
              <select
                value={eventFormData.eventType}
                onChange={(e) =>
                  setEventFormData({
                    ...eventFormData,
                    eventType: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                value={eventFormData.status}
                onChange={(e) =>
                  setEventFormData({ ...eventFormData, status: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Period
            </label>
            <select
              value={eventFormData.periodId}
              onChange={(e) => {
                const newPeriodId = e.target.value;
                setEventFormData({ ...eventFormData, periodId: newPeriodId });

                // Find corner ID from selected club
                const corner = corners.find((c) => {
                  const clubs = c.clubs ? Object.values(c.clubs) : [];
                  return clubs.some((club) => club.id === eventFormData.clubId);
                });

                if (newPeriodId && corner) {
                  checkConflict(
                    corner.id,
                    newPeriodId,
                    eventFormData.clubId,
                    selectedEvent?.id,
                  );
                }
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              <option value="">No period assigned</option>
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name} ({period.startTime} - {period.endTime})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Admins can assign any event type to periods (including Live Stage)
            </p>
            {isCheckingConflict && (
              <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-xs text-blue-400">
                  Checking for conflicts...
                </span>
              </div>
            )}
            {conflict && (
              <div
                className={`mt-2 p-3 rounded-lg border ${
                  conflict.type === "corner"
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-amber-500/10 border-amber-500/30"
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    className={`w-4 h-4 mt-0.5 ${
                      conflict.type === "corner"
                        ? "text-red-400"
                        : "text-amber-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        conflict.type === "corner"
                          ? "text-red-300"
                          : "text-amber-300"
                      }`}
                    >
                      {conflict.type === "corner"
                        ? "Corner Conflict"
                        : "Club Conflict"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {conflict.message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Event Name (TR)
            </label>
            <input
              type="text"
              value={eventFormData.nameTr}
              onChange={(e) =>
                setEventFormData({ ...eventFormData, nameTr: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              placeholder="Etkinlik Adi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Event Name (EN)
            </label>
            <input
              type="text"
              value={eventFormData.nameEn}
              onChange={(e) =>
                setEventFormData({ ...eventFormData, nameEn: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              placeholder="Event Name"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Time Display
              </label>
              <input
                type="text"
                value={eventFormData.time}
                onChange={(e) =>
                  setEventFormData({ ...eventFormData, time: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                placeholder="14:20-15:00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={eventFormData.startTime}
                onChange={(e) =>
                  setEventFormData({
                    ...eventFormData,
                    startTime: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                placeholder="14:20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Time
              </label>
              <input
                type="text"
                value={eventFormData.endTime}
                onChange={(e) =>
                  setEventFormData({
                    ...eventFormData,
                    endTime: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                placeholder="15:00"
              />
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <AdminButton
              variant="secondary"
              onClick={() => {
                setIsEditEventModalOpen(false);
                setSelectedEvent(null);
                resetEventForm();
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="primary"
              icon={Check}
              onClick={handleUpdateEvent}
              className="w-full sm:w-auto"
            >
              Save Changes
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Create Club Modal */}
      <AdminModal
        isOpen={isClubModalOpen}
        onClose={() => {
          setIsClubModalOpen(false);
          resetClubForm();
        }}
        title={`Add Club - ${selectedCorner?.nameEn || ""}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Club ID
            </label>
            <input
              type="text"
              value={clubFormData.id}
              onChange={(e) =>
                setClubFormData({ ...clubFormData, id: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              placeholder="e.g., emurpg_club_new"
            />
            <p className="text-xs text-gray-500 mt-1">
              Unique identifier (lowercase, underscores allowed)
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Club Name (TR)
            </label>
            <input
              type="text"
              value={clubFormData.nameTr}
              onChange={(e) =>
                setClubFormData({ ...clubFormData, nameTr: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              placeholder="Kulup Adi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Club Name (EN)
            </label>
            <input
              type="text"
              value={clubFormData.nameEn}
              onChange={(e) =>
                setClubFormData({ ...clubFormData, nameEn: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              placeholder="Club Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Corner
            </label>
            <select
              value={clubFormData.cornerId}
              onChange={(e) =>
                setClubFormData({ ...clubFormData, cornerId: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              {CORNER_TYPES.map((corner) => (
                <option key={corner.value} value={corner.value}>
                  {corner.label} ({corner.labelTr})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              value={clubFormData.status}
              onChange={(e) =>
                setClubFormData({ ...clubFormData, status: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <AdminButton
              variant="secondary"
              onClick={() => {
                setIsClubModalOpen(false);
                resetClubForm();
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="primary"
              icon={Plus}
              onClick={handleCreateClub}
              className="w-full sm:w-auto"
            >
              Create Club
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Edit Club Modal */}
      <AdminModal
        isOpen={isEditClubModalOpen}
        onClose={() => {
          setIsEditClubModalOpen(false);
          setSelectedClub(null);
          resetClubForm();
        }}
        title="Edit Club"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Club ID
            </label>
            <input
              type="text"
              value={clubFormData.id}
              disabled
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Club Name (TR)
            </label>
            <input
              type="text"
              value={clubFormData.nameTr}
              onChange={(e) =>
                setClubFormData({ ...clubFormData, nameTr: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              placeholder="Kulup Adi"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Club Name (EN)
            </label>
            <input
              type="text"
              value={clubFormData.nameEn}
              onChange={(e) =>
                setClubFormData({ ...clubFormData, nameEn: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              placeholder="Club Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Corner
            </label>
            <select
              value={clubFormData.cornerId}
              onChange={(e) =>
                setClubFormData({ ...clubFormData, cornerId: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              {CORNER_TYPES.map((corner) => (
                <option key={corner.value} value={corner.value}>
                  {corner.label} ({corner.labelTr})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              value={clubFormData.status}
              onChange={(e) =>
                setClubFormData({ ...clubFormData, status: e.target.value })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <AdminButton
              variant="secondary"
              onClick={() => {
                setIsEditClubModalOpen(false);
                setSelectedClub(null);
                resetClubForm();
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="primary"
              icon={Check}
              onClick={handleUpdateClub}
              className="w-full sm:w-auto"
            >
              Save Changes
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      {/* Participants Modal */}
      <AdminModal
        isOpen={isParticipantsModalOpen}
        onClose={() => {
          setIsParticipantsModalOpen(false);
          setParticipantsData({ participants: [], count: 0 });
        }}
        title={`Participants - ${participantsEventName}`}
      >
        <div className="space-y-4">
          {participantsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : participantsData.count === 0 ? (
            <p className="text-center text-gray-400 py-8">
              No participants registered yet
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">
                  Total: {participantsData.count} participants
                </span>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {participantsData.participants.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="p-3 bg-gray-800/50 rounded-lg"
                  >
                    <p className="text-white font-medium">{p.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </AdminModal>

      {/* Registration Link Modal */}
      <AdminModal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setRegistrationLink("");
        }}
        title="Registration Link"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Share this link with participants to register for the event:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={registrationLink}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
            />
            <button
              onClick={() => copyToClipboard(registrationLink)}
              className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5 text-gray-900" />
            </button>
          </div>
          <p className="text-xs text-gray-500">
            This link is unique to this event and will remain active.
          </p>
        </div>
      </AdminModal>

      {/* Confirm Delete Event Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDeleteEvent(confirmDelete?.id)}
        title="Delete Event"
        message={`Are you sure you want to delete "${
          confirmDelete?.nameEn || confirmDelete?.nameTr || "this event"
        }"?`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Confirm Delete Club Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDeleteClub}
        onClose={() => setConfirmDeleteClub(null)}
        onConfirm={() => handleDeleteClub(confirmDeleteClub?.id)}
        title="Delete Club"
        message={`Are you sure you want to delete "${
          confirmDeleteClub?.nameEn || confirmDeleteClub?.nameTr || "this club"
        }"? This will also delete all events associated with this club.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default EmuconAdminPanel;
