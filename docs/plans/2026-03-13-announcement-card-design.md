# Announcement Card Redesign

**Date:** 2026-03-13
**Status:** Approved

## Summary

Replace the server-side Pillow-generated PNG announcement image with a client-side React component that renders a styled announcement card and exports it as a high-resolution PNG using `html-to-image`. The new card has a dynamic-height layout with atmospheric background artwork, a fixed header and footer, and graceful text-length handling throughout.

## Problem with Current System

- Output is visually poor: flat `(44,24,16)` brown rectangles with gold text, no atmosphere
- Server-side PIL blocks a FastAPI thread during image composition
- Text layout is reimplemented from scratch in Python, with fragile pixel-math for spacing
- The `announcement_title` / `announcement_url` fields stored on each event are never used

## Architecture

### Approach: Client-side React card + `html-to-image` export

**New files (frontend):**
- `src/components/Admin/AnnouncementCard.jsx` — card component; receives the full `event` object as a prop (including `tableDetails`); renders both the live preview and the export target
- `src/components/Admin/AnnouncementModal.jsx` — modal wrapper; renders a scrollable scaled preview and a Download PNG button
- `src/assets/images/announcement-bg-game.jpg` — bundled dark dungeon/tavern background artwork (~1200×1600px)
- `src/assets/images/announcement-bg-general.jpg` — bundled dark stone hall/gathering background artwork

**Modified files (frontend):**
- `src/components/Admin/EventsAdminPanel.jsx` — "Announcement" button opens `AnnouncementModal(event)` instead of calling the backend

**New dependency:**
- `html-to-image` — `npm install html-to-image`

**Removed (backend, optional):**
- `GET /api/admin/events/{slug}/announcement` endpoint in `main.py`
- `scripts/announcement_generator.py`

### Data Flow

The `event` object is already in scope at the button site (`filteredEvents.map()`). It already carries `tableDetails` (fetched on panel load). `AnnouncementCard` receives `event` directly — zero additional API calls.

### Export Mechanism

```js
import { toPng } from 'html-to-image';

const handleDownload = async () => {
  setExporting(true);
  const dataUrl = await toPng(fullSizeRef.current, { pixelRatio: 2 });
  // trigger download via <a> element
  setExporting(false);
};
```

The full-size card (1080px wide) lives in the DOM but is visually hidden. `html-to-image` captures it at 2× device pixel ratio, producing a ~2160px wide PNG. Cinzel and Spectral fonts are already loaded by the page and are embedded automatically.

## Visual Layout

```
┌─────────────────────────────────────────────────────┐
│  HEADER BAR  (~80px, rgba(10,5,2,0.85))             │
│  [logo]  EMU RPG CLUB              [GAME/GENERAL]   │
├─ gold rule ─────────────────────────────────────────┤
│                                                     │
│  HERO ZONE  (~280px, background art + gradient)     │
│                                                     │
│         ✦  EVENT NAME  ✦   (Cinzel Bold, ~48px)     │
│              📅  15 March 2026                      │
│              📍  Venue Name                         │
│                                                     │
├─ gold rule ─────────────────────────────────────────┤
│                                                     │
│  CONTENT BODY  (background art continues)           │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ GAME A   │  │ GAME B   │  │ GAME C   │          │
│  │ GM: Name │  │ GM: Name │  │ GM: Name │          │
│  │ · Player │  │ · Player │  │ · Player │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│  (or clubs + accepted students for general events)  │
│                                                     │
├─ gold rule ─────────────────────────────────────────┤
│  FOOTER BAR  (~60px, rgba(10,5,2,0.85))            │
│  emurpg.emu.edu.tr          @emurpgclub   🎲        │
└─────────────────────────────────────────────────────┘
```

### Styling

- **Card width:** 1080px fixed (scaled down in modal preview via CSS transform)
- **Height:** dynamic; grows with content
- **Background:** single `<img>` absolutely positioned, `object-cover`, full card area
- **Overlay:** `linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.75))` over the background image
- **Header/footer background:** `rgba(10, 5, 2, 0.85)`
- **Section dividers:** `1px solid rgba(245, 196, 50, 0.4)` (gold rule)
- **Table cards:** `rgba(20, 10, 5, 0.6)` fill, `1px solid rgba(245,196,50,0.25)` border, `border-radius: 12px`
- **Event name:** Cinzel Bold, ~48px, `#F5C842` gold
- **Section labels:** Cinzel Regular, 13px, uppercase, letter-spaced, `rgba(245,196,50,0.7)`
- **Player names:** Spectral Regular, 15px, warm white `#EDE8DC`

### Text-length Handling

| Element | Strategy |
|---|---|
| Event name | `line-clamp-2` — wraps to 2 lines max |
| Game name (table card header) | `line-clamp-2` |
| GM name | `truncate` (single line) |
| Player name | `truncate` (single line) |
| Table grid | 3 columns; rows grow to tallest card in the row |
| General event students | 2-column list, unlimited rows |
| Clubs | Wrapped flex row of badges |

## Background Art

- Bundled as local assets (not fetched from R2) — no CORS concerns, instant render
- `announcement-bg-game.jpg`: dark fantasy dungeon or tavern interior
- `announcement-bg-general.jpg`: dimly lit stone hall or gathering scene
- Selected automatically based on `event.event_type`
- Images can be swapped by replacing the files; no code changes needed

## Modal UX

```
┌──────────────────────────────────────┐
│  Event Announcement Preview          │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  scaled card preview           │  │
│  │  (max-height: 70vh, scroll)    │  │
│  └────────────────────────────────┘  │
│                                      │
│  [Cancel]          [⬇ Download PNG]  │
└──────────────────────────────────────┘
```

- Preview scales the card down to fit the modal via CSS `transform: scale()`
- Full-size 1080px card is hidden in the DOM; `html-to-image` captures that ref
- Download button shows `Generating…` during the ~500ms capture
- Output filename: `{event.slug}_announcement.png`
