import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { config } from "../../config";

const EVENT_TYPE_LABELS = {
  scheduled: { label: "Scheduled Event", color: "bg-blue-500" },
  continuous: { label: "Continuous", color: "bg-green-500" },
  standTime: { label: "Stand Time", color: "bg-purple-500" },
  liveStage: { label: "Live Stage", color: "bg-red-500" },
};

const STATUS_LABELS = {
  upcoming: { label: "Upcoming", color: "bg-blue-500" },
  live: { label: "Live Now", color: "bg-green-500" },
  completed: { label: "Completed", color: "bg-gray-500" },
};

const EmuconRegister = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentId: "",
    notes: "",
  });

  const fetchEventDetails = useCallback(async () => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/emucon/public/register/${token}`
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Invalid or expired registration link");
      }
      const data = await response.json();
      setEvent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(
        `${config.backendUrl}/api/emucon/public/register/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Registration failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg font-cinzel">
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center border-2 border-red-500/40 shadow-2xl">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2 font-cinzel">
            Registration Unavailable
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate("/emucon")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-emerald-500/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to EMUCON
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/20">
          <div className="relative mb-6">
            <CheckCircle className="w-20 h-20 text-emerald-400 mx-auto" />
            <Sparkles className="w-8 h-8 text-yellow-400 absolute top-0 right-1/4 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-cinzel">
            Registration Successful!
          </h2>
          <p className="text-gray-400 mb-2">You&apos;re registered for:</p>
          <p className="text-xl font-semibold text-emerald-300 mb-6 font-cinzel">
            {event?.eventName}
          </p>
          <div className="bg-gradient-to-br from-emerald-900/40 to-gray-800/40 border border-emerald-500/30 rounded-xl p-4 mb-6 text-left space-y-2">
            {event?.time && (
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{event.time}</span>
              </div>
            )}
            {(event?.startTime || event?.endTime) && (
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>
                  {event?.startTime}
                  {event?.endTime && ` - ${event.endTime}`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{event?.location}</span>
            </div>
          </div>
          <p className="text-sm text-emerald-400/80 mb-6 italic">
            Please arrive 10 minutes early. See you there!
          </p>
          <button
            onClick={() => navigate("/emucon")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-emerald-500/30"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to EMUCON
          </button>
        </div>
      </div>
    );
  }

  // Registration form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/emucon")}
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to EMUCON
        </button>

        {/* Event Card */}
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/10 mb-6">
          {/* Event Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 p-6 relative overflow-hidden">
            {/* Decorative pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)",
              }}
            ></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {event?.clubName && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20">
                    {event.clubName}
                  </span>
                )}
                {event?.eventType && EVENT_TYPE_LABELS[event.eventType] && (
                  <span
                    className={`px-3 py-1 ${
                      EVENT_TYPE_LABELS[event.eventType].color
                    } rounded-full text-white text-sm font-medium shadow-md`}
                  >
                    {EVENT_TYPE_LABELS[event.eventType].label}
                  </span>
                )}
                {event?.status && STATUS_LABELS[event.status] && (
                  <span
                    className={`px-3 py-1 ${
                      STATUS_LABELS[event.status].color
                    } rounded-full text-white text-sm font-medium shadow-md`}
                  >
                    {STATUS_LABELS[event.status].label}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white font-cinzel drop-shadow-lg">
                {event?.eventName}
              </h1>
              {event?.eventNameTr && event.eventNameTr !== event.eventName && (
                <p className="text-white/80 mt-1 text-lg">
                  {event.eventNameTr}
                </p>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {/* Time Info */}
              <div className="bg-gradient-to-br from-emerald-900/30 to-gray-800/30 border border-emerald-500/30 rounded-xl p-4 text-center hover:shadow-lg hover:shadow-emerald-500/20 transition-shadow">
                <Clock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-emerald-300/80 font-medium">Time</p>
                <p className="text-sm font-semibold text-white">
                  {event?.time ||
                    (event?.startTime
                      ? `${event.startTime}${
                          event?.endTime ? ` - ${event.endTime}` : ""
                        }`
                      : "TBA")}
                </p>
              </div>

              {/* Location */}
              <div className="bg-gradient-to-br from-emerald-900/30 to-gray-800/30 border border-emerald-500/30 rounded-xl p-4 text-center hover:shadow-lg hover:shadow-emerald-500/20 transition-shadow">
                <MapPin className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-emerald-300/80 font-medium">
                  Location
                </p>
                <p className="text-sm font-semibold text-white">
                  {event?.location || "EMUCON"}
                </p>
              </div>

              {/* Spots/Participants */}
              <div className="bg-gradient-to-br from-emerald-900/30 to-gray-800/30 border border-emerald-500/30 rounded-xl p-4 text-center col-span-2 md:col-span-1 hover:shadow-lg hover:shadow-emerald-500/20 transition-shadow">
                <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs text-emerald-300/80 font-medium">
                  {event?.spotsLeft !== null && event?.spotsLeft !== undefined
                    ? "Spots Left"
                    : "Registered"}
                </p>
                <p className="text-sm font-semibold text-white">
                  {event?.spotsLeft !== null && event?.spotsLeft !== undefined
                    ? event.spotsLeft
                    : event?.participantCount || 0}
                </p>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-t border-emerald-500/30 pt-6">
                <h2 className="text-xl font-bold text-emerald-300 mb-4 font-cinzel flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Register Now
                </h2>
              </div>

              {error && (
                <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-4 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border-2 border-emerald-500/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border-2 border-emerald-500/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border-2 border-emerald-500/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    placeholder="+90 5XX XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-2">
                    Student ID (Optional)
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border-2 border-emerald-500/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    placeholder="e.g., 2023000001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900/50 border-2 border-emerald-500/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
                  placeholder="Any special requirements or notes..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 font-cinzel text-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Complete Registration
                  </>
                )}
              </button>

              <p className="text-xs text-emerald-400/60 text-center italic">
                By registering, you agree to receive event updates via email.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

EmuconRegister.propTypes = {};

export default EmuconRegister;
