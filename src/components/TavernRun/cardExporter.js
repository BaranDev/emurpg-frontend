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

const W = 1080;
const H = 1080;
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

// Returns a Blob — caller decides whether to download, share, or copy
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

  // --- Scenario name (top center) ---
  ctx.font = `16px ${SANS}`;
  ctx.fillStyle = "#9CA3AF";
  ctx.textAlign = "center";
  ctx.fillText(scenarioName, W / 2, 110);

  // --- Family badge ---
  ctx.font = `bold 16px ${SANS}`;
  ctx.fillStyle = accentColor;
  ctx.textAlign = "center";
  ctx.fillText(ending.family.toUpperCase(), W / 2, 155);

  // --- Ending title ---
  ctx.font = `bold 44px ${SANS}`;
  ctx.fillStyle = accentColor;
  ctx.textAlign = "center";
  ctx.fillText(ending.title, W / 2, 230);

  // --- Flavor text (wrapped) ---
  ctx.font = `italic 22px ${SERIF}`;
  ctx.fillStyle = "#D1D5DB";
  ctx.textAlign = "center";
  const flavorY = wrapText(
    ctx,
    `\u201C${ending.text}\u201D`,
    W / 2,
    310,
    W - 160,
    34,
  );

  // --- Player name ---
  const nameY = Math.max(flavorY + 40, 520);
  ctx.font = `bold 28px ${SANS}`;
  ctx.fillStyle = "#F3F4F6";
  ctx.textAlign = "center";
  ctx.fillText(playerName, W / 2, nameY);

  // --- Stats row (4 columns) ---
  const statsY = nameY + 70;
  const stats = [
    { label: "Renown", value: state.renown, color: STAT_COLORS.renown },
    { label: "Supplies", value: state.supplies, color: STAT_COLORS.supplies },
    { label: "Danger", value: state.danger, color: STAT_COLORS.danger },
    { label: "Streak", value: state.streak, color: STAT_COLORS.streak },
  ];

  const statSpacing = 200;
  const statStartX = W / 2 - ((stats.length - 1) * statSpacing) / 2;

  stats.forEach((stat, i) => {
    const x = statStartX + i * statSpacing;
    ctx.font = `bold 38px ${SANS}`;
    ctx.fillStyle = stat.color;
    ctx.textAlign = "center";
    ctx.fillText(String(stat.value), x, statsY);
    ctx.font = `14px ${SANS}`;
    ctx.fillStyle = "#6B7280";
    ctx.fillText(stat.label, x, statsY + 22);
  });

  // --- Tags ---
  const tagsY = statsY + 70;
  if (state.tags && state.tags.length > 0) {
    ctx.font = `15px ${SANS}`;
    ctx.fillStyle = "#D1D5DB";
    ctx.textAlign = "center";
    ctx.fillText(state.tags.join("  \u00B7  "), W / 2, tagsY);
  }

  // --- Branding ---
  ctx.font = `14px ${SANS}`;
  ctx.fillStyle = "#6B7280";
  ctx.textAlign = "center";
  ctx.fillText("emurpg.com", W / 2, H - 50);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Failed to generate card image"));
      resolve(blob);
    }, "image/png");
  });
}

export function downloadCard(blob, filename = "tavern-run-card.png") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function shareCard(blob, title = "My Tavern Run") {
  const file = new File([blob], "tavern-run-card.png", { type: "image/png" });
  await navigator.share({ files: [file], title });
}

export async function copyCard(blob) {
  await navigator.clipboard.write([
    new ClipboardItem({ "image/png": blob }),
  ]);
}

export const canShare = () =>
  typeof navigator !== "undefined" &&
  !!navigator.share &&
  !!navigator.canShare?.({ files: [new File([], "x.png", { type: "image/png" })] });

export const canCopy = () =>
  typeof navigator !== "undefined" && !!navigator.clipboard?.write;
