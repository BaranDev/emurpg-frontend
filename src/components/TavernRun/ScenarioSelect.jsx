import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { config } from "../../config";

const ScenarioSelect = ({ scenarios, onSelect }) => {
  const { t } = useTranslation();

  if (scenarios.length === 1) {
    const s = scenarios[0];
    return (
      <div className="max-w-md mx-auto animate-fadeIn">
        <div className="bg-gray-800/80 border border-yellow-500/30 rounded-xl overflow-hidden">
          {s.thumbnail && (
            <img
              src={s.thumbnail}
              alt={s.name}
              className="w-full h-40 object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <div className="p-5 text-center">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">{s.name}</h3>
            <p className="text-gray-300 text-sm mb-4">{s.description}</p>
            <p className="text-gray-500 text-xs mb-4">
              {t("tavern_run.scenes_count", { count: 4 })}
            </p>
            <button
              onClick={() => onSelect(s)}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-colors duration-300"
            >
              {t("tavern_run.start_run")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className="bg-gray-800/80 border border-yellow-500/30 rounded-xl overflow-hidden text-left hover:border-yellow-400/60 transition-colors duration-300 group"
          >
            {s.thumbnail && (
              <img
                src={s.thumbnail}
                alt={s.name}
                className="w-full h-32 object-cover group-hover:brightness-110 transition-all duration-300"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold text-yellow-400 mb-1">
                {s.name}
              </h3>
              <p className="text-gray-400 text-sm">{s.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

ScenarioSelect.propTypes = {
  scenarios: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      thumbnail: PropTypes.string,
    }),
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ScenarioSelect;
