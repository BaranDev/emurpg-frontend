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
  FaClock,
  FaUsers,
  FaBookOpen,
  FaPlayCircle,
  FaGamepad,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800/90 border-2 border-yellow-600/50 rounded-lg p-6 max-w-md w-full relative shadow-[0_0_15px_rgba(202,138,4,0.15)] max-h-[90vh] overflow-y-auto"
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

Modal.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.node,
};

const Input = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
      <Icon size={18} />
    </div>
    <input
      {...props}
      className="shadow-inner appearance-none border-2 border-gray-600 rounded-lg w-full py-3 pl-12 pr-4 bg-gray-700/90 text-gray-100 leading-tight focus:outline-none focus:border-yellow-500 focus:shadow-[0_0_10px_rgba(202,138,4,0.2)] transition-all duration-300 text-sm"
    />
  </div>
);

Input.propTypes = {
  icon: PropTypes.elementType.isRequired,
};

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
        name: name,
        table_id: tableId,
        contact: contact,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      alert(result.detail || t("registration.error_generic"));
    } else {
      alert(t("registration.success"));
    }
  };

  // Format playtime
  const formatPlaytime = (minutes) => {
    if (!minutes) return t("registration.not_specified");
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Game Information Card */}
      {gameInfo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/90 border-2 border-yellow-600/50 rounded-lg mb-6 overflow-hidden"
        >
          {/* Game Info Header */}
          <button
            onClick={() => setShowGameDetails(!showGameDetails)}
            className="w-full flex items-center justify-between p-4 bg-yellow-600/20 hover:bg-yellow-600/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FaGamepad className="text-yellow-500 text-xl" />
              <span className="text-yellow-500 font-bold text-lg">
                {t("registration.game_information")}
              </span>
            </div>
            {showGameDetails ? (
              <FaChevronUp className="text-yellow-500" />
            ) : (
              <FaChevronDown className="text-yellow-500" />
            )}
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
                <div className="p-4 space-y-4">
                  {/* Game Image */}
                  {gameInfo.image_url && (
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-700">
                      <img
                        src={gameInfo.image_url}
                        alt={gameName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Game Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Average Playtime */}
                    <div className="bg-gray-700/50 rounded-lg p-3 text-center border border-gray-600">
                      <FaClock className="text-yellow-500 mx-auto mb-1 text-lg" />
                      <p className="text-xs text-gray-400">
                        {t("registration.avg_playtime")}
                      </p>
                      <p className="text-white font-semibold text-sm">
                        {formatPlaytime(gameInfo.avg_play_time)}
                      </p>
                    </div>

                    {/* Player Count */}
                    <div className="bg-gray-700/50 rounded-lg p-3 text-center border border-gray-600">
                      <FaUsers className="text-yellow-500 mx-auto mb-1 text-lg" />
                      <p className="text-xs text-gray-400">
                        {t("registration.players")}
                      </p>
                      <p className="text-white font-semibold text-sm">
                        {gameInfo.min_players && gameInfo.max_players
                          ? `${gameInfo.min_players}-${gameInfo.max_players}`
                          : playerQuota || t("registration.not_available")}
                      </p>
                    </div>

                    {/* Table Quota */}
                    <div className="bg-gray-700/50 rounded-lg p-3 text-center border border-gray-600 col-span-2 sm:col-span-1">
                      <FaDiceD20 className="text-yellow-500 mx-auto mb-1 text-lg" />
                      <p className="text-xs text-gray-400">
                        {t("registration.table_quota")}
                      </p>
                      <p className="text-white font-semibold text-sm">
                        {playerQuota} {t("registration.seats")}
                      </p>
                    </div>
                  </div>

                  {/* Game Description */}
                  {gameInfo.guide_text && (
                    <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center gap-2 mb-2">
                        <FaBookOpen className="text-yellow-500" />
                        <h4 className="text-yellow-500 font-semibold text-sm">
                          {t("registration.about_game")}
                        </h4>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                        {gameInfo.guide_text}
                      </p>
                    </div>
                  )}

                  {/* Tutorial Video Link */}
                  {gameInfo.guide_video_url && (
                    <a
                      href={gameInfo.guide_video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg p-3 transition-colors group"
                    >
                      <FaPlayCircle className="text-red-500 text-xl group-hover:scale-110 transition-transform" />
                      <span className="text-red-400 font-semibold text-sm">
                        {t("registration.watch_tutorial")}
                      </span>
                    </a>
                  )}

                  {/* Important Notice */}
                  <div className="bg-orange-900/20 border border-orange-500/50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <FaExclamationTriangle className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <p className="text-orange-300 text-xs leading-relaxed">
                        {t("registration.review_game_info")}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* No Game Info Warning */}
      {!gameInfo && (
        <div className="bg-gray-800/90 border-2 border-gray-600 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 text-gray-400">
            <FaGamepad className="text-2xl" />
            <div>
              <p className="font-semibold">{gameName}</p>
              <p className="text-sm">
                {t("registration.player_quota")} {playerQuota} |{" "}
                {t("registration.game_details_unavailable")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-800/90 shadow-[0_0_25px_rgba(0,0,0,0.3)] rounded-lg p-4 sm:p-6 border-2 border-yellow-500/30 backdrop-blur-sm"
      >
        {/* Form Header */}
        <div className="text-center mb-6">
          <FaDiceD20 className="text-4xl text-yellow-500 mx-auto mb-2" />
          <h2 className="text-xl font-bold text-yellow-500">
            {t("registration.join_adventure")}
          </h2>
          <p className="text-gray-400 text-sm">
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

          {/* Game Knowledge Checkbox */}
          <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-600 focus:ring-blue-500 focus:ring-offset-gray-800 mt-0.5 flex-shrink-0"
                checked={gameKnowledgeAccepted}
                onChange={() =>
                  setGameKnowledgeAccepted(!gameKnowledgeAccepted)
                }
              />
              <div className="text-sm">
                <span className="text-blue-300 font-semibold">
                  {t("registration.game_knowledge_confirm")}
                </span>
                <p className="text-gray-400 mt-1 text-xs leading-relaxed">
                  {gameInfo?.guide_video_url
                    ? t("registration.game_knowledge_video")
                    : t("registration.game_knowledge_research")}
                </p>
              </div>
            </label>
          </div>

          {/* Terms Checkbox */}
          <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="flex-shrink-0 mt-0.5">
                <FaShieldAlt className="text-yellow-500/50" />
              </div>
              <div className="text-sm text-gray-300">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-yellow-500 rounded border-gray-600 focus:ring-yellow-500 focus:ring-offset-gray-800 mr-2"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
                {t("registration.accept_privacy")}{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-500 hover:text-yellow-400 underline"
                >
                  {t("registration.privacy_policy")}
                </a>{" "}
                {t("registration.and_the")}{" "}
                <span
                  onClick={() => setIsModalOpen(true)}
                  className="text-yellow-500 hover:text-yellow-400 underline cursor-pointer"
                >
                  {t("registration.event_rules")}
                </span>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full font-bold py-4 px-6 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800 
                       transition duration-300 ease-in-out shadow-lg relative overflow-hidden
                       ${
                         termsAccepted && gameKnowledgeAccepted
                           ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                           : "bg-gray-600 text-gray-400 cursor-not-allowed"
                       }`}
            type="submit"
            disabled={!termsAccepted || !gameKnowledgeAccepted}
          >
            <span className="relative z-10 flex items-center justify-center">
              <FaDiceD20 className="mr-2" />
              {t("registration.begin_quest")}
            </span>
          </motion.button>

          {/* Validation Hints */}
          {(!termsAccepted || !gameKnowledgeAccepted) && (
            <p className="text-center text-gray-500 text-xs">
              {t("registration.accept_both")}
            </p>
          )}
        </form>
      </motion.div>

      {/* Rules Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-yellow-500 text-2xl font-bold flex items-center">
              <FaScroll className="mr-2" /> {t("registration.event_rules")}
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setRuleLanguage(ruleLanguage === "EN" ? "TR" : "EN")}
            className="w-40 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 mb-4"
          >
            {ruleLanguage === "EN" ? "Türkçe" : "English"}
          </motion.button>
          <div className="text-gray-300 space-y-3">
            {rules[ruleLanguage].map((rule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <FaCheck className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-sm">{rule}</span>
              </motion.div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(false)}
            className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
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
