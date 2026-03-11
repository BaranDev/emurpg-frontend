import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Scroll, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

const COUNTDOWN_SECONDS = 5;

const TAVERN = {
  overlay: "rgba(10, 6, 3, 0.88)",
  cardBg: "linear-gradient(135deg, rgba(42, 26, 15, 0.99), rgba(61, 40, 23, 0.99))",
  border: "rgba(139, 69, 19, 0.6)",
  accent: "#ffaa33",
  accentGlow: "rgba(255, 170, 51, 0.2)",
  text: "#d4a574",
  textDark: "#8a7060",
  buttonBg: "linear-gradient(135deg, rgba(139, 69, 19, 0.8), rgba(101, 50, 14, 0.8))",
};

const PostCreationModal = ({ onClose, onFeedbackOpen }) => {
  const { t } = useTranslation();
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (remaining <= 0) {
      setCanClose(true);
      const timer = setTimeout(onClose, 400);
      return () => clearTimeout(timer);
    }
    const tick = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(tick);
  }, [remaining, onClose]);

  const progress = ((COUNTDOWN_SECONDS - remaining) / COUNTDOWN_SECONDS) * 100;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: TAVERN.overlay, backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: TAVERN.cardBg, border: `1px solid ${TAVERN.border}`, boxShadow: `0 0 60px ${TAVERN.accentGlow}` }}
      >
        {/* Countdown bar — fills from left */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "rgba(139, 69, 19, 0.3)" }}>
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%`, background: TAVERN.accent, boxShadow: `0 0 8px ${TAVERN.accent}` }}
          />
        </div>

        <div className="p-7 pt-8 flex flex-col items-center text-center gap-4">
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: TAVERN.accentGlow, border: `1px solid ${TAVERN.border}` }}
          >
            <Scroll className="w-8 h-8" style={{ color: TAVERN.accent }} />
          </div>

          {/* Title */}
          <h2 className="font-cinzel text-xl font-bold" style={{ color: TAVERN.text }}>
            {t("charroller.feedback.post_creation_title")}
          </h2>

          {/* Body */}
          <p className="text-sm leading-relaxed" style={{ color: TAVERN.textDark }}>
            {t("charroller.feedback.post_creation_body")}
          </p>

          {/* Countdown label */}
          <p className="text-xs font-mono" style={{ color: TAVERN.textDark }}>
            {t("charroller.feedback.closing_in", { count: remaining })}
          </p>

          {/* CTA — only enabled after countdown */}
          <button
            onClick={() => { onClose(); onFeedbackOpen(); }}
            disabled={!canClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: TAVERN.buttonBg, color: TAVERN.text, border: `1px solid ${TAVERN.border}` }}
          >
            <MessageSquare className="w-4 h-4" />
            {t("charroller.feedback.post_creation_cta")}
          </button>
        </div>
      </div>
    </div>
  );
};

PostCreationModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onFeedbackOpen: PropTypes.func.isRequired,
};

export default PostCreationModal;
