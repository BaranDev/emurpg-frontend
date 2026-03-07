/**
 * Test fixtures for CharrollerResults component tests.
 * Provides a factory for a minimal valid D&D 5e character.
 */

export const makeDnd5eCharacter = (overrides = {}) => ({
  id: "test-char-001",
  character_name: "Aldric Ironforge",
  system: "dnd5e",
  system_name: "D&D 5e",
  race: "Human",
  class: "Fighter",
  level: 5,
  max_hp: 45,
  hit_points: 45,
  portrait_url: null,
  roll_list: [
    // Ability checks
    { roll_name: "Strength Check", dice: "1d20+3", category: "ability" },
    { roll_name: "Dexterity Check", dice: "1d20+2", category: "ability" },
    { roll_name: "Constitution Check", dice: "1d20+1", category: "ability" },
    { roll_name: "Intelligence Check", dice: "1d20+0", category: "ability" },
    { roll_name: "Wisdom Check", dice: "1d20+0", category: "ability" },
    { roll_name: "Charisma Check", dice: "1d20-1", category: "ability" },
    // Saving throws
    { roll_name: "Strength Save", dice: "1d20+5", category: "save" },
    { roll_name: "Dexterity Save", dice: "1d20+2", category: "save" },
    { roll_name: "Constitution Save", dice: "1d20+5", category: "save" },
    { roll_name: "Intelligence Save", dice: "1d20+0", category: "save" },
    { roll_name: "Wisdom Save", dice: "1d20+0", category: "save" },
    { roll_name: "Charisma Save", dice: "1d20-1", category: "save" },
    // Skills
    { roll_name: "Athletics", dice: "1d20+3", category: "skill" },
    // Attack
    { roll_name: "Longsword Attack", dice: "1d20+7", category: "attack" },
    { roll_name: "Longsword Damage", dice: "1d8+4", category: "damage" },
  ],
  ...overrides,
});

/** Pre-populate localStorage with a character so trackers load properly. */
export const seedLocalStorage = (character) => {
  localStorage.setItem(
    "emurpg_characters",
    JSON.stringify([{ ...character, trackers: undefined }]),
  );
};
