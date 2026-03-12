# /events Page Visual Redesign

**Date:** 2026-03-12  
**Scope:** `src/pages/EventsPage.jsx`, `src/components/events/EventList.jsx`  
**Aesthetic direction:** Dark arcane-medieval with soft luminous pastel accents — stained-glass colours against stone

---

## Problem

The `/events` page has a flat `bg-gray-900` background, generic gray event cards with harsh yellow borders, and cold gray typography. The recently added arcane sigil pattern on the card wrapper raised the bar visually, making the surrounding page and the event rows feel underdressed by contrast.

## Goal

Elevate `/events` into a cohesive "night-sky observatory / illuminated manuscript" atmosphere without touching any other page or shared component.

---

## Section 1 — Page atmosphere (`EventsPage.jsx`)

### Background
Replace the flat `bg-gray-900` class on the `motion.div` page wrapper with a multi-stop radial gradient mesh:

```
radial-gradient(ellipse 80% 60% at 20% 10%,  #0d1230 0%, transparent 60%)
radial-gradient(ellipse 60% 50% at 80% 80%,  #110a2e 0%, transparent 55%)
radial-gradient(ellipse 100% 80% at 50% 50%, #070b18 0%, #0a0d1a 100%)
```

Deep navy-black at center, bruised indigo top-left, deep violet wisp bottom-right — reads like a night sky from a castle window.

### Arcane card wrapper
- Border: `border-yellow-500/30` (up from `/20`)
- Hover border: `border-yellow-400/50` (up from `/30`)
- No other changes — the sigil tile, layered gradients, and box-shadow from the previous session are retained.

---

## Section 2 — Event cards (`EventList.jsx`)

### Card panel
| Property | Before | After |
|---|---|---|
| Background | `bg-gray-800/50` | `rgba(15, 18, 35, 0.75)` |
| Border | `border-2 border-yellow-600/50` | removed; replaced by left accent border |
| Border radius | `rounded-lg` | `rounded-xl` |
| Left accent | none | `4px solid` — `rose-300/65` (game) or `sky-300/65` (general) |
| Top-left ornament | none | `◆` absolutely positioned in accent colour |
| Hover transform | `scale(1.01)` | `translateX(3px)` — slides like a manuscript from a shelf |

### Typography
| Element | Before | After |
|---|---|---|
| Page/list title | `text-yellow-500` | `text-amber-100 font-cinzel` |
| Event name | `text-yellow-500` | `text-rose-200 font-cinzel` (game) / `text-sky-200 font-cinzel` (general) |
| Description | `text-gray-300` | `text-stone-300` |
| Date | `text-gray-400` + `FaCalendar` icon | `text-amber-200/70` + `✦` prefix |
| Back arrow | `text-yellow-500` | matches card accent colour |

### Badges
| State | Before | After |
|---|---|---|
| Seats available | `bg-green-900/50 text-green-400` | `bg-emerald-950/60 text-emerald-300 border border-emerald-400/30` |
| Full / not started | `bg-red-900/50 text-red-400` | `bg-rose-950/60 text-rose-300 border border-rose-400/30` |
| General event | `bg-purple-900/50 text-purple-400 border-purple-500` | `bg-sky-950/60 text-sky-200 border border-sky-400/30` |

### Animation
- Initial `y` on stagger cards: `20` → `12` (lighter float-in)
- All other framer-motion props unchanged

---

## Files changed
- `src/pages/EventsPage.jsx` — page background, card wrapper border tweak
- `src/components/events/EventList.jsx` — card structure, typography, badges, animation

## Files NOT changed
- `SectionTitle.jsx` — shared component, untouched
- All other pages, admin panel, backend — untouched
