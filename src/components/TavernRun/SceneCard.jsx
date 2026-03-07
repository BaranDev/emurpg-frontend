import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const SceneCard = ({ scene, actIndex, onChoiceSelect, disabled }) => {
  const { t } = useTranslation();
  const actLabels = [
    t("tavern_run.act_hook"),
    t("tavern_run.act_complication"),
    t("tavern_run.act_opportunity"),
    t("tavern_run.act_crisis"),
  ];

  return (
    <div className="max-w-md mx-auto animate-fadeIn">
      <div className="bg-gray-800/80 border border-yellow-500/30 rounded-xl p-5">
        {/* Act indicator */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-yellow-500/70 font-bold">
            {actLabels[actIndex] || `Act ${actIndex + 1}`}
          </span>
          <span className="text-xs text-gray-500">{actIndex + 1} / 4</span>
        </div>

        {/* Scene title & text */}
        <h3 className="text-lg font-bold text-yellow-300 mb-2">
          {scene.title}
        </h3>
        <p className="text-gray-300 text-sm mb-5 leading-relaxed">
          {scene.text}
        </p>

        {/* Choices */}
        <div className="space-y-2">
          {scene.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoiceSelect(choice)}
              disabled={disabled}
              className="w-full text-left px-4 py-3 rounded-lg border border-yellow-500/20 bg-gray-700/50 hover:bg-yellow-600/20 hover:border-yellow-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="text-yellow-200 text-sm font-medium group-hover:text-yellow-100">
                {choice.label}
              </span>
              {choice.hint && (
                <span className="block text-gray-500 text-xs mt-0.5 italic">
                  {choice.hint}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

SceneCard.propTypes = {
  scene: PropTypes.shape({
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    choices: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        hint: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  actIndex: PropTypes.number.isRequired,
  onChoiceSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default SceneCard;
