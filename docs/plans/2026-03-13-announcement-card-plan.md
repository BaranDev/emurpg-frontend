# Announcement Card Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the server-side Pillow PNG generator with a client-side React announcement card that previews in an admin modal and exports as a high-resolution PNG via `html-to-image`.

**Architecture:** An `AnnouncementCard` component (1080px fixed-width, inline styles for export fidelity) is rendered inside `AnnouncementModal`. The modal shows a scaled-down preview and captures the hidden full-size card ref via `html-to-image` for download. The "Announcement" button in `EventsAdminPanel` opens the modal instead of calling the backend.

**Tech Stack:** React 18, html-to-image, vitest + @testing-library/react, Tailwind CSS (admin chrome only — card itself uses inline styles for reliable html-to-image capture)

---

## Task 1: Install `html-to-image`

**Files:**
- Modify: `package.json` (auto-updated by npm)

**Step 1: Install the package**

```bash
cd "D:\git clones\emurpg-frontend"
npm install html-to-image
```

Expected output: `added 1 package` (or similar, no errors)

**Step 2: Verify import resolves**

```bash
node -e "require('html-to-image'); console.log('ok')"
```

Expected: `ok`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add html-to-image dependency"
```

---

## Task 2: Add Background Image Assets

**Files:**
- Create: `src/assets/images/announcement-bg-game.jpg`
- Create: `src/assets/images/announcement-bg-general.jpg`

**Step 1: Source two images**

You need two dark atmospheric images, ideally ~1200×1600px (portrait covers both square and tall cards):
- `announcement-bg-game.jpg` — dungeon, tavern interior, or fantasy dungeon art
- `announcement-bg-general.jpg` — stone hall, gathering scene, or moody architectural interior

Royalty-free sources: Unsplash, Pexels, or generate with an AI image tool.
Place them at `src/assets/images/` (create the `images/` folder if it doesn't exist).

**Step 2: Verify files exist**

```bash
ls src/assets/images/
```

Expected: both files listed.

**Step 3: Commit**

```bash
git add src/assets/images/
git commit -m "feat: add announcement card background art assets"
```

---

## Task 3: Create `AnnouncementCard.jsx`

**Files:**
- Create: `src/components/Admin/AnnouncementCard.jsx`

The card uses **inline styles throughout** (not Tailwind classes) because html-to-image inlines computed CSS — but Tailwind utility classes on elements inside the card may not capture reliably across all browsers. Inline styles are 100% reliable.

**Step 1: Create the file**

```jsx
// src/components/Admin/AnnouncementCard.jsx
import { forwardRef } from "react";
import PropTypes from "prop-types";
import gameBg from "../../assets/images/announcement-bg-game.jpg";
import generalBg from "../../assets/images/announcement-bg-general.jpg";

// ── Design tokens ────────────────────────────────────────────────────────────
const CARD_WIDTH = 1080;
const GOLD = "#F5C842";
const GOLD_DIM = "rgba(245,196,50,0.65)";
const GOLD_RULE = "rgba(245,196,50,0.38)";
const GOLD_BORDER = "rgba(245,196,50,0.25)";
const HEADER_BG = "rgba(8,4,2,0.90)";
const TABLE_BG = "rgba(18,8,4,0.68)";
const WARM_WHITE = "#EDE8DC";
const WARM_WHITE_DIM = "rgba(237,232,220,0.72)";
const CINZEL = "Cinzel, 'Times New Roman', serif";
const SPECTRAL = "Spectral, Georgia, serif";

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildDateDisplay(start, end) {
  if (!start) return "";
  if (!end || start === end) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

// ── Sub-components ───────────────────────────────────────────────────────────
function GoldRule() {
  return (
    <div style={{ height: 1, background: GOLD_RULE, margin: "0 36px" }} />
  );
}

function CardHeader({ isGame }) {
  return (
    <div
      style={{
        background: HEADER_BG,
        padding: "22px 44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 14,
          letterSpacing: "0.32em",
          color: GOLD_DIM,
          textTransform: "uppercase",
        }}
      >
        EMU RPG CLUB
      </div>
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 11,
          letterSpacing: "0.2em",
          color: GOLD,
          textTransform: "uppercase",
          padding: "5px 14px",
          border: `1px solid ${GOLD_BORDER}`,
          borderRadius: 4,
        }}
      >
        {isGame ? "Game Event" : "General Event"}
      </div>
    </div>
  );
}

function HeroSection({ event, dateDisplay }) {
  return (
    <div style={{ padding: "60px 72px", textAlign: "center" }}>
      {/* Event name — 2 lines max, then ellipsis */}
      <h1
        style={{
          fontFamily: CINZEL,
          fontWeight: 700,
          fontSize: 52,
          color: GOLD,
          margin: "0 0 28px",
          lineHeight: 1.18,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {event.name}
      </h1>

      {/* Date */}
      <div
        style={{
          fontFamily: SPECTRAL,
          fontSize: 20,
          color: WARM_WHITE,
          marginBottom: 10,
        }}
      >
        📅&nbsp; {dateDisplay}
      </div>

      {/* Time */}
      {(event.start_time || event.end_time) && (
        <div
          style={{
            fontFamily: SPECTRAL,
            fontSize: 18,
            color: WARM_WHITE_DIM,
            marginBottom: 10,
          }}
        >
          🕐&nbsp;{" "}
          {[event.start_time, event.end_time].filter(Boolean).join(" – ")}
        </div>
      )}

      {/* Venue */}
      {event.venue_name && (
        <div
          style={{
            fontFamily: SPECTRAL,
            fontSize: 18,
            color: WARM_WHITE_DIM,
          }}
        >
          📍&nbsp; {event.venue_name}
        </div>
      )}
    </div>
  );
}

function TableCard({ table }) {
  const players = table.approved_players || [];
  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 0,
        background: TABLE_BG,
        border: `1px solid ${GOLD_BORDER}`,
        borderRadius: 12,
        padding: "22px 20px",
      }}
    >
      {/* Game name */}
      <div
        style={{
          fontFamily: CINZEL,
          fontWeight: 700,
          fontSize: 14,
          color: GOLD,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 8,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          lineHeight: 1.4,
        }}
      >
        {table.game_name}
      </div>

      {/* Game Master */}
      <div
        style={{
          fontFamily: SPECTRAL,
          fontSize: 13,
          color: GOLD_DIM,
          fontStyle: "italic",
          marginBottom: 14,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {table.game_master}
      </div>

      {/* Players */}
      <div
        style={{
          borderTop: "1px solid rgba(245,196,50,0.14)",
          paddingTop: 12,
        }}
      >
        {players.length === 0 ? (
          <div
            style={{
              fontFamily: SPECTRAL,
              fontSize: 13,
              color: "rgba(237,232,220,0.35)",
              fontStyle: "italic",
            }}
          >
            No players
          </div>
        ) : (
          players.map((p, i) => (
            <div
              key={i}
              style={{
                fontFamily: SPECTRAL,
                fontSize: 14,
                color: WARM_WHITE,
                marginBottom: 6,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              · {p.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function GameContent({ tableDetails }) {
  if (!tableDetails || tableDetails.length === 0) {
    return (
      <div
        style={{
          padding: "48px 44px",
          textAlign: "center",
          fontFamily: SPECTRAL,
          fontSize: 16,
          color: WARM_WHITE_DIM,
          fontStyle: "italic",
        }}
      >
        No tables registered yet.
      </div>
    );
  }

  // Chunk into rows of 3
  const rows = [];
  for (let i = 0; i < tableDetails.length; i += 3) {
    rows.push(tableDetails.slice(i, i + 3));
  }

  return (
    <div style={{ padding: "40px 32px" }}>
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 12,
          letterSpacing: "0.28em",
          color: "rgba(245,196,50,0.55)",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 28,
        }}
      >
        ✦&nbsp; Tables &nbsp;✦
      </div>

      {rows.map((row, ri) => (
        <div
          key={ri}
          style={{ display: "flex", gap: 20, marginBottom: ri < rows.length - 1 ? 20 : 0 }}
        >
          {row.map((table, ci) => (
            <TableCard key={table.slug || `${ri}-${ci}`} table={table} />
          ))}
          {/* Spacers so last row aligns left in a 3-col grid */}
          {row.length < 3 &&
            Array.from({ length: 3 - row.length }).map((_, si) => (
              <div key={`sp-${si}`} style={{ flex: "1 1 0", minWidth: 0 }} />
            ))}
        </div>
      ))}
    </div>
  );
}

function GeneralContent({ clubs }) {
  if (!clubs || clubs.length === 0) return null;

  return (
    <div style={{ padding: "48px 56px" }}>
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 12,
          letterSpacing: "0.28em",
          color: "rgba(245,196,50,0.55)",
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 28,
        }}
      >
        ✦&nbsp; Participating Clubs &nbsp;✦
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          justifyContent: "center",
        }}
      >
        {clubs.map((club, i) => (
          <div
            key={i}
            style={{
              fontFamily: CINZEL,
              fontSize: 16,
              color: GOLD,
              padding: "12px 28px",
              border: `1px solid ${GOLD_BORDER}`,
              borderRadius: 8,
              background: TABLE_BG,
            }}
          >
            {club}
          </div>
        ))}
      </div>
    </div>
  );
}

function CardFooter() {
  return (
    <div
      style={{
        background: HEADER_BG,
        padding: "18px 44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 13,
          color: GOLD_DIM,
          letterSpacing: "0.1em",
        }}
      >
        emurpg.emu.edu.tr
      </div>
      <div style={{ fontFamily: CINZEL, fontSize: 16, color: GOLD_RULE }}>
        ✦
      </div>
      <div
        style={{
          fontFamily: CINZEL,
          fontSize: 13,
          color: GOLD_DIM,
          letterSpacing: "0.1em",
        }}
      >
        @emurpgclub
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const AnnouncementCard = forwardRef(function AnnouncementCard({ event }, ref) {
  const isGame = event.event_type !== "general";
  const bg = isGame ? gameBg : generalBg;
  const dateDisplay = buildDateDisplay(event.start_date, event.end_date);

  return (
    <div
      ref={ref}
      style={{
        width: CARD_WIDTH,
        position: "relative",
        overflow: "hidden",
        // Ensure the card always has a dark base even before bg loads
        background: "#0A0402",
      }}
    >
      {/* Background image */}
      <img
        src={bg}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.80) 100%)",
          zIndex: 1,
        }}
      />

      {/* All content sits above overlay */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <CardHeader isGame={isGame} />
        <GoldRule />
        <HeroSection event={event} dateDisplay={dateDisplay} />
        <GoldRule />
        {isGame ? (
          <GameContent tableDetails={event.tableDetails || []} />
        ) : (
          <GeneralContent clubs={event.clubs || []} />
        )}
        <GoldRule />
        <CardFooter />
      </div>
    </div>
  );
});

// ── PropTypes ────────────────────────────────────────────────────────────────
const playerShape = PropTypes.shape({ name: PropTypes.string.isRequired });
const tableShape = PropTypes.shape({
  slug: PropTypes.string,
  game_name: PropTypes.string.isRequired,
  game_master: PropTypes.string.isRequired,
  approved_players: PropTypes.arrayOf(playerShape),
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
};

CardHeader.propTypes = { isGame: PropTypes.bool.isRequired };
HeroSection.propTypes = {
  event: PropTypes.object.isRequired,
  dateDisplay: PropTypes.string.isRequired,
};
TableCard.propTypes = { table: tableShape.isRequired };
GameContent.propTypes = { tableDetails: PropTypes.arrayOf(tableShape) };
GeneralContent.propTypes = { clubs: PropTypes.arrayOf(PropTypes.string) };

export default AnnouncementCard;
```

**Step 2: Run linter**

```bash
npx eslint src/components/Admin/AnnouncementCard.jsx
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/components/Admin/AnnouncementCard.jsx
git commit -m "feat: add AnnouncementCard component"
```

---

## Task 4: Create `AnnouncementModal.jsx`

**Files:**
- Create: `src/components/Admin/AnnouncementModal.jsx`

The modal renders:
1. A **scaled preview** (CSS transform) inside `AdminModal` — what the admin sees
2. A **hidden full-size card** (positioned off-screen) — what `html-to-image` captures

**Step 1: Create the file**

```jsx
// src/components/Admin/AnnouncementModal.jsx
import { useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { toPng } from "html-to-image";
import AdminModal from "./shared/AdminModal";
import AdminButton from "./shared/AdminButton";
import AnnouncementCard from "./AnnouncementCard";
import { Download } from "lucide-react";

// The card is 1080px. We want it to fit inside roughly 700px of modal width.
const CARD_WIDTH = 1080;
const PREVIEW_WIDTH = 680;
const PREVIEW_SCALE = PREVIEW_WIDTH / CARD_WIDTH;

const AnnouncementModal = ({ event, isOpen, onClose }) => {
  const exportRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `${event.slug || event.name.toLowerCase().replace(/\s+/g, "-")}_announcement.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export announcement:", err);
      alert("Failed to generate image. Check the console for details.");
    } finally {
      setExporting(false);
    }
  }, [event]);

  if (!isOpen || !event) return null;

  return (
    <>
      {/* Hidden full-size card for export — off-screen, not visible */}
      <div
        style={{
          position: "fixed",
          left: -9999,
          top: 0,
          zIndex: -1,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <AnnouncementCard ref={exportRef} event={event} />
      </div>

      <AdminModal
        isOpen={isOpen}
        onClose={onClose}
        title="Announcement Preview"
        size="xl"
      >
        {/* Scaled preview container */}
        <div
          style={{
            width: PREVIEW_WIDTH,
            margin: "0 auto 24px",
            // The card is 1080px; we scale it to PREVIEW_WIDTH.
            // We also need to constrain the height so the modal doesn't overflow.
            overflow: "hidden",
            borderRadius: 8,
            border: "1px solid rgba(245,196,50,0.18)",
          }}
        >
          <div
            style={{
              width: CARD_WIDTH,
              transformOrigin: "top left",
              transform: `scale(${PREVIEW_SCALE})`,
              // The scaled card occupies PREVIEW_WIDTH px in layout space,
              // but its content height is still CARD_WIDTH-proportional.
              // We set the wrapper height to match the scaled height.
            }}
          >
            <AnnouncementCard event={event} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <AdminButton variant="secondary" onClick={onClose}>
            Close
          </AdminButton>
          <AdminButton
            onClick={handleDownload}
            disabled={exporting}
            icon={Download}
          >
            {exporting ? "Generating…" : "Download PNG"}
          </AdminButton>
        </div>
      </AdminModal>
    </>
  );
};

AnnouncementModal.propTypes = {
  event: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AnnouncementModal;
```

**Step 2: Run linter**

```bash
npx eslint src/components/Admin/AnnouncementModal.jsx
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/components/Admin/AnnouncementModal.jsx
git commit -m "feat: add AnnouncementModal with html-to-image export"
```

---

## Task 5: Wire Up `EventsAdminPanel.jsx`

**Files:**
- Modify: `src/components/Admin/EventsAdminPanel.jsx`

**Step 1: Add import at the top (after existing imports)**

Find the line:
```js
import ConfirmDialog from "./shared/ConfirmDialog";
```

Add after it:
```js
import AnnouncementModal from "./AnnouncementModal";
```

**Step 2: Add state (inside `EventsAdminPanel`, after existing state declarations)**

Find:
```js
const [confirmDialog, setConfirmDialog] = useState({
```

Add before it:
```js
const [announcementEvent, setAnnouncementEvent] = useState(null);
```

**Step 3: Remove the old `handleGenerateAnnouncement` function**

Delete this entire function (lines ~590–607):
```js
const handleGenerateAnnouncement = async (event) => {
  try {
    const response = await fetch(
      `${backendUrl}/api/admin/events/${event.slug}/announcement`,
      {
        headers: { apiKey },
      },
    );
    if (!response.ok) throw new Error("Failed to generate announcement");
    const blob = await response.blob();
    downloadFile(blob, `${event.name}_announcement.png`);
  } catch (error) {
    console.error("Error generating announcement:", error);
    alert("Failed to generate announcement image");
  }
};
```

**Step 4: Update the Announcement button's `onClick`**

Find:
```jsx
<AdminButton
  onClick={(e) => {
    e.stopPropagation();
    handleGenerateAnnouncement(event);
  }}
  variant="secondary"
  size="sm"
  icon={Image}
>
  Announcement
</AdminButton>
```

Replace with:
```jsx
<AdminButton
  onClick={(e) => {
    e.stopPropagation();
    setAnnouncementEvent(event);
  }}
  variant="secondary"
  size="sm"
  icon={Image}
>
  Announcement
</AdminButton>
```

**Step 5: Add `<AnnouncementModal>` to the JSX return**

Find the closing `</div>` after `<ConfirmDialog ... />` at the bottom of the return (around line 1181):
```jsx
      <ConfirmDialog
        isOpen={confirmDialog.open}
        ...
      />
    </div>
  );
```

Add the modal before the closing `</div>`:
```jsx
      <ConfirmDialog
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() =>
          setConfirmDialog({ open: false, title: "", message: "", onConfirm: null })
        }
      />

      <AnnouncementModal
        event={announcementEvent}
        isOpen={!!announcementEvent}
        onClose={() => setAnnouncementEvent(null)}
      />
    </div>
  );
```

**Step 6: Run linter**

```bash
npx eslint src/components/Admin/EventsAdminPanel.jsx
```

Expected: no errors.

**Step 7: Commit**

```bash
git add src/components/Admin/EventsAdminPanel.jsx
git commit -m "feat: wire Announcement button to AnnouncementModal"
```

---

## Task 6: Write Smoke Tests

**Files:**
- Create: `src/test/AnnouncementCard.test.jsx`

These tests verify the card renders without crashing and shows the right content sections — they don't test pixel output.

**Step 1: Create the test file**

```jsx
// src/test/AnnouncementCard.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AnnouncementCard from "../components/Admin/AnnouncementCard";

// Mock background image imports (Vite handles these; jsdom doesn't)
vi.mock("../assets/images/announcement-bg-game.jpg", () => ({ default: "game-bg.jpg" }));
vi.mock("../assets/images/announcement-bg-general.jpg", () => ({ default: "general-bg.jpg" }));

const gameEvent = {
  name: "EMURPG Spring 2026",
  event_type: "game",
  start_date: "2026-04-01",
  end_date: "2026-04-01",
  start_time: "10:00",
  end_time: "18:00",
  venue_name: "Kaleiçi Pasaj",
  clubs: [],
  tableDetails: [
    {
      slug: "table-1",
      game_name: "Curse of Strahd",
      game_master: "Baran",
      approved_players: [{ name: "Alice" }, { name: "Bob" }],
    },
    {
      slug: "table-2",
      game_name: "Lost Mine of Phandelver",
      game_master: "Deha",
      approved_players: [{ name: "Charlie" }],
    },
  ],
};

const generalEvent = {
  name: "Inter-Club Gathering",
  event_type: "general",
  start_date: "2026-05-10",
  end_date: "2026-05-10",
  venue_name: "Main Hall",
  clubs: ["EMURPG", "Chess Club", "Drama Club"],
  tableDetails: [],
};

describe("AnnouncementCard", () => {
  it("renders header with club name", () => {
    render(<AnnouncementCard event={gameEvent} />);
    expect(screen.getByText(/EMU RPG CLUB/i)).toBeInTheDocument();
  });

  it("renders event name in hero section", () => {
    render(<AnnouncementCard event={gameEvent} />);
    expect(screen.getByText("EMURPG Spring 2026")).toBeInTheDocument();
  });

  it("renders venue name when provided", () => {
    render(<AnnouncementCard event={gameEvent} />);
    expect(screen.getByText(/Kaleiçi Pasaj/)).toBeInTheDocument();
  });

  it("renders table cards for game events", () => {
    render(<AnnouncementCard event={gameEvent} />);
    expect(screen.getByText(/Curse of Strahd/i)).toBeInTheDocument();
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
  });

  it("shows Game Event badge for game type", () => {
    render(<AnnouncementCard event={gameEvent} />);
    expect(screen.getByText("Game Event")).toBeInTheDocument();
  });

  it("shows General Event badge for general type", () => {
    render(<AnnouncementCard event={generalEvent} />);
    expect(screen.getByText("General Event")).toBeInTheDocument();
  });

  it("renders clubs section for general events", () => {
    render(<AnnouncementCard event={generalEvent} />);
    expect(screen.getByText("EMURPG")).toBeInTheDocument();
    expect(screen.getByText("Chess Club")).toBeInTheDocument();
  });

  it("renders footer with website and social handle", () => {
    render(<AnnouncementCard event={gameEvent} />);
    expect(screen.getByText(/emurpg\.emu\.edu\.tr/)).toBeInTheDocument();
    expect(screen.getByText(/@emurpgclub/)).toBeInTheDocument();
  });

  it("handles missing optional fields gracefully", () => {
    const minimal = {
      name: "Minimal Event",
      event_type: "game",
      start_date: "2026-06-01",
      end_date: "2026-06-01",
    };
    expect(() => render(<AnnouncementCard event={minimal} />)).not.toThrow();
  });

  it("formats a date range correctly", () => {
    const rangeEvent = { ...gameEvent, end_date: "2026-04-02" };
    render(<AnnouncementCard event={rangeEvent} />);
    expect(screen.getByText(/1 April 2026 – 2 April 2026/)).toBeInTheDocument();
  });
});
```

**Step 2: Run tests**

```bash
npx vitest run src/test/AnnouncementCard.test.jsx
```

Expected: all 10 tests pass.

**Step 3: Commit**

```bash
git add src/test/AnnouncementCard.test.jsx
git commit -m "test: add AnnouncementCard smoke tests"
```

---

## Task 7: Manual Verification

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Navigate to admin panel**

Open the admin panel in the browser, log in, go to Events.

**Step 3: Click "Announcement" on a game event**

Verify:
- Modal opens (not a file download)
- Card preview is visible and legible
- Header shows "EMU RPG CLUB" and "Game Event"
- Hero shows event name, date, venue
- Tables grid shows game names, GMs, players
- Footer shows website and social handle
- "Download PNG" button exports a crisp ~2160px PNG that matches the preview

**Step 4: Click "Announcement" on a general event**

Verify:
- "General Event" badge in header
- Clubs appear as styled badges in the content section

**Step 5: Test edge cases**

- Event with a very long name (should clamp to 2 lines)
- Event with 4 tables (should render as 3+1, with two spacers in last row)
- Event with no tables (should show the "No tables registered yet" message)

---

## Cleanup (Optional)

After verifying everything works, you can remove the now-unused backend endpoint:

**`main.py`** — delete the `generate_event_announcement` route (~lines 2388–2400)

**`scripts/announcement_generator.py`** — can be archived to `trash/` or deleted

These are safe to leave in place if you want a fallback.
