import cardLegendary from "../../assets/tavern-run-cards/card-legendary.webp";
import cardHeroic from "../../assets/tavern-run-cards/card-heroic.webp";
import cardChaotic from "../../assets/tavern-run-cards/card-chaotic.webp";
import cardCursed from "../../assets/tavern-run-cards/card-cursed.webp";
import cardPathetic from "../../assets/tavern-run-cards/card-pathetic.webp";

const TEMPLATES = {
  legendary: cardLegendary,
  heroic: cardHeroic,
  chaotic: cardChaotic,
  cursed: cardCursed,
  pathetic: cardPathetic,
};

// Primary ink color per family (dark, readable on parchment)
const FAMILY_INK = {
  legendary: "#5C3D08",
  heroic:    "#152847",
  chaotic:   "#2E0E50",
  cursed:    "#4A0A0A",
  pathetic:  "#2D2D2D",
};

// Accent/decoration color per family
const FAMILY_ACCENT = {
  legendary: "#8B6010",
  heroic:    "#1A3F7A",
  chaotic:   "#5A2090",
  cursed:    "#8B1010",
  pathetic:  "#505050",
};

// Content areas (parchment safe zone) scaled from 2048→1080 (×0.527)
const CONTENT_AREAS = {
  pathetic:  { x: 197, y: 192, w: 667, h: 629 },
  legendary: { x: 249, y: 278, w: 553, h: 518 },
  chaotic:   { x: 239, y: 213, w: 563, h: 602 },
  cursed:    { x: 214, y: 190, w: 634, h: 662 },
  heroic:    { x: 227, y: 228, w: 626, h: 638 },
};

// Gender-fluid title prefixes per family — randomly assigned to player name
const ADVENTURER_TITLES = {
  pathetic: [
    "The Unfortunate",
    "Hapless",
    "The Bewildered",
    "The Stumbling",
    "Most Confused",
    "The Regrettable",
    "Ill-Prepared",
    "The Easily Startled",
  ],
  legendary: [
    "The Magnificent",
    "The Radiant",
    "Most Exalted",
    "The Glorious",
    "Grand",
    "The Undeniable",
    "The Resplendent",
    "Sublime",
  ],
  chaotic: [
    "The Unpredictable",
    "Agent of Chaos",
    "The Unhinged",
    "Most Reckless",
    "The Inexplicable",
    "Wildly Improvising",
    "The Baffling",
    "Technically Victorious",
  ],
  cursed: [
    "The Damned",
    "The Forsaken",
    "The Ill-Fated",
    "Wretched",
    "Most Cursed",
    "The Haunted",
    "Ever-Doomed",
    "The Jinxed",
  ],
  heroic: [
    "The Valiant",
    "Champion",
    "The Steadfast",
    "Shield-Bearer",
    "The Fearless",
    "Most Honorable",
    "The Unyielding",
    "Defender",
  ],
};

const QUOTES = {
  pathetic: [
    "I came, I saw, I tripped over my own sword.",
    "My battle cry was just me screaming for help.",
    "The bard will not be writing songs about this.",
    "I didn't lose. I failed to win. Spectacularly.",
    "Even the goblins felt bad for me. They offered me soup.",
    "The innkeeper asked me to stop calling myself an adventurer.",
    "I brought a sword to a door fight. The door won.",
    "Somewhere, a goblin is telling his friends about the easiest fight he ever had.",
    "They say legends never die. Good thing I'm not one.",
    "My legacy is a cautionary tale told by parents to their children.",
  ],
  legendary: [
    "They'll sing songs about this. Mostly because I'm paying the bard.",
    "I didn't choose the legendary life. I rolled a nat 20.",
    "Even the dragons are taking notes.",
    "The tavern ran out of ale celebrating my return.",
    "I walked in a nobody. I walked out owning the tavern.",
    "My reputation now has its own reputation.",
    "The king offered me his crown. I said keep it — I prefer glory.",
    "Destiny didn't call me. I called destiny. Collect.",
    "They named a constellation after me. I named it back.",
    "Plot armor? No. Plot SKILL.",
  ],
  chaotic: [
    "I solved every problem with arson. Including the arson problem.",
    "The plan was flawless. We just didn't follow the plan.",
    "I seduced the door. It opened. Don't ask questions.",
    "We won, but nobody can explain how. Including us.",
    "I threw the wizard at the dragon. It worked.",
    "My strategy was chaos. Chaos was my strategy.",
    "I traded the quest item for a slightly nicer hat.",
    "We started a tavern brawl to end a tavern brawl. Genius.",
    "I befriended the final boss. We're getting brunch Tuesday.",
    "The DM is still crying. Worth it.",
  ],
  cursed: [
    "I touched the glowing thing. I always touch the glowing thing.",
    "My blood is 40% curse and 60% poor decisions.",
    "The ghost said I have main character energy. Haunted main character.",
    "I didn't read the warning signs. They were in Elvish.",
    "Cursed, haunted, and broke. Triple threat.",
    "The necromancer called my vibe relatable.",
    "Dark forces follow me now. They also want rent.",
    "I opened the forbidden book. Chapter one: You fool.",
    "My luck is so bad, even my bad luck has bad luck.",
    "The curse says it's permanent. My therapist says that's a mindset.",
  ],
  heroic: [
    "I held the line. Also, I held a very cool pose doing it.",
    "No one left behind. Except my self-preservation instinct.",
    "The shield broke. I didn't.",
    "They said it was impossible. They were almost right.",
    "I volunteered for the suicide mission. It was only MOSTLY suicide.",
    "Courage isn't the absence of fear. It's rolling anyway.",
    "I saved the village. They named a goat after me. Close enough.",
    "My sword arm is tired but my heart is full. And also tired.",
    "Honor, duty, valor — and a desperate need to impress the innkeeper.",
    "I looked death in the eye. Death blinked first.",
  ],
};

const W = 1080;
const H = 1080;
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS  = "'Segoe UI', Arial, sans-serif";

// ─── Canvas Icon Drawers ─────────────────────────────────────────────────────

/** Crown silhouette — used for Renown */
function drawIconCrown(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  // Crown body (3-prong silhouette)
  ctx.beginPath();
  ctx.moveTo(cx - r,         cy + r * 0.55);  // bottom-left
  ctx.lineTo(cx - r,         cy - r * 0.35);  // left prong
  ctx.lineTo(cx - r * 0.45,  cy + r * 0.08);  // left valley
  ctx.lineTo(cx,             cy - r);          // center peak
  ctx.lineTo(cx + r * 0.45,  cy + r * 0.08);  // right valley
  ctx.lineTo(cx + r,         cy - r * 0.35);  // right prong
  ctx.lineTo(cx + r,         cy + r * 0.55);  // bottom-right
  ctx.closePath();
  ctx.fill();
  // Base band
  ctx.fillRect(cx - r, cy + r * 0.35, r * 2, r * 0.42);
}

/** Coin bag silhouette — used for Supplies */
function drawIconBag(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  // Bag body
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.12, r * 0.75, r * 0.78, 0, 0, Math.PI * 2);
  ctx.fill();
  // Neck
  ctx.fillRect(cx - r * 0.22, cy - r * 0.68, r * 0.44, r * 0.38);
  // Knot circle
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.8, r * 0.21, 0, Math.PI * 2);
  ctx.fill();
}

/** Skull silhouette — used for Danger */
function drawIconSkull(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  // Cranium
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.1, r * 0.62, 0, Math.PI * 2);
  ctx.fill();
  // Jaw (lower half arc)
  ctx.beginPath();
  ctx.arc(cx, cy + r * 0.35, r * 0.42, 0, Math.PI);
  ctx.fill();
  // Eye socket cutouts (light semi-transparent overlay)
  ctx.fillStyle = "rgba(240, 230, 205, 0.88)";
  ctx.beginPath();
  ctx.ellipse(cx - r * 0.24, cy - r * 0.15, r * 0.14, r * 0.19, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + r * 0.24, cy - r * 0.15, r * 0.14, r * 0.19, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** Upright sword silhouette — used for Streak */
function drawIconSword(ctx, cx, cy, r, color) {
  const bw = Math.max(2.5, r * 0.22); // blade width
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  // Blade
  ctx.lineWidth = bw;
  ctx.beginPath();
  ctx.moveTo(cx, cy + r * 0.28);
  ctx.lineTo(cx, cy - r * 0.82);
  ctx.stroke();
  // Tip
  ctx.beginPath();
  ctx.moveTo(cx - bw * 0.6, cy - r * 0.82);
  ctx.lineTo(cx, cy - r);
  ctx.lineTo(cx + bw * 0.6, cy - r * 0.82);
  ctx.closePath();
  ctx.fill();
  // Crossguard
  ctx.lineWidth = bw;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.58, cy + r * 0.28);
  ctx.lineTo(cx + r * 0.58, cy + r * 0.28);
  ctx.stroke();
  // Handle
  ctx.lineWidth = bw * 1.35;
  ctx.beginPath();
  ctx.moveTo(cx, cy + r * 0.28);
  ctx.lineTo(cx, cy + r * 0.78);
  ctx.stroke();
  // Pommel
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy + r * 0.88, r * 0.21, 0, Math.PI * 2);
  ctx.fill();
}

// ─── Ornamental Divider ──────────────────────────────────────────────────────

function drawDivider(ctx, cx, y, halfW, color, alpha = 0.5) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1;
  // Left wing
  ctx.beginPath();
  ctx.moveTo(cx - halfW, y);
  ctx.lineTo(cx - 13, y);
  ctx.stroke();
  // Right wing
  ctx.beginPath();
  ctx.moveTo(cx + 13, y);
  ctx.lineTo(cx + halfW, y);
  ctx.stroke();
  // Center diamond
  const d = 7;
  ctx.beginPath();
  ctx.moveTo(cx,     y - d);
  ctx.lineTo(cx + d, y);
  ctx.lineTo(cx,     y + d);
  ctx.lineTo(cx - d, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ─── Text Helpers ────────────────────────────────────────────────────────────

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let curY  = y;
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, curY);
      line = word;
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, curY);
  return curY + lineHeight;
}

function countWrappedLines(ctx, text, maxWidth) {
  const words = text.split(" ");
  let line = "";
  let n = 1;
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) { n++; line = word; }
    else line = test;
  }
  return n;
}

/** Shrink font size until text fits within maxWidth. Returns chosen size. */
function fitFontSize(ctx, text, maxWidth, maxSz, minSz, style) {
  const prevFont = ctx.font;
  let result = minSz;
  for (let sz = maxSz; sz >= minSz; sz--) {
    ctx.font = `${style} ${sz}px ${SERIF}`;
    if (ctx.measureText(text).width <= maxWidth) { result = sz; break; }
  }
  ctx.font = prevFont;
  return result;
}

function pickRandom(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickQuote(family) {
  return pickRandom(QUOTES[family] || QUOTES.pathetic);
}

function pickTitle(family) {
  return pickRandom(ADVENTURER_TITLES[family] || ADVENTURER_TITLES.pathetic);
}

/**
 * Draws a classic ribbon banner with inward V-notches on each side.
 * Returns the bottom Y coordinate of the banner.
 */
function drawNameplateBanner(ctx, cx, cy, w, h, text, fillColor, textColor) {
  const notch = h * 0.38;
  const x1 = cx - w / 2;
  const x2 = cx + w / 2;
  const y1 = cy - h / 2;
  const y2 = cy + h / 2;

  // Shadow for depth
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur  = 6;
  ctx.shadowOffsetY = 3;

  // Banner shape (inward V-notch ribbon)
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(x1,          y1);
  ctx.lineTo(x2,          y1);
  ctx.lineTo(x2 - notch,  cy);
  ctx.lineTo(x2,          y2);
  ctx.lineTo(x1,          y2);
  ctx.lineTo(x1 + notch,  cy);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Fit font size so text never overflows inner width
  const innerW = w - notch * 2 - 20;
  const fittedSz = fitFontSize(ctx, text, innerW, 26, 14, "bold");

  ctx.font = `bold ${fittedSz}px ${SERIF}`;
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, cx, cy + 1);
  ctx.textBaseline = "alphabetic";

  return y2;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load card template image"));
    img.src = src;
  });
}

// ─── Main Generator ──────────────────────────────────────────────────────────

function toTitleCase(str) {
  return str
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export async function generateRunCard({ ending, state, playerName }) {
  playerName = playerName ? toTitleCase(playerName) : "";
  const family = ending.family || "pathetic";
  const ink    = FAMILY_INK[family]    || FAMILY_INK.pathetic;
  const accent = FAMILY_ACCENT[family] || FAMILY_ACCENT.pathetic;
  const area   = CONTENT_AREAS[family] || CONTENT_AREAS.pathetic;

  const img = await loadImage(TEMPLATES[family] || TEMPLATES.pathetic);
  const canvas = document.createElement("canvas");
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0, W, H);

  // Layout constants
  const cx      = area.x + area.w / 2;
  const padX    = 30;
  const textW   = area.w - padX * 2;
  const divHalf = textW / 2 - 6;

  const LABEL_SZ    = 13;
  const QUOTE_SZ    = 20;
  const QUOTE_LH    = 30;
  const NUM_SZ      = 30;
  const STAT_LBL_SZ = 11;
  const BRAND_SZ    = 11;
  const ICON_R      = 12;
  const DIV_H       = 14;   // vertical space for a divider (diamond height = 14px)

  // Title: auto-fit size so it never wraps
  const titleSz = fitFontSize(ctx, ending.title, textW, 46, 24, "bold");

  // Quote and nameplate — prefer scenario-specific shareQuote, fall back to family pool
  const quoteStr   = `\u201C${ending.shareQuote || pickQuote(family)}\u201D`;
  const titlePrefix = pickTitle(family);
  const bannerText  = playerName
    ? `\u25C6  ${titlePrefix} ${playerName}  \u25C6`
    : `\u25C6  ${titlePrefix}  \u25C6`;

  ctx.font = `italic ${QUOTE_SZ}px ${SERIF}`;
  const quoteH = countWrappedLines(ctx, quoteStr, textW) * QUOTE_LH;

  const BANNER_H = 50;

  // Total layout height (no name line — banner replaces it)
  const totalH =
    LABEL_SZ +                                    // family label
    10 + DIV_H + 16 +                             // gap + div1 + gap
    titleSz +                                     // title
    16 +                                          // gap
    BANNER_H +                                    // nameplate banner
    20 +                                          // gap
    quoteH +                                      // quote block
    20 + DIV_H + 14 +                             // gap + div2 + gap
    ICON_R * 2 + 6 + NUM_SZ + 4 + STAT_LBL_SZ +  // stat row
    12 + BRAND_SZ;                                // gap + branding

  // Vertically center content in area
  let y = area.y + Math.max(20, Math.floor((area.h - totalH) / 2));

  ctx.textAlign = "center";

  // ── Family label ──
  ctx.font = `bold ${LABEL_SZ}px ${SANS}`;
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.8;
  ctx.fillText(family.toUpperCase() + " ENDING", cx, y + LABEL_SZ);
  ctx.globalAlpha = 1;
  y += LABEL_SZ + 10;

  // ── Divider 1 ──
  drawDivider(ctx, cx, y + DIV_H / 2, divHalf, accent);
  y += DIV_H + 16;

  // ── Title ──
  ctx.font = `bold ${titleSz}px ${SERIF}`;
  ctx.fillStyle = ink;
  ctx.fillText(ending.title, cx, y + titleSz);
  y += titleSz + 16;

  // ── Nameplate banner ──
  const bannerFill = accent + "D6"; // accent at ~84% opacity (hex)
  const bannerText_cream = "#FFF2DC";
  drawNameplateBanner(ctx, cx, y + BANNER_H / 2, textW, BANNER_H, bannerText, bannerFill, bannerText_cream);
  y += BANNER_H + 20;

  // ── Quote ──
  ctx.font = `italic ${QUOTE_SZ}px ${SERIF}`;
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.9;
  const afterQuoteY = wrapText(ctx, quoteStr, cx, y, textW, QUOTE_LH);
  ctx.globalAlpha = 1;
  y = afterQuoteY + 20;

  // ── Divider 2 ──
  drawDivider(ctx, cx, y + DIV_H / 2, divHalf, accent);
  y += DIV_H + 14;

  // ── Stats row ──
  const statDefs = [
    { label: "RENOWN",   value: state.renown   ?? 0, draw: drawIconCrown },
    { label: "SUPPLIES", value: state.supplies ?? 0, draw: drawIconBag   },
    { label: "DANGER",   value: state.danger   ?? 0, draw: drawIconSkull },
    { label: "STREAK",   value: state.streak   ?? 0, draw: drawIconSword },
  ];

  const spacing   = Math.min(128, textW / statDefs.length);
  const statLeft  = cx - ((statDefs.length - 1) * spacing) / 2;
  const iconCY    = y + ICON_R;
  const numY      = iconCY + ICON_R + 6 + NUM_SZ;
  const lblY      = numY + 4 + STAT_LBL_SZ;

  statDefs.forEach((s, i) => {
    const sx = statLeft + i * spacing;
    s.draw(ctx, sx, iconCY, ICON_R, ink);

    ctx.font = `bold ${NUM_SZ}px ${SERIF}`;
    ctx.fillStyle = ink;
    ctx.textAlign = "center";
    ctx.fillText(String(s.value), sx, numY);

    ctx.font = `bold ${STAT_LBL_SZ}px ${SANS}`;
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.7;
    ctx.fillText(s.label, sx, lblY);
    ctx.globalAlpha = 1;
  });

  y = lblY + 12;

  // ── Branding ──
  ctx.font = `${BRAND_SZ}px ${SANS}`;
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.globalAlpha = 0.3;
  ctx.fillText("emurpg.com", cx, y + BRAND_SZ);
  ctx.globalAlpha = 1;

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Failed to generate card image"));
      resolve(blob);
    }, "image/png");
  });
}

// ─── Export Helpers ──────────────────────────────────────────────────────────

export function downloadCard(blob, filename = "tavern-run-card.png") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  try {
    a.click();
  } finally {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export async function shareCard(blob, title = "My Tavern Run") {
  const file = new File([blob], "tavern-run-card.png", { type: "image/png" });
  await navigator.share({ files: [file], title });
}

export async function copyCard(blob) {
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

// Memoized: capability is stable per session, no need to re-check on every render
let _canShare = null;
export const canShare = () => {
  if (_canShare === null) {
    _canShare =
      typeof navigator !== "undefined" &&
      !!navigator.share &&
      !!navigator.canShare?.({ files: [new File([], "x.png", { type: "image/png" })] });
  }
  return _canShare;
};

export const canCopy = () =>
  typeof navigator !== "undefined" && !!navigator.clipboard?.write;
