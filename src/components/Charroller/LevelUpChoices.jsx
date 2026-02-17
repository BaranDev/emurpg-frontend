import { useState } from "react";
import PropTypes from "prop-types";
import { Sparkles, ChevronUp, Check, X, Star, Shield, Zap } from "lucide-react";

/**
 * LevelUpChoices - Modal for D&D 5e level-up choice selection
 * Displays subclass options, ASI/Feat choices, and features gained
 */
const LevelUpChoices = ({ 
  choiceData, 
  onApply, 
  onCancel,
  characterName 
}) => {
  const [selections, setSelections] = useState({});
  const [expandedChoice, setExpandedChoice] = useState(0);
  const [isApplying, setIsApplying] = useState(false);

  const { current_level, target_level, choices, features_gained, message } = choiceData;

  const handleSelect = (choiceType, value) => {
    setSelections(prev => ({ ...prev, [choiceType]: value }));
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await onApply(selections);
    } finally {
      setIsApplying(false);
    }
  };

  const allChoicesMade = choices?.every(choice => 
    selections[choice.type] !== undefined
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(0, 0, 0, 0.85)" }}
    >
      <div 
        className="w-full max-w-2xl my-8 rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(30, 58, 95, 0.98), rgba(26, 45, 74, 0.98))",
          border: "2px solid rgba(74, 158, 255, 0.5)",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5), 0 0 100px rgba(74, 158, 255, 0.2)"
        }}
      >
        {/* Header */}
        <div 
          className="p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(74, 158, 255, 0.3), rgba(45, 90, 135, 0.3))"
          }}
        >
          {/* Decorative sparkles */}
          <div className="absolute top-2 right-4 opacity-50">
            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
          <div className="absolute bottom-2 left-8 opacity-30">
            <Sparkles className="w-4 h-4 text-blue-300" />
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <ChevronUp className="w-8 h-8 text-arcane-glow" />
            <div>
              <h2 className="text-2xl font-cinzel text-white">Level Up!</h2>
              <p className="text-sm text-silver-light">
                {characterName} • Level {current_level} → {target_level}
              </p>
            </div>
          </div>
          
          <p className="text-silver-light text-sm mt-3">{message}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Features Gained */}
          {features_gained?.length > 0 && (
            <div 
              className="p-4 rounded-lg"
              style={{
                background: "rgba(74, 158, 255, 0.1)",
                border: "1px solid rgba(74, 158, 255, 0.2)"
              }}
            >
              <h3 className="font-cinzel text-white mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Features Gained at Level {target_level}
              </h3>
              <div className="space-y-2">
                {features_gained.map((feature, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-arcane-glow font-medium">{feature.name}</span>
                    <p className="text-silver-dark text-xs mt-0.5 line-clamp-2">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Choice Sections */}
          {choices?.map((choice, choiceIndex) => (
            <div key={choiceIndex} className="space-y-3">
              <button
                onClick={() => setExpandedChoice(expandedChoice === choiceIndex ? -1 : choiceIndex)}
                className="w-full flex items-center justify-between p-3 rounded-lg transition-colors"
                style={{
                  background: selections[choice.type] 
                    ? "rgba(34, 197, 94, 0.15)" 
                    : "rgba(74, 158, 255, 0.15)",
                  border: selections[choice.type]
                    ? "1px solid rgba(34, 197, 94, 0.4)"
                    : "1px solid rgba(74, 158, 255, 0.3)"
                }}
              >
                <div className="flex items-center gap-3">
                  {choice.type === "subclass" ? (
                    <Shield className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Star className="w-5 h-5 text-yellow-400" />
                  )}
                  <div className="text-left">
                    <span className="text-white font-medium block">
                      {choice.type === "subclass" ? "Choose Subclass" : "Ability Score Improvement"}
                    </span>
                    <span className="text-xs text-silver-dark">
                      {selections[choice.type] 
                        ? `Selected: ${selections[choice.type]}`
                        : choice.description
                      }
                    </span>
                  </div>
                </div>
                {selections[choice.type] && (
                  <Check className="w-5 h-5 text-green-400" />
                )}
              </button>

              {/* Options */}
              {expandedChoice === choiceIndex && (
                <div className="grid gap-2 pl-4">
                  {choice.options?.map((option, optIndex) => (
                    <button
                      key={optIndex}
                      onClick={() => handleSelect(choice.type, option.name)}
                      className={`
                        p-3 rounded-lg text-left transition-all
                        ${selections[choice.type] === option.name 
                          ? "ring-2 ring-arcane-glow bg-arcane-glow/20" 
                          : "hover:bg-white/5"
                        }
                      `}
                      style={{
                        background: selections[choice.type] === option.name
                          ? "rgba(74, 158, 255, 0.2)"
                          : "rgba(30, 58, 95, 0.5)",
                        border: "1px solid rgba(74, 158, 255, 0.2)"
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-white font-medium block">
                            {option.name}
                          </span>
                          {option.description && (
                            <p className="text-xs text-silver-dark mt-1 line-clamp-2">
                              {option.description}
                            </p>
                          )}
                        </div>
                        {selections[choice.type] === option.name && (
                          <Check className="w-4 h-4 text-arcane-glow flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div 
          className="p-6 flex justify-end gap-3"
          style={{
            background: "rgba(26, 45, 74, 0.5)",
            borderTop: "1px solid rgba(74, 158, 255, 0.2)"
          }}
        >
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg text-silver-light hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!allChoicesMade || isApplying}
            className={`
              px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all
              ${allChoicesMade && !isApplying
                ? "hover:brightness-110 active:scale-95"
                : "opacity-50 cursor-not-allowed"
              }
            `}
            style={{
              background: allChoicesMade 
                ? "linear-gradient(135deg, #4a9eff, #2d5a87)" 
                : "rgba(74, 158, 255, 0.3)",
              color: "white"
            }}
          >
            {isApplying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4" />
                Apply Level Up
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

LevelUpChoices.propTypes = {
  choiceData: PropTypes.shape({
    current_level: PropTypes.number,
    target_level: PropTypes.number,
    choices: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string,
      description: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string
      }))
    })),
    features_gained: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string
    })),
    message: PropTypes.string
  }).isRequired,
  onApply: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  characterName: PropTypes.string
};

export default LevelUpChoices;
