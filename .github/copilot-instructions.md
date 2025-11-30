# EMURPG Frontend - AI Coding Assistant Instructions

## Project Overview

React + Vite frontend for EMU RPG Club's event management system with medieval/fantasy theme. Communicates with FastAPI backend at `api.emurpg.com` for table management, player registration, and real-time updates via WebSockets.

## Architecture Pattern

### Component Organization

- **Barrel exports**: All components export through `src/components/index.jsx` - always import from this central location
- **Page components**: `src/pages/` contains route-level components (HomePage, EventsPage, TableDetailPage)
- **Shared components**: `src/components/` for reusable UI elements (Navbar, EventList, TableList, etc.)
- **Props pattern**: Pass `onLanguageSwitch` down from App.jsx to enable language switching from any page

### State Management & Data Flow

```
App.jsx (root state)
├── Language selection (localStorage: "selectedLanguage")
├── Authentication (localStorage: "login", "apiKey" with expiration)
└── Routes pass onLanguageSwitch callback to pages
    └── Pages pass to Navbar component
```

## Critical Workflows

### Development Setup

```bash
npm run dev              # Start dev server with --host flag (network accessible)
npm run build           # Production build
npm run preview         # Preview production build
npm start               # Serve production build with 'serve'
```

### Backend Integration

- **Base URL**: Set in `src/config.jsx` via `DEV` flag (localhost:8000 or api.emurpg.com)
- **WebSocket pattern**: `TableDetailPage.jsx` implements real-time updates for table availability
- **API key validation**: Admin routes require `apiKey` from localStorage in headers
- **CORS**: Backend has CORS configured - no proxy needed in Vite

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
```

**Language files**: `src/locales/en.json` and `src/locales/tr.json` must stay in sync. **First-time flow**: `LanguageSelector` modal appears if no `selectedLanguage` in localStorage.

### Styling Approach

- **Tailwind CSS**: Primary styling system with custom medieval theme colors (yellow-500/600 for primary)
- **Custom animations**: Defined in `src/index.css` (`@keyframes fadeIn`, `scaleIn`, `slideDown`)
- **Performance focus**: Use CSS animations over Framer Motion for low-end devices
- **Theme**: Medieval RPG aesthetic with yellow/gold accents, dark backgrounds (gray-800/900)

### Animation Performance

**Optimization principle**: Removed heavy Framer Motion animations for low-end devices.

- ✅ Use: CSS classes like `animate-fadeIn`, `animate-scaleIn`
- ❌ Avoid: Complex `motion` components with spring physics, 3D transforms
- **Accessibility**: `@media (prefers-reduced-motion)` support in index.css

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

## Key Files & Their Purpose

### Configuration

- `src/config.jsx`: Backend URL, social links, RPG quotes (264 lines of themed quotes)
- `src/i18n.js`: i18next setup with localStorage persistence
- `tailwind.config.js`: Custom flame animations for medieval effects

### Core Components

- `src/App.jsx`: Router + language selector + auth state management
- `src/components/Navbar.jsx`: Responsive nav with language switcher button (no AnimatePresence - uses CSS)
- `src/components/LanguageSelector.jsx`: Modal for language selection (optimized - no Framer Motion)
- `src/components/TableList.jsx`: WebSocket-connected real-time table display
- `src/components/EventList.jsx`: Event grid with browser compatibility checks

### Data Flow Components

- `AdminDashboard.jsx`: Protected route for table/player CRUD operations
- `RegistrationForm.jsx`: Player registration with validation
- `TableDetailPage.jsx`: WebSocket consumer for real-time seat availability

## Integration Points

### Backend Communication

```javascript
// Standard fetch pattern with error handling
const backendUrl = config.backendUrl;
fetch(`${backendUrl}/api/tables`)
  .then(res => res.json())
  .then(data => /* handle data */);

// Admin endpoints require API key
headers: {
  'Content-Type': 'application/json',
  'X-API-Key': localStorage.getItem('apiKey')
}
```

### WebSocket Pattern (see TableDetailPage.jsx)

```javascript
const ws = new WebSocket(`wss://api.emurpg.com/ws/table/${slug}`);
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update local state
};
```

### localStorage Keys

- `selectedLanguage`: "en" | "tr"
- `login`: JSON with `expirationTime` timestamp
- `apiKey`: Admin session token

## Common Gotchas

1. **Navbar duplication**: HomePage renders `<Navbar />` twice (bug or feature?)
2. **Language selector**: Must accept `onLanguageSelect` callback, NOT `onLanguageSwitch`
3. **PropTypes**: Always add PropTypes validation to prevent lint errors
4. **Animation imports**: Don't import `motion` or `AnimatePresence` from framer-motion anymore (performance optimization)
5. **Translation coverage**: Not all pages fully translated yet - HomePage and EventsPage are complete
6. **Config DEV flag**: Remember to set `DEV = false` before production build

## Testing & Debugging

- No test suite currently exists
- Dev server accessible on network with `--host` flag for mobile testing
- Use browser DevTools for WebSocket debugging (Network > WS tab)
- Backend logs available at api.emurpg.com (admin access required)

## Design System

- **Primary color**: Yellow-500/600 (medieval gold)
- **Background**: Gray-900 (dark medieval theme)
- **Accent**: Yellow-400 for highlights
- **Icons**: react-icons (FaDiceD20, FaGlobe, FaGithub, etc.)
- **Fonts**: "Metamorphous" (Google Fonts) for medieval aesthetic
- **Responsive breakpoints**: Tailwind defaults (sm, md, lg, xl)

## When Adding Features

1. Add translations to BOTH `en.json` and `tr.json`
2. Pass `onLanguageSwitch` if component uses Navbar
3. Use PropTypes validation
4. Prefer CSS animations over Framer Motion
5. Export new components through `src/components/index.jsx`
6. Follow existing naming: PascalCase for components, camelCase for utilities
7. **Never use emojis** - Not in code comments, console logs, error messages, documentation, or user-facing text
