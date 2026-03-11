import PropTypes from "prop-types";
import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

const TAVERN = {
  overlay: "rgba(10, 6, 3, 0.88)",
  cardBg: "linear-gradient(135deg, rgba(42, 26, 15, 0.99), rgba(61, 40, 23, 0.99))",
  border: "rgba(139, 69, 19, 0.6)",
  accent: "#ffaa33",
  accentGlow: "rgba(255, 170, 51, 0.2)",
  text: "#d4a574",
  textDark: "#8a7060",
  buttonBg: "linear-gradient(135deg, rgba(139, 69, 19, 0.8), rgba(101, 50, 14, 0.8))",
  buttonSecBg: "rgba(20, 12, 6, 0.8)",
};

const DataConsentModal = ({ onAccept, onDecline }) => {
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: TAVERN.overlay, backdropFilter: "blur(6px)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{
          background: TAVERN.cardBg,
          border: `1px solid ${TAVERN.border}`,
          boxShadow: `0 0 60px ${TAVERN.accentGlow}`,
        }}
      >
        {/* Icon + title */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: TAVERN.accentGlow, border: `1px solid ${TAVERN.border}` }}
          >
            <Shield className="w-5 h-5" style={{ color: TAVERN.accent }} />
          </div>
          <h2 className="font-cinzel text-base font-bold" style={{ color: TAVERN.text }}>
            {t("charroller.consent.title")}
          </h2>
        </div>

        {/* Body */}
        <p className="text-sm leading-relaxed mb-2" style={{ color: TAVERN.text }}>
          {t("charroller.consent.body")}
        </p>
        <p className="text-xs mb-5" style={{ color: TAVERN.textDark }}>
          {t("charroller.consent.decline_note")}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onAccept}
            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:brightness-110"
            style={{ background: TAVERN.buttonBg, color: TAVERN.text, border: `1px solid ${TAVERN.border}` }}
          >
            {t("charroller.consent.accept")}
          </button>
          <button
            onClick={onDecline}
            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:brightness-110"
            style={{ background: TAVERN.buttonSecBg, color: TAVERN.textDark, border: "1px solid rgba(139,69,19,0.3)" }}
          >
            {t("charroller.consent.decline")}
          </button>
        </div>
      </div>
    </div>
  );
};

DataConsentModal.propTypes = {
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
};

export default DataConsentModal;
