import { useState } from "react";
import PropTypes from "prop-types";
import {
  Settings,
  X,
  Key,
  Volume2,
  Image,
  Trash2,
  Download,
  Upload,
  Check,
  AlertTriangle,
} from "lucide-react";
import {
  getSettings,
  saveSettings,
  exportCharacters,
  importCharacters,
  deleteAllCharacters,
  clearAdminCode,
} from "../../utils/characterStorage";
import { config } from "../../config";

/**
 * SettingsPanel - Settings modal with admin code, music, and data management
 */
const SettingsPanel = ({ isOpen, onClose, onSettingsChange }) => {
  const [settings, setSettings] = useState(getSettings);
  const [adminCode, setAdminCode] = useState(settings.adminCode || "");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleSettingChange = (key, value) => {
    const updated = saveSettings({ [key]: value });
    setSettings(updated);
    if (onSettingsChange) {
      onSettingsChange(updated);
    }
  };

  const validateAdminCode = async () => {
    if (!adminCode.trim()) return;

    setIsValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch(
        `${config.backendUrl}/api/charroller/validate-admin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ admin_code: adminCode }),
        },
      );

      const data = await response.json();

      if (data.valid) {
        handleSettingChange("adminCode", adminCode);
        handleSettingChange("isAdmin", true);
        setValidationResult({
          success: true,
          message: "Admin access granted!",
        });
      } else {
        setValidationResult({ success: false, message: "Invalid admin code" });
      }
    } catch (error) {
      setValidationResult({
        success: false,
        message: "Failed to validate code",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearAdmin = () => {
    clearAdminCode();
    setAdminCode("");
    setSettings(getSettings());
    setValidationResult(null);
    if (onSettingsChange) {
      onSettingsChange(getSettings());
    }
  };

  const handleExport = () => {
    exportCharacters();
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await importCharacters(file);
      setImportResult({
        success: true,
        message: `Imported ${result.imported} characters`,
        errors: result.errors,
      });
      if (onSettingsChange) {
        onSettingsChange(getSettings());
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: error.message,
      });
    }

    // Reset file input
    e.target.value = "";
  };

  const handleDeleteAll = () => {
    deleteAllCharacters();
    setShowDeleteConfirm(false);
    if (onSettingsChange) {
      onSettingsChange(getSettings());
    }
    onClose();
  };

  // Always render when mounted (isOpen is optional for backwards compatibility)
  if (isOpen === false) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.8)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl p-6 max-h-[90vh] overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, #3d2817, #2a1a0f)",
          border: "2px solid #8b4513",
          boxShadow: "0 0 40px rgba(255, 170, 51, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-cinzel text-xl text-tavern-parchment flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-tavern-parchmentDark hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Sound Settings */}
        <div
          className="p-4 rounded-lg mb-4"
          style={{ background: "rgba(0, 0, 0, 0.3)" }}
        >
          <h3 className="font-medium text-tavern-candleGlow mb-3 flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Sound
          </h3>

          <label className="flex items-center justify-between cursor-pointer mb-2">
            <span className="text-tavern-parchment">Background Music</span>
            <input
              type="checkbox"
              checked={settings.musicEnabled}
              onChange={(e) =>
                handleSettingChange("musicEnabled", e.target.checked)
              }
              className="w-5 h-5 accent-tavern-candleGlow"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-tavern-parchment">Sound Effects</span>
            <input
              type="checkbox"
              checked={settings.soundEffectsEnabled}
              onChange={(e) =>
                handleSettingChange("soundEffectsEnabled", e.target.checked)
              }
              className="w-5 h-5 accent-tavern-candleGlow"
            />
          </label>
        </div>

        {/* Portrait Generation Toggle */}
        <div
          className="p-4 rounded-lg mb-4"
          style={{ background: "rgba(0, 0, 0, 0.3)" }}
        >
          <h3 className="font-medium text-tavern-candleGlow mb-3 flex items-center gap-2">
            <Image className="w-4 h-4" />
            AI Features
          </h3>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-tavern-parchment">Generate Portraits</span>
            <input
              type="checkbox"
              checked={settings.portraitGenerationEnabled}
              onChange={(e) =>
                handleSettingChange(
                  "portraitGenerationEnabled",
                  e.target.checked,
                )
              }
              className="w-5 h-5 accent-tavern-candleGlow"
            />
          </label>
          <p className="text-xs text-tavern-parchmentDark mt-1">
            AI-generated character portraits
          </p>
        </div>

        {/* Data Management */}
        <div
          className="p-4 rounded-lg mb-4"
          style={{ background: "rgba(0, 0, 0, 0.3)" }}
        >
          <h3 className="font-medium text-tavern-candleGlow mb-3">
            Data Management
          </h3>

          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded
                       bg-tavern-woodLight text-tavern-parchment hover:bg-tavern-leather transition-colors"
            >
              <Download className="w-4 h-4" />
              Export All Characters
            </button>

            <label
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded
                            bg-tavern-woodLight text-tavern-parchment hover:bg-tavern-leather 
                            transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Import Characters
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            {importResult && (
              <p
                className={`text-sm ${importResult.success ? "text-green-400" : "text-red-400"}`}
              >
                {importResult.message}
              </p>
            )}
          </div>
        </div>
        {/* Admin Code Section */}
        <div
          className="p-4 rounded-lg mb-4"
          style={{ background: "rgba(0, 0, 0, 0.3)" }}
        >
          <h3 className="font-medium text-tavern-candleGlow mb-3 flex items-center gap-2">
            <Key className="w-4 h-4" />
            Admin Code
          </h3>

          {settings.isAdmin ? (
            <div className="flex items-center justify-between">
              <span className="text-green-400 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Admin access active
              </span>
              <button
                onClick={handleClearAdmin}
                className="text-red-400 text-sm hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter admin code..."
                  className="flex-1 px-3 py-2 rounded bg-tavern-woodDark text-tavern-parchment
                           border border-tavern-leather focus:border-tavern-candleGlow outline-none"
                />
                <button
                  onClick={validateAdminCode}
                  disabled={isValidating || !adminCode.trim()}
                  className="px-4 py-2 rounded bg-tavern-leather text-white
                           disabled:opacity-50 hover:bg-tavern-ale transition-colors"
                >
                  {isValidating ? "..." : "Verify"}
                </button>
              </div>
              {validationResult && (
                <p
                  className={
                    validationResult.success ? "text-green-400" : "text-red-400"
                  }
                >
                  {validationResult.message}
                </p>
              )}
            </div>
          )}
        </div>
        {/* Danger Zone */}
        <div
          className="p-4 rounded-lg"
          style={{
            background: "rgba(220, 38, 38, 0.1)",
            border: "1px solid rgba(220, 38, 38, 0.3)",
          }}
        >
          <h3 className="font-medium text-red-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Danger Zone
          </h3>

          {showDeleteConfirm ? (
            <div className="space-y-2">
              <p className="text-red-300 text-sm">
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAll}
                  className="flex-1 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Yes, Delete All
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 rounded bg-tavern-woodLight text-tavern-parchment"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded
                       border border-red-500 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete All Characters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

SettingsPanel.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSettingsChange: PropTypes.func,
};

export default SettingsPanel;
