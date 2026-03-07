import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const FAMILY_COLORS = {
  legendary: "text-yellow-400",
  heroic: "text-blue-400",
  chaotic: "text-purple-400",
  cursed: "text-red-400",
  pathetic: "text-gray-400",
};

const FAMILY_BORDERS = {
  legendary: "border-yellow-500/40",
  heroic: "border-blue-500/40",
  chaotic: "border-purple-500/40",
  cursed: "border-red-500/40",
  pathetic: "border-gray-500/40",
};

const EndingScreen = ({ ending, state, onRestart, onChangeScenario }) => {
  const { t } = useTranslation();
  const familyColor = FAMILY_COLORS[ending.family] || "text-yellow-300";
  const borderColor = FAMILY_BORDERS[ending.family] || "border-yellow-500/30";

  return (
    <div className="max-w-md mx-auto animate-scaleIn">
      <div
        className={`bg-gray-800/80 border ${borderColor} rounded-xl p-6 text-center`}
      >
        {/* Family badge */}
        <span
          className={`text-xs uppercase tracking-wider font-bold ${familyColor}`}
        >
          {ending.family}
        </span>

        {/* Title */}
        <h3 className={`text-2xl font-bold mt-2 mb-3 ${familyColor}`}>
          {ending.title}
        </h3>

        {/* Ending text */}
        <p className="text-gray-300 text-sm mb-6 leading-relaxed italic">
          &ldquo;{ending.text}&rdquo;
        </p>

        {/* Run stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-2">
            <div className="text-yellow-400 text-lg font-bold">
              {state.renown}
            </div>
            <div className="text-gray-500 text-xs">
              {t("tavern_run.stat_renown")}
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-2">
            <div className="text-green-400 text-lg font-bold">
              {state.supplies}
            </div>
            <div className="text-gray-500 text-xs">
              {t("tavern_run.stat_supplies")}
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-2">
            <div className="text-red-400 text-lg font-bold">{state.danger}</div>
            <div className="text-gray-500 text-xs">
              {t("tavern_run.stat_danger")}
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-2">
            <div className="text-blue-400 text-lg font-bold">
              {state.streak}
            </div>
            <div className="text-gray-500 text-xs">
              {t("tavern_run.stat_streak")}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-colors duration-300"
          >
            {t("tavern_run.play_again")}
          </button>
          <button
            onClick={onChangeScenario}
            className="px-4 py-2 bg-transparent border border-gray-600 hover:border-yellow-500/50 text-gray-400 hover:text-yellow-300 text-sm rounded-lg transition-colors duration-300"
          >
            {t("tavern_run.try_another")}
          </button>
        </div>
      </div>
    </div>
  );
};

EndingScreen.propTypes = {
  ending: PropTypes.shape({
    family: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
  state: PropTypes.shape({
    renown: PropTypes.number,
    supplies: PropTypes.number,
    danger: PropTypes.number,
    streak: PropTypes.number,
  }).isRequired,
  onRestart: PropTypes.func.isRequired,
  onChangeScenario: PropTypes.func.isRequired,
};

export default EndingScreen;
