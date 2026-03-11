import { useState } from "react";
import { X, Send, MessageSquare, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const TAVERN = {
  overlay: "rgba(10, 6, 3, 0.85)",
  cardBg:
    "linear-gradient(135deg, rgba(42, 26, 15, 0.98), rgba(61, 40, 23, 0.98))",
  border: "rgba(139, 69, 19, 0.6)",
  accent: "#ffaa33",
  accentGlow: "rgba(255, 170, 51, 0.25)",
  text: "#d4a574",
  textDark: "#8a7060",
  inputBg: "rgba(20, 12, 6, 0.7)",
  buttonBg:
    "linear-gradient(135deg, rgba(139, 69, 19, 0.8), rgba(101, 50, 14, 0.8))",
};

const FeedbackModal = ({ onClose }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "sending" | "success" | "error"

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: "Charroller Feedback",
          from_name: name.trim() || "Anonymous",
          message: message.trim(),
        }),
      });
      const data = await res.json();
      setStatus(data.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: TAVERN.overlay, backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{
          background: TAVERN.cardBg,
          border: `1px solid ${TAVERN.border}`,
          boxShadow: `0 0 40px ${TAVERN.accentGlow}`,
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: TAVERN.textDark }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: TAVERN.accentGlow,
              border: `1px solid ${TAVERN.border}`,
            }}
          >
            <MessageSquare
              className="w-5 h-5"
              style={{ color: TAVERN.accent }}
            />
          </div>
          <h2
            className="font-cinzel text-lg font-bold"
            style={{ color: TAVERN.text }}
          >
            {t("charroller.feedback.modal_title")}
          </h2>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center py-6 gap-3">
            <CheckCircle
              className="w-12 h-12"
              style={{ color: TAVERN.accent }}
            />
            <p
              className="font-cinzel text-base font-bold"
              style={{ color: TAVERN.text }}
            >
              {t("charroller.feedback.success_title")}
            </p>
            <p className="text-sm" style={{ color: TAVERN.textDark }}>
              {t("charroller.feedback.success_body")}
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all hover:brightness-110"
              style={{
                background: TAVERN.buttonBg,
                color: TAVERN.text,
                border: `1px solid ${TAVERN.border}`,
              }}
            >
              {t("common.close")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("charroller.feedback.name_placeholder")}
              maxLength={60}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all"
              style={{
                background: TAVERN.inputBg,
                border: `1px solid ${TAVERN.border}`,
                color: TAVERN.text,
              }}
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("charroller.feedback.message_placeholder")}
              required
              rows={4}
              maxLength={1000}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none resize-none transition-all"
              style={{
                background: TAVERN.inputBg,
                border: `1px solid ${TAVERN.border}`,
                color: TAVERN.text,
              }}
            />
            {status === "error" && (
              <p className="text-red-400 text-xs">
                {t("charroller.feedback.error")}
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending" || !message.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all hover:brightness-110 disabled:opacity-50"
              style={{
                background: TAVERN.buttonBg,
                color: TAVERN.text,
                border: `1px solid ${TAVERN.border}`,
              }}
            >
              <Send className="w-4 h-4" />
              {status === "sending"
                ? t("charroller.feedback.sending")
                : t("charroller.feedback.submit")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

FeedbackModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default FeedbackModal;
