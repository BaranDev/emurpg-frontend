import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { config } from "../../config";
import {
  FaDiceD20,
  FaCheck,
  FaScroll,
  FaUser,
  FaIdCard,
  FaPhoneAlt,
  FaShieldAlt,
  FaPlayCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const GOLD = "rgba(201,162,39,";
const CORNER_POS = ["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"];

// ── Arcane rules modal ────────────────────────────────────────────────────────
const Modal = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(30,10,60,0.6) 0%, rgba(0,0,0,0.88) 100%)",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative max-w-md w-full rounded-xl max-h-[90vh] overflow-y-auto"
          style={{
            background: "rgba(10, 12, 22, 0.97)",
            border: `1px solid ${GOLD}0.28)`,
            boxShadow: [
              "0 32px 80px rgba(0,0,0,0.9)",
              `inset 0 1px 0 ${GOLD}0.18)`,
            ].join(", "),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {CORNER_POS.map((pos) => (
            <span
              key={pos}
              className={`absolute ${pos} text-xs select-none pointer-events-none`}
              style={{ color: `${GOLD}0.22)` }}
              aria-hidden="true"
            >
              ◆
            </span>
          ))}
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

// ── Arcane input field ────────────────────────────────────────────────────────
const Input = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none">
      <Icon size={14} />
    </div>
    <input
      {...props}
      className="w-full py-3 pl-11 pr-4 rounded-lg text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all duration-200"
      style={{
        background: "rgba(6, 8, 18, 0.85)",
        border: `1px solid ${GOLD}0.2)`,
      }}
    />
  </div>
);

Input.propTypes = {
  icon: PropTypes.elementType.isRequired,
};

// ── Stat tile ─────────────────────────────────────────────────────────────────
const StatTile = ({ glyph, label, value }) => (
  <div
    className="rounded-lg p-3 text-center flex flex-col items-center gap-1.5"
    style={{
      background: "rgba(6, 8, 18, 0.85)",
      border: `1px solid ${GOLD}0.13)`,
    }}
  >
    <span className="text-lg text-amber-200/40">{glyph}</span>
    <p className="text-xs font-cinzel tracking-wide text-stone-500">{label}</p>
    <p className="text-stone-200 font-semibold text-xs tabular-nums">{value}</p>
  </div>
);

StatTile.propTypes = {
  glyph: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

// ── Section divider ───────────────────────────────────────────────────────────
const Divider = () => (
  <div
    className="h-px w-full"
    style={{
      background: `linear-gradient(to right, transparent, ${GOLD}0.3), transparent)`,
    }}
  />
);

// ── Main component ────────────────────────────────────────────────────────────
const RegistrationForm = ({
  tableSlug,
  tableId,
  gameName,
  playerQuota,
  gameInfo,
}) => {
  const { t } = useTranslation();
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [gameKnowledgeAccepted, setGameKnowledgeAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleLanguage, setRuleLanguage] = useState("EN");
  const [showGameDetails, setShowGameDetails] = useState(true);
  const backendUrl = config.backendUrl;

  const rules = {
    EN: [
      "1. Participants must be currently enrolled students.",
      "2. Respect all other participants and staff members.",
      "3. Follow the event schedule and guidelines.",
      "4. No cheating or unfair play is allowed.",
      "5. Do not carry any weapons or dangerous items to the event even though they are related to your cosplay.",
      "6. Each participant may register only once per event. Multiple registrations with the same credentials will be automatically rejected by the system.",
      "7. Have fun and embrace the spirit of role-playing without breaking the rules or bothering others.",
    ],
    TR: [
      "1. Katılımcılar kayıtlı öğrenci olmalıdır.",
      "2. Tüm diğer katılımcılara ve personele saygılı olun.",
      "3. Etkinlik programını ve yönergelerini takip edin.",
      "4. Hile yapmak veya haksız oyun oynamak yasaktır.",
      "5. Kostümle ilgili olsa bile etkinliğe silah veya tehlikeli eşya getirmeyin.",
      "6. Her katılımcı etkinlik başına yalnızca bir kez kayıt olabilir. Aynı kimlik bilgileriyle yapılan tekrarlı kayıtlar sistem tarafından otomatik olarak reddedilecektir.",
      "7. Kuralları ihlal etmeden ve diğerlerini rahatsız etmeden rol yapma ruhunu benimseyin ve eğlenin.",
    ],
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert(t("registration.accept_terms"));
      return;
    }
    if (!gameKnowledgeAccepted) {
      alert(t("registration.game_understanding_required"));
      return;
    }

    const response = await fetch(`${backendUrl}/api/register/${tableSlug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: studentId,
        name,
        table_id: tableId,
        contact,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      alert(result.detail || t("registration.error_generic"));
    } else {
      alert(t("registration.success"));
    }
  };

  const formatPlaytime = (minutes) => {
    if (!minutes) return t("registration.not_specified");
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const canSubmit = termsAccepted && gameKnowledgeAccepted;

  return (
    <div
      className="w-full"
      style={{ background: "rgba(10, 12, 22, 0.96)" }}
    >
      {/* ── Game Information (collapsible) ──────────────────────────────── */}
      {gameInfo ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Collapsible header */}
          <button
            onClick={() => setShowGameDetails(!showGameDetails)}
            className="w-full flex items-center justify-between px-6 py-4 transition-colors"
            style={{
              background: showGameDetails
                ? `${GOLD}0.07)`
                : `${GOLD}0.03)`,
              borderBottom: showGameDetails
                ? `1px solid ${GOLD}0.18)`
                : "none",
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-amber-200/50 text-xs">◆</span>
              <span className="font-cinzel font-semibold text-xs text-amber-200/75 tracking-widest uppercase">
                {t("registration.game_information")}
              </span>
            </div>
            <span
              className="text-stone-600 text-xs transition-transform duration-300"
              style={{
                display: "inline-block",
                transform: showGameDetails ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▾
            </span>
          </button>

          <AnimatePresence>
            {showGameDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-5 space-y-5">
                  {/* Game image */}
                  {gameInfo.image_url && (
                    <div
                      className="w-full aspect-video rounded-lg overflow-hidden"
                      style={{
                        boxShadow: `inset 0 0 0 1px ${GOLD}0.2)`,
                      }}
                    >
                      <img
                        src={gameInfo.image_url}
                        alt={gameName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Stat tiles */}
                  <div className="grid grid-cols-3 gap-3">
                    <StatTile
                      glyph="⏱"
                      label={t("registration.avg_playtime")}
                      value={formatPlaytime(gameInfo.avg_play_time)}
                    />
                    <StatTile
                      glyph="⚔"
                      label={t("registration.players")}
                      value={
                        gameInfo.min_players && gameInfo.max_players
                          ? `${gameInfo.min_players}–${gameInfo.max_players}`
                          : playerQuota || t("registration.not_available")
                      }
                    />
                    <StatTile
                      glyph="🎲"
                      label={t("registration.table_quota")}
                      value={`${playerQuota} ${t("registration.seats")}`}
                    />
                  </div>

                  {/* Guide text */}
                  {gameInfo.guide_text && (
                    <div>
                      <h4 className="font-cinzel text-xs text-amber-200/65 tracking-widest uppercase mb-2.5">
                        ✦ {t("registration.about_game")}
                      </h4>
                      <div
                        className="text-stone-300 text-sm leading-relaxed pl-3"
                        style={{ borderLeft: `2px solid ${GOLD}0.18)` }}
                      >
                        <p className="whitespace-pre-line">{gameInfo.guide_text}</p>
                      </div>
                    </div>
                  )}

                  {/* Video link */}
                  {gameInfo.guide_video_url && (
                    <a
                      href={gameInfo.guide_video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 rounded-lg p-3 transition-all duration-200 group"
                      style={{
                        background: "rgba(127,29,29,0.25)",
                        border: "1px solid rgba(248,113,113,0.22)",
                      }}
                    >
                      <FaPlayCircle className="text-red-400 text-lg group-hover:scale-110 transition-transform" />
                      <span className="text-red-300 font-cinzel text-xs tracking-wide">
                        {t("registration.watch_tutorial")}
                      </span>
                    </a>
                  )}

                  {/* Important notice */}
                  <div
                    className="rounded-lg p-3 flex items-start gap-2.5"
                    style={{
                      background: "rgba(120,53,15,0.22)",
                      border: "1px solid rgba(251,146,60,0.22)",
                    }}
                  >
                    <FaExclamationTriangle className="text-amber-400/60 mt-0.5 flex-shrink-0 text-xs" />
                    <p className="text-amber-200/65 text-xs leading-relaxed">
                      {t("registration.review_game_info")}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Divider />
        </motion.div>
      ) : (
        /* No game info fallback */
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{ borderBottom: `1px solid ${GOLD}0.15)` }}
        >
          <span className="text-stone-600 text-xl">⚔</span>
          <div>
            <p className="text-stone-300 text-sm font-semibold">{gameName}</p>
            <p className="text-stone-600 text-xs">
              {t("registration.player_quota")} {playerQuota} ·{" "}
              {t("registration.game_details_unavailable")}
            </p>
          </div>
        </div>
      )}

      {/* ── Registration form ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="px-6 py-7"
      >
        {/* Form header */}
        <div className="text-center mb-7">
          <div className="text-2xl mb-2 text-amber-200/25" aria-hidden="true">
            <FaDiceD20 className="inline" />
          </div>
          <h2 className="font-cinzel font-bold text-lg text-amber-100">
            {t("registration.join_adventure")}
          </h2>
          <p className="text-stone-600 text-xs mt-1">
            {t("registration.quest_awaits")}
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            icon={FaIdCard}
            type="number"
            maxLength={8}
            placeholder={t("registration.student_id")}
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
          <Input
            icon={FaUser}
            type="text"
            placeholder={t("registration.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            icon={FaPhoneAlt}
            type="number"
            maxLength={15}
            placeholder={t("registration.contact")}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />

          {/* Game knowledge checkbox */}
          <div
            className="rounded-lg p-4"
            style={{
              background: "rgba(30,27,75,0.4)",
              border: "1px solid rgba(99,102,241,0.22)",
            }}
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 mt-0.5 flex-shrink-0 rounded border-indigo-700 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                checked={gameKnowledgeAccepted}
                onChange={() => setGameKnowledgeAccepted(!gameKnowledgeAccepted)}
              />
              <div>
                <span className="text-indigo-300 font-cinzel text-xs tracking-wide block">
                  {t("registration.game_knowledge_confirm")}
                </span>
                <p className="text-stone-500 mt-1 text-xs leading-relaxed">
                  {gameInfo?.guide_video_url
                    ? t("registration.game_knowledge_video")
                    : t("registration.game_knowledge_research")}
                </p>
              </div>
            </label>
          </div>

          {/* Terms checkbox */}
          <div
            className="rounded-lg p-4"
            style={{
              background: "rgba(6, 8, 18, 0.8)",
              border: `1px solid ${GOLD}0.16)`,
            }}
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 mt-0.5 flex-shrink-0 rounded border-amber-800 text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <div className="text-xs text-stone-400 leading-relaxed">
                <FaShieldAlt className="inline text-amber-500/40 mr-1.5 mb-0.5" />
                {t("registration.accept_privacy")}{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400/80 hover:text-amber-300 underline"
                >
                  {t("registration.privacy_policy")}
                </a>{" "}
                {t("registration.and_the")}{" "}
                <span
                  onClick={() => setIsModalOpen(true)}
                  className="text-amber-400/80 hover:text-amber-300 underline cursor-pointer"
                >
                  {t("registration.event_rules")}
                </span>
              </div>
            </label>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={canSubmit ? { scale: 1.01 } : {}}
            whileTap={canSubmit ? { scale: 0.99 } : {}}
            type="submit"
            disabled={!canSubmit}
            className="w-full py-3.5 px-6 rounded-xl font-cinzel font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200"
            style={
              canSubmit
                ? {
                    background:
                      "linear-gradient(135deg, rgba(112,72,8,0.85) 0%, rgba(180,120,20,0.85) 50%, rgba(112,72,8,0.85) 100%)",
                    border: `1px solid ${GOLD}0.5)`,
                    color: "#fde68a",
                    boxShadow: `0 4px 20px ${GOLD}0.12), inset 0 1px 0 rgba(255,255,255,0.08)`,
                  }
                : {
                    background: "rgba(20, 22, 35, 0.8)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.25)",
                    cursor: "not-allowed",
                  }
            }
          >
            <FaDiceD20 />
            {t("registration.begin_quest")}
          </motion.button>

          {!canSubmit && (
            <p className="text-center text-stone-600 text-xs">
              {t("registration.accept_both")}
            </p>
          )}
        </form>
      </motion.div>

      {/* ── Rules modal ──────────────────────────────────────────────────────── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 flex flex-col">
          {/* Header */}
          <div className="mb-5 pr-4">
            <h2 className="font-cinzel font-bold text-lg text-amber-100 flex items-center gap-2">
              <FaScroll className="text-amber-200/50 text-base" />
              {t("registration.event_rules")}
            </h2>
            <div
              className="mt-2.5 h-px w-full"
              style={{
                background: `linear-gradient(to right, transparent, ${GOLD}0.42), transparent)`,
              }}
            />
          </div>

          {/* Language toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              setRuleLanguage(ruleLanguage === "EN" ? "TR" : "EN")
            }
            className="self-start px-4 py-1.5 rounded-lg text-xs font-cinzel tracking-wide text-amber-200 mb-5 transition-all duration-200"
            style={{
              background: `${GOLD}0.12)`,
              border: `1px solid ${GOLD}0.3)`,
            }}
          >
            {ruleLanguage === "EN" ? "Türkçe" : "English"}
          </motion.button>

          {/* Rules list */}
          <div className="space-y-1.5">
            {rules[ruleLanguage].map((rule, index) => (
              <motion.div
                key={`${ruleLanguage}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-2.5 p-2.5 rounded-lg transition-colors hover:bg-white/[0.025]"
              >
                <FaCheck className="text-amber-400/50 mt-0.5 flex-shrink-0 text-xs" />
                <span className="text-stone-300 text-xs leading-relaxed">
                  {rule}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Close */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setIsModalOpen(false)}
            className="mt-6 w-full py-2.5 px-6 rounded-lg font-cinzel text-xs tracking-wide text-amber-200 transition-all duration-200"
            style={{
              background: `${GOLD}0.12)`,
              border: `1px solid ${GOLD}0.3)`,
            }}
          >
            {t("common.close")}
          </motion.button>
        </div>
      </Modal>
    </div>
  );
};

RegistrationForm.propTypes = {
  tableSlug: PropTypes.string,
  tableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gameName: PropTypes.string,
  gameMaster: PropTypes.string,
  playerQuota: PropTypes.number,
  gameInfo: PropTypes.shape({
    name: PropTypes.string,
    avg_play_time: PropTypes.number,
    min_players: PropTypes.number,
    max_players: PropTypes.number,
    image_url: PropTypes.string,
    guide_text: PropTypes.string,
    guide_video_url: PropTypes.string,
  }),
};

export default RegistrationForm;
