import { createContext, useContext, forwardRef } from "react";
import PropTypes from "prop-types";
import { Calendar, Clock, MapPin } from "lucide-react";
import gameBg from "../../assets/images/announcement-bg-game.jpg";
import generalBg from "../../assets/images/announcement-bg-general.jpg";
import logoWhite from "../../assets/logo/LOGO_WHITE.png";

// ── Card constants ─────────────────────────────────────────────────────────────
const CARD_WIDTH = 1080;
const CINZEL   = "Cinzel, 'Times New Roman', serif";
const SPECTRAL = "Spectral, Georgia, serif";

// ── Theme catalogue ────────────────────────────────────────────────────────────
// Each theme controls: overlay gradient, accent palette, header/table
// backgrounds, badge, title glow, and ornament glyph.  Colour tokens are
// propagated to every sub-component via ThemeCtx so zero props need to change.

export const THEMES = {
  // ── 1. Shadow (default) ── dark, brooding, timeless ──────────────────────
  shadow: {
    id: "shadow", label: "Shadow", swatch: "#FFD426",
    overlay: "linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.72) 50%, rgba(0,0,0,0.88) 100%)",
    cardBg:        "#050201",
    accent:        "#FFD426",
    accentDim:     "rgba(255,212,38,0.56)",
    accentRule:    "rgba(255,212,38,0.28)",
    accentBorder:  "rgba(255,212,38,0.18)",
    headerBg:      "rgba(4,2,1,0.94)",
    tableBg:       "rgba(10,4,2,0.78)",
    badgeBg:       "#B91C34",
    badgeBorder:   "rgba(185,28,52,0.60)",
    badgeShadow:   "0 0 18px rgba(185,28,52,0.35)",
    tableTopBar:   "#B91C34",
    textLight:     "#F5EFE0",
    textLightDim:  "rgba(245,239,224,0.60)",
    titleShadow:   "0 2px 24px rgba(255,212,38,0.20)",
    ornament:      "✦",
    playerDiv:     "rgba(255,212,38,0.06)",
    innerDiv:      "rgba(255,212,38,0.12)",
    backupBar:     "rgba(255,212,38,0.55)",
  },

  // ── 2. Arcane ── mystical, rune-etched, violet sorcery ───────────────────
  arcane: {
    id: "arcane", label: "Arcane", swatch: "#A78BFA",
    overlay: [
      "radial-gradient(ellipse at 50% 28%, rgba(88,28,135,0.52) 0%, transparent 62%)",
      "linear-gradient(to bottom, rgba(8,0,22,0.55) 0%, rgba(22,0,52,0.76) 50%, rgba(3,0,12,0.94) 100%)",
    ].join(", "),
    cardBg:        "#03000D",
    accent:        "#C084FC",
    accentDim:     "rgba(192,132,252,0.62)",
    accentRule:    "rgba(167,139,250,0.30)",
    accentBorder:  "rgba(139,92,246,0.22)",
    headerBg:      "rgba(8,0,22,0.97)",
    tableBg:       "rgba(14,3,36,0.83)",
    badgeBg:       "#5B21B6",
    badgeBorder:   "rgba(167,139,250,0.55)",
    badgeShadow:   "0 0 22px rgba(139,92,246,0.55)",
    tableTopBar:   "#7C3AED",
    textLight:     "#EDE9FE",
    textLightDim:  "rgba(237,233,254,0.62)",
    titleShadow:   "0 2px 32px rgba(167,139,250,0.32)",
    ornament:      "✤",
    playerDiv:     "rgba(167,139,250,0.07)",
    innerDiv:      "rgba(167,139,250,0.14)",
    backupBar:     "rgba(192,132,252,0.55)",
  },

  // ── 3. Infernal ── hellfire rising, demonic siege ─────────────────────────
  infernal: {
    id: "infernal", label: "Infernal", swatch: "#F97316",
    // Fire rises from bottom — invert the gradient direction for a unique look
    overlay: [
      "radial-gradient(ellipse at 50% 115%, rgba(153,27,27,0.68) 0%, rgba(80,10,0,0.35) 52%, transparent 72%)",
      "linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(12,2,0,0.62) 45%, rgba(50,7,0,0.93) 100%)",
    ].join(", "),
    cardBg:        "#080100",
    accent:        "#F97316",
    accentDim:     "rgba(249,115,22,0.60)",
    accentRule:    "rgba(239,68,68,0.32)",
    accentBorder:  "rgba(220,38,38,0.22)",
    headerBg:      "rgba(18,2,0,0.97)",
    tableBg:       "rgba(30,5,2,0.83)",
    badgeBg:       "#7F1D1D",
    badgeBorder:   "rgba(239,68,68,0.60)",
    badgeShadow:   "0 0 22px rgba(239,68,68,0.52)",
    tableTopBar:   "#DC2626",
    textLight:     "#FEF2F2",
    textLightDim:  "rgba(254,242,242,0.60)",
    titleShadow:   "0 2px 30px rgba(239,68,68,0.28)",
    ornament:      "❖",
    playerDiv:     "rgba(239,68,68,0.06)",
    innerDiv:      "rgba(239,68,68,0.12)",
    backupBar:     "rgba(249,115,22,0.55)",
  },

  // ── 4. Divine ── celestial radiance, paladin's oath ───────────────────────
  divine: {
    id: "divine", label: "Divine", swatch: "#FCD34D",
    // Golden corona bleeds down from the very top
    overlay: [
      "radial-gradient(ellipse at 50% -12%, rgba(253,224,71,0.28) 0%, rgba(251,191,36,0.09) 42%, transparent 68%)",
      "linear-gradient(to bottom, rgba(10,7,0,0.36) 0%, rgba(5,4,0,0.60) 50%, rgba(0,0,0,0.86) 100%)",
    ].join(", "),
    cardBg:        "#060400",
    accent:        "#FCD34D",
    accentDim:     "rgba(252,211,77,0.62)",
    accentRule:    "rgba(245,158,11,0.36)",
    accentBorder:  "rgba(217,119,6,0.26)",
    headerBg:      "rgba(12,9,0,0.97)",
    tableBg:       "rgba(16,11,2,0.80)",
    badgeBg:       "#92400E",
    badgeBorder:   "rgba(251,191,36,0.55)",
    badgeShadow:   "0 0 24px rgba(252,211,77,0.45)",
    tableTopBar:   "#D97706",
    textLight:     "#FFFBEB",
    textLightDim:  "rgba(255,251,235,0.65)",
    titleShadow:   "0 2px 36px rgba(253,224,71,0.36)",
    ornament:      "✦",
    playerDiv:     "rgba(245,158,11,0.07)",
    innerDiv:      "rgba(245,158,11,0.15)",
    backupBar:     "rgba(252,211,77,0.55)",
  },

  // ── 5. Verdant ── ancient forest, elven sanctum ───────────────────────────
  verdant: {
    id: "verdant", label: "Verdant", swatch: "#4ADE80",
    // Twin radial glows rise from the lower corners (like forest underglow)
    overlay: [
      "radial-gradient(ellipse at 20% 90%, rgba(5,46,22,0.52) 0%, transparent 55%)",
      "radial-gradient(ellipse at 80% 90%, rgba(5,46,22,0.52) 0%, transparent 55%)",
      "linear-gradient(to bottom, rgba(0,10,3,0.52) 0%, rgba(0,16,5,0.72) 50%, rgba(0,6,1,0.94) 100%)",
    ].join(", "),
    cardBg:        "#000902",
    accent:        "#4ADE80",
    accentDim:     "rgba(74,222,128,0.56)",
    accentRule:    "rgba(34,197,94,0.30)",
    accentBorder:  "rgba(22,163,74,0.22)",
    headerBg:      "rgba(0,10,3,0.97)",
    tableBg:       "rgba(2,16,5,0.83)",
    badgeBg:       "#14532D",
    badgeBorder:   "rgba(74,222,128,0.50)",
    badgeShadow:   "0 0 22px rgba(74,222,128,0.32)",
    tableTopBar:   "#16A34A",
    textLight:     "#F0FDF4",
    textLightDim:  "rgba(240,253,244,0.62)",
    titleShadow:   "0 2px 28px rgba(74,222,128,0.24)",
    ornament:      "❧",
    playerDiv:     "rgba(34,197,94,0.06)",
    innerDiv:      "rgba(34,197,94,0.12)",
    backupBar:     "rgba(74,222,128,0.55)",
  },
};

const ThemeCtx = createContext(THEMES.shadow);

// ── Layout / content options ──────────────────────────────────────────────────
export const DEFAULT_OPTIONS = {
  tableFontScale: 1,   // 0.82 | 1 | 1.25  — scales all table-card typography
  tablesPerRow:   3,   // 1 | 2 | 3
  showBackup:     true,
  showVenue:      true,
  titleOverride:  "",  // empty = use event.name
};

const OptionsCtx = createContext(DEFAULT_OPTIONS);

// Available px width for a player name given the number of columns
function playerNameMaxWidth(tablesPerRow) {
  const inner   = CARD_WIDTH - 64;               // 32 px padding each side → 1016
  const gaps    = 16 * (tablesPerRow - 1);
  const col     = (inner - gaps) / tablesPerRow;
  const content = col - 40;                      // 20 px padding each side
  return content - 30;                           // 20 px number badge + 10 px gap
}

// Lazily-created canvas for synchronous text measurement
let _mc = null;
function measureTextWidth(text, fontSize) {
  if (typeof document === "undefined") return 0;
  if (!_mc) _mc = document.createElement("canvas");
  const ctx = _mc.getContext("2d");
  ctx.font = `${fontSize}px Georgia, serif`; // Georgia ≈ Spectral in proportions
  return ctx.measureText(text).width;
}

// Abbreviate a name to fit maxWidth px at the given font size.
// Trailing words are replaced with "FirstLetter." one at a time until it fits.
// e.g. "Cevdet Baran Oral" → "Cevdet Baran O." (not "Cevdet Baran Ora...")
function abbreviateName(name, maxWidth, fontSize) {
  if (measureTextWidth(name, fontSize) <= maxWidth) return name;
  const words = name.split(" ").filter(Boolean);
  for (let from = words.length - 1; from >= 0; from--) {
    const parts = [
      ...words.slice(0, from),
      ...words.slice(from).map((w) => w[0].toUpperCase() + "."),
    ];
    const candidate = parts.join(" ");
    if (measureTextWidth(candidate, fontSize) <= maxWidth) return candidate;
  }
  return (words[0]?.[0]?.toUpperCase() ?? "") + ".";
}

// ── Colour helpers ─────────────────────────────────────────────────────────────
function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Merge per-key colour overrides into a base theme, re-deriving dependent tokens
// so that, e.g., changing `accent` also updates accentDim, accentRule, etc.
function buildEffectiveTheme(base, overrides = {}) {
  const t = { ...base };

  if (overrides.accent) {
    const a = overrides.accent;
    Object.assign(t, {
      accent:      a,
      accentDim:   hexToRgba(a, 0.56),
      accentRule:  hexToRgba(a, 0.28),
      accentBorder:hexToRgba(a, 0.18),
      backupBar:   hexToRgba(a, 0.55),
      playerDiv:   hexToRgba(a, 0.06),
      innerDiv:    hexToRgba(a, 0.12),
      titleShadow: `0 2px 26px ${hexToRgba(a, 0.28)}`,
    });
  }
  if (overrides.badgeBg) {
    const b = overrides.badgeBg;
    Object.assign(t, {
      badgeBg:    b,
      badgeBorder:hexToRgba(b, 0.60),
      badgeShadow:`0 0 20px ${hexToRgba(b, 0.40)}`,
    });
  }
  if (overrides.tableTopBar) t.tableTopBar = overrides.tableTopBar;
  if (overrides.textLight) {
    const tx = overrides.textLight;
    Object.assign(t, {
      textLight:   tx,
      textLightDim:hexToRgba(tx, 0.60),
    });
  }
  if (overrides.headerBg) t.headerBg = overrides.headerBg;

  return t;
}

// ── Theme decorations (unique per-theme SVG elements) ─────────────────────────

// Arcane: concentric magic circle + 8-point compass, etched into darkness
function ArcaneCircles() {
  // All coordinates relative to a 1080×720 viewport, centred at (540, 320)
  const cx = 540, cy = 320;
  const compassPts = [
    [cx,       cy - 380], [cx + 269, cy - 269],
    [cx + 380, cy      ], [cx + 269, cy + 269],
    [cx,       cy + 380], [cx - 269, cy + 269],
    [cx - 380, cy      ], [cx - 269, cy - 269],
  ];
  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2, opacity: 0.07 }}
      viewBox="0 0 1080 720"
      preserveAspectRatio="xMidYMin meet"
    >
      <g fill="none" stroke="#A78BFA" strokeLinecap="round">
        {[380, 290, 185, 88, 36].map((r, i) => (
          <circle key={r} cx={cx} cy={cy} r={r} strokeWidth={i === 0 ? 1.1 : 0.7} />
        ))}
        {compassPts.map(([x, y], i) => (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} strokeWidth="0.5" />
        ))}
        {compassPts.map(([x, y], i) => (
          <circle key={`m${i}`} cx={x} cy={y} r={i % 2 === 0 ? 8 : 5} strokeWidth={i % 2 === 0 ? 0.9 : 0.6} />
        ))}
      </g>
    </svg>
  );
}

// Divine: golden light rays fanning downward from above the card top
function DivineRays() {
  const ox = 540, oy = -40, L = 1600;
  const angles = [-68, -52, -36, -22, -10, 0, 10, 22, 36, 52, 68];
  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}
      viewBox="0 0 1080 1400"
      preserveAspectRatio="xMidYMin meet"
    >
      {angles.map((a, i) => {
        const r = (a * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={ox} y1={oy}
            x2={Math.round(ox + L * Math.sin(r))}
            y2={Math.round(oy + L * Math.cos(r))}
            stroke="#FCD34D"
            strokeWidth={a === 0 ? 80 : 52}
            opacity={a === 0 ? 0.07 : 0.045}
          />
        );
      })}
    </svg>
  );
}

// Verdant: delicate vine / branch flourishes growing from the top corners
function VerdantVines() {
  const strokeProps = { fill: "none", stroke: "#4ADE80", strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2, opacity: 0.22 }}
      viewBox="0 0 1080 360"
      preserveAspectRatio="xMidYMin meet"
    >
      {/* Top-left */}
      <g {...strokeProps}>
        <path d="M0,0 C8,55 35,75 55,115 C65,135 60,165 78,198" strokeWidth="1.8" />
        <path d="M26,58 C48,46 68,34 88,12" strokeWidth="1.3" />
        <path d="M46,98 C68,76 88,64 106,44" strokeWidth="1.0" />
        <path d="M88,12 C93,2 106,1 109,10 C103,17 92,17 88,12 Z" fill="#4ADE80" opacity="0.6" />
        <path d="M106,44 C111,34 124,33 127,42 C121,49 109,49 106,44 Z" fill="#4ADE80" opacity="0.5" />
        <path d="M0,82 C11,76 18,64 15,55 C12,46 3,45 1,53" strokeWidth="0.8" opacity="0.6" />
      </g>
      {/* Top-right (mirrored) */}
      <g {...strokeProps}>
        <path d="M1080,0 C1072,55 1045,75 1025,115 C1015,135 1020,165 1002,198" strokeWidth="1.8" />
        <path d="M1054,58 C1032,46 1012,34 992,12" strokeWidth="1.3" />
        <path d="M1034,98 C1012,76 992,64 974,44" strokeWidth="1.0" />
        <path d="M992,12 C987,2 974,1 971,10 C977,17 988,17 992,12 Z" fill="#4ADE80" opacity="0.6" />
        <path d="M974,44 C969,34 956,33 953,42 C959,49 971,49 974,44 Z" fill="#4ADE80" opacity="0.5" />
        <path d="M1080,82 C1069,76 1062,64 1065,55 C1068,46 1077,45 1079,53" strokeWidth="0.8" opacity="0.6" />
      </g>
    </svg>
  );
}

function ThemeDecoration({ themeId }) {
  if (themeId === "arcane")   return <ArcaneCircles />;
  if (themeId === "divine")   return <DivineRays />;
  if (themeId === "verdant")  return <VerdantVines />;
  return null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function buildDateDisplay(start, end) {
  if (!start) return "";
  if (!end || start === end) return formatDate(start);
  return `${formatDate(start)} \u2013 ${formatDate(end)}`;
}

// ── Primitives ────────────────────────────────────────────────────────────────
function AccentRule() {
  const t = useContext(ThemeCtx);
  return <div style={{ height: 1, background: t.accentRule, margin: "0 36px" }} />;
}

function HeraldRule() {
  const t = useContext(ThemeCtx);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ flex: 1, height: 1, background: t.accentRule }} />
      <div style={{ fontFamily: CINZEL, fontSize: 11, color: t.accentDim, letterSpacing: "0.3em", userSelect: "none" }}>
        {t.ornament}
      </div>
      <div style={{ flex: 1, height: 1, background: t.accentRule }} />
    </div>
  );
}

function SectionLabel({ children }) {
  const t = useContext(ThemeCtx);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
      <div style={{ flex: 1, height: 1, background: t.accentRule }} />
      <div style={{ fontFamily: CINZEL, fontSize: 10, letterSpacing: "0.36em", color: t.accentDim, textTransform: "uppercase", whiteSpace: "nowrap" }}>
        {t.ornament} {children} {t.ornament}
      </div>
      <div style={{ flex: 1, height: 1, background: t.accentRule }} />
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
function CardHeader({ isGame }) {
  const t = useContext(ThemeCtx);
  return (
    <div style={{ background: t.headerBg, padding: "14px 44px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <img src={logoWhite} alt="EMU RPG" style={{ height: 32, width: "auto", objectFit: "contain", opacity: 0.9 }} />
        <div style={{ width: 1, height: 28, background: t.accentRule }} />
        <div>
          <div style={{ fontFamily: CINZEL, fontSize: 13, letterSpacing: "0.3em", color: t.accent, textTransform: "uppercase", lineHeight: 1.2 }}>
            EMURPG CLUB
          </div>
          <div style={{ fontFamily: SPECTRAL, fontSize: 10, color: t.accentDim, letterSpacing: "0.12em", fontStyle: "italic", marginTop: 2 }}>
            Eastern Mediterranean University
          </div>
        </div>
      </div>
      <div style={{ fontFamily: CINZEL, fontSize: 10, letterSpacing: "0.24em", color: t.textLight, textTransform: "uppercase", padding: "7px 20px", background: t.badgeBg, borderRadius: 2, border: `1px solid ${t.badgeBorder}`, boxShadow: t.badgeShadow }}>
        {isGame ? "Game Night" : "Club Event"}
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, children }) {
  const t = useContext(ThemeCtx);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px" }}>
      <Icon size={15} color={t.accentDim} strokeWidth={1.5} style={{ flexShrink: 0 }} />
      <span style={{ fontFamily: SPECTRAL, fontSize: 17, color: t.textLight, lineHeight: 1.3, whiteSpace: "nowrap" }}>
        {children}
      </span>
    </div>
  );
}

function MetaDivider() {
  const t = useContext(ThemeCtx);
  return <div style={{ width: 1, height: 18, background: t.accentRule, flexShrink: 0 }} />;
}

function HeroSection({ event, dateDisplay }) {
  const t    = useContext(ThemeCtx);
  const opts = useContext(OptionsCtx);
  const title = opts.titleOverride?.trim() || event.name;
  return (
    <div style={{ padding: "48px 80px 44px", textAlign: "center" }}>
      <div style={{ marginBottom: 22 }}><HeraldRule /></div>
      <h1 style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: 56, color: t.accent, margin: "0 0 20px", lineHeight: 1.12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", letterSpacing: "0.04em", textShadow: t.titleShadow }}>
        {title}
      </h1>
      <div style={{ marginBottom: 26 }}><HeraldRule /></div>
      <div style={{ display: "inline-flex", flexDirection: "row", alignItems: "center", gap: 0, flexWrap: "wrap", justifyContent: "center" }}>
        {dateDisplay && <InfoRow icon={Calendar}>{dateDisplay}</InfoRow>}
        {(event.start_time || event.end_time) && (
          <>
            <MetaDivider />
            <InfoRow icon={Clock}>{[event.start_time, event.end_time].filter(Boolean).join(" \u2013 ")}</InfoRow>
          </>
        )}
        {opts.showVenue && event.venue_name && (
          <>
            <MetaDivider />
            <InfoRow icon={MapPin}>{event.venue_name}</InfoRow>
          </>
        )}
      </div>
    </div>
  );
}

// ── Table card ────────────────────────────────────────────────────────────────
function TableCard({ table, index }) {
  const t       = useContext(ThemeCtx);
  const opts    = useContext(OptionsCtx);
  const scale   = opts.tableFontScale ?? 1;
  const maxW    = playerNameMaxWidth(opts.tablesPerRow ?? 3);
  const sz      = (n) => Math.round(n * scale);
  const players = table.approved_players || [];

  return (
    <div style={{ flex: "1 1 0", minWidth: 0, background: t.tableBg, border: `1px solid ${t.accentBorder}`, borderRadius: 6, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 4, background: t.tableTopBar, flexShrink: 0 }} />
      <div style={{ padding: `${sz(18)}px ${sz(20)}px ${sz(22)}px` }}>

        {/* Table number */}
        <div style={{ fontFamily: CINZEL, fontSize: sz(11), letterSpacing: "0.32em", color: t.accentDim, textTransform: "uppercase", marginBottom: sz(9) }}>
          Table {String(index + 1).padStart(2, "0")}
        </div>

        {/* Game name */}
        <div style={{ fontFamily: CINZEL, fontWeight: 700, fontSize: sz(16), color: t.accent, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: sz(6), display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.35 }}>
          {table.game_name}
        </div>

        {/* GM name */}
        <div style={{ fontFamily: SPECTRAL, fontSize: sz(14), color: t.textLightDim, fontStyle: "italic", marginBottom: sz(14), overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {table.game_master}
        </div>

        <div style={{ height: 1, background: t.innerDiv, marginBottom: sz(12) }} />

        {/* Player list */}
        {players.length === 0 ? (
          <div style={{ fontFamily: SPECTRAL, fontSize: sz(14), color: t.textLightDim, fontStyle: "italic", opacity: 0.45 }}>No players</div>
        ) : (
          players.map((p, i) => {
            const nameFontSize = sz(15);
            const displayName  = abbreviateName(p.name, maxW, nameFontSize);
            return (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: sz(10), paddingTop: i > 0 ? sz(7) : 0, marginTop: i > 0 ? sz(7) : 0, borderTop: i > 0 ? `1px solid ${t.playerDiv}` : "none" }}>
                <span style={{ fontFamily: CINZEL, fontSize: sz(11), color: t.accentDim, letterSpacing: "0.05em", flexShrink: 0, minWidth: sz(20), lineHeight: 1.6 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* fontWeight 500 + slight tracking = wider, more legible */}
                <span style={{ fontFamily: SPECTRAL, fontWeight: 500, fontSize: nameFontSize, letterSpacing: "0.015em", color: t.textLight, whiteSpace: "nowrap", lineHeight: 1.5 }}>
                  {displayName}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Backup players card ───────────────────────────────────────────────────────
function BackupPlayersCard({ players }) {
  const t     = useContext(ThemeCtx);
  const opts  = useContext(OptionsCtx);
  const scale = opts.tableFontScale ?? 1;
  const sz    = (n) => Math.round(n * scale);

  if (!players || players.length === 0) return null;

  // Backup names live in a multi-column flex grid; max ~140 px per entry
  const backupNameMaxW = 140;

  return (
    <div style={{ background: t.tableBg, border: `1px solid ${t.accentBorder}`, borderRadius: 6, overflow: "hidden", marginTop: 16 }}>
      <div style={{ height: 3, background: t.backupBar, flexShrink: 0 }} />
      <div style={{ padding: `${sz(18)}px ${sz(24)}px ${sz(22)}px` }}>
        <div style={{ fontFamily: CINZEL, fontSize: sz(12), letterSpacing: "0.32em", color: t.accentDim, textTransform: "uppercase", textAlign: "center", marginBottom: sz(14) }}>
          {t.ornament} Backup Players {t.ornament}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: `${sz(8)}px ${sz(28)}px` }}>
          {players.map((p, i) => {
            const nameFontSize = sz(15);
            const displayName  = abbreviateName(p.name, backupNameMaxW, nameFontSize);
            return (
              <div key={i} style={{ display: "flex", alignItems: "baseline", gap: sz(9), minWidth: sz(170) }}>
                <span style={{ fontFamily: CINZEL, fontSize: sz(11), color: t.accentDim, letterSpacing: "0.05em", flexShrink: 0, minWidth: sz(20), lineHeight: 1.6 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: SPECTRAL, fontWeight: 500, fontSize: nameFontSize, letterSpacing: "0.015em", color: t.textLightDim, lineHeight: 1.5, whiteSpace: "nowrap" }}>
                  {displayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Game content ──────────────────────────────────────────────────────────────
function GameContent({ tableDetails }) {
  const t    = useContext(ThemeCtx);
  const opts = useContext(OptionsCtx);
  const tpr  = opts.tablesPerRow ?? 3; // tables per row

  if (!tableDetails || tableDetails.length === 0) {
    return (
      <div style={{ padding: "48px 44px", textAlign: "center", fontFamily: SPECTRAL, fontSize: 16, color: t.textLightDim, fontStyle: "italic" }}>
        No tables registered yet.
      </div>
    );
  }

  const rows = [];
  for (let i = 0; i < tableDetails.length; i += tpr) rows.push(tableDetails.slice(i, i + tpr));

  const seen = new Set();
  const allBackups = tableDetails.flatMap((td) => td.backup_players || []).filter((p) => {
    if (seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  });

  return (
    <div style={{ padding: "36px 32px" }}>
      <SectionLabel>Registered Adventurers</SectionLabel>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap: 16, marginBottom: ri < rows.length - 1 ? 16 : 0, alignItems: "stretch" }}>
          {row.map((table, ci) => (
            <TableCard key={table.slug || `${ri}-${ci}`} table={table} index={ri * tpr + ci} />
          ))}
          {row.length < tpr && Array.from({ length: tpr - row.length }).map((_, si) => (
            <div key={`sp-${si}`} style={{ flex: "1 1 0", minWidth: 0 }} />
          ))}
        </div>
      ))}
      {opts.showBackup && <BackupPlayersCard players={allBackups} />}
    </div>
  );
}

// ── General content ───────────────────────────────────────────────────────────
function GeneralContent({ clubs }) {
  const t = useContext(ThemeCtx);
  if (!clubs || clubs.length === 0) return null;
  return (
    <div style={{ padding: "48px 56px" }}>
      <SectionLabel>Participating Clubs</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
        {clubs.map((club, i) => (
          <div key={i} style={{ fontFamily: CINZEL, fontSize: 16, color: t.accent, padding: "12px 28px", border: `1px solid ${t.accentBorder}`, borderRadius: 4, background: t.tableBg, letterSpacing: "0.05em" }}>
            {club}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function CardFooter() {
  const t = useContext(ThemeCtx);
  return (
    <div style={{ background: t.headerBg, padding: "14px 44px", display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ fontFamily: CINZEL, fontSize: 11, color: t.accentDim, letterSpacing: "0.16em", textTransform: "uppercase" }}>emurpg.com</div>
      <div style={{ flex: 1, height: 1, background: t.accentRule }} />
      <div style={{ fontFamily: CINZEL, fontSize: 11, color: t.accentDim, letterSpacing: "0.16em", textTransform: "uppercase" }}>@emurpgclub</div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
const AnnouncementCard = forwardRef(function AnnouncementCard(
  { event, bgUrl, theme = "shadow", colorOverrides = {}, cardOptions = {} },
  ref,
) {
  const t    = buildEffectiveTheme(THEMES[theme] ?? THEMES.shadow, colorOverrides);
  const opts = { ...DEFAULT_OPTIONS, ...cardOptions };
  const isGame = event.event_type !== "general";
  const bg = bgUrl || (isGame ? gameBg : generalBg);
  const dateDisplay = buildDateDisplay(event.start_date, event.end_date);

  return (
    <ThemeCtx.Provider value={t}>
    <OptionsCtx.Provider value={opts}>
      <div ref={ref} style={{ width: CARD_WIDTH, position: "relative", overflow: "hidden", background: t.cardBg }}>
        {/* Background artwork — z:0 */}
        <img src={bg} alt="" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />

        {/* Theme overlay — z:1 */}
        <div style={{ position: "absolute", inset: 0, background: t.overlay, zIndex: 1 }} />

        {/* Per-theme decorative SVG — z:2, between overlay and content */}
        <ThemeDecoration themeId={t.id} />

        {/* Content — z:3 */}
        <div style={{ position: "relative", zIndex: 3 }}>
          <CardHeader isGame={isGame} />
          <AccentRule />
          <HeroSection event={event} dateDisplay={dateDisplay} />
          {isGame ? (
            <GameContent tableDetails={event.tableDetails || []} />
          ) : (
            <GeneralContent clubs={event.clubs || []} />
          )}
          <AccentRule />
          <CardFooter />
        </div>
      </div>
    </OptionsCtx.Provider>
    </ThemeCtx.Provider>
  );
});

// ── PropTypes ─────────────────────────────────────────────────────────────────
const playerShape = PropTypes.shape({ name: PropTypes.string.isRequired });
const tableShape  = PropTypes.shape({
  slug: PropTypes.string,
  game_name: PropTypes.string.isRequired,
  game_master: PropTypes.string.isRequired,
  approved_players: PropTypes.arrayOf(playerShape),
  backup_players: PropTypes.arrayOf(playerShape),
});

AnnouncementCard.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string.isRequired,
    event_type: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
    venue_name: PropTypes.string,
    clubs: PropTypes.arrayOf(PropTypes.string),
    tableDetails: PropTypes.arrayOf(tableShape),
  }).isRequired,
  bgUrl:         PropTypes.string,
  theme:         PropTypes.oneOf(Object.keys(THEMES)),
  colorOverrides:PropTypes.object,
  cardOptions:   PropTypes.object,
};

CardHeader.propTypes   = { isGame: PropTypes.bool.isRequired };
HeroSection.propTypes  = { event: PropTypes.object.isRequired, dateDisplay: PropTypes.string.isRequired };
InfoRow.propTypes      = { icon: PropTypes.elementType.isRequired, children: PropTypes.node.isRequired };
TableCard.propTypes    = { table: tableShape.isRequired, index: PropTypes.number.isRequired };
GameContent.propTypes  = { tableDetails: PropTypes.arrayOf(tableShape) };
GeneralContent.propTypes   = { clubs: PropTypes.arrayOf(PropTypes.string) };
BackupPlayersCard.propTypes = { players: PropTypes.arrayOf(playerShape) };
ThemeDecoration.propTypes  = { themeId: PropTypes.string.isRequired };

export default AnnouncementCard;
