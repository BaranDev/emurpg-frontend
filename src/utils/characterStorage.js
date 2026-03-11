/**
 * Character Storage - Local storage utilities for character management
 *
 * Handles saving, loading, exporting, and importing character data.
 * Characters are stored in localStorage with the key "emurpg_characters"
 */

const STORAGE_KEY = "emurpg_characters";
const SETTINGS_KEY = "emurpg_charroller_settings";
const EXPORT_VERSION = "1.0";

/**
 * Generate a unique character ID
 */
export const generateId = () => {
  return `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get all saved characters from localStorage
 * @returns {Array} Array of character objects
 */
export const getCharacters = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading characters from storage:", error);
    return [];
  }
};

/**
 * Get a single character by ID
 * @param {string} id - Character ID
 * @returns {Object|null} Character object or null
 */
export const getCharacterById = (id) => {
  const characters = getCharacters();
  return characters.find((c) => c.id === id) || null;
};

/**
 * Save a new character to localStorage
 * @param {Object} characterData - Character data from API
 * @param {string} portraitUrl - Optional portrait URL
 * @returns {Object} Saved character with generated ID
 */
export const saveCharacter = (characterData, portraitUrl = null) => {
  const characters = getCharacters();

  const newCharacter = {
    id: generateId(),
    ...characterData,
    portrait_url: portraitUrl || characterData.portrait_url || null,
    created_at: new Date().toISOString(),
    last_played: null,
    play_count: 0,
  };

  characters.unshift(newCharacter); // Add to beginning

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    return newCharacter;
  } catch (error) {
    console.error("Error saving character:", error);
    throw new Error("Failed to save character to storage");
  }
};

/**
 * Update an existing character
 * @param {string} id - Character ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated character or null
 */
export const updateCharacter = (id, updates) => {
  const characters = getCharacters();
  const index = characters.findIndex((c) => c.id === id);

  if (index === -1) return null;

  characters[index] = {
    ...characters[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    return characters[index];
  } catch (error) {
    console.error("Error updating character:", error);
    return null;
  }
};

/**
 * Mark character as played (updates last_played and play_count)
 * @param {string} id - Character ID
 */
export const markAsPlayed = (id) => {
  const character = getCharacterById(id);
  if (character) {
    updateCharacter(id, {
      last_played: new Date().toISOString(),
      play_count: (character.play_count || 0) + 1,
    });
  }
};

/**
 * Delete a character by ID
 * @param {string} id - Character ID
 * @returns {boolean} Success status
 */
export const deleteCharacter = (id) => {
  const characters = getCharacters();
  const filtered = characters.filter((c) => c.id !== id);

  if (filtered.length === characters.length) return false;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting character:", error);
    return false;
  }
};

/**
 * Delete all characters
 * @returns {boolean} Success status
 */
export const deleteAllCharacters = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing characters:", error);
    return false;
  }
};

/**
 * Export all characters as a downloadable JSON file
 */
export const exportCharacters = () => {
  const characters = getCharacters();

  const exportData = {
    version: EXPORT_VERSION,
    exported_at: new Date().toISOString(),
    source: "EMURPG Charroller",
    character_count: characters.length,
    characters: characters,
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `emurpg_characters_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Import characters from a JSON file
 * @param {File} file - JSON file to import
 * @returns {Promise<{success: boolean, imported: number, errors: string[]}>}
 */
export const importCharacters = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Validate format
        if (!data.characters || !Array.isArray(data.characters)) {
          throw new Error("Invalid file format: missing characters array");
        }

        const existingCharacters = getCharacters();
        const existingIds = new Set(existingCharacters.map((c) => c.id));

        let imported = 0;
        const errors = [];

        for (const char of data.characters) {
          try {
            // Generate new ID if already exists
            if (existingIds.has(char.id)) {
              char.id = generateId();
            }

            // Validate required fields
            if (!char.character_name && !char.name) {
              errors.push(`Character missing name, skipped`);
              continue;
            }

            existingCharacters.push({
              ...char,
              imported_at: new Date().toISOString(),
            });
            existingIds.add(char.id);
            imported++;
          } catch (err) {
            errors.push(`Failed to import character: ${err.message}`);
          }
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingCharacters));

        resolve({ success: true, imported, errors });
      } catch (error) {
        reject(new Error(`Failed to parse file: ${error.message}`));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};

// Settings management

/**
 * Get charroller settings
 * @returns {Object} Settings object
 */
export const getSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return getDefaultSettings();
    return { ...getDefaultSettings(), ...JSON.parse(data) };
  } catch (error) {
    console.error("Error reading settings:", error);
    return getDefaultSettings();
  }
};

/**
 * Get default settings
 * @returns {Object} Default settings
 */
export const getDefaultSettings = () => ({
  musicEnabled: true,
  musicVolume: 24,
  soundEffectsEnabled: true,
  portraitGenerationEnabled: true,
  adminCode: "",
  isAdmin: false,
  theme: "tavern", // tavern, arcane
});

/**
 * Save settings
 * @param {Object} settings - Settings to save
 */
export const saveSettings = (settings) => {
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("charroller-settings-changed", {
          detail: updated,
        }),
      );
    }

    return updated;
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
};

/**
 * Clear admin code
 */
export const clearAdminCode = () => {
  saveSettings({ adminCode: "", isAdmin: false });
};

// ========================
// CONSENT
// ========================

const CONSENT_KEY = "emurpg_charroller_consent";

export const getConsent = () => localStorage.getItem(CONSENT_KEY); // 'accepted' | 'declined' | null

export const setConsent = (value) => {
  if (value !== "accepted" && value !== "declined") return;
  localStorage.setItem(CONSENT_KEY, value);
};

export default {
  getCharacters,
  getCharacterById,
  saveCharacter,
  updateCharacter,
  deleteCharacter,
  deleteAllCharacters,
  markAsPlayed,
  exportCharacters,
  importCharacters,
  getSettings,
  saveSettings,
  clearAdminCode,
  generateId,
};
