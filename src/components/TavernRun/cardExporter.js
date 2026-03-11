import cardLegendary from "../../assets/tavern-run-cards/card-legendary.png";
import cardHeroic from "../../assets/tavern-run-cards/card-heroic.png";
import cardChaotic from "../../assets/tavern-run-cards/card-chaotic.png";
import cardCursed from "../../assets/tavern-run-cards/card-cursed.png";
import cardPathetic from "../../assets/tavern-run-cards/card-pathetic.png";

const TEMPLATES = {
  legendary: cardLegendary,
  heroic: cardHeroic,
  chaotic: cardChaotic,
  cursed: cardCursed,
  pathetic: cardPathetic,
};

const FAMILY_COLORS = {
  legendary: "#F6C23E",
  heroic: "#60A5FA",
  chaotic: "#A78BFA",
  cursed: "#F87171",
  pathetic: "#9CA3AF",
};

const STAT_COLORS = {
  renown: "#FACC15",
  supplies: "#4ADE80",
  danger: "#F87171",
  streak: "#60A5FA",
};

const W = 1200;
const H = 630;
const SANS = "'Segoe UI', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line ? line + " " + word : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
}

export async function generateRunCard({ ending, state, scenarioName, playerName }) {
  const templateSrc = TEMPLATES[ending.family] || TEMPLATES.pathetic;
  const accentColor = FAMILY_COLORS[ending.family] || FAMILY_COLORS.pathetic;

  const img = await loadImage(templateSrc);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Draw template background
  ctx.drawImage(img, 0, 0, W, H);

  // --- Family badge (top-left of parchment area) ---
  ctx.font = `bold 14px ${SANS}`;
  ctx.fillStyle = accentColor;
  ctx.textAlign = "left";
  ctx.fillText(ending.family.toUpperCase(), 140, 90);

  // --- Scenario name (top-right of parchment area) ---
  ctx.font = `13px ${SANS}`;
  ctx.fillStyle = "#9CA3AF";
  ctx.textAlign = "right";
  ctx.fillText(scenarioName, W - 140, 90);

  // --- Ending title (centered, large) ---
  ctx.font = `bold 36px ${SANS}`;
  ctx.fillStyle = accentColor;
  ctx.textAlign = "center";
  ctx.fillText(ending.title, W / 2, 155);

  // --- Flavor text (centered, wrapped) ---
  ctx.font = `italic 18px ${SERIF}`;
  ctx.fillStyle = "#D1D5DB";
  ctx.textAlign = "center";
  const flavorY = wrapText(
    ctx,
    `\u201C${ending.text}\u201D`,
    W / 2,
    210,
    W - 320,
    26,
  );

  // --- Player name ---
  const nameY = Math.max(flavorY + 20, 340);
  ctx.font = `bold 20px ${SANS}`;
  ctx.fillStyle = "#F3F4F6";
  ctx.textAlign = "center";
  ctx.fillText(playerName, W / 2, nameY);

  // --- Stats row ---
  const statsY = nameY + 50;
  const stats = [
    { label: "Renown", value: state.renown, color: STAT_COLORS.renown },
    { label: "Supplies", value: state.supplies, color: STAT_COLORS.supplies },
    { label: "Danger", value: state.danger, color: STAT_COLORS.danger },
    { label: "Streak", value: state.streak, color: STAT_COLORS.streak },
  ];

  const statSpacing = 160;
  const statStartX = W / 2 - ((stats.length - 1) * statSpacing) / 2;

  stats.forEach((stat, i) => {
    const x = statStartX + i * statSpacing;
    // Value
    ctx.font = `bold 28px ${SANS}`;
    ctx.fillStyle = stat.color;
    ctx.textAlign = "center";
    ctx.fillText(String(stat.value), x, statsY);
    // Label
    ctx.font = `12px ${SANS}`;
    ctx.fillStyle = "#6B7280";
    ctx.fillText(stat.label, x, statsY + 18);
  });

  // --- Tags ---
  const tagsY = statsY + 55;
  if (state.tags && state.tags.length > 0) {
    ctx.font = `13px ${SANS}`;
    ctx.fillStyle = "#D1D5DB";
    ctx.textAlign = "center";
    ctx.fillText(state.tags.join("  \u00B7  "), W / 2, tagsY);
  }

  // --- Branding ---
  ctx.font = `12px ${SANS}`;
  ctx.fillStyle = "#6B7280";
  ctx.textAlign = "center";
  ctx.fillText("emurpg.com", W / 2, H - 50);

  // Export as blob URL
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Failed to generate card image"));
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
}

export function downloadBlob(blobUrl, filename = "tavern-run-card.png") {
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}
