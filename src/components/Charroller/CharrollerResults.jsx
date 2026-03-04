import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  User,
  Scroll,
  History,
  ChevronDown,
  ChevronUp,
  Download,
  Heart,
  Brain,
  Zap,
  Shield,
  Skull,
  Star,
  Plus,
  Minus,
  RefreshCw,
  Sparkles,
  X,
  Send,
  Trash2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import DiceRoller from "./DiceRoller";
import { getCharacters } from "../../utils/characterStorage";

/**
 * CharrollerResults - Displays processed character sheet with clickable rolls
 * Includes system-specific gameplay trackers and AI-powered editing
 * Supports both tavern and arcane themes
 */
const CharrollerResults = ({
  characterData,
  onNewCharacter,
  isGeneratingPortrait = false,
  onEditWithAI,
  onLevelUp,
  isLevelingUp = false,
  onDelete,
  theme = "arcane", // "tavern" | "arcane"
}) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [rollHistory, setRollHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showTrackers, setShowTrackers] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Theme colors
  const themeColors =
    theme === "tavern"
      ? {
          cardBg:
            "linear-gradient(135deg, rgba(61, 40, 23, 0.95), rgba(42, 26, 15, 0.95))",
          cardBorder: "rgba(139, 69, 19, 0.5)",
          accent: "#ffaa33",
          accentLight: "rgba(255, 170, 51, 0.3)",
          text: "#d4a574",
          textDark: "#a67c52",
          buttonBg:
            "linear-gradient(135deg, rgba(139, 69, 19, 0.6), rgba(101, 50, 14, 0.6))",
        }
      : {
          cardBg:
            "linear-gradient(135deg, rgba(30, 58, 95, 0.6), rgba(26, 45, 74, 0.8))",
          cardBorder: "rgba(74, 158, 255, 0.3)",
          accent: "#4a9eff",
          accentLight: "rgba(74, 158, 255, 0.3)",
          text: "#94a3b8",
          textDark: "#64748b",
          buttonBg:
            "linear-gradient(135deg, rgba(74, 158, 255, 0.3), rgba(45, 90, 135, 0.3))",
        };

  // Live trackers (persisted to localStorage)
  const [trackers, setTrackers] = useState({
    // D&D 5e / Pathfinder
    currentHP: 0,
    maxHP: 0,
    tempHP: 0,
    deathSaveSuccess: 0,
    deathSaveFail: 0,
    spellSlots: [0, 0, 0, 0, 0, 0, 0, 0, 0], // Levels 1-9
    usedSpellSlots: [0, 0, 0, 0, 0, 0, 0, 0, 0],

    // Pathfinder 2e specific
    focusPoints: 0,
    maxFocusPoints: 0,
    heroPoints: 0,

    // Call of Cthulhu
    currentSanity: 0,
    maxSanity: 0,
    currentLuck: 0,
    currentMP: 0,
    maxMP: 0,

    // Fate
    fatePoints: 0,
    maxRefresh: 3,
    physicalStress: [false, false, false, false],
    mentalStress: [false, false, false, false],
    consequences: { mild: "", moderate: "", severe: "" },

    // Conditions (generic)
    conditions: [],
    notes: "",
  });

  // Load trackers from localStorage on mount
  useEffect(() => {
    if (characterData?.id) {
      const chars = getCharacters();
      const saved = chars.find((c) => c.id === characterData.id);
      if (saved?.trackers) {
        setTrackers((prev) => ({ ...prev, ...saved.trackers }));
      } else {
        // Initialize from character data
        initializeTrackers();
      }
    }
  }, [characterData?.id]);

  // Save trackers to localStorage when they change
  useEffect(() => {
    if (characterData?.id) {
      const chars = getCharacters();
      const charIndex = chars.findIndex((c) => c.id === characterData.id);
      if (charIndex >= 0) {
        chars[charIndex].trackers = trackers;
        localStorage.setItem("emurpg_characters", JSON.stringify(chars));
      }
    }
  }, [trackers, characterData?.id]);

  const initializeTrackers = () => {
    const hp = characterData?.max_hp || characterData?.hit_points || 10;
    const sanity = characterData?.sanity || 50;
    const mp = characterData?.magic_points || 10;

    setTrackers((prev) => ({
      ...prev,
      currentHP: hp,
      maxHP: hp,
      currentSanity: sanity,
      maxSanity: sanity,
      currentMP: mp,
      maxMP: mp,
      currentLuck: characterData?.luck || 50,
      focusPoints: characterData?.focus_points || 1,
      maxFocusPoints: characterData?.max_focus_points || 1,
      fatePoints: characterData?.refresh || 3,
      maxRefresh: characterData?.refresh || 3,
    }));
  };

  if (!characterData) return null;

  const system = characterData.system || "dnd5e";

  const handleRoll = (result, rollName) => {
    setRollHistory((prev) =>
      [
        {
          ...result,
          rollName,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ].slice(0, 20),
    );
  };

  const updateTracker = (key, value) => {
    setTrackers((prev) => ({ ...prev, [key]: value }));
  };

  const adjustValue = (key, delta, min = 0, max = 999) => {
    setTrackers((prev) => ({
      ...prev,
      [key]: Math.max(min, Math.min(max, (prev[key] || 0) + delta)),
    }));
  };

  const toggleStress = (type, index) => {
    setTrackers((prev) => {
      const newStress = [...prev[type]];
      newStress[index] = !newStress[index];
      return { ...prev, [type]: newStress };
    });
  };

  const exportCharacter = () => {
    const exportData = {
      ...characterData,
      trackers,
      rollHistory,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const charName = (characterData.character_name || "character").replace(
      /[^a-z0-9]/gi,
      "_",
    );
    const charSystem = system || characterData.system || "unknown";
    a.download = charName + "_" + charSystem + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Group rolls by category
  const groupedRolls = {};
  (characterData.roll_list || []).forEach((roll) => {
    const category = roll.category || "other";
    if (!groupedRolls[category]) {
      groupedRolls[category] = [];
    }
    groupedRolls[category].push(roll);
  });

  const categoryLabels = {
    ability: "Ability Checks",
    save: "Saving Throws",
    skill: "Skills",
    attack: "Attacks",
    damage: "Damage",
    spell: "Spells",
    approach: "Approaches",
    aspect: "Aspects",
    stunt: "Stunts",
    characteristic: "Characteristics",
    combat: "Combat",
    sanity: "Sanity",
    other: "Other Rolls",
  };

  const categoryOrder = [
    "ability",
    "save",
    "skill",
    "attack",
    "damage",
    "spell",
    "approach",
    "characteristic",
    "combat",
    "sanity",
    "other",
  ];

  // Condition options by system
  const conditionOptions = {
    dnd5e: [
      "Blinded",
      "Charmed",
      "Deafened",
      "Exhaustion",
      "Frightened",
      "Grappled",
      "Incapacitated",
      "Invisible",
      "Paralyzed",
      "Petrified",
      "Poisoned",
      "Prone",
      "Restrained",
      "Stunned",
      "Unconscious",
    ],
    pathfinder2e: [
      "Blinded",
      "Clumsy",
      "Confused",
      "Controlled",
      "Dazzled",
      "Deafened",
      "Doomed",
      "Drained",
      "Dying",
      "Encumbered",
      "Enfeebled",
      "Fascinated",
      "Fatigued",
      "Fleeing",
      "Frightened",
      "Grabbed",
      "Hidden",
      "Immobilized",
      "Paralyzed",
      "Persistent Damage",
      "Petrified",
      "Prone",
      "Quickened",
      "Restrained",
      "Sickened",
      "Slowed",
      "Stunned",
      "Stupefied",
      "Unconscious",
      "Wounded",
    ],
    coc: [
      "Dying",
      "Unconscious",
      "Major Wound",
      "Temporary Insanity",
      "Indefinite Insanity",
    ],
    fate: ["Aspect (Scene)", "Boost", "Compelled"],
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Character Header */}
      <div
        className="p-6 rounded-xl mb-6"
        style={{
          background: themeColors.cardBg,
          border: `1px solid ${themeColors.cardBorder}`,
        }}
      >
        <div className="flex items-start gap-4">
          {/* Portrait with loading animation */}
          {characterData.portrait_url ? (
            <img
              src={characterData.portrait_url}
              alt={characterData.character_name}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0 animate-fade-in"
              style={{ animation: "fadeIn 0.5s ease-out" }}
            />
          ) : isGeneratingPortrait ? (
            <div
              className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden relative"
              style={{ background: "rgba(74, 158, 255, 0.2)" }}
            >
              {/* Shimmer animation */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(74, 158, 255, 0.3) 50%, transparent 100%)",
                  animation: "shimmer 1.5s infinite",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
                  style={{ animation: "spin 1s linear infinite" }}
                />
                <span className="text-[10px] text-blue-300 mt-1">
                  Generating...
                </span>
              </div>
              {/* CSS animations */}
              <style>{`
                @keyframes shimmer {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
                @keyframes fadeIn {
                  from { opacity: 0; transform: scale(0.9); }
                  to { opacity: 1; transform: scale(1); }
                }
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(74, 158, 255, 0.2)" }}
            >
              <User className="w-8 h-8 text-arcane-glow" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-cinzel text-white mb-1">
              {characterData.character_name || "Unknown Hero"}
            </h2>
            <div className="flex flex-wrap gap-3 text-sm text-silver-light">
              {characterData.class && (
                <span>
                  Class: <strong>{characterData.class}</strong>
                </span>
              )}
              {characterData.level && (
                <span>
                  Level: <strong>{characterData.level}</strong>
                </span>
              )}
              {characterData.race && (
                <span>
                  Race: <strong>{characterData.race}</strong>
                </span>
              )}
              {characterData.occupation && (
                <span>
                  Occupation: <strong>{characterData.occupation}</strong>
                </span>
              )}
              {characterData.high_concept && (
                <span>
                  Concept: <strong>{characterData.high_concept}</strong>
                </span>
              )}
            </div>
            <div
              className="mt-2 text-xs"
              style={{ color: themeColors.textDark }}
            >
              System: {characterData.system_name || characterData.system}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {/* Back button */}
            {onNewCharacter && (
              <button
                onClick={onNewCharacter}
                className="p-2 rounded-lg transition-colors"
                style={{ color: themeColors.text }}
                title="Back to Characters"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            {/* Level Up button */}
            {onLevelUp && characterData.system === "dnd5e" && (
              <button
                onClick={onLevelUp}
                disabled={isLevelingUp}
                className={`p-2 rounded-lg transition-colors ${isLevelingUp ? "opacity-50 cursor-not-allowed" : "hover:brightness-125"}`}
                style={{
                  color: themeColors.accent,
                  background: themeColors.accentLight,
                  border: `1px solid ${themeColors.cardBorder}`,
                }}
                title="Level Up"
              >
                {isLevelingUp ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </button>
            )}

            {/* Edit with AI */}
            {onEditWithAI && (
              <button
                onClick={() => setShowEditModal(true)}
                className="p-2 rounded-lg transition-colors hover:brightness-125"
                style={{ color: themeColors.accent }}
                title="Edit with AI"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            )}

            {/* Export */}
            <button
              onClick={exportCharacter}
              className="p-2 rounded-lg transition-colors"
              style={{ color: themeColors.text }}
              title="Export Character"
            >
              <Download className="w-5 h-5" />
            </button>

            {/* Delete */}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                title="Delete Character"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Edit Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
        >
          <div
            className="w-full max-w-lg p-6 rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(30, 58, 95, 0.95), rgba(26, 45, 74, 0.98))",
              border: "1px solid rgba(74, 158, 255, 0.4)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-cinzel text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-arcane-glow" />
                Edit with AI
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 text-silver-light hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-silver-light mb-4">
              Describe the changes you want to make to your character. The AI
              will update stats, abilities, and other attributes while{" "}
              <strong>preserving your portrait</strong>.
            </p>

            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Example: Change my class to Paladin and adjust stats for a holy warrior. Add healing spells and increase Charisma."
              className="w-full h-32 p-3 rounded-lg bg-slate-800 border border-slate-600 text-white 
                         placeholder-gray-500 resize-none focus:outline-none focus:border-arcane-glow"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg text-silver-light hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editDescription.trim() || !onEditWithAI) return;
                  setIsEditing(true);
                  try {
                    await onEditWithAI(editDescription, characterData);
                    setShowEditModal(false);
                    setEditDescription("");
                  } catch (err) {
                    console.error("Edit failed:", err);
                  } finally {
                    setIsEditing(false);
                  }
                }}
                disabled={!editDescription.trim() || isEditing}
                className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #4a9eff, #2d5a87)",
                  color: "white",
                }}
              >
                {isEditing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Apply Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System-Specific Trackers */}
      <div className="mb-6">
        <button
          onClick={() => setShowTrackers(!showTrackers)}
          className="w-full flex items-center justify-between p-3 rounded-lg mb-3
                     text-silver-light hover:bg-arcane-medium/30 transition-colors"
          style={{ background: "rgba(30, 58, 95, 0.4)" }}
        >
          <span className="font-medium flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Gameplay Trackers
          </span>
          {showTrackers ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        {showTrackers && (
          <div
            className="p-4 rounded-xl space-y-6"
            style={{
              background: "rgba(30, 58, 95, 0.3)",
              border: "1px solid rgba(74, 158, 255, 0.2)",
            }}
          >
            {/* D&D 5e / Pathfinder Trackers */}
            {(system === "dnd5e" || system === "pathfinder2e") && (
              <>
                {/* HP Tracker */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span className="text-silver-light">HP:</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        adjustValue(
                          "currentHP",
                          -1,
                          0,
                          trackers.maxHP + trackers.tempHP,
                        )
                      }
                      className="w-8 h-8 rounded bg-red-500/20 text-red-300 hover:bg-red-500/40"
                    >
                      <Minus className="w-4 h-4 mx-auto" />
                    </button>
                    <input
                      type="number"
                      value={trackers.currentHP}
                      onChange={(e) =>
                        updateTracker(
                          "currentHP",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-16 text-center bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white"
                    />
                    <span className="text-silver-dark">/</span>
                    <input
                      type="number"
                      value={trackers.maxHP}
                      onChange={(e) =>
                        updateTracker("maxHP", parseInt(e.target.value) || 0)
                      }
                      className="w-16 text-center bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white"
                    />
                    <button
                      onClick={() =>
                        adjustValue(
                          "currentHP",
                          1,
                          0,
                          trackers.maxHP + trackers.tempHP,
                        )
                      }
                      className="w-8 h-8 rounded bg-green-500/20 text-green-300 hover:bg-green-500/40"
                    >
                      <Plus className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-silver-dark">Temp:</span>
                    <input
                      type="number"
                      value={trackers.tempHP}
                      onChange={(e) =>
                        updateTracker("tempHP", parseInt(e.target.value) || 0)
                      }
                      className="w-12 text-center bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                    />
                  </div>
                </div>

                {/* Death Saves (D&D) */}
                {system === "dnd5e" && (
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Skull className="w-5 h-5 text-gray-400" />
                      <span className="text-silver-light">Death Saves:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-400">Success:</span>
                      {[0, 1, 2].map((i) => (
                        <button
                          key={`succ-${i}`}
                          onClick={() =>
                            updateTracker(
                              "deathSaveSuccess",
                              i < trackers.deathSaveSuccess ? i : i + 1,
                            )
                          }
                          className={`w-6 h-6 rounded-full border-2 ${
                            i < trackers.deathSaveSuccess
                              ? "bg-green-500 border-green-400"
                              : "border-green-400/50"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-red-400">Fail:</span>
                      {[0, 1, 2].map((i) => (
                        <button
                          key={`fail-${i}`}
                          onClick={() =>
                            updateTracker(
                              "deathSaveFail",
                              i < trackers.deathSaveFail ? i : i + 1,
                            )
                          }
                          className={`w-6 h-6 rounded-full border-2 ${
                            i < trackers.deathSaveFail
                              ? "bg-red-500 border-red-400"
                              : "border-red-400/50"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        updateTracker("deathSaveSuccess", 0);
                        updateTracker("deathSaveFail", 0);
                      }}
                      className="text-xs text-silver-dark hover:text-white"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Pathfinder 2e specific */}
                {system === "pathfinder2e" && (
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-400" />
                      <span className="text-silver-light">Focus:</span>
                      <input
                        type="number"
                        value={trackers.focusPoints}
                        onChange={(e) =>
                          updateTracker(
                            "focusPoints",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-12 text-center bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white"
                      />
                      <span className="text-silver-dark">/</span>
                      <span className="text-silver-light">
                        {trackers.maxFocusPoints}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-yellow-400" />
                      <span className="text-silver-light">Hero Points:</span>
                      {[0, 1, 2].map((i) => (
                        <button
                          key={`hero-${i}`}
                          onClick={() =>
                            updateTracker(
                              "heroPoints",
                              i < trackers.heroPoints ? i : i + 1,
                            )
                          }
                          className={`w-6 h-6 rounded border-2 ${
                            i < trackers.heroPoints
                              ? "bg-yellow-500 border-yellow-400"
                              : "border-yellow-400/50"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Call of Cthulhu Trackers */}
            {system === "coc" && (
              <>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span className="text-silver-light">Sanity:</span>
                    <input
                      type="number"
                      value={trackers.currentSanity}
                      onChange={(e) =>
                        updateTracker(
                          "currentSanity",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-16 text-center bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white"
                    />
                    <span className="text-silver-dark">/</span>
                    <span className="text-silver-light">
                      {trackers.maxSanity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-green-400" />
                    <span className="text-silver-light">Luck:</span>
                    <input
                      type="number"
                      value={trackers.currentLuck}
                      onChange={(e) =>
                        updateTracker(
                          "currentLuck",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-16 text-center bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    <span className="text-silver-light">MP:</span>
                    <input
                      type="number"
                      value={trackers.currentMP}
                      onChange={(e) =>
                        updateTracker(
                          "currentMP",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-16 text-center bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white"
                    />
                    <span className="text-silver-dark">/</span>
                    <span className="text-silver-light">{trackers.maxMP}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span className="text-silver-light">HP:</span>
                  <input
                    type="number"
                    value={trackers.currentHP}
                    onChange={(e) =>
                      updateTracker("currentHP", parseInt(e.target.value) || 0)
                    }
                    className="w-16 text-center bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white"
                  />
                  <span className="text-silver-dark">/</span>
                  <span className="text-silver-light">{trackers.maxHP}</span>
                </div>
              </>
            )}

            {/* Fate Trackers */}
            {system === "fate" && (
              <>
                <div className="flex items-center gap-4">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-silver-light">Fate Points:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => adjustValue("fatePoints", -1, 0)}
                      className="w-8 h-8 rounded bg-red-500/20 text-red-300 hover:bg-red-500/40"
                    >
                      <Minus className="w-4 h-4 mx-auto" />
                    </button>
                    <span className="w-12 text-center text-xl font-bold text-white">
                      {trackers.fatePoints}
                    </span>
                    <button
                      onClick={() => adjustValue("fatePoints", 1)}
                      className="w-8 h-8 rounded bg-green-500/20 text-green-300 hover:bg-green-500/40"
                    >
                      <Plus className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                  <span className="text-xs text-silver-dark">
                    (Refresh: {trackers.maxRefresh})
                  </span>
                </div>

                {/* Stress Boxes */}
                <div className="flex flex-wrap gap-6">
                  <div>
                    <span className="text-sm text-silver-light block mb-2">
                      Physical Stress
                    </span>
                    <div className="flex gap-2">
                      {trackers.physicalStress.map((checked, i) => (
                        <button
                          key={`phys-${i}`}
                          onClick={() => toggleStress("physicalStress", i)}
                          className={`w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-bold ${
                            checked
                              ? "bg-red-500 border-red-400 text-white"
                              : "border-slate-500 text-slate-400"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-silver-light block mb-2">
                      Mental Stress
                    </span>
                    <div className="flex gap-2">
                      {trackers.mentalStress.map((checked, i) => (
                        <button
                          key={`ment-${i}`}
                          onClick={() => toggleStress("mentalStress", i)}
                          className={`w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-bold ${
                            checked
                              ? "bg-purple-500 border-purple-400 text-white"
                              : "border-slate-500 text-slate-400"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Consequences */}
                <div className="space-y-2">
                  <span className="text-sm text-silver-light block">
                    Consequences
                  </span>
                  {["mild", "moderate", "severe"].map((level) => (
                    <div key={level} className="flex items-center gap-2">
                      <span className="text-xs text-silver-dark w-20 capitalize">
                        {level} (-
                        {level === "mild" ? 2 : level === "moderate" ? 4 : 6}):
                      </span>
                      <input
                        type="text"
                        value={trackers.consequences[level]}
                        onChange={(e) =>
                          setTrackers((prev) => ({
                            ...prev,
                            consequences: {
                              ...prev.consequences,
                              [level]: e.target.value,
                            },
                          }))
                        }
                        placeholder="Empty"
                        className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Conditions (all systems) */}
            <div>
              <span className="text-sm text-silver-light block mb-2">
                Active Conditions
              </span>
              <div className="flex flex-wrap gap-2">
                {trackers.conditions.map((cond, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setTrackers((prev) => ({
                        ...prev,
                        conditions: prev.conditions.filter(
                          (_, idx) => idx !== i,
                        ),
                      }))
                    }
                    className="px-2 py-1 rounded bg-orange-500/20 text-orange-300 text-xs hover:bg-red-500/30"
                  >
                    {cond} &times;
                  </button>
                ))}
                <select
                  onChange={(e) => {
                    if (
                      e.target.value &&
                      !trackers.conditions.includes(e.target.value)
                    ) {
                      setTrackers((prev) => ({
                        ...prev,
                        conditions: [...prev.conditions, e.target.value],
                      }));
                    }
                    e.target.value = "";
                  }}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-600 text-silver-light text-xs"
                >
                  <option value="">+ Add Condition</option>
                  {(conditionOptions[system] || conditionOptions.dnd5e).map(
                    (cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <span className="text-sm text-silver-light block mb-2">
                Session Notes
              </span>
              <textarea
                value={trackers.notes}
                onChange={(e) => updateTracker("notes", e.target.value)}
                placeholder="Quick notes for the session..."
                className="w-full h-20 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Roll History Toggle */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-cinzel text-silver-light flex items-center gap-2">
          <Scroll className="w-5 h-5" />
          Character Rolls
        </h3>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-silver-light
                     hover:bg-arcane-medium/30 transition-colors"
        >
          <History className="w-4 h-4" />
          History ({rollHistory.length})
        </button>
      </div>

      {/* Roll History Panel */}
      {showHistory && rollHistory.length > 0 && (
        <div
          className="p-4 rounded-xl mb-4 max-h-48 overflow-y-auto"
          style={{
            background: "rgba(30, 58, 95, 0.4)",
            border: "1px solid rgba(74, 158, 255, 0.2)",
          }}
        >
          {rollHistory.map((roll, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-2 border-b border-arcane-medium/20 last:border-0"
            >
              <span className="text-silver-light">{roll.rollName}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-silver-dark">
                  {roll.rolls.join("+")}
                  {roll.modifier !== 0 &&
                    (roll.modifier > 0 ? `+${roll.modifier}` : roll.modifier)}
                </span>
                <span
                  className={`font-bold ${
                    roll.isCriticalSuccess
                      ? "text-yellow-400"
                      : roll.isCriticalFail
                        ? "text-red-500"
                        : "text-white"
                  }`}
                >
                  {roll.total}
                </span>
                <span className="text-xs text-silver-dark">
                  {roll.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Roll Categories */}
      <div className="space-y-4">
        {categoryOrder
          .filter((cat) => groupedRolls[cat]?.length > 0)
          .map((category) => (
            <div key={category}>
              <button
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category ? null : category,
                  )
                }
                className="w-full flex items-center justify-between p-3 rounded-lg
                           text-silver-light hover:bg-arcane-medium/30 transition-colors"
                style={{ background: "rgba(30, 58, 95, 0.3)" }}
              >
                <span className="font-medium">
                  {categoryLabels[category] || category} (
                  {groupedRolls[category].length})
                </span>
                {expandedCategory === category ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {expandedCategory === category && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3 p-3">
                  {groupedRolls[category].map((roll, i) => (
                    <DiceRoller
                      key={i}
                      notation={roll.dice}
                      rollName={roll.roll_name}
                      onRoll={(result) => handleRoll(result, roll.roll_name)}
                      criticalMin={characterData.critical_min}
                      criticalMax={characterData.critical_max}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Quick rolls if no categories */}
      {Object.keys(groupedRolls).length === 0 &&
        characterData.roll_list?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {characterData.roll_list.map((roll, i) => (
              <DiceRoller
                key={i}
                notation={roll.dice}
                rollName={roll.roll_name}
                onRoll={(result) => handleRoll(result, roll.roll_name)}
              />
            ))}
          </div>
        )}

      {/* Actions */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={exportCharacter}
          className="px-6 py-3 rounded-lg text-silver-light font-medium
                     transition-all hover:-translate-y-0.5 flex items-center gap-2"
          style={{
            background: "rgba(30, 58, 95, 0.5)",
            border: "1px solid rgba(74, 158, 255, 0.3)",
          }}
        >
          <Download className="w-4 h-4" />
          Export Character
        </button>
        <button
          onClick={onNewCharacter}
          className="px-6 py-3 rounded-lg text-silver-light font-medium
                     transition-all hover:-translate-y-0.5"
          style={{
            background: "rgba(30, 58, 95, 0.5)",
            border: "1px solid rgba(74, 158, 255, 0.3)",
          }}
        >
          Process Another Character
        </button>
      </div>
    </div>
  );
};

CharrollerResults.propTypes = {
  characterData: PropTypes.shape({
    id: PropTypes.string,
    character_name: PropTypes.string,
    system: PropTypes.string,
    system_name: PropTypes.string,
    portrait_url: PropTypes.string,
    roll_list: PropTypes.arrayOf(
      PropTypes.shape({
        roll_name: PropTypes.string,
        dice: PropTypes.string,
        category: PropTypes.string,
      }),
    ),
    critical_min: PropTypes.number,
    critical_max: PropTypes.number,
    class: PropTypes.string,
    level: PropTypes.number,
    race: PropTypes.string,
    occupation: PropTypes.string,
    high_concept: PropTypes.string,
    max_hp: PropTypes.number,
    hit_points: PropTypes.number,
    sanity: PropTypes.number,
    magic_points: PropTypes.number,
    luck: PropTypes.number,
    focus_points: PropTypes.number,
    max_focus_points: PropTypes.number,
    refresh: PropTypes.number,
  }),
  onNewCharacter: PropTypes.func,
  isGeneratingPortrait: PropTypes.bool,
  onEditWithAI: PropTypes.func,
  onLevelUp: PropTypes.func,
  isLevelingUp: PropTypes.bool,
  onDelete: PropTypes.func,
  theme: PropTypes.oneOf(["tavern", "arcane"]),
};

export default CharrollerResults;
