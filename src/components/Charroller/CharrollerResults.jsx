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
  Settings,
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSectionSettings, setShowSectionSettings] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [hasInspiration, setHasInspiration] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

    // Inspiration
    inspiration: false,

    // Conditions (generic)
    conditions: [],
    notes: "",

    // Custom Overrides
    abilityOverrides: {},
    acOverride: null,
    speedOverride: null,
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
      abilityOverrides: {},
      acOverride: null,
      speedOverride: null,
    }));
  };

  if (!characterData) return null;

  const system = characterData.system || "dnd5e";

  const rollD20 = () => Math.floor(Math.random() * 20) + 1;

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
    <div className="w-full max-w-[1200px] mx-auto text-silver-light font-sans relative">
      <style>{`
        .dnd-panel {
          background: linear-gradient(135deg, rgba(61, 40, 23, 0.95), rgba(42, 26, 15, 0.95));
          border: 1px solid rgba(139, 69, 19, 0.4);
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
        }
        .dnd-accent { color: #ffaa33; }
        .dnd-border-accent { border-color: rgba(255, 170, 51, 0.5); }
        .dnd-bg-accent { background: #ffaa33; }
        .dnd-input {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(139, 69, 19, 0.3);
          color: white;
        }
        .dnd-input:focus {
          outline: none;
          border-color: #ffaa33;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg, 
            transparent 0%, 
            rgba(255, 170, 51, 0.1) 30%, 
            rgba(255, 170, 51, 0.2) 50%, 
            rgba(255, 170, 51, 0.1) 70%, 
            transparent 100%
          );
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* HEADER SECTION */}
      <div className="dnd-panel rounded-xl mb-4 p-4 flex flex-col md:flex-row gap-6 relative">
        {/* Left: Portrait & Context */}
        <div className="flex gap-4 items-start w-full md:w-1/2">
          {/* Portrait Container */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
            {characterData.portrait_url ? (
              <div
                className="w-full h-full rounded-lg bg-cover bg-center border-2 dnd-border-accent shadow-[0_0_15px_rgba(255,170,51,0.2)] animate-fade-in"
                style={{
                  backgroundImage: `url(${characterData.portrait_url})`,
                }}
              />
            ) : isGeneratingPortrait ? (
              <div className="w-full h-full rounded-lg bg-[#1a110a] border-2 dnd-border-accent flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="shimmer-overlay" />
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 border-2 border-tavern-accent border-t-transparent rounded-full animate-spin shadow-[0_0_10px_rgba(255,170,51,0.3)]" />
                  <span className="text-[10px] font-cinzel text-tavern-accent animate-pulse tracking-tighter uppercase">
                    Channeling Image...
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full rounded-lg bg-red-900/20 border-2 border-red-900/50 flex items-center justify-center">
                <User className="w-12 h-12 text-red-900/50" />
              </div>
            )}

            {/* Level Badge Overlay */}
            {characterData.level && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 dnd-bg-accent rounded-full flex items-center justify-center border-2 border-[#1a110a] shadow-lg font-bold text-lg text-white font-cinzel z-20">
                {characterData.level}
              </div>
            )}
          </div>

          {/* Character Identity */}
          <div className="flex-1 mt-1">
            <h1 className="text-3xl font-cinzel text-white drop-shadow-md mb-1 uppercase tracking-wider dnd-accent">
              {characterData.character_name || "Unknown Hero"}
            </h1>

            <div className="flex flex-col gap-1 text-sm text-tavern-parchmentDark">
              {characterData.race && <span>{characterData.race}</span>}
              {characterData.class && (
                <span>
                  {characterData.class} {characterData.level}
                </span>
              )}
              {characterData.occupation && (
                <span>{characterData.occupation}</span>
              )}
              {characterData.high_concept && (
                <span>{characterData.high_concept}</span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setHasInspiration((v) => !v)}
                aria-pressed={String(hasInspiration)}
                className={`px-3 py-1 text-xs uppercase font-bold tracking-wider rounded border transition-colors ${
                  hasInspiration
                    ? "border-yellow-500 bg-yellow-500/20 text-yellow-300"
                    : "border-gray-600 hover:bg-white/5 text-gray-400"
                }`}
              >
                Inspiration
              </button>
              <button
                onClick={() => {
                  const dexRoll = (groupedRolls["ability"] || []).find((r) =>
                    ["dexterity", "dex"].some((a) =>
                      r.roll_name.toLowerCase().includes(a),
                    ),
                  );
                  const mod = dexRoll
                    ? parseInt(
                        (dexRoll.dice.match(/([+-]\d+)/) || ["", "0"])[1],
                      )
                    : 0;
                  const d20 = rollD20();
                  const total = d20 + mod;
                  handleRoll(
                    { rolls: [d20], total, modifier: mod },
                    "Initiative",
                  );
                  setShowHistory(true);
                }}
                className="px-3 py-1 text-xs uppercase font-bold tracking-wider rounded dnd-bg-accent text-white hover:brightness-110 transition-all shadow-lg"
              >
                Initiative
              </button>
              <button
                onClick={exportCharacter}
                className="px-3 py-1 text-xs uppercase font-bold tracking-wider rounded border border-gray-600 hover:bg-white/5 transition-colors"
                title="Export"
              >
                <Download className="w-3.5 h-3.5 inline mr-1" /> Export
              </button>
              {onDelete && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-3 py-1 text-xs uppercase font-bold tracking-wider rounded border border-red-900/50 !bg-red-900/20 text-red-500 hover:!bg-red-900/50 transition-colors shadow-lg"
                  title="Delete Character"
                >
                  <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Delete
                </button>
              )}
              {onEditWithAI && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-3 py-1 text-xs uppercase font-bold tracking-wider rounded border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 transition-colors"
                  title="Edit with AI"
                >
                  <Sparkles className="w-3.5 h-3.5 inline mr-1" /> Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: HP Block */}
        <div className="w-full md:w-1/2 flex justify-end">
          <div className="dnd-panel rounded-lg p-4 w-full max-w-sm flex flex-col justify-between border-t-4 dnd-border-accent">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-cinzel text-sm text-[#e5e5e5] tracking-widest font-bold">
                HIT POINTS
              </h3>
              <button
                onClick={() => {
                  setEditingSection("hp");
                  setShowSectionSettings(true);
                }}
                className="w-7 h-7 bg-transparent text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center flex-shrink-0"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-end gap-4">
              {/* HP Numbers */}
              <div className="flex-1 border-b-2 border-green-500 pb-1 flex items-baseline justify-center gap-2">
                <input
                  type="number"
                  value={trackers.currentHP}
                  onChange={(e) =>
                    updateTracker("currentHP", parseInt(e.target.value) || 0)
                  }
                  className="bg-transparent text-3xl font-bold text-white w-16 text-right focus:outline-none"
                />
                <span className="text-gray-500 text-xl">/</span>
                <input
                  type="number"
                  value={trackers.maxHP}
                  onChange={(e) =>
                    updateTracker("maxHP", parseInt(e.target.value) || 0)
                  }
                  className="bg-transparent text-3xl font-bold text-white w-16 text-left focus:outline-none"
                />
              </div>

              {/* Temp HP */}
              <div className="w-16 border-b-2 border-gray-600 pb-1 flex flex-col items-center">
                <input
                  type="number"
                  value={trackers.tempHP}
                  onChange={(e) =>
                    updateTracker("tempHP", parseInt(e.target.value) || 0)
                  }
                  className="bg-transparent text-2xl font-bold text-gray-300 w-full text-center focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500 uppercase mt-1 px-4">
              <span>Current</span>
              <span>Max</span>
              <span>Temp</span>
            </div>

            {/* HP Actions */}
            <div className="flex gap-2 mt-4">
              <div className="flex gap-1 flex-1">
                <button
                  onClick={() =>
                    adjustValue(
                      "currentHP",
                      -1,
                      0,
                      trackers.maxHP + trackers.tempHP,
                    )
                  }
                  className="w-8 h-8 rounded bg-red-900/50 text-red-400 hover:bg-red-800 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    adjustValue(
                      "currentHP",
                      1,
                      0,
                      trackers.maxHP + trackers.tempHP,
                    )
                  }
                  className="w-8 h-8 rounded bg-green-900/50 text-green-400 hover:bg-green-800 flex items-center justify-center transition-colors border border-green-900/50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => {
                  // Determine hit die from class (D&D 5e defaults)
                  const classDie = {
                    barbarian: 12,
                    fighter: 10,
                    paladin: 10,
                    ranger: 10,
                    bard: 8,
                    cleric: 8,
                    druid: 8,
                    monk: 8,
                    rogue: 8,
                    warlock: 8,
                    sorcerer: 6,
                    wizard: 6,
                  };
                  const className = (characterData.class || "").toLowerCase();
                  const die = classDie[className] ?? 8;

                  // Find CON modifier from ability rolls
                  const conRoll = (groupedRolls["ability"] || []).find((r) =>
                    r.roll_name.toLowerCase().includes("constitution"),
                  );
                  const conModMatch = conRoll?.dice?.match(/([+-]\d+)/);
                  const conMod = conModMatch ? parseInt(conModMatch[1]) : 0;

                  const hitDieRoll = Math.floor(Math.random() * die) + 1;
                  const healed = Math.max(1, hitDieRoll + conMod);
                  setTrackers((prev) => ({
                    ...prev,
                    currentHP: Math.min(prev.maxHP, prev.currentHP + healed),
                  }));
                }}
                className="flex-1 py-1 px-2 rounded bg-[#2a2a2a] text-xs font-bold uppercase tracking-wider text-gray-300 hover:bg-gray-700 transition-colors border border-gray-600"
              >
                Short Rest
              </button>
              <button
                onClick={() => {
                  setTrackers((prev) => ({
                    ...prev,
                    currentHP: prev.maxHP,
                    tempHP: 0,
                    deathSaveSuccess: 0,
                    deathSaveFail: 0,
                    usedSpellSlots: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                  }));
                }}
                className="flex-1 py-1 px-2 rounded bg-[#2a2a2a] text-xs font-bold uppercase tracking-wider text-gray-300 hover:bg-gray-700 transition-colors border border-gray-600"
              >
                Long Rest
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ABILITIES ROW */}
      <div className="dnd-panel rounded-xl mb-4 p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-cinzel text-sm text-[#e5e5e5] tracking-widest font-bold">
            ABILITIES
          </h3>
          <button
            onClick={() => {
              setEditingSection("abilities");
              setShowSectionSettings(true);
            }}
            className="w-7 h-7 bg-transparent text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center flex-shrink-0"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-2 justify-between">
          {[
            "Strength",
            "Dexterity",
            "Constitution",
            "Intelligence",
            "Wisdom",
            "Charisma",
          ].map((stat) => {
            // Extract modifier
            const extractMod = (rollStr) => {
              if (!rollStr) return "+0";
              const match = rollStr.match(/([+-]\d+)/);
              if (match) return match[1];

              const val = parseInt(rollStr);
              if (!isNaN(val) && val >= 3) {
                // 5e scores are 3-20 usually
                const mod = Math.floor((val - 10) / 2);
                return mod >= 0 ? `+${mod}` : `${mod}`;
              }
              return "+0";
            };

            const statAliases = {
              Strength: ["strength", "str"],
              Dexterity: ["dexterity", "dex"],
              Constitution: ["constitution", "con"],
              Intelligence: ["intelligence", "int"],
              Wisdom: ["wisdom", "wis"],
              Charisma: ["charisma", "cha"],
            };

            const aliases = statAliases[stat] || [stat.toLowerCase()];
            const abilityRoll = (groupedRolls["ability"] || []).find((r) =>
              aliases.some((a) => r.roll_name.toLowerCase().includes(a)),
            );
            const saveRoll = (groupedRolls["save"] || []).find((r) =>
              aliases.some((a) => r.roll_name.toLowerCase().includes(a)),
            );

            const baseAbMod = abilityRoll ? extractMod(abilityRoll.dice) : "+0";
            const baseSvMod = saveRoll ? extractMod(saveRoll.dice) : "+0";

            const abMod =
              trackers.abilityOverrides?.[stat]?.ability || baseAbMod;
            const svMod = trackers.abilityOverrides?.[stat]?.save || baseSvMod;

            return (
              <div
                key={stat}
                className="flex-1 min-w-[100px] flex flex-col items-center border-r border-[#3a2f26] last:border-0 relative"
              >
                <span className="text-xs text-gray-400 mb-1">{stat}</span>
                <div className="bg-[#1a1511] border border-[#3a2f26] rounded-md px-4 py-2 flex flex-col items-center shadow-inner relative z-10">
                  <span className="font-cinzel text-2xl text-white font-bold">
                    {abMod}
                  </span>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                      aria-label={`${stat} Ability`}
                      onClick={() => {
                        if (!abilityRoll) return;
                        const d20 = rollD20();
                        const mod = parseInt(abMod);
                        handleRoll(
                          { rolls: [d20], total: d20 + mod, modifier: mod },
                          abilityRoll.roll_name,
                        );
                      }}
                      className="text-[10px] text-gray-500 hover:text-white uppercase tracking-wider flex flex-col items-center gap-1"
                    >
                      <div className="w-6 h-6 border border-gray-600 rounded bg-[#2a2a2a] flex items-center justify-center font-bold text-gray-300">
                        {abMod}
                      </div>
                      Ability
                    </button>
                    <button
                      aria-label={`${stat} Save`}
                      onClick={() => {
                        if (!saveRoll) return;
                        const d20 = rollD20();
                        const mod = parseInt(svMod);
                        handleRoll(
                          { rolls: [d20], total: d20 + mod, modifier: mod },
                          saveRoll.roll_name,
                        );
                      }}
                      className="text-[10px] text-gray-500 hover:text-white uppercase tracking-wider flex flex-col items-center gap-1"
                    >
                      <div className="w-6 h-6 border dnd-border-accent rounded bg-[#2a2a2a] flex items-center justify-center font-bold text-gray-300 ring-1 ring-red-900/50">
                        {svMod}
                      </div>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN 3-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* LEFT COLUMN: Skills (3 cols) */}
        <div className="md:col-span-3 dnd-panel rounded-xl p-4 h-fit">
          <div className="flex justify-between items-center mb-4 border-b border-[#3a2f26] pb-2">
            <h3 className="font-cinzel text-sm text-[#e5e5e5] tracking-widest font-bold">
              SKILLS
            </h3>
            <button
              onClick={() => {
                setEditingSection("skills");
                setShowSectionSettings(true);
              }}
              className="w-7 h-7 bg-transparent text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center flex-shrink-0"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-[2px]">
            {(groupedRolls["skill"] || []).map((roll, i) => {
              // Extract mod
              const match = roll.dice.match(/([+-]\d+)/);
              const mod = match ? match[1] : "+0";
              const isProf = parseInt(mod) > 2; // rough approx for UI design
              const displayMod =
                parseInt(mod) >= 0 ? `+${parseInt(mod)}` : `${parseInt(mod)}`;

              return (
                <button
                  key={i}
                  onClick={() => {
                    const d20 = rollD20();
                    handleRoll(
                      {
                        rolls: [d20],
                        total: d20 + parseInt(mod),
                        modifier: parseInt(mod),
                      },
                      roll.roll_name,
                    );
                  }}
                  className="w-full flex items-center justify-between py-1.5 px-2 hover:bg-white/5 rounded group text-left"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full border border-gray-500 ${isProf ? "bg-tavern-accent border-tavern-accent" : "bg-transparent"}`}
                    />
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                      {roll.roll_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-600 font-bold uppercase w-6 text-right">
                      {roll.roll_name.substring(0, 3)}
                    </span>
                    <span
                      className={`text-sm font-bold w-6 text-center rounded bg-[#1a1511] border border-[#3a2f26] ${isProf ? "text-tavern-accent" : "text-gray-400"}`}
                    >
                      {displayMod}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Fallback if no skills */}
            {(!groupedRolls["skill"] || groupedRolls["skill"].length === 0) && (
              <p className="text-gray-500 text-sm italic text-center py-4">
                No specific skills parsed.
              </p>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: Tabs Content (6 cols) */}
        <div className="md:col-span-6 dnd-panel rounded-xl p-0 h-fit overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#3a2f26] bg-[#1a1511] overflow-x-auto no-scrollbar">
            {[
              "COMBAT",
              "SPELLS",
              "INVENTORY",
              "FEATURES & TRAITS",
              "NOTES",
              "ABOUT",
            ].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setExpandedCategory(tab.toLowerCase())}
                className={`py-3 px-4 font-cinzel text-xs font-bold tracking-widest whitespace-nowrap transition-colors
                  ${
                    (expandedCategory || "combat") === tab.toLowerCase()
                      ? "text-[#e5e5e5] border-b-2 dnd-border-accent bg-white/5"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 min-h-[400px]">
            {/* Show rolls based on active tab */}
            {((expandedCategory || "combat") === "combat" ||
              (expandedCategory || "combat") === "spells") && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="relative w-1/2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={`Search ${expandedCategory || "Combat"}...`}
                      className="dnd-input w-full rounded pl-8 pr-2 py-1 text-sm"
                    />
                  </div>
                  <button className="text-xs dnd-accent uppercase tracking-wider font-bold flex items-center gap-1 hover:brightness-125">
                    <Plus className="w-3 h-3" /> Add New
                  </button>
                </div>

                {/* Roll list matching tab */}
                <div className="space-y-2">
                  {categoryOrder
                    .filter((cat) =>
                      (expandedCategory || "combat") === "combat"
                        ? ["attack", "damage", "combat", "ability"].includes(
                            cat,
                          )
                        : ["spell", "sanity", "other"].includes(cat),
                    )
                    .map((cat) => {
                      const rolls = (groupedRolls[cat] || []).filter(
                        (r) =>
                          !searchTerm ||
                          r.roll_name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()),
                      );
                      return rolls.length > 0 ? (
                        <div key={cat} className="mb-4">
                          <div className="bg-[#1a1511] border border-[#3a2f26] rounded-t px-3 py-1 text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between">
                            <span>{categoryLabels[cat]}</span>
                          </div>
                          <div className="border border-t-0 border-[#3a2f26] rounded-b">
                            {rolls.map((roll, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2 border-b border-[#3a2f26] last:border-0 hover:bg-white/5 transition-colors"
                              >
                                <span
                                  className="text-sm font-bold text-gray-300 w-1/3 truncate"
                                  title={roll.roll_name}
                                >
                                  {roll.roll_name}
                                </span>
                                <div className="flex-1 flex justify-center">
                                  <DiceRoller
                                    notation={roll.dice}
                                    rollName={roll.roll_name}
                                    onRoll={(result) =>
                                      handleRoll(result, roll.roll_name)
                                    }
                                    criticalMin={characterData.critical_min}
                                    criticalMax={characterData.critical_max}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    })}

                  {/* History toggle button */}
                  <button
                    data-testid="roll-history-toggle"
                    aria-label="Roll History"
                    onClick={() => setShowHistory((v) => !v)}
                    className="text-xs text-gray-500 hover:text-gray-300 uppercase tracking-wider font-bold flex items-center gap-1 mt-4"
                  >
                    <History className="w-3 h-3" />
                    Roll History{" "}
                    {rollHistory.length > 0 ? `(${rollHistory.length})` : ""}
                  </button>

                  {/* History panel */}
                  {showHistory && rollHistory.length > 0 && (
                    <div
                      data-testid="roll-history"
                      className="mt-6 border-t border-[#3a2f26] pt-4"
                    >
                      <h4 className="font-cinzel text-xs text-gray-500 font-bold mb-2">
                        RECENT ROLLS
                      </h4>
                      <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
                        {rollHistory.map((roll, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center py-1.5 px-2 bg-[#1a1511] rounded border border-[#3a2f26]"
                          >
                            <span className="text-xs text-gray-300 truncate w-1/2">
                              {roll.rollName}
                            </span>
                            <div className="flex items-center gap-3">
                              <span
                                className={`font-bold text-sm ${roll.isCriticalSuccess ? "text-yellow-400" : roll.isCriticalFail ? "text-red-500" : "text-white"}`}
                              >
                                {roll.total}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {roll.timestamp}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {(expandedCategory === "notes" ||
              expandedCategory === "features & traits") && (
              <div>
                <textarea
                  value={trackers.notes}
                  onChange={(e) => updateTracker("notes", e.target.value)}
                  placeholder={`Write your ${expandedCategory.toLowerCase()} here...`}
                  className="dnd-input w-full h-[300px] rounded p-3 resize-none font-serif text-sm leading-relaxed"
                />
              </div>
            )}

            {expandedCategory === "inventory" && (
              <div>
                <h4 className="font-cinzel text-xs text-gray-500 font-bold mb-3 uppercase tracking-widest">
                  Equipment
                </h4>
                {(characterData.equipment || []).length > 0 ? (
                  <ul className="space-y-1">
                    {(characterData.equipment || []).map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 py-1.5 px-3 bg-[#1a1511] rounded border border-[#3a2f26] text-sm text-gray-300"
                      >
                        <span className="w-2 h-2 rounded-full bg-tavern-accent flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm italic text-center py-6">
                    No items in inventory.
                  </p>
                )}
              </div>
            )}

            {expandedCategory === "about" && (
              <div className="space-y-4">
                {characterData.backstory ||
                characterData.alignment ||
                characterData.background ? (
                  <>
                    {characterData.background && (
                      <div>
                        <h4 className="font-cinzel text-xs text-gray-500 font-bold mb-1 uppercase tracking-widest">
                          Background
                        </h4>
                        <p className="text-sm text-gray-300">
                          {characterData.background}
                        </p>
                      </div>
                    )}
                    {characterData.alignment && (
                      <div>
                        <h4 className="font-cinzel text-xs text-gray-500 font-bold mb-1 uppercase tracking-widest">
                          Alignment
                        </h4>
                        <p className="text-sm text-gray-300">
                          {characterData.alignment}
                        </p>
                      </div>
                    )}
                    {characterData.backstory && (
                      <div>
                        <h4 className="font-cinzel text-xs text-gray-500 font-bold mb-1 uppercase tracking-widest">
                          Backstory
                        </h4>
                        <p className="text-sm text-gray-300 font-serif leading-relaxed whitespace-pre-wrap">
                          {characterData.backstory}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-sm italic text-center py-6">
                    No about information available.
                  </p>
                )}
              </div>
            )}
          </div>
          {/* end tab content p-4 div */}
        </div>
        {/* end center column panel */}

        {/* RIGHT COLUMN: Defenses, Senses, etc. (3 cols) */}
        <div className="md:col-span-3 space-y-4">
          {/* AC / Speed block styling from screenshot */}
          <div className="dnd-panel rounded-xl p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-cinzel text-sm text-[#e5e5e5] tracking-widest font-bold">
                AC/SPEED
              </h3>
              <button
                onClick={() => {
                  setEditingSection("ac_speed");
                  setShowSectionSettings(true);
                }}
                className="w-7 h-7 bg-transparent text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center flex-shrink-0"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#3a2f26]">
              <span className="text-sm text-gray-400 font-bold tracking-wider">
                ARMOR CLASS
              </span>
              <div className="w-10 h-10 border border-gray-500 rounded flex items-center justify-center font-bold text-lg bg-[#1a1511] relative shield-shape">
                {trackers.acOverride !== null ? trackers.acOverride : 10}
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-400 font-bold tracking-wider">
                SPEED (ft)
              </span>
              <div className="w-10 h-10 border border-gray-500 rounded flex items-center justify-center font-bold text-lg bg-[#1a1511]">
                {trackers.speedOverride !== null ? trackers.speedOverride : 30}
              </div>
            </div>
          </div>

          <div className="dnd-panel rounded-xl p-4">
            <div className="flex justify-between items-center border-b border-[#3a2f26] pb-2 mb-2">
              <h3 className="font-cinzel text-sm text-[#e5e5e5] tracking-widest font-bold">
                DEFENSES
              </h3>
              <button
                onClick={() => {
                  setEditingSection("defenses");
                  setShowSectionSettings(true);
                }}
                className="w-7 h-7 bg-transparent text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center flex-shrink-0"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-400 italic">No defenses</p>
          </div>

          <div className="dnd-panel rounded-xl p-4">
            <div className="flex justify-between items-center border-b border-[#3a2f26] pb-2 mb-2">
              <h3 className="font-cinzel text-sm text-[#e5e5e5] tracking-widest font-bold">
                CONDITIONS
              </h3>
              <button
                onClick={() => {
                  setEditingSection("conditions");
                  setShowSectionSettings(true);
                }}
                className="w-7 h-7 bg-transparent text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center flex-shrink-0"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            {trackers.conditions.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No Conditions</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {trackers.conditions.map((cond, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded bg-red-900/30 text-red-400 border border-red-900/50 text-xs flex items-center gap-1"
                  >
                    {cond}
                    <button
                      onClick={() =>
                        setTrackers((prev) => ({
                          ...prev,
                          conditions: prev.conditions.filter(
                            (_, idx) => idx !== i,
                          ),
                        }))
                      }
                      className="hover:text-white"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}

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
              className="mt-3 w-full dnd-input text-xs py-1 rounded px-2"
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

          {/* Section Settings Modal */}
          {showSectionSettings && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="dnd-panel w-full max-w-md p-6 rounded-xl border border-[#dc2626]/30 shadow-2xl">
                <div className="flex items-center justify-between mb-4 border-b border-[#3a2f26] pb-2">
                  <h3 className="text-lg font-cinzel text-white flex items-center gap-2 uppercase">
                    <Settings className="w-5 h-5 text-gray-400" /> CUSTOMIZE{" "}
                    {editingSection?.replace("_", " ")}
                  </h3>
                  <button
                    onClick={() => setShowSectionSettings(false)}
                    className="w-7 h-7 bg-transparent text-gray-400 hover:text-white rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 py-2">
                  {editingSection === "hp" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1 uppercase font-bold tracking-wider">
                          Max HP Override
                        </label>
                        <input
                          type="number"
                          value={trackers.maxHP}
                          onChange={(e) =>
                            updateTracker(
                              "maxHP",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="w-full dnd-input p-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1 uppercase font-bold tracking-wider">
                          Current HP
                        </label>
                        <input
                          type="number"
                          value={trackers.currentHP}
                          onChange={(e) =>
                            updateTracker(
                              "currentHP",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="w-full dnd-input p-2 rounded"
                        />
                      </div>
                    </div>
                  )}

                  {editingSection === "abilities" && (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 no-scrollbar">
                      {[
                        "Strength",
                        "Dexterity",
                        "Constitution",
                        "Intelligence",
                        "Wisdom",
                        "Charisma",
                      ].map((stat) => (
                        <div
                          key={stat}
                          className="flex items-center justify-between bg-black/20 p-2 rounded border border-[#3a2f26]"
                        >
                          <span className="text-sm text-gray-300 w-1/3">
                            {stat}
                          </span>
                          <div className="flex gap-2 w-2/3">
                            <input
                              type="text"
                              placeholder="Abil (e.g. +3)"
                              value={
                                trackers.abilityOverrides?.[stat]?.ability || ""
                              }
                              onChange={(e) => {
                                const newOverrides = {
                                  ...(trackers.abilityOverrides || {}),
                                };
                                if (!newOverrides[stat])
                                  newOverrides[stat] = {};
                                newOverrides[stat].ability = e.target.value;
                                updateTracker("abilityOverrides", newOverrides);
                              }}
                              className="w-1/2 dnd-input p-1 text-center text-sm rounded bg-black/40"
                            />
                            <input
                              type="text"
                              placeholder="Save (e.g. +5)"
                              value={
                                trackers.abilityOverrides?.[stat]?.save || ""
                              }
                              onChange={(e) => {
                                const newOverrides = {
                                  ...(trackers.abilityOverrides || {}),
                                };
                                if (!newOverrides[stat])
                                  newOverrides[stat] = {};
                                newOverrides[stat].save = e.target.value;
                                updateTracker("abilityOverrides", newOverrides);
                              }}
                              className="w-1/2 dnd-input p-1 text-center text-sm rounded bg-black/40"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editingSection === "ac_speed" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1 uppercase font-bold tracking-wider">
                          AC Override
                        </label>
                        <input
                          type="number"
                          placeholder="10"
                          value={trackers.acOverride || ""}
                          onChange={(e) =>
                            updateTracker(
                              "acOverride",
                              e.target.value ? parseInt(e.target.value) : null,
                            )
                          }
                          className="w-full dnd-input p-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1 uppercase font-bold tracking-wider">
                          Speed Override
                        </label>
                        <input
                          type="number"
                          placeholder="30"
                          value={trackers.speedOverride || ""}
                          onChange={(e) =>
                            updateTracker(
                              "speedOverride",
                              e.target.value ? parseInt(e.target.value) : null,
                            )
                          }
                          className="w-full dnd-input p-2 rounded"
                        />
                      </div>
                    </div>
                  )}

                  {["skills", "defenses", "conditions"].includes(
                    editingSection,
                  ) && (
                    <p className="text-sm text-gray-400 italic text-center py-4">
                      Settings for this section are managed automatically or via
                      the main view.
                    </p>
                  )}
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowSectionSettings(false)}
                    className="px-6 py-2 rounded-lg font-bold bg-[#1a1511] text-gray-300 hover:text-white border border-[#3a2f26] hover:bg-white/5 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="dnd-panel w-full max-w-sm p-6 rounded-xl border border-red-900/50 shadow-2xl">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-red-900/20 border border-red-900/50 flex items-center justify-center mb-4">
                    <Trash2 className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-cinzel text-white mb-2">
                    Delete Character?
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Are you sure you want to delete{" "}
                    <strong className="text-white">
                      {characterData.character_name || "this character"}
                    </strong>
                    ? This action cannot be undone.
                  </p>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 py-2 rounded-lg font-bold !bg-[#1a1511] text-gray-300 hover:text-white border border-[#3a2f26] hover:!bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        if (onDelete) onDelete(characterData.id);
                      }}
                      className="flex-1 py-2 rounded-lg font-bold !bg-red-900/80 text-white hover:!bg-red-600 transition-colors shadow-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Edit Modal code stays hidden here */}
          {showEditModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="dnd-panel w-full max-w-lg p-6 rounded-xl border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-cinzel text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" /> Edit with
                    AI
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-1 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Describe the changes you want to make...
                </p>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full h-32 p-3 rounded-lg dnd-input text-white resize-none"
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 rounded-lg text-gray-400 hover:bg-white/10"
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
                      } finally {
                        setIsEditing(false);
                      }
                    }}
                    disabled={!editDescription.trim() || isEditing}
                    className="px-4 py-2 rounded-lg font-bold flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50"
                  >
                    {isEditing ? "Updating..." : "Apply Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
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
