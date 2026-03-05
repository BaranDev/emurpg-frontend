# Audio Player Replacement Design

**Date:** 2026-03-05
**Status:** Approved

## Problem

The current custom `MusicPlayer.jsx` has ongoing issues due to its hand-rolled `GlobalAudioContext` singleton. We want to replace it with a battle-tested library that handles the edge cases we're fighting, while preserving the tavern/D&D aesthetic.

## Solution

Replace `MusicPlayer.jsx` with a new `TavernPlayer.jsx` wrapper around `react-h5-audio-player`.

## Architecture

### Library
- `react-h5-audio-player` v3.x - purpose-built React audio player widget
- Compact layout mode via `layout="stacked-reverse"` or `customAdditionalControls={[]}`
- Loop mode via `loop` prop
- Volume and mute controlled via props

### Component: `TavernPlayer.jsx`
- Fixed position: `bottom-4 right-4 z-30` (same as today)
- Collapsible: small music icon button when collapsed, full player when expanded
- Reads initial volume/mute from `localStorage` via `getSettings()` on mount
- Persists volume/mute changes via `saveSettings()` on player callbacks

### Theme
CSS custom property overrides scoped inside the component:
- `--rhap_theme-color`: `#ffaa33` (tavern amber)
- `--rhap_background-color`: `rgba(61, 40, 23, 0.95)` (tavern wood)
- `--rhap_bar-color`: `rgba(139, 69, 19, 0.4)`
- `--rhap_time-color`: `#d4a574`
- Border and shadow: matching exiting tavern panel style

### Audio Source
- Single looping file: `/src/assets/sound/tavern-ambient.mp3`
- `loop={true}`, `autoPlayAfterSrcChange={false}`

### GlobalAudioContext
- Keep as-is for now (avoids cross-route disruption)
- Can be simplified/removed in a future pass once the new player is confirmed stable

## What Changes
- `MusicPlayer.jsx` → replaced by `TavernPlayer.jsx`
- All files that import `MusicPlayer` are updated to import `TavernPlayer`
- `react-h5-audio-player` added to dependencies

## What Stays the Same
- Audio file path
- Floating bottom-right widget position
- Volume/mute persistence via `localStorage`
- Collapsible behavior
