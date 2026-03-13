# Asset Generation Prompts

---

## Announcement Card Backgrounds

These two images are used as full-bleed backdrop artwork in the announcement card component (`AnnouncementCard.jsx`). They are rendered behind a dark gradient overlay, so the lower half of each image should intentionally lean toward deep shadow to keep the table cards and player names legible.

**Model:** Imagen 3 ("nano banana 2" — Google Gemini image generation)
**Format:** JPG, minimum 1080 × 1920 px (portrait 9:16 or 2:3), high quality

---

### `announcement-bg-game.jpg`
**Path:** `src/assets/images/announcement-bg-game.jpg`
**Used for:** Game Night events

**Prompt:**
> Flat vector illustration, looking upward through the interior of a medieval wizard's stone tower at night, spiraling bookshelves stuffed with glowing spell tomes lining the curved walls, arcane orbs and floating rune tablets drifting in shadow, iron chandelier with dozens of lit candles hanging overhead, a circular stained-glass oculus window at the top revealing a crimson full moon and the silhouette of a circling dragon, polished dice and a rolled dungeon map resting on a stone lectern in the foreground, jewel-tone flat fills of midnight navy #0D1522, deep crimson #8B1525, amber gold #C9A020, and arcane violet #2A1547 against near-black stone, bold geometric shapes, hard edges, zero gradients or shading, upper half richly detailed and luminous, lower half fading to near-black for text overlay, vertical portrait 9:16 aspect ratio

---

### `announcement-bg-general.jpg`
**Path:** `src/assets/images/announcement-bg-general.jpg`
**Used for:** General / club events

**Prompt:**
> Flat vector illustration, high rooftop vantage point overlooking a grand medieval walled city festival at dusk, cobblestone plaza below strung wall-to-wall with hundreds of glowing amber lanterns, colorful guild banners of crimson, emerald, and cobalt cascading from every gothic stone facade, silhouetted crowd gathered around an ornate central fountain, distant cathedral spires and castle towers rising against a deep indigo-violet sky packed with stars and a crescent moon, jewel-tone flat fills of deep indigo #0D0F2A, forest emerald #0D3020, blood crimson #8C1A20, and warm amber #C9920A against dark stone, bold geometric flat shapes, zero gradients or shading, upper half vivid and detailed, lower half dissolving to near-black for text overlay, vertical portrait 9:16 aspect ratio

---

# EMUCON Asset Generation Prompts

This file contains image generation prompts for vector assets needed for the EMUCON pages.

## Important Background Requirements

**CRITICAL:** All generated images (except `forest-silhouette.svg`) must have:

- **Solid color background** - Use a single, uniform color (no gradients, shades, lights, or variations)
- **Chroma key color** - Background must be **#FF00FF (pure magenta)** for easy color key removal
- **No color mixing** - The background color must not appear anywhere in the actual image content
- **PNG format** - All files except `forest-silhouette.svg` must be PNG format (not SVG)
- **Easy removal** - Background should be easily removable via color key/chroma key in image editing software

## Required Assets

| Filename | Filepath | Purpose | Image Generation Prompt |
| --- | --- | --- | --- |
| `forest-silhouette.svg` | `src/assets/images/forest-silhouette.svg` | Hero section bottom decoration, parallax background element | "A seamless horizontal vector silhouette of a mystical forest treeline, featuring dark green pine trees and oak trees with varying heights, subtle mist at the base, flat design style, transparent background, no gradients on trees, clean crisp edges, suitable for web hero section background, 1920x400 aspect ratio, forest colors #0d1f0d and #1a2e1a" |

## Optional Decorative Assets

These could enhance the medieval/fantasy theme if generated:

| Filename | Filepath | Purpose | Image Generation Prompt |
| --- | --- | --- | --- |
| `medieval-border.png` | `src/assets/images/medieval-border.png` | Card border decoration | "Medieval fantasy style decorative border frame, Celtic knot corners, vine and leaf motifs, dark green and gold colors (#2d4a2d, #c9a227), solid uniform background color #FF00FF (pure magenta) with no shades or gradients, PNG format, suitable for card borders, 400x400 aspect ratio, background must be easily removable by color key" |
| `celtic-divider.png` | `src/assets/images/celtic-divider.png` | Section divider decoration | "Horizontal Celtic knot divider ornament, intertwined vines and leaves, medieval fantasy style, dark green (#4a7c4a) color, solid uniform background color #FF00FF (pure magenta) with no shades or gradients, PNG format, 800x60 aspect ratio, background must be easily removable by color key" |
| `corner-flourish.png` | `src/assets/images/corner-flourish.png` | Corner decorations for cards | "Medieval fantasy corner flourish ornament with leaves and vines, dark green and gold accent, solid uniform background color #FF00FF (pure magenta) with no shades or gradients, PNG format, single corner design, 100x100 aspect ratio, background must be easily removable by color key" |
| `forest-fog.png` | `src/assets/images/forest-fog.png` | Atmospheric fog overlay | "Soft atmospheric fog/mist texture, dark green tinted (#0d1f0d to transparent gradient), horizontal seamless pattern, subtle particle effect, solid uniform background color #FF00FF (pure magenta) with no shades or gradients, PNG format, 1920x400 aspect ratio, background must be easily removable by color key" |

## Notes

- The forest silhouette (`forest-silhouette.svg`) is the only SVG file - all other assets must be PNG format
- The forest silhouette is currently implemented as an inline SVG in `EmuconParallax.jsx` component, so this asset is **optional** for enhanced visual quality
- If you prefer to use an external SVG file instead of the inline version, generate the asset and update the component accordingly
- All PNG assets must have a solid #FF00FF (magenta) background for easy chroma key removal
- The background color must be completely uniform with no variations, gradients, or lighting effects
- After generation, backgrounds can be removed using color key/chroma key tools in image editing software
- All other visual elements (gradients, overlays, ornaments) are implemented using pure CSS/Tailwind utilities
- The icons used in the UI are custom React SVG components in `EmuconIcons.jsx`

---

# On Code SVG Inventory

> Identified via `svg_usage_map.csv` (SVGSource = "On Code").
> These are SVGs hand-drawn with JSX path/shape code. They are candidates for replacement with proper generated SVG files or an icon library.

## Group A — Illustration SVGs (Scene Elements)

These are larger decorative scene elements embedded inside component files.
Target path when replaced: `src/assets/icons/`

| Component Name | Defined In | Used In | viewBox | Description |
| --- | --- | --- | --- | --- |
| `MoonSVG` | `CharrollerBackground.jsx` | `CharrollerBackground.jsx` (line 162) | 0 0 200 200 | Moon with glow rings and crater circles |
| `ScrollSVG` | `CharrollerBackground.jsx` | `CharrollerBackground.jsx` (line 227) | 0 0 120 160 | Magical tome / scroll shape |
| `DiceSVG` | `CharrollerBackground.jsx` | `CharrollerBackground.jsx` (line 241) | 0 0 100 100 | D6 dice with pips |
| `TreeSVG` | `CharrollerBackground.jsx` | `CharrollerBackground.jsx` (line 255, ×2) | 0 0 200 400 | Dark fantasy tree silhouette |
| `MoonSVG` | `ParallaxBackground.jsx` | `ParallaxBackground.jsx` (line 324) | 0 0 200 200 | Same moon motif, parallax variant |
| `TreeSVG` | `ParallaxBackground.jsx` | `ParallaxBackground.jsx` (line 389, ×2) | 0 0 200 400 | Same tree motif, parallax variant |
| `OwlSVG` | `ParallaxBackground.jsx` | `ParallaxBackground.jsx` (line 415) | 0 0 120 160 | Owl silhouette |

Also inline (direct `<svg>`) in the same files:

| File | viewBox | Description |
| --- | --- | --- |
| `CharrollerBackground.jsx` | 0 0 120 160 | Scroll/tome shape |
| `CharrollerBackground.jsx` | 0 0 100 100 | Dice shape |
| `CharrollerBackground.jsx` | 0 0 200 400 | Tree shape |
| `CharrollerBackground.jsx` | 0 0 200 200 | Moon shape |
| `TavernBackground.jsx` | 0 0 1200 100 | Decorative wave/ground |
| `EmuconParallax.jsx` | 0 0 200 80 | Cloud / landscape element |
| `EmuconParallax.jsx` | 0 0 180 70 | Cloud / landscape element |
| `EmuconParallax.jsx` | 0 0 150 60 | Cloud / landscape element |
| `ParallaxBackground.jsx` | 0 0 200 200 | Decorative shape |
| `ParallaxBackground.jsx` | 0 0 120 160 | Decorative shape |
| `ParallaxBackground.jsx` | 0 0 100 120 | Decorative shape |
| `ParallaxBackground.jsx` | 0 0 200 400 | Tree silhouette |
| `ParallaxBackground.jsx` | 0 0 200 200 | Decorative shape |

---

## Group B — EmuconIcons (Icon Set, all On Code)

All 20 icons in `src/components/Emucon/EmuconIcons.jsx` are hand-coded JSX path components using a 24×24 viewBox.

**Replacement options:**
- A: Swap with matching Lucide React icons (Lucide is already installed in the project)
- B: Generate proper `.svg` files and place in `src/assets/icons/emucon/`

| Icon Name | Used In | Current Usage |
| --- | --- | --- |
| `ShieldIcon` | EmuconContactGrid, EmuconDivider, EmuconFooter, EmuconNavbar, EmuconStatsRow, SponsorTierCard, Sponsors | Decorative, sponsor tiers, stats |
| `LeafIcon` | EmuconContentCard, EmuconDivider, EmuconFooter, EmuconNavbar, EmuconSectionHeader | Decorative dividers, headers |
| `StarIcon` | EmuconFooter, EmuconNavbar, EmuconStatsRow, Sponsors | Ratings, decorative |
| `TreeIcon` | EmuconFooter (×3) | Footer decoration |
| `MoonIcon` | EmuconFooter | Footer decoration |
| `CrownIcon` | EmuconContactGrid, SponsorHero, Sponsors | Sponsor tiers |
| `SwordIcon` | EmuconNavbar | Navbar decoration |
| `UpArrowIcon` | EmuconFooter | Back-to-top button |
| `CalendarIcon` | EmuconHero, EmuconSchedule | Event date display |
| `ClockIcon` | EmuconHero, EmuconSchedule | Event time display |
| `LocationIcon` | EmuconHero | Event venue display |
| `EmailIcon` | EmuconContactGrid, SponsorContactCTA | Contact info |
| `PhoneIcon` | Sponsors | Contact info |
| `ScrollIcon` | EmuconSchedule, Sponsors | Schedule / info |
| `ArtIcon` | Sponsors | Sponsor category |
| `GamepadIcon` | *(not in CSV — defined but currently unused)* | — |
| `MusicIcon` | *(not in CSV — defined but currently unused)* | — |
| `FoodIcon` | *(not in CSV — defined but currently unused)* | — |
| `CameraIcon` | *(not in CSV — defined but currently unused)* | — |
| `WorkshopIcon` | *(not in CSV — defined but currently unused)* | — |

---

## Group C — Admin & Misc Inline SVGs

Small utility SVGs coded directly in component files. Lower priority for replacement.

| File | viewBox | Description |
| --- | --- | --- |
| `AdminLayout.jsx` | 0 0 1200 200 | Decorative wave separator |
| `AdminLogin.jsx` | 0 0 1200 200 | Decorative wave separator |
| `AnalyticsPanel.jsx` | 0 0 24 24 | Small icon |
| `AnnouncementCard.jsx` | 0 0 1080 720 | Background art (landscape ratio) |
| `AnnouncementCard.jsx` | 0 0 1080 1400 | Background art (portrait ratio) |
| `AnnouncementCard.jsx` | 0 0 1080 360 | Background art (banner ratio) |
| `TeamMembersPanel.jsx` | 0 0 24 24 | Small icon |
| `AdminButton.jsx` | 0 0 24 24 | Button icon |
| `LoadingSpinner.jsx` | 0 0 20 20 | Spinner animation |
| `EmuconIcons.jsx` | 0 0 24 24 | IconWrapper base (shared SVG root) |
| `EmuconNavbar.jsx` | 0 0 1200 60 | Navbar bottom decoration |
| `Landing.jsx` | 0 0 24 24 | Small icon |
| `EmuconRulesPage.jsx` | 80×80 | Decorative element |
| `EventsPage.jsx` | 200×200 | Decorative element |
| `HomePage.jsx` | 0 0 24 24 | Small icon |

## Logo Assets (Already Available)

The following logo variations are already available in `src/assets/logo/`:

- `LOGO_BLACK.png`
- `LOGO_DARKGRAY.png`
- `LOGO_LIGHTGRAY.png` (used in Home hero & footer)
- `LOGO_WHITE.png` (used in navbar)
- `LOGO_YELLOW.png` (used in sponsor footer)
