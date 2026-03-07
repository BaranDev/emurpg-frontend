# EMURPG Frontend - AI Coding Assistant Instructions

## Project Overview

React 18 + Vite 5 frontend for EMU RPG Club's event management system with medieval/fantasy theme. Communicates with a FastAPI backend at `api.emurpg.com` for table management, player registration, CharRoller AI character tools, EMUCON event management, and real-time updates via WebSockets.

## Architecture Pattern

### Component Organization

- **Barrel exports**: All public components export through `src/components/index.jsx` — always import from this central location
- **Admin components**: `src/components/Admin/` has its own `index.jsx` barrel for admin-only components
- **Page components**: `src/pages/` contains route-level components
- **Contexts**: `src/contexts/GlobalAudioContext.jsx` — persistent audio state for CharRoller ambient music
- **Hooks**: `src/hooks/useToast.js` — toast notification system
- **Utils**: `src/utils/auth.js` (session management) and `src/utils/characterStorage.js` (character CRUD)
- **Props pattern**: Pass `onLanguageSwitch` down from App.jsx to enable language switching from any page

### State Management & Data Flow

```
App.jsx (root state)
├── Language selection (localStorage: "selectedLanguage")
├── Authentication (via src/utils/auth.js)
│   └── localStorage: "login" (JSON with expirationTime), "apiKey"
└── Routes pass onLanguageSwitch callback to pages
    └── Pages pass to Navbar component
```

### Pages (`src/pages/`)

| Page | Route | Purpose |
| --- | --- | --- |
| `HomePage.jsx` | `/` | Landing page with events list |
| `EventsPage.jsx` | `/events` | Full event/table browser |
| `TableDetailPage.jsx` | `/table/:slug` | Table detail + WebSocket seat updates |
| `CharrollerLandingPage.jsx` | `/charroller` | CharRoller feature landing |
| `CharrollerPage.jsx` | `/charroller/app` | Full CharRoller application |
| `EmuconRulesPage.jsx` | `/emucon/rules` | EMUCON event rules |
| `Emucon/` | `/emucon/*` | EMUCON event schedule/info pages |

---

## Critical Workflows

### Development Setup

```bash
npm run dev              # Start dev server with --host flag (network accessible)
npm run build           # Production build
npm run preview         # Preview production build
npm start               # Serve production build with 'serve'
```

### Environment Variables

```env
VITE_DEV=true           # Routes to localhost:8000 backend; false = api.emurpg.com
VITE_ENABLE_R2=true     # Shows image upload widgets in admin panels
```

### Backend Integration

- **Base URL**: `src/config.jsx` reads `import.meta.env.VITE_DEV` — never hardcode URLs
- **R2 uploads**: `config.ENABLE_R2` (from `VITE_ENABLE_R2`) gates image upload UI in admin panels
- **WebSocket**: Single endpoint `wss://api.emurpg.com/ws/updates` — frontend re-fetches on message
- **API key**: Admin routes require `apiKey` header (NOT `X-API-Key`) — use `getApiKey()` from `src/utils/auth.js`
- **CORS**: Backend handles CORS — no proxy needed in Vite

---

## Project-Specific Conventions

### Internationalization (i18n)

```jsx
// Always import and use translation hook
import { useTranslation } from "react-i18next";
const { t } = useTranslation();

// Translation keys structure: "section.subsection.key"
t("navbar.events"); // Navbar translations
t("events_page.title"); // Page-specific
t("table_list.quest_master"); // Component-specific
t("charroller.landing.title"); // CharRoller-specific
```

**Language files**: `src/locales/en.json` and `src/locales/tr.json` must stay in sync. **First-time flow**: `LanguageSelector` modal appears if no `selectedLanguage` in localStorage.

### Styling Approach

- **Tailwind CSS**: Primary styling system with custom medieval theme colors (yellow-500/600 for primary)
- **Custom animations**: Defined in `src/index.css` (`@keyframes fadeIn`, `scaleIn`, `slideDown`)
- **Performance focus**: Use CSS animations over Framer Motion for low-end devices
- **Theme**: Medieval RPG aesthetic with yellow/gold accents, dark backgrounds (gray-800/900)
- **`index.css` button rule**: Global `button` base applies only `transition-colors duration-300` — no background color. Each button must declare its own background.

### Animation Performance

**Optimization principle**: Framer Motion was removed for low-end device performance.

- Use: CSS utility classes like `animate-fadeIn`, `animate-scaleIn` (defined in `index.css`)
- Avoid: `motion` components, `AnimatePresence`, spring physics, 3D transforms from framer-motion
- **Accessibility**: `@media (prefers-reduced-motion)` support in `index.css`

### Component Patterns

```jsx
// Standard component structure
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const MyComponent = ({ prop1, onCallback }) => {
  const { t } = useTranslation();
  // Component logic
};

MyComponent.propTypes = {
  prop1: PropTypes.string,
  onCallback: PropTypes.func,
};

export default MyComponent;
```

---

## Key Files & Their Purpose

### Configuration

- `src/config.jsx`: Backend URL (`VITE_DEV`), R2 flag (`VITE_ENABLE_R2`), social links, 264 RPG themed quotes
- `src/i18n.js`: i18next setup with localStorage persistence
- `tailwind.config.js`: Custom flame animations for medieval effects

### Core App Files

- `src/App.jsx`: Router + language selector + auth state management + `GlobalAudioProvider` wrapping
- `src/contexts/GlobalAudioContext.jsx`: Persistent audio player context for CharRoller ambient music
- `src/utils/auth.js`: `getApiKey()`, `setLoginData()`, `clearSession()`, TTL-based session validation
- `src/utils/characterStorage.js`: localStorage CRUD for CharRoller characters (`emurpg_characters` key)
- `src/hooks/useToast.js`: Toast notification hook (success/error/info messages)

### Public-Facing Components

- `src/components/Navbar.jsx`: Responsive nav with language switcher (CSS transitions, no Framer Motion)
- `src/components/LanguageSelector.jsx`: First-run language selection modal
- `src/components/TableList.jsx`: Real-time table list (subscribes to WebSocket updates)
- `src/components/EventList.jsx`: Event grid with browser compatibility checks
- `src/components/GameGuideModal.jsx`: In-context game rule viewer
- `src/components/RegistrationForm.jsx`: Player registration with validation

### Admin System (`src/components/Admin/`)

The admin system uses a sidebar-based layout with grouped navigation:

```
AdminMain.jsx          # Protected route wrapper + auth gate
AdminLayout.jsx        # Sidebar layout with menuSections navigation
AdminSidebar.jsx       # Sidebar renderer (reads menuSections)
AdminHeader.jsx        # Top bar
AdminLogin.jsx         # Login form
```

**Panel components** (each is a full admin section):

| Panel                     | Purpose                                 |
| ------------------------- | --------------------------------------- |
| `EventsAdminPanel.jsx`    | Create/manage game + general events     |
| `TablesAdminPanel.jsx`    | Create/manage tables per event          |
| `RegistrationsPanel.jsx`  | Approve/reject player registrations     |
| `GamesLibraryPanel.jsx`   | Game CRUD + R2 image upload             |
| `ThemesAdminPanel.jsx`    | Table theme CRUD + R2 background upload |
| `TeamMembersPanel.jsx`    | Team member CRUD + R2 photo upload      |
| `ReportsPanel.jsx`        | Event analytics + report download       |
| `AnalyticsPanel.jsx`      | Aggregate analytics dashboard           |
| `EmuconAdminPanel.jsx`    | EMUCON event structure management       |
| `EmuconManagersPanel.jsx` | EMUCON manager/invite code management   |
| `EmuconSchedulePanel.jsx` | EMUCON time period management           |
| `AdminAccountsPanel.jsx`  | Super-admin: manage admin accounts      |

**AdminLayout `menuSections` pattern**:

```jsx
const menuSections = [
  { label: null, items: [{ id: "home", ... }] },                   // No header
  { label: "EMURPG", items: [events, tables, registrations, ...] },
  { label: "EMUCON", items: [emucon, managers, schedule] },
  { label: "Management", items: [games, themes, team, reports, analytics, accounts] },
];
```

---

## Integration Points

### Backend Communication

```javascript
// Standard fetch pattern
import { config } from "./config";

const res = await fetch(`${config.backendUrl}/api/tables`);
const data = await res.json();

// Admin endpoints — use auth utility, header name is "apiKey" (not "X-API-Key")
import { getApiKey } from "../utils/auth";

const res = await fetch(`${config.backendUrl}/api/admin/tables`, {
  headers: {
    "Content-Type": "application/json",
    apiKey: getApiKey(),
  },
});
```

### WebSocket Pattern

There is a **single** WebSocket endpoint — not per-table. Frontend receives `"Records updated"` string (not JSON) and re-fetches data.

```javascript
const ws = new WebSocket("wss://api.emurpg.com/ws/updates");
ws.onmessage = () => {
  // Re-fetch tables/events — do NOT parse as JSON
  fetchData();
};

// Always clean up in useEffect return
return () => ws.close();
```

### R2 Image Uploads (Admin Only)

Image upload widgets should be conditionally rendered behind `config.ENABLE_R2`:

```jsx
import { config } from "../../config";

{
  config.ENABLE_R2 && (
    <input type="file" accept="image/*" onChange={handleImageUpload} />
  );
}
```

### localStorage Keys (Full Inventory)

| Key | Value | Set By |
| --- | --- | --- |
| `selectedLanguage` | `"en"` \| `"tr"` | `LanguageSelector` |
| `login` | JSON `{ expirationTime: number }` | `auth.js setLoginData()` |
| `apiKey` | string token | `auth.js setLoginData()` |
| `emurpg_characters` | JSON array of character objects | `characterStorage.js` |
| `emurpg_charroller_settings` | JSON user preferences | CharRoller settings panel |

---

## CharRoller Feature

AI-powered character sheet tool. Located at `/charroller` and `/charroller/app`.

### Architecture

- `CharrollerLandingPage.jsx`: Marketing/intro page for the feature
- `CharrollerPage.jsx`: Full app — upload PDF/text, get dice roll list, manage characters
- `GlobalAudioContext.jsx`: Provides persistent ambient music player for the CharRoller experience
- `characterStorage.js`: CRUD operations against `emurpg_characters` in localStorage
- `src/test/CharrollerResults.*.test.jsx`: Vitest tests for the roll results component

### Audio Context Pattern

`GlobalAudioProvider` wraps CharRoller routes in `App.jsx`. Use the context to control playback:

```jsx
import { useGlobalAudio } from "../contexts/GlobalAudioContext";
const { isPlaying, toggle, setTrack } = useGlobalAudio();
```

### Supported Game Systems

`dnd5e` | `fate` | `coc` | `pathfinder2e` — passed as `game_system` param to backend.

---

## Testing

### Test Suite

Vitest + React Testing Library. Tests live in `src/test/`.

```bash
npm test          # Run all tests
npm run coverage  # Coverage report
```

**Test files**:

- `CharrollerResults.high.test.jsx` — rolls rendered from high-priority results
- `CharrollerResults.medium.test.jsx` — rolls rendered from medium-priority results
- `CharrollerResults.low.test.jsx` — rolls rendered from low-priority results
- `fixtures/` — shared test data
- `setup.js` — Vitest global setup

### Debugging

- Dev server accessible on network with `--host` flag for mobile testing
- Use browser DevTools Network > WS tab for WebSocket debugging
- Backend logs available at `api.emurpg.com` (admin access required)

---

## Design System

- **Primary color**: Yellow-500/600 (medieval gold)
- **Background**: Gray-900 (dark medieval theme)
- **Accent**: Yellow-400 for highlights
- **Icons**: react-icons (FaDiceD20, FaGlobe, FaGithub, etc.)
- **Fonts**: "Metamorphous" (Google Fonts) for medieval aesthetic
- **Responsive breakpoints**: Tailwind defaults (sm, md, lg, xl)

---

## Common Gotchas

1. **Admin API key header**: Must be `apiKey` (not `X-API-Key`) — use `getApiKey()` from `src/utils/auth.js`
2. **WebSocket URL**: Single endpoint `/ws/updates`, message is plain string `"Records updated"` — do not parse as JSON
3. **Config DEV flag**: Controlled by `VITE_DEV` env var (`import.meta.env.VITE_DEV === "true"`), not a hardcoded constant
4. **Language selector**: Must accept `onLanguageSelect` callback, NOT `onLanguageSwitch`
5. **PropTypes**: Always add PropTypes validation to prevent lint errors
6. **Animation imports**: Do not import `motion` or `AnimatePresence` from framer-motion (performance optimization)
7. **Button backgrounds**: Global `button` base has no background — each button declares its own `bg-*` class
8. **R2 upload UI**: Gate image upload widgets behind `config.ENABLE_R2` check
9. **WebSocket cleanup**: Always call `ws.close()` in the `useEffect` cleanup function
10. **Translation coverage**: Not all pages fully translated yet — HomePage, EventsPage, and CharRoller are complete

---

## When Adding Features

1. Add translations to BOTH `en.json` and `tr.json`
2. Pass `onLanguageSwitch` if component uses Navbar
3. Use PropTypes validation on all new components
4. Prefer CSS animations over Framer Motion
5. Export new public components through `src/components/index.jsx`
6. Export new admin components through `src/components/Admin/index.jsx`
7. Follow existing naming: PascalCase for components, camelCase for utilities
8. Use `getApiKey()` from `src/utils/auth.js` for admin API calls — never read `localStorage` directly
9. Add new admin panels to `menuSections` in `AdminLayout.jsx` under the appropriate group
10. **Never use emojis** — not in code, comments, console logs, error messages, or user-facing text
