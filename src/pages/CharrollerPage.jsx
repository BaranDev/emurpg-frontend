import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  CharrollerSystemSelector,
  CharrollerUpload,
  CharrollerDescribe,
  CharrollerResults,
  CharrollerNavbar,
  MusicPlayer,
  TavernBackground,
  LevelUpChoices,
  SettingsPanel,
} from "../components";
import { config } from "../config";
import { Upload, Sparkles, Users, X, Scroll, Settings } from "lucide-react";
import {
  saveCharacter,
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
  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState(false);
  const [error, setError] = useState(null);

  // Settings & extras
  const [settings, setSettings] = useState(getSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [levelUpChoices, setLevelUpChoices] = useState(null);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load characters
  useEffect(() => {
    const loadedChars = getCharacters();
    setCharacters(loadedChars);
  }, [refreshKey]);

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
        setIsGeneratingPortrait(true);
        generatePortrait(data).then((portraitUrl) => {
          if (portraitUrl) {
            const updatedChar = { ...newChar, portrait_url: portraitUrl };
            setSelectedCharacter(updatedChar);
            const chars = JSON.parse(
              localStorage.getItem("emurpg_characters") || "[]",
            );
            const idx = chars.findIndex((c) => c.id === savedChar.id);
            if (idx >= 0) {
              chars[idx].portrait_url = portraitUrl;
              localStorage.setItem("emurpg_characters", JSON.stringify(chars));
            }
            setRefreshKey((k) => k + 1);
          }
          setIsGeneratingPortrait(false);
        });
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
        setIsGeneratingPortrait(true);
        generatePortrait(data).then((portraitUrl) => {
          if (portraitUrl) {
            const updatedChar = { ...newChar, portrait_url: portraitUrl };
            setSelectedCharacter(updatedChar);
            const chars = JSON.parse(
              localStorage.getItem("emurpg_characters") || "[]",
            );
            const idx = chars.findIndex((c) => c.id === savedChar.id);
            if (idx >= 0) {
              chars[idx].portrait_url = portraitUrl;
              localStorage.setItem("emurpg_characters", JSON.stringify(chars));
            }
            setRefreshKey((k) => k + 1);
          }
          setIsGeneratingPortrait(false);
        });
      }
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const generatePortrait = async (charData) => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/charroller/portrait`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            character_data: { ...charData, system: selectedSystem },
            character_id: null,
          }),
        },
      );
      const data = await response.json();
      return data.portrait_url || null;
    } catch (err) {
      console.error("Portrait generation failed:", err);
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
        theme="tavern"
        onLanguageSwitch={onLanguageSwitch}
        onSettingsOpen={() => setShowSettings(true)}
      />

      <div className="relative z-10 min-h-screen pt-16 flex">
        {/* =============================== */}
        {/* SIDEBAR */}
        {/* =============================== */}
        <aside
          className={`
            fixed left-0 top-16 bottom-0 z-20 animate-fadeIn
            ${sidebarCollapsed ? "w-16" : "w-72"}
            transition-all duration-300
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
            {!sidebarCollapsed && (
              <h2 className="font-cinzel text-tavern-parchment text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t("charroller.your_characters")}
              </h2>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg text-tavern-parchmentDark hover:text-tavern-parchment 
                         hover:bg-tavern-wood/30 transition-colors"
            >
              {sidebarCollapsed ? (
                <Users className="w-5 h-5" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </button>
          </div>

          {!sidebarCollapsed && (
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
                        w-full text-left p-2 rounded-lg transition-all
                        ${
                          selectedCharacter?.id === char.id
                            ? "ring-2 ring-tavern-candle"
                            : "hover:bg-tavern-wood/30"
                        }
                      `}
                      style={{
                        background:
                          selectedCharacter?.id === char.id
                            ? "rgba(139, 69, 19, 0.4)"
                            : "rgba(61, 40, 23, 0.5)",
                        border: "1px solid rgba(139, 69, 19, 0.3)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {/* Mini portrait */}
                        <div
                          className="w-10 h-10 rounded-lg bg-cover bg-center flex-shrink-0"
                          style={{
                            backgroundImage: char.portrait_url
                              ? `url(${char.portrait_url})`
                              : undefined,
                            background: !char.portrait_url
                              ? "rgba(139, 69, 19, 0.3)"
                              : undefined,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-cinzel text-tavern-parchment truncate text-sm">
                            {char.character_name || "Unknown"}
                          </p>
                          <p className="text-xs text-tavern-parchmentDark truncate">
                            {char.class || char.occupation || "Adventurer"}
                            {char.level ? ` • Lv ${char.level}` : ""}
                          </p>
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
            ${sidebarCollapsed ? "ml-16" : "ml-72"}
          `}
        >
          <div className="max-w-5xl mx-auto p-6">
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
                  isGeneratingPortrait={isGeneratingPortrait}
                  onEditWithAI={handleEditWithAI}
                  onLevelUp={handleLevelUp}
                  isLevelingUp={isLevelingUp}
                  onDelete={() => handleDeleteCharacter(selectedCharacter.id)}
                  theme="tavern"
                />
              </div>
            )}

            {/* Empty State */}
            {!selectedCharacter && !isCreating && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fadeIn">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                  style={{ background: "rgba(139, 69, 19, 0.2)" }}
                >
                  <Scroll className="w-12 h-12 text-tavern-parchmentDark" />
                </div>
                <h2 className="text-2xl font-cinzel text-tavern-parchment mb-2">
                  {t("charroller.manager_title")}
                </h2>
                <p className="text-tavern-parchmentDark mb-6 max-w-md">
                  {t("charroller.no_characters_desc")}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleStartCreate("upload")}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium
                               text-white transition-all hover:brightness-110"
                    style={{
                      background: "linear-gradient(135deg, #8b4513, #654321)",
                      border: "2px solid rgba(139, 69, 19, 0.6)",
                    }}
                  >
                    <Upload className="w-5 h-5" />
                    {t("charroller.upload_sheet")}
                  </button>
                  <button
                    onClick={() => handleStartCreate("describe")}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium
                               text-white transition-all hover:brightness-110"
                    style={{
                      background: "linear-gradient(135deg, #8b4513, #654321)",
                      border: "2px solid rgba(139, 69, 19, 0.6)",
                    }}
                  >
                    <Sparkles className="w-5 h-5" />
                    {t("charroller.create_with_ai")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Music Player */}
        <div className="fixed bottom-4 right-4 z-30">
          <MusicPlayer theme="tavern" autoPlay />
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
