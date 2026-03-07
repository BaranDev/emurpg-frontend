# Changelog

## [Unreleased] — 2026-03-08

### Features
- **Tavern Run**: Add scenario loader and JSON templates for Tavern Run scenarios ([`370e371`](https://github.com/BaranDev/emurpg-frontend/commit/370e371))

### Style
- Format code for better readability across multiple components ([`18c3f3e`](https://github.com/BaranDev/emurpg-frontend/commit/18c3f3e))

---

## 2026-03-07

### Features
- **Mobile**: Add mobile sidebar functionality and bottom navigation bar ([`29fe4db`](https://github.com/BaranDev/emurpg-frontend/commit/29fe4db))
- **Games Library**: Add image upload functionality to GamesLibraryPanel and enhance GameMasterCard hover effects ([`b885205`](https://github.com/BaranDev/emurpg-frontend/commit/b885205))
- **Admin**: Update color scheme for admin panels and components for better visibility ([`9b3eae7`](https://github.com/BaranDev/emurpg-frontend/commit/9b3eae7))
- **Toasts**: Implement premium toast notification system and graceful error handling ([`b8263b6`](https://github.com/BaranDev/emurpg-frontend/commit/b8263b6))
- **R2**: Implement R2 fallback logic and admin UI feedback ([`4d8258a`](https://github.com/BaranDev/emurpg-frontend/commit/4d8258a))
- **Themes**: Improve theme modal responsiveness and add background style handling ([`0ad17f0`](https://github.com/BaranDev/emurpg-frontend/commit/0ad17f0))
- **Team Members**: Dynamic team members from API with admin panels ([`8137c16`](https://github.com/BaranDev/emurpg-frontend/commit/8137c16))
- **CharRoller**: Implement CharRoller page with results and comprehensive tests, add ambient music player, and introduce new admin panels ([`f23d426`](https://github.com/BaranDev/emurpg-frontend/commit/f23d426))
- **Themes Admin**: Create Themes Admin Panel with live preview and LLM prompt ([`fea3bb8`](https://github.com/BaranDev/emurpg-frontend/commit/fea3bb8))
- **Table Themes**: Add theme selection to table creation and editing ([`af650f2`](https://github.com/BaranDev/emurpg-frontend/commit/af650f2))
- **Table Themes**: Apply dynamic theme classes to table cards ([`0793af4`](https://github.com/BaranDev/emurpg-frontend/commit/0793af4))

### Fixes
- **GameMasterCard**: Improve static image fallback logic and format animation styles ([`b5f8115`](https://github.com/BaranDev/emurpg-frontend/commit/b5f8115))

### Refactor
- Refactor AdminLayout menu structure and update button styles ([`8983385`](https://github.com/BaranDev/emurpg-frontend/commit/8983385))

### Style
- Format font-family declaration for better readability in `index.css` and adjust description paragraph formatting in AdminLayout ([`787f629`](https://github.com/BaranDev/emurpg-frontend/commit/787f629))

### Chore
- Ignore trash folder ([`19f0ff5`](https://github.com/BaranDev/emurpg-frontend/commit/19f0ff5))

---

## 2026-03-05

### Features
- **Audio**: Replace MusicPlayer with TavernPlayer (`react-h5-audio-player`) ([`1d7b013`](https://github.com/BaranDev/emurpg-frontend/commit/1d7b013))
- **CharRoller**: Introduce CharRoller page for character creation, management, and display ([`4947bba`](https://github.com/BaranDev/emurpg-frontend/commit/4947bba))

### Fixes
- **TavernPlayer**: Cleaner layout — single row, no progress bar, inline collapse button; untrack `docs/plans` (now gitignored) ([`7286d03`](https://github.com/BaranDev/emurpg-frontend/commit/7286d03))

---

## 2026-03-04

### Features
- **CharRoller**: UI overhaul — tavern theme, localStorage fix, portrait size, button contrast ([`f006ffa`](https://github.com/BaranDev/emurpg-frontend/commit/f006ffa))
- **CharRoller**: Improve level-up loading state and icon colors ([`df59866`](https://github.com/BaranDev/emurpg-frontend/commit/df59866))

### Fixes
- **Navbar**: Make CharRoller link active on events page (was showing Coming Soon) ([`edfc135`](https://github.com/BaranDev/emurpg-frontend/commit/edfc135))

---

## 2026-02-17

### Features
- **EMUCON**: Add EMUCON event page, CharRoller character management system, internationalization, and global audio context ([`28d5dbf`](https://github.com/BaranDev/emurpg-frontend/commit/28d5dbf))
