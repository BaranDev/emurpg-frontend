import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  CharrollerSystemSelector,
  CharrollerUpload,
  CharrollerDescribe,
  CharrollerResults,
  CharrollerNavbar,
  TavernPlayer,
  TavernBackground,
  LevelUpChoices,
  SettingsPanel,
} from "../components";
import { config } from "../config";
import { Upload, Sparkles, Users, X, Scroll, Settings } from "lucide-react";
import {
  saveCharacter,
  updateCharacter,
  getSettings,
  getCharacters,
  deleteCharacter,
} from "../utils/characterStorage";

/**
 * CharrollerPage - Character Manager with Sidebar Layout
 *
 * Layout:
 * - Left sidebar (280px): Character list + create button
 * - Main content: Selected character OR create form
 * - Unified tavern theme throughout
 */
const CharrollerPage = ({ onLanguageSwitch }) => {
  const { t } = useTranslation();

  // Core state
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createMode, setCreateMode] = useState(null); // "upload" | "describe"

  // Create form state
  const [selectedSystem, setSelectedSystem] = useState("dnd5e");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);
  const [error, setError] = useState(null);

  // Settings & extras
  const [settings, setSettings] = useState(getSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [levelUpChoices, setLevelUpChoices] = useState(null);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load characters
  useEffect(() => {
    const loadedChars = getCharacters();
    setCharacters(loadedChars);
  }, [refreshKey]);

  // Auto-select first character if none selected
  useEffect(() => {
    if (
      characters.length > 0 &&
      !selectedCharacter &&
      !isCreating &&
      !levelUpChoices
    ) {
      setSelectedCharacter(characters[0]);
    }
  }, [characters, selectedCharacter, isCreating, levelUpChoices]);

  // Reload settings
  useEffect(() => {
    setSettings(getSettings());
  }, [refreshKey]);

  const getHeaders = () => {
    const headers = { "Content-Type": "application/json" };
    if (settings.adminCode) {
      headers["x-admin-code"] = settings.adminCode;
    }
    return headers;
  };

  // ===============================
  // Character Selection
  // ===============================
  const handleSelectCharacter = (char) => {
    setSelectedCharacter(char);
    setIsCreating(false);
    setCreateMode(null);
    setError(null);
    setMobileSidebarOpen(false);
  };

  const handleDeselectCharacter = () => {
    setSelectedCharacter(null);
  };

  const handleDeleteCharacter = (id) => {
    deleteCharacter(id);
    if (selectedCharacter?.id === id) {
      setSelectedCharacter(null);
    }
    setRefreshKey((k) => k + 1);
  };

  // ===============================
  // Create Character Flow
  // ===============================
  const handleStartCreate = (mode) => {
    setIsCreating(true);
    setCreateMode(mode);
    setSelectedCharacter(null);
    setSelectedFile(null);
    setError(null);
    setMobileSidebarOpen(false);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setCreateMode(null);
    setSelectedFile(null);
    setError(null);
  };

  const handleProcessPDF = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const headers = {};
      if (settings.adminCode) {
        headers["x-admin-code"] = settings.adminCode;
      }

      const response = await fetch(
        `${config.backendUrl}/api/charroller/process?system=${selectedSystem}`,
        { method: "POST", headers, body: formData },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error: ${response.status}`);
      }

      const data = await response.json();

      // Save immediately, generate portrait async
      const savedChar = saveCharacter(
        { ...data, system: selectedSystem },
        null,
      );
      const newChar = {
        ...data,
        id: savedChar.id,
        portrait_url: null,
        system: selectedSystem,
      };

      setSelectedCharacter(newChar);
      setIsCreating(false);
      setCreateMode(null);
      setRefreshKey((k) => k + 1);
      setIsLoading(false);

      // Generate portrait async
      if (settings.portraitGenerationEnabled) {
        console.log(
          "[PORTRAIT] portraitGenerationEnabled=true, starting async portrait for id:",
          savedChar.id,
        );
        setGeneratingId(savedChar.id);
        generatePortrait(data, savedChar.id).then((portraitUrl) => {
          console.log(
            "[PORTRAIT] generatePortrait resolved. URL:",
            portraitUrl,
          );
          if (portraitUrl) {
            updateCharacter(savedChar.id, { portrait_url: portraitUrl });
            setSelectedCharacter((prev) =>
              prev?.id === savedChar.id
                ? { ...prev, portrait_url: portraitUrl }
                : prev,
            );
            setRefreshKey((k) => k + 1);
          } else {
            console.warn(
              "[PORTRAIT] Portrait URL was null/undefined - no image to show",
            );
          }
          setGeneratingId(null);
        });
      } else {
        console.log(
          "[PORTRAIT] portraitGenerationEnabled=false, skipping portrait generation",
        );
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleGenerateCharacter = async (description) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${config.backendUrl}/api/charroller/generate`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ description, system: selectedSystem }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error: ${response.status}`);
      }

      const data = await response.json();

      const savedChar = saveCharacter(
        { ...data, system: selectedSystem },
        null,
      );
      const newChar = {
        ...data,
        id: savedChar.id,
        portrait_url: null,
        system: selectedSystem,
      };

      setSelectedCharacter(newChar);
      setIsCreating(false);
      setCreateMode(null);
      setRefreshKey((k) => k + 1);
      setIsLoading(false);

      if (settings.portraitGenerationEnabled) {
        console.log(
          "[PORTRAIT] portraitGenerationEnabled=true, starting async portrait for id:",
          savedChar.id,
        );
        setGeneratingId(savedChar.id);
        generatePortrait(data, savedChar.id).then((portraitUrl) => {
          console.log(
            "[PORTRAIT] generatePortrait resolved. URL:",
            portraitUrl,
          );
          if (portraitUrl) {
            updateCharacter(savedChar.id, { portrait_url: portraitUrl });
            setSelectedCharacter((prev) =>
              prev?.id === savedChar.id
                ? { ...prev, portrait_url: portraitUrl }
                : prev,
            );
            setRefreshKey((k) => k + 1);
          } else {
            console.warn(
              "[PORTRAIT] Portrait URL was null/undefined - no image to show",
            );
          }
          setGeneratingId(null);
        });
      } else {
        console.log(
          "[PORTRAIT] portraitGenerationEnabled=false, skipping portrait generation",
        );
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const generatePortrait = async (charData, characterId) => {
    console.log(
      "[PORTRAIT] Starting portrait generation for character_id:",
      characterId,
    );
    console.log(
      "[PORTRAIT] Backend URL:",
      `${config.backendUrl}/api/charroller/portrait`,
    );
    console.log("[PORTRAIT] Payload:", {
      character_data: { ...charData, system: selectedSystem },
      character_id: characterId || null,
    });
    try {
      const response = await fetch(
        `${config.backendUrl}/api/charroller/portrait`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            character_data: { ...charData, system: selectedSystem },
            character_id: characterId || null,
          }),
        },
      );
      console.log(
        "[PORTRAIT] Response status:",
        response.status,
        response.statusText,
      );
      const data = await response.json();
      console.log("[PORTRAIT] Response data:", data);
      if (data.portrait_url) {
        console.log("[PORTRAIT] Success! Portrait URL:", data.portrait_url);
      } else {
        console.warn(
          "[PORTRAIT] No portrait_url in response. Full response:",
          data,
        );
      }
      return data.portrait_url || null;
    } catch (err) {
      console.error("[PORTRAIT] EXCEPTION during portrait fetch:", err);
      return null;
    }
  };

  // ===============================
  // Edit with AI
  // ===============================
  const handleEditWithAI = async (description, originalCharacter) => {
    setError(null);

    try {
      const response = await fetch(`${config.backendUrl}/api/charroller/edit`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          character_data: originalCharacter,
          edit_description: description,
          system: originalCharacter.system || selectedSystem,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.requires_choices) {
        setLevelUpChoices({ ...responseData, originalCharacter });
        return;
      }

      setSelectedCharacter(responseData);

      const chars = JSON.parse(
        localStorage.getItem("emurpg_characters") || "[]",
      );
      const idx = chars.findIndex((c) => c.id === responseData.id);
      if (idx >= 0) {
        chars[idx] = { ...chars[idx], ...responseData };
        localStorage.setItem("emurpg_characters", JSON.stringify(chars));
      }

      setRefreshKey((k) => k + 1);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleApplyLevelUpChoices = async (selections) => {
    if (!levelUpChoices) return;

    const { originalCharacter, target_level } = levelUpChoices;

    try {
      let choiceDescription = `Level up to level ${target_level}.`;
      for (const [key, value] of Object.entries(selections)) {
        if (value) choiceDescription += ` ${key}: ${value}.`;
      }

      const response = await fetch(`${config.backendUrl}/api/charroller/edit`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          character_data: {
            ...originalCharacter,
            ...levelUpChoices.partial_update,
            subclass: selections.subclass || originalCharacter.subclass,
          },
          edit_description: choiceDescription,
          system: originalCharacter.system || selectedSystem,
        }),
      });

      if (!response.ok) throw new Error("Failed to apply level-up choices");

      const updatedData = await response.json();

      if (updatedData.requires_choices) {
        setLevelUpChoices({ ...updatedData, originalCharacter });
        return;
      }

      setSelectedCharacter(updatedData);
      setLevelUpChoices(null);

      const chars = JSON.parse(
        localStorage.getItem("emurpg_characters") || "[]",
      );
      const idx = chars.findIndex((c) => c.id === updatedData.id);
      if (idx >= 0) {
        chars[idx] = { ...chars[idx], ...updatedData };
        localStorage.setItem("emurpg_characters", JSON.stringify(chars));
      }

      setRefreshKey((k) => k + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  // ===============================
  // Level Up Shortcut
  // ===============================
  const handleLevelUp = async () => {
    if (!selectedCharacter) return;
    setIsLevelingUp(true);
    setError(null);
    try {
      const currentLevel = selectedCharacter.level || 1;
      await handleEditWithAI(
        `Level up to level ${currentLevel + 1}`,
        selectedCharacter,
      );
    } catch (err) {
      setError(err.message || "Level-up failed. Please try again.");
    } finally {
      setIsLevelingUp(false);
    }
  };

  return (
    <>
      <TavernBackground />

      <CharrollerNavbar
        onLanguageSwitch={onLanguageSwitch}
        onSettingsOpen={() => setShowSettings(true)}
      />

      <div className="relative z-10 min-h-screen pt-14 flex">
        {/* Mobile sidebar backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar toggle button */}
        <button
          className={`fixed bottom-24 left-6 z-[60] md:hidden w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-opacity duration-300 ${mobileSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          style={{
            background:
              "linear-gradient(135deg, rgba(139, 69, 19, 0.9), rgba(101, 50, 14, 0.9))",
            border: "2px solid rgba(255, 170, 51, 0.5)",
            boxShadow: "0 4px 20px rgba(80, 40, 10, 0.5)",
          }}
        >
          <Users className="w-6 h-6 text-amber-200" />
        </button>

        {/* =============================== */}
        {/* SIDEBAR */}
        {/* =============================== */}
        <aside
          className={`
            fixed left-0 top-14 bottom-0 animate-fadeIn
            transition-all duration-300
            w-72 z-30 ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:z-20
            ${sidebarCollapsed ? "md:w-16" : "md:w-72"}
          `}
          style={{
            background:
              "linear-gradient(180deg, rgba(42, 26, 15, 0.98) 0%, rgba(61, 40, 23, 0.95) 100%)",
            borderRight: "2px solid rgba(139, 69, 19, 0.5)",
          }}
        >
          {/* Sidebar Header */}
          <div
            className="p-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(139, 69, 19, 0.3)" }}
          >
            {(!sidebarCollapsed || mobileSidebarOpen) && (
              <h2 className="font-cinzel text-tavern-parchment text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t("charroller.your_characters")}
              </h2>
            )}
            {/* Desktop: collapse/expand toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden md:flex w-8 h-8 rounded-lg transition-colors items-center justify-center flex-shrink-0 text-[#1a110a] hover:brightness-110"
              style={{ background: "rgba(255, 170, 51, 0.9)" }}
            >
              {sidebarCollapsed ? (
                <Users className="w-5 h-5" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </button>
            {/* Mobile: close button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="flex md:hidden w-8 h-8 rounded-lg transition-colors items-center justify-center flex-shrink-0 text-[#1a110a] hover:brightness-110"
              style={{ background: "rgba(255, 170, 51, 0.9)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {(!sidebarCollapsed || mobileSidebarOpen) && (
            <>
              {/* Create Buttons */}
              <div
                className="p-3 space-y-2"
                style={{ borderBottom: "1px solid rgba(139, 69, 19, 0.3)" }}
              >
                <button
                  onClick={() => handleStartCreate("upload")}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg font-medium
                             text-tavern-parchment transition-all hover:brightness-110"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139, 69, 19, 0.6), rgba(101, 50, 14, 0.6))",
                    border: "1px solid rgba(139, 69, 19, 0.5)",
                  }}
                >
                  <Upload className="w-4 h-4" />
                  {t("charroller.upload_sheet")}
                </button>
                <button
                  onClick={() => handleStartCreate("describe")}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg font-medium
                             text-tavern-parchment transition-all hover:brightness-110"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139, 69, 19, 0.6), rgba(101, 50, 14, 0.6))",
                    border: "1px solid rgba(139, 69, 19, 0.5)",
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  {t("charroller.create_with_ai")}
                </button>
              </div>

              {/* Character List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {characters.length === 0 ? (
                  <div className="text-center py-8 text-tavern-parchmentDark text-sm">
                    <Scroll className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>{t("charroller.no_characters")}</p>
                  </div>
                ) : (
                  characters.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => handleSelectCharacter(char)}
                      className={`
                        w-full text-left p-2 rounded-lg transition-all relative overflow-hidden group
                        ${
                          selectedCharacter?.id === char.id
                            ? "ring-2 ring-tavern-candle scale-[1.02]"
                            : "hover:ring-1 hover:ring-tavern-candle/50 hover:scale-[1.01]"
                        }
                      `}
                      style={{
                        background:
                          selectedCharacter?.id === char.id
                            ? "rgba(20, 15, 10, 0.9)"
                            : "rgba(30, 20, 15, 0.8)",
                        border: "1px solid rgba(139, 69, 19, 0.2)",
                      }}
                    >
                      {/* Background Portrait blur */}
                      {char.portrait_url && (
                        <div
                          className="absolute inset-0 opacity-10 blur-sm mix-blend-overlay transition-opacity group-hover:opacity-20"
                          style={{
                            backgroundImage: `url(${char.portrait_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                      )}

                      <div className="flex items-center gap-3 relative z-10">
                        {/* Main portrait */}
                        <div
                          className={`w-16 h-16 rounded-md flex-shrink-0 border border-tavern-wood shadow-lg relative overflow-hidden flex items-center justify-center ${
                            generatingId === char.id ? "animate-pulse" : ""
                          }`}
                          style={{
                            backgroundColor: "rgba(139, 69, 19, 0.2)",
                          }}
                        >
                          {char.portrait_url ? (
                            <img
                              src={char.portrait_url}
                              alt={char.character_name || "Portrait"}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center opacity-40">
                              <Users className="w-6 h-6 text-tavern-parchment" />
                              <span className="text-[10px] font-cinzel mt-1">
                                {char.character_name
                                  ? char.character_name[0]
                                  : "?"}
                              </span>
                            </div>
                          )}
                          {generatingId === char.id && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-tavern-accent/30 to-transparent animate-[shimmer_1.5s_infinite]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-cinzel text-tavern-parchment truncate text-base drop-shadow-md">
                            {char.character_name || "Unknown"}
                          </p>
                          <p className="text-xs text-tavern-parchmentDark truncate mt-0.5">
                            {char.class || char.occupation || "Adventurer"}
                            {char.level ? ` • Lv ${char.level}` : ""}
                          </p>
                          {char.system && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-bold tracking-wider rounded bg-red-900/40 text-red-200 border border-red-900/50 uppercase">
                              {char.system === "dnd5e" ? "D&D 5E" : char.system}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Sidebar Footer */}
              <div
                className="p-3"
                style={{ borderTop: "1px solid rgba(139, 69, 19, 0.3)" }}
              >
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                             text-tavern-parchmentDark hover:text-tavern-parchment 
                             hover:bg-tavern-wood/30 transition-colors text-sm"
                >
                  <Settings className="w-4 h-4" />
                  {t("common.settings")}
                </button>
              </div>
            </>
          )}
        </aside>

        {/* =============================== */}
        {/* MAIN CONTENT */}
        {/* =============================== */}
        <main
          className={`
            flex-1 min-h-screen transition-all duration-300
            ml-0 ${sidebarCollapsed ? "md:ml-16" : "md:ml-72"}
          `}
        >
          <div className="max-w-5xl mx-auto p-4 md:p-6">
            {/* Creating New Character */}
            {isCreating && (
              <div className="animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-cinzel text-tavern-parchment flex items-center gap-3">
                    {createMode === "upload" ? (
                      <>
                        <Upload className="w-6 h-6" />{" "}
                        {t("charroller.upload_sheet")}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />{" "}
                        {t("charroller.create_with_ai")}
                      </>
                    )}
                  </h1>
                  <button
                    onClick={handleCancelCreate}
                    className="px-4 py-2 text-tavern-parchmentDark hover:text-tavern-parchment transition-colors"
                  >
                    {t("common.close")}
                  </button>
                </div>

                {/* System Selector */}
                <div className="mb-6">
                  <CharrollerSystemSelector
                    selectedSystem={selectedSystem}
                    onSystemChange={setSelectedSystem}
                  />
                </div>

                {/* Form */}
                {createMode === "upload" ? (
                  <CharrollerUpload
                    onFileSelect={setSelectedFile}
                    selectedFile={selectedFile}
                    onClearFile={() => setSelectedFile(null)}
                    onProcess={handleProcessPDF}
                    isLoading={isLoading}
                  />
                ) : (
                  <CharrollerDescribe
                    onSubmit={handleGenerateCharacter}
                    isLoading={isLoading}
                  />
                )}

                {error && (
                  <div
                    className="mt-6 p-4 rounded-lg text-center"
                    style={{
                      background: "rgba(220, 38, 38, 0.2)",
                      border: "1px solid rgba(220, 38, 38, 0.5)",
                    }}
                  >
                    <p className="text-red-300">{error}</p>
                  </div>
                )}
              </div>
            )}

            {/* Selected Character */}
            {selectedCharacter && !isCreating && (
              <div className="animate-fadeIn">
                <CharrollerResults
                  characterData={selectedCharacter}
                  onNewCharacter={handleDeselectCharacter}
                  isGeneratingPortrait={generatingId === selectedCharacter.id}
                  onEditWithAI={handleEditWithAI}
                  onLevelUp={handleLevelUp}
                  isLevelingUp={isLevelingUp}
                  onDelete={() => handleDeleteCharacter(selectedCharacter.id)}
                  theme="tavern"
                />
              </div>
            )}

            {/* Empty State / Creation Hub */}
            {!selectedCharacter && !isCreating && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[75vh] text-center animate-fadeIn relative">
                {/* Decorative background circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 h-64 md:h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

                <div
                  className="w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-2xl relative z-10"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(61, 40, 23, 0.8), rgba(42, 26, 15, 0.9))",
                    border: "2px solid rgba(139, 69, 19, 0.5)",
                  }}
                >
                  <Scroll className="w-10 h-10 md:w-14 md:h-14 text-red-500/80 drop-shadow-lg" />
                </div>

                <h2 className="text-3xl md:text-4xl font-cinzel text-white mb-3 tracking-wide drop-shadow-md relative z-10">
                  {t("charroller.manager_title")}
                </h2>

                <p className="text-tavern-parchmentDark mb-8 md:mb-10 max-w-lg text-base md:text-lg relative z-10 px-4">
                  {t("charroller.no_characters_desc")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-5 relative z-10 w-full px-4 sm:w-auto sm:px-0">
                  <button
                    onClick={() => handleStartCreate("upload")}
                    className="flex items-center justify-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg
                               text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-red-900/20 hover:shadow-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(139, 69, 19, 0.6), rgba(101, 50, 14, 0.6))",
                      border: "1px solid rgba(139, 69, 19, 0.5)",
                    }}
                  >
                    <Upload className="w-6 h-6" />
                    {t("charroller.upload_sheet")}
                  </button>
                  <button
                    onClick={() => handleStartCreate("describe")}
                    className="flex items-center justify-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg
                               text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-red-900/20 hover:shadow-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(139, 69, 19, 0.6), rgba(101, 50, 14, 0.6))",
                      border: "1px solid rgba(139, 69, 19, 0.5)",
                    }}
                  >
                    <Sparkles className="w-6 h-6" />
                    {t("charroller.create_with_ai")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Music Player — desktop only (mobile uses navbar play button) */}
        <div className="hidden md:block fixed bottom-4 right-4 z-30">
          <TavernPlayer autoPlay />
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsPanel
          onClose={() => {
            setShowSettings(false);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}

      {/* Level Up Choices Modal */}
      {levelUpChoices && (
        <LevelUpChoices
          choiceData={levelUpChoices}
          characterName={levelUpChoices.originalCharacter?.character_name}
          onApply={handleApplyLevelUpChoices}
          onCancel={() => setLevelUpChoices(null)}
        />
      )}
    </>
  );
};

CharrollerPage.propTypes = {
  onLanguageSwitch: PropTypes.func,
};

export default CharrollerPage;
