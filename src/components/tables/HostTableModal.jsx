import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { config } from "../../config";

const LANGUAGES = ["Turkish", "English"];

const initialForm = {
  game_id: null,
  game_name: "",
  game_master: "",
  player_quota: "",
  language: "Turkish",
  whatsapp: "",
  student_id: "",
  agreed: false,
};

const HostTableModal = ({ isOpen, onClose, eventSlug }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [selectedGameId, setSelectedGameId] = useState("");
  const [games, setGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setGamesLoading(true);
    fetch(`${config.backendUrl}/api/games`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setGames(Array.isArray(data) ? data : []))
      .catch(() => setGames([]))
      .finally(() => setGamesLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGameSelect = (e) => {
    const val = e.target.value;
    setSelectedGameId(val);
    if (val === "" ) {
      setForm((prev) => ({ ...prev, game_id: null, game_name: "" }));
    } else if (val === "custom") {
      setForm((prev) => ({ ...prev, game_id: null, game_name: "" }));
    } else {
      const game = games.find((g) => g.id === val);
      if (game) {
        setForm((prev) => ({ ...prev, game_id: game.id, game_name: game.name }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClose = () => {
    setForm(initialForm);
    setSelectedGameId("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedGameId) {
      setError(t("host_table_modal.error_game_required"));
      return;
    }
    if (selectedGameId === "custom" && !form.game_name.trim()) {
      setError(t("host_table_modal.error_game_required"));
      return;
    }
    const quota = parseInt(form.player_quota, 10);
    if (isNaN(quota) || quota < 1) {
      setError(t("host_table_modal.error_invalid_quota"));
      return;
    }
    if (!/^\d{8}$/.test(form.student_id)) {
      setError(t("host_table_modal.error_invalid_student_id"));
      return;
    }
    if (!form.agreed) {
      setError(t("host_table_modal.error_agreement_required"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `${config.backendUrl}/api/events/${eventSlug}/host-request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            game_id: form.game_id || null,
            game_name: form.game_name.trim(),
            game_master: form.game_master.trim(),
            player_quota: quota,
            language: form.language,
            whatsapp: form.whatsapp.trim(),
            student_id: form.student_id.trim(),
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || t("host_table_modal.error_generic"));
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isCustom = selectedGameId === "custom";

  return (
    <div className="fixed inset-0 bg-gray-950/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-purple-600 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-1 font-medieval">
            {t("host_table_modal.title")}
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            {t("host_table_modal.subtitle")}
          </p>

          {success ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎲</div>
              <p className="text-xl font-bold text-green-400 mb-2">
                {t("host_table_modal.success_title")}
              </p>
              <p className="text-gray-300 text-sm mb-6">
                {t("host_table_modal.success_body")}
              </p>
              <button
                onClick={handleClose}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                {t("host_table_modal.close")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Game Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t("host_table_modal.game_name")}{" "}
                  <span className="text-red-400">*</span>
                </label>
                {gamesLoading ? (
                  <div className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-gray-500 text-sm animate-pulse">
                    {t("host_table_modal.loading_games")}
                  </div>
                ) : (
                  <select
                    value={selectedGameId}
                    onChange={handleGameSelect}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="">{t("host_table_modal.select_game")}</option>
                    {games.map((game) => (
                      <option key={game.id} value={game.id}>
                        {game.name}
                      </option>
                    ))}
                    <option value="custom">
                      {t("host_table_modal.custom_game")}
                    </option>
                  </select>
                )}
                {isCustom && (
                  <input
                    type="text"
                    name="game_name"
                    value={form.game_name}
                    onChange={handleChange}
                    required
                    autoFocus
                    className="mt-2 w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                    placeholder={t("host_table_modal.game_name_placeholder")}
                  />
                )}
              </div>

              {/* Game Master Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t("host_table_modal.game_master")}{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="game_master"
                  value={form.game_master}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                  placeholder={t("host_table_modal.game_master_placeholder")}
                />
              </div>

              {/* Player Quota + Language side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t("host_table_modal.player_quota")}{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="player_quota"
                    value={form.player_quota}
                    onChange={handleChange}
                    required
                    min={1}
                    max={20}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                    placeholder="e.g. 4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t("host_table_modal.language")}{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="language"
                    value={form.language}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t("host_table_modal.whatsapp")}{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                  placeholder="+90 5XX XXX XX XX"
                />
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t("host_table_modal.student_id")}{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="student_id"
                  value={form.student_id}
                  onChange={handleChange}
                  required
                  maxLength={8}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                  placeholder="12345678"
                />
              </div>

              {/* Agreement */}
              <div className="bg-gray-800/60 border border-gray-700 rounded-md p-4">
                <label className="flex gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreed"
                    checked={form.agreed}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 accent-purple-500 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-300 leading-snug">
                    {t("host_table_modal.agreement_text")}
                  </span>
                </label>
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors font-medium"
                >
                  {submitting
                    ? t("host_table_modal.submitting")
                    : t("host_table_modal.submit")}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  {t("host_table_modal.cancel")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

HostTableModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  eventSlug: PropTypes.string.isRequired,
};

export default HostTableModal;
