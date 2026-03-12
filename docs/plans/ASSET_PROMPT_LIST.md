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
> A cinematic vertical digital fantasy illustration of a grand medieval great hall turned adventurers' game night. A long oak table dominates the foreground, scattered with polished dice, hand-drawn treasure maps, spell books with glowing runes, and painted miniatures. Iron torch sconces blaze with amber and deep crimson fire, casting dramatic chiaroscuro pools of light across rough stone walls hung with battle-worn tapestries in jewel tones — blood crimson, burnished gold, sapphire. A dragon skull and crossed swords mounted above a gothic stone fireplace occupy the far wall. Blue-violet arcane light bleeds from a cracked stone doorway at center-back. The atmosphere crackles with anticipation and fellowship.
>
> Lighting: theatrical chiaroscuro — vivid warm amber firelight in the upper quarter, with the central and lower portions deepening into near-black shadow. The bottom half of the image should be very dark to allow white and gold text overlay at high contrast.
>
> Color palette: near-black stone and shadow (#08040A) as dominant; accents of ember orange (#C17020), deep crimson (#9B1E2E), antique gold (#C9A227), and arcane cobalt (#2A3B6A). Jewel-saturated tones throughout with no washed-out midtones.
>
> Style: premium digital fantasy concept art, painterly with crisp high-contrast detail, reminiscent of official D&D sourcebook illustrations. Tall vertical portrait composition, 9:16 aspect ratio. Upper third richly detailed; lower two-thirds transitions to deep shadow.

---

### `announcement-bg-general.jpg`
**Path:** `src/assets/images/announcement-bg-general.jpg`
**Used for:** General / club events

**Prompt:**
> A breathtaking cinematic vertical illustration of a vast medieval cathedral repurposed as a grand festival hall. Soaring Gothic stone arches rise to a vaulted ceiling lost in shadow. Tall narrow stained glass windows line both sides, beaming dramatic shafts of colored light across worn flagstone floors — deep emerald, ruby red, royal cobalt, and amber gold. Between the windows hang massive heraldic tapestries featuring mythical beasts, crossed swords, and guild crests in rich jewel tones. Stone columns wrapped in ivy and torchlit by iron candelabras lead the eye toward a raised dais at the far end, where banners stream in unseen air.
>
> The mood is celebratory, majestic, and legendary — a gathering of people who belong to something greater than themselves. Hundreds of candle flames create a warm golden haze in the upper register. The floor and lower walls deepen into cool shadow.
>
> Lighting: warm golden candlelight above, vivid colored spill from stained glass in the mid-register, transitioning to deep shadow below. The bottom half of the image should be very dark to allow text overlay at high contrast.
>
> Color palette: near-black stone (#060408) as dominant; accents of stained-glass ruby (#8C1A2A), emerald (#1A5C3A), royal cobalt (#1C2E6A), and burnished gold (#C9A027). The overall effect should feel rich, theatrical, and alive with color despite the dark stone base.
>
> Style: premium digital fantasy concept art, cinematic painterly rendering, reminiscent of high-fantasy RPG sourcebook covers. Tall vertical portrait composition, 9:16 aspect ratio. Upper half carries the most visual information; lower half deepens to near-black.

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

## Logo Assets (Already Available)

The following logo variations are already available in `src/assets/logo/`:

- `LOGO_BLACK.png`
- `LOGO_DARKGRAY.png`
- `LOGO_LIGHTGRAY.png` (used in Home hero & footer)
- `LOGO_WHITE.png` (used in navbar)
- `LOGO_YELLOW.png` (used in sponsor footer)
