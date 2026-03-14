/**
 * Duplicate-player detection utilities.
 *
 * Shared by TablesAdminPanel (cross-event scan) and EventsAdminPanel
 * (single-event scan).
 */

const TURKISH_MAP = { ı: "i", ğ: "g", ü: "u", ş: "s", ö: "o", ç: "c" };
const TURKISH_RE = new RegExp(`[${Object.keys(TURKISH_MAP).join("")}]`, "g");

/** Normalise a player name for comparison (lowercase, strip diacritics & non-alnum). */
export const normalizeName = (name) =>
  (name ?? "")
    .toLowerCase()
    .replace(TURKISH_RE, (ch) => TURKISH_MAP[ch])
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Normalise a student ID (digits only). */
export const normalizeId = (id) => (id ?? "").replace(/\D/g, "");

const STATUS_RANK = { approved: 0, joined: 1, backup: 2, rejected: 3 };

const PLAYER_LISTS = [
  { key: "approved_players", status: "approved" },
  { key: "joined_players", status: "joined" },
  { key: "backup_players", status: "backup" },
  { key: "rejected_players", status: "rejected" },
];

/**
 * Detect duplicate players across a list of events (each with tableDetails).
 *
 * @param {Array} events — array of event objects, each with `tableDetails[]`.
 * @returns {Array<{ reasons: string[], apps: object[] }>}  duplicate groups.
 */
export function findDuplicatePlayers(events) {
  // Phase 1 — collect one entry per player per table, keeping highest-priority status.
  const seenInTable = new Map();
  const rawEntries = [];

  for (const event of events) {
    for (const table of event.tableDetails ?? []) {
      for (const { key, status } of PLAYER_LISTS) {
        for (const player of table[key] ?? []) {
          const normId = normalizeId(player.student_id);
          const dedupeKey = `${table.slug}:${normId || normalizeName(player.name)}`;

          if (seenInTable.has(dedupeKey)) {
            const existing = rawEntries[seenInTable.get(dedupeKey)];
            if (STATUS_RANK[status] < STATUS_RANK[existing._status]) {
              existing._status = status;
            }
          } else {
            seenInTable.set(dedupeKey, rawEntries.length);
            rawEntries.push({
              ...player,
              _status: status,
              _tableName: table.game_name,
              _tableSlug: table.slug,
              _eventName: event.name,
            });
          }
        }
      }
    }
  }

  // Phase 2 — group by normalised name and normalised student ID.
  const nameMap = new Map();
  const idMap = new Map();

  for (const player of rawEntries) {
    const nk = normalizeName(player.name);
    const ik = normalizeId(player.student_id);
    if (nk) {
      if (!nameMap.has(nk)) nameMap.set(nk, []);
      nameMap.get(nk).push(player);
    }
    if (ik) {
      if (!idMap.has(ik)) idMap.set(ik, []);
      idMap.get(ik).push(player);
    }
  }

  // Phase 3 — merge groups so that the same player-set matched on >1 criterion
  // produces one group with all reasons listed.
  const groupMap = new Map();

  const upsert = (reason, players) => {
    const key = players
      .map(
        (p) =>
          `${p._tableSlug}:${normalizeId(p.student_id) || normalizeName(p.name)}`,
      )
      .sort()
      .join("|");
    if (groupMap.has(key)) {
      groupMap.get(key).reasons.push(reason);
    } else {
      groupMap.set(key, { reasons: [reason], apps: players });
    }
  };

  nameMap.forEach((players, key) => {
    if (players.length > 1) upsert(`Matching name: "${key}"`, players);
  });
  idMap.forEach((players, id) => {
    if (players.length > 1) upsert(`Matching student ID: ${id}`, players);
  });

  return [...groupMap.values()];
}
