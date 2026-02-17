import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { 
  Plus, Upload, Settings, Users, Scroll, FileText, Sparkles,
  AlertCircle
} from "lucide-react";
import CharacterCard from "./CharacterCard";
import MusicPlayer from "./MusicPlayer";
import SettingsPanel from "./SettingsPanel";
import { 
  getCharacters, deleteCharacter, getSettings, markAsPlayed 
} from "../../utils/characterStorage";
import { config } from "../../config";

/**
 * CharrollerManager - Main character management section
 * Displays saved characters and provides create/import actions
 */
const CharrollerManager = ({ 
  onCreateNew, 
  onPlayCharacter,
  onRefresh 
}) => {
  const { t } = useTranslation();
  const [characters, setCharacters] = useState([]);
  const [settings, setSettings] = useState(getSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [usage, setUsage] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadCharacters();
    loadUsage();
  }, [onRefresh]);

  const loadCharacters = () => {
    const chars = getCharacters();
    setCharacters(chars);
  };

  const loadUsage = async () => {
    try {
      const headers = {};
      if (settings.adminCode) {
        headers["x-admin-code"] = settings.adminCode;
      }
      
      const response = await fetch(`${config.backendUrl}/api/charroller/usage`, {
        headers
      });
      const data = await response.json();
      setUsage(data);
    } catch (error) {
      console.error("Failed to load usage:", error);
    }
  };

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      deleteCharacter(id);
      loadCharacters();
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handlePlay = (character) => {
    markAsPlayed(character.id);
    if (onPlayCharacter) {
      onPlayCharacter(character);
    }
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    loadCharacters();
    loadUsage();
  };

  return (
    <section className="min-h-screen py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 md:mb-12">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <Users className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
              <h2 className="font-cinzel text-3xl md:text-4xl text-white">
                {t("charroller.manager_title")}
              </h2>
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {t("common.beta")}
              </span>
            </div>
            <p className="text-slate-400 mt-2 text-lg">
              {t("charroller.manager_subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/50 p-2 rounded-xl backdrop-blur-sm border border-slate-700/30">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-blue-400
                       hover:bg-slate-700/50 transition-colors"
              title="Settings"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Usage info */}
        {usage && !usage.is_admin && usage.remaining !== "unlimited" && (
          <div 
            className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3 rounded-lg mb-8"
            style={{
              background: usage.remaining <= 1 
                ? "rgba(220, 38, 38, 0.15)" 
                : "rgba(30, 58, 95, 0.5)",
              border: usage.remaining <= 1 
                ? "1px solid rgba(220, 38, 38, 0.4)"
                : "1px solid rgba(74, 158, 255, 0.3)",
            }}
          >
            <div className="flex items-center gap-3">
              <AlertCircle className={`w-5 h-5 ${usage.remaining <= 1 ? "text-red-400" : "text-blue-400"}`} />
              <span className="text-sm md:text-base text-slate-200">
                {usage.remaining} {t("charroller.remaining_today")}
              </span>
            </div>
            {usage.remaining <= 1 && (
              <button
                onClick={() => setShowSettings(true)}
                className="text-sm text-blue-400 hover:text-white transition-colors underline"
              >
                {t("charroller.enter_admin")}
              </button>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <button
            onClick={() => onCreateNew("upload")}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium
                     text-white transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95 group"
            style={{
              background: "linear-gradient(135deg, #1e3a5f, #2d5a87)",
              border: "1px solid rgba(74, 158, 255, 0.3)",
              boxShadow: "0 4px 15px rgba(74, 158, 255, 0.2)"
            }}
          >
            <Upload className="w-5 h-5 text-blue-300 group-hover:scale-110 transition-transform" />
            {t("charroller.upload_sheet")}
          </button>

          <button
            onClick={() => onCreateNew("describe")}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium
                     text-white transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95 group"
            style={{
              background: "linear-gradient(135deg, #4c1d95, #6d28d9)",
              border: "1px solid rgba(167, 139, 250, 0.3)",
              boxShadow: "0 4px 15px rgba(147, 51, 234, 0.2)"
            }}
          >
            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {t("charroller.create_with_ai")}
          </button>
        </div>

        {/* Characters section */}
        {characters.length > 0 ? (
          <>
            {/* View toggle & Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-cinzel text-xl text-white flex items-center gap-2">
                <Scroll className="w-5 h-5 text-blue-400" />
                {t("charroller.your_characters")} ({characters.length})
              </h3>
              
              <div className="flex gap-1 p-1 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-md text-sm transition-all font-medium
                    ${viewMode === "grid" 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded-md text-sm transition-all font-medium
                    ${viewMode === "list" 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                >
                  List
                </button>
              </div>
            </div>

            {/* Character grid/list */}
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onPlay={handlePlay}
                  onDelete={handleDelete}
                  isCompact={viewMode === "list"}
                />
              ))}
            </div>
          </>
        ) : (
          // Empty state
          <div 
            className="text-center py-20 px-6 rounded-2xl relative overflow-hidden"
            style={{
              background: "rgba(30, 58, 95, 0.3)",
              border: "2px dashed rgba(74, 158, 255, 0.3)"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-950/20 pointer-events-none" />
            
            <FileText className="w-20 h-20 mx-auto text-slate-500 mb-6" />
            <h3 className="font-cinzel text-2xl text-white mb-3">
              {t("charroller.no_characters")}
            </h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
              {t("charroller.no_characters_desc")}
            </p>
            <button
              onClick={() => onCreateNew("describe")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg
                       text-white transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #4c1d95, #6d28d9)",
                boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)"
              }}
            >
              <Plus className="w-6 h-6" />
              {t("charroller.create_first")}
            </button>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSettingsChange={handleSettingsChange}
      />
    </section>
  );
};

CharrollerManager.propTypes = {
  onCreateNew: PropTypes.func.isRequired,
  onPlayCharacter: PropTypes.func,
  onRefresh: PropTypes.number,
};

export default CharrollerManager;
