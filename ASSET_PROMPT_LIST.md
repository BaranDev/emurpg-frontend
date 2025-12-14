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
