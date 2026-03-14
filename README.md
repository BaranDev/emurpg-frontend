<div align="center">

# EMURPG Frontend

**Event management platform for the Eastern Mediterranean University RPG Club**

[![GitHub License](https://img.shields.io/github/license/barandev/emurpg-frontend?style=for-the-badge)](LICENSE)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/barandev/emurpg-frontend?style=for-the-badge)](https://github.com/BaranDev/emurpg-frontend/releases)
[![GitHub last commit](https://img.shields.io/github/last-commit/barandev/emurpg-frontend?style=for-the-badge)](https://github.com/BaranDev/emurpg-frontend/commits/main)

[Live Site](https://www.emurpg.com) | [Backend Repository](https://github.com/BaranDev/emurpg-backend)

</div>

---

## Table of Contents

- [EMURPG Frontend](#emurpg-frontend)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Running the Dev Server](#running-the-dev-server)
    - [Building for Production](#building-for-production)
    - [All Scripts](#all-scripts)
  - [Project Structure](#project-structure)
  - [Architecture](#architecture)
    - [Routing](#routing)
    - [State Management](#state-management)
    - [Component Organization](#component-organization)
    - [Barrel Exports](#barrel-exports)
  - [Features](#features)
    - [Game Table Management](#game-table-management)
    - [EMUCON Convention Management](#emucon-convention-management)
    - [Charroller -- AI Character Sheet Companion](#charroller----ai-character-sheet-companion)
    - [Admin Dashboard](#admin-dashboard)
    - [Real-Time Updates (WebSockets)](#real-time-updates-websockets)
    - [Internationalization (i18n)](#internationalization-i18n)
    - [Cloudflare R2 Image Storage](#cloudflare-r2-image-storage)
  - [Design System](#design-system)
    - [Theme \& Colors](#theme--colors)
    - [Typography](#typography)
    - [Animations \& Performance](#animations--performance)
    - [Accessibility](#accessibility)
    - [Custom Tailwind Extensions](#custom-tailwind-extensions)
  - [Backend Integration](#backend-integration)
    - [API Communication](#api-communication)
    - [WebSocket Pattern](#websocket-pattern)
    - [Authentication Flow](#authentication-flow)
    - [API Endpoints Reference](#api-endpoints-reference)
  - [Component Reference](#component-reference)
    - [Pages](#pages)
    - [Shared Components](#shared-components)
    - [Admin Components](#admin-components)
    - [EMUCON Components](#emucon-components)
    - [Charroller Components](#charroller-components)
  - [Hooks \& Contexts](#hooks--contexts)
    - [`useToast` Hook (`src/hooks/useToast.js`)](#usetoast-hook-srchooksusetoastjs)
    - [`GlobalAudioContext` (`src/contexts/GlobalAudioContext.jsx`)](#globalaudiocontext-srccontextsglobalaudiocontextjsx)
  - [Utilities](#utilities)
    - [`auth.js` (`src/utils/auth.js`)](#authjs-srcutilsauthjs)
    - [`characterStorage.js` (`src/utils/characterStorage.js`)](#characterstoragejs-srcutilscharacterstoragejs)
  - [Data \& Assets](#data--assets)
    - [Mock Data (`src/data/emuconMockData.js`)](#mock-data-srcdataemuconmockdatajs)
    - [Static Assets](#static-assets)
  - [Testing](#testing)
  - [SEO \& Analytics](#seo--analytics)
  - [Conventions \& Guidelines](#conventions--guidelines)
    - [Code Style](#code-style)
    - [Styling](#styling)
    - [Performance](#performance)
    - [Translation](#translation)
  - [Known Gotchas](#known-gotchas)
  - [Changelog](#changelog)
    - [\[Unreleased\] — 2026-03-09](#unreleased--2026-03-09)
      - [Refactor](#refactor)
      - [CI / Testing](#ci--testing)
    - [\[Unreleased\] — 2026-03-08](#unreleased--2026-03-08)
      - [Features](#features-1)
      - [Style](#style)
    - [2026-03-07](#2026-03-07)
      - [Features](#features-2)
      - [Fixes](#fixes)
      - [Refactor](#refactor-1)
      - [Style](#style-1)
      - [Chore](#chore)
    - [2026-03-05](#2026-03-05)
      - [Features](#features-3)
      - [Fixes](#fixes-1)
    - [2026-03-04](#2026-03-04)
      - [Features](#features-4)
      - [Fixes](#fixes-2)
    - [2026-02-17](#2026-02-17)
      - [Features](#features-5)

---

## Overview

React + Vite single-page application for the EMURPG Club's event ecosystem. The platform handles game table management, player registration, real-time seat tracking, EMUCON convention logistics, and an AI-powered character sheet tool (Charroller). It communicates with a FastAPI backend at `api.emurpg.com` and stores media assets on Cloudflare R2.

The visual identity follows a medieval/fantasy RPG theme with gold accents, dark backgrounds, and thematic fonts.

---

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React 18 | UI component library |
| **Build Tool** | Vite 5 | Dev server + production bundler |
| **Styling** | Tailwind CSS 3 | Utility-first CSS framework |
| **Routing** | React Router DOM 6 | Client-side routing |
| **i18n** | i18next + react-i18next | English/Turkish translations |
| **Icons** | lucide-react, react-icons | SVG icon libraries |
| **UI Library** | Ant Design (antd) 5 | Admin panel form components |
| **Animation** | CSS animations (preferred), Framer Motion (legacy) | Transitions and effects |
| **Audio** | react-h5-audio-player | Charroller ambient music |
| **Auth** | js-sha256 | Client-side password hashing |
| **Styling (alt)** | styled-components, @emotion/react | Component-scoped CSS |
| **Carousel** | react-slick + slick-carousel | Image/content carousels |
| **Social** | react-social-media-embed | Instagram embed grid |
| **IDs** | nanoid | Unique identifier generation |
| **Testing** | Vitest + React Testing Library | Unit/component testing |
| **Linting** | ESLint 9 + react/react-hooks plugins | Code quality |
| **CSS Processing** | PostCSS + Autoprefixer | CSS transforms |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- Backend server running (locally at `localhost:8000` or remotely at `api.emurpg.com`)

### Installation

```bash
git clone https://github.com/BaranDev/emurpg-frontend.git
cd emurpg-frontend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Set to "true" to point API calls to localhost:8000 instead of api.emurpg.com
VITE_DEV=true

# Set to "true" to enable Cloudflare R2 image upload features in admin panel
VITE_ENABLE_R2=false
```

| Variable | Values | Description |
|----------|--------|-------------|
| `VITE_DEV` | `"true"` / `"false"` | Toggles backend URL between `localhost:8000` (dev) and `api.emurpg.com` (prod) |
| `VITE_ENABLE_R2` | `"true"` / `"false"` | Enables R2 image upload widgets in admin panels |

These are read in `src/config.jsx` via `import.meta.env`.

### Running the Dev Server

```bash
npm run dev
```

This starts Vite with the `--host` flag, making the dev server accessible on the local network (useful for mobile testing).

### Building for Production

```bash
npm run build     # Creates optimized bundle in dist/
npm run preview   # Preview the production build locally
npm start         # Serve the dist/ folder with the 'serve' package
```

### All Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite --host` | Development server (network accessible) |
| `build` | `vite build` | Production build |
| `preview` | `vite preview` | Preview production build |
| `start` | `serve -s dist` | Serve production build |
| `start_local` | `vite` | Dev server (localhost only) |
| `test` | `vitest run` | Run tests once |
| `test:watch` | `vitest` | Run tests in watch mode |
| `test:ui` | `vitest --ui` | Vitest browser UI dashboard |
| `lint` | `eslint .` | Lint all files |

---

## Project Structure

```
emurpg-frontend/
├── public/
│   ├── robots.txt                     # Crawler rules
│   ├── sitemap.xml                    # SEO sitemap
│   └── vite.svg                       # Vite favicon
├── src/
│   ├── index.jsx                      # React root (StrictMode + medieval bg)
│   ├── index.css                      # Global styles, base layer, animations
│   ├── App.jsx                        # Router, auth state, i18n provider
│   ├── config.jsx                     # Backend URL, social links, RPG quotes
│   ├── i18n.js                        # i18next setup with localStorage
│   ├── App.css                        # Supplementary styles
│   ├── assets/
│   │   ├── images/                    # Parallax clouds, forest silhouettes
│   │   ├── logo/                      # 7 logo color variants (PNG)
│   │   ├── member_photos/             # Team member profile pictures
│   │   └── sound/
│   │       └── tavern-ambient.mp3     # Charroller background music
│   ├── components/
│   │   ├── index.jsx                  # Barrel exports (all shared + Charroller)
│   │   ├── Admin/
│   │   │   ├── index.jsx              # Admin barrel exports
│   │   │   ├── AdminLogin.jsx         # Login form (EMURPG + EMUCON manager)
│   │   │   ├── AdminMain.jsx          # New admin shell (sidebar layout)
│   │   │   ├── AdminLayout.jsx        # Sidebar navigation + responsive menu
│   │   │   ├── AdminHeader.jsx        # Admin top bar
│   │   │   ├── AdminSidebar.jsx       # Sidebar component
│   │   │   ├── EventsAdminPanel.jsx   # Events CRUD
│   │   │   ├── TablesAdminPanel.jsx   # Tables CRUD
│   │   │   ├── GamesLibraryPanel.jsx  # Games library + R2 image upload
│   │   │   ├── ThemesAdminPanel.jsx   # Table themes management
│   │   │   ├── TeamMembersPanel.jsx   # Team member management
│   │   │   ├── RegistrationsPanel.jsx # Player registration viewer
│   │   │   ├── ReportsPanel.jsx       # Reports/analytics
│   │   │   ├── AnalyticsPanel.jsx     # Dashboard metrics
│   │   │   ├── AdminAccountsPanel.jsx # Admin account management
│   │   │   ├── Emucon/
│   │   │   │   ├── index.jsx          # EMUCON admin barrel exports
│   │   │   │   ├── EmuconAdminPanel.jsx
│   │   │   │   ├── EmuconManagerDashboard.jsx
│   │   │   │   ├── EmuconManagersPanel.jsx
│   │   │   │   └── EmuconSchedulePanel.jsx
│   │   │   └── shared/
│   │   │       ├── index.jsx          # Shared admin barrel exports
│   │   │       ├── AdminButton.jsx    # Themed button with variants
│   │   │       ├── AdminModal.jsx     # Reusable modal dialog
│   │   │       ├── ConfirmDialog.jsx  # Confirmation prompt
│   │   │       ├── LoadingSpinner.jsx # Loading indicator
│   │   │       └── Toast.jsx          # Notification toast
│   │   ├── Charroller/
│   │   │   ├── index.jsx              # Charroller barrel exports
│   │   │   ├── CharacterCard.jsx      # Character display in sidebar
│   │   │   ├── CharrollerBackground.jsx # Blue forest parallax
│   │   │   ├── CharrollerDescribe.jsx # AI description input form
│   │   │   ├── CharrollerFooter.jsx   # Charroller page footer
│   │   │   ├── CharrollerManager.jsx  # Character grid + actions
│   │   │   ├── CharrollerNavbar.jsx   # Charroller-themed navbar
│   │   │   ├── CharrollerResults.jsx  # Gameplay view with dice rolls
│   │   │   ├── CharrollerSystemSelector.jsx # TTRPG system picker
│   │   │   ├── CharrollerUpload.jsx   # PDF character sheet upload
│   │   │   ├── DiceRoller.jsx         # 3D CSS animated dice
│   │   │   ├── LevelUpChoices.jsx     # Level-up choice selector
│   │   │   ├── MusicPlayer.jsx        # Audio player controls
│   │   │   ├── SettingsPanel.jsx      # Admin code, sound, export/import
│   │   │   ├── TavernBackground.jsx   # Warm tavern parallax
│   │   │   └── TavernPlayer.jsx       # Music control widget
│   │   ├── Emucon/
│   │   │   ├── index.jsx              # EMUCON component barrel exports
│   │   │   ├── EmuconHero.jsx         # Hero section
│   │   │   ├── EmuconNavbar.jsx       # EMUCON-themed navigation
│   │   │   ├── EmuconSchedule.jsx     # Detailed event schedule
│   │   │   ├── EmuconParallax.jsx     # EMUCON parallax background
│   │   │   ├── EmuconFooter.jsx       # EMUCON footer
│   │   │   ├── EmuconContactGrid.jsx  # Contact/sponsor grid
│   │   │   ├── EmuconContentCard.jsx  # Content display card
│   │   │   ├── EmuconDivider.jsx      # Visual divider
│   │   │   ├── EmuconFeatureCard.jsx  # Feature highlight card
│   │   │   ├── EmuconIcons.jsx        # Corner icon components
│   │   │   ├── EmuconSectionHeader.jsx # Section title styling
│   │   │   ├── EmuconStatsRow.jsx     # Stats display
│   │   │   ├── LiveCornerCarousel.jsx # Live event status carousel
│   │   │   ├── SponsorHero.jsx        # Sponsor tier display
│   │   │   ├── SponsorBenefitCard.jsx # Sponsor benefit card
│   │   │   ├── SponsorTierCard.jsx    # Sponsorship tier card
│   │   │   └── SponsorContactCTA.jsx  # Sponsor contact CTA
│   │   ├── layout/                    # Navigation & footer wrappers
│   │   │   ├── Navbar.jsx             # Primary navigation bar
│   │   │   ├── MainFooter.jsx         # Main site footer
│   │   │   ├── BottomNavBar.jsx       # Mobile bottom nav
│   │   │   └── EventsFooter.jsx       # Events page footer
│   │   ├── shared/                    # Reusable UI atoms
│   │   │   ├── SectionTitle.jsx       # Styled section heading
│   │   │   ├── SocialButton.jsx       # Social media link button
│   │   │   ├── SocialIcon.jsx         # Small social icon button
│   │   │   ├── FireButton.jsx         # CTA with flame animation
│   │   │   ├── ParallaxBackground.jsx # Forest/cloud parallax
│   │   │   ├── InstagramGrid.jsx      # Instagram embed grid
│   │   │   ├── LanguageSelector.jsx   # Language choice modal
│   │   │   └── ErrorBoundary.jsx      # React error boundary
│   │   ├── events/                    # Events domain components
│   │   │   ├── EventCard.jsx          # Single event preview
│   │   │   ├── EventList.jsx          # WebSocket-connected event list
│   │   │   ├── HomePageEventList.jsx  # Homepage event preview
│   │   │   ├── RegistrationForm.jsx   # Player table registration
│   │   │   └── GeneralEventRegistrationForm.jsx # Event-wide registration
│   │   ├── tables/                    # Tables domain components
│   │   │   ├── TableList.jsx          # Game tables with WebSocket
│   │   │   ├── GameMasterCard.jsx     # GM profile card (lazy loaded)
│   │   │   └── GameGuideModal.jsx     # Game rules/info modal
│   │   └── index.jsx                  # Barrel — re-exports all shared components
│   ├── contexts/
│   │   └── GlobalAudioContext.jsx     # Persistent audio for Charroller
│   ├── data/
│   │   └── emuconMockData.js          # Mock data for EMUCON demo mode
│   ├── hooks/
│   │   └── useToast.js                # Toast notification hook
│   ├── locales/
│   │   ├── en.json                    # English translations
│   │   └── tr.json                    # Turkish translations
│   ├── pages/                         # One file per App.jsx route
│   │   ├── HomePage.jsx               # /
│   │   ├── EventsPage.jsx             # /events
│   │   ├── TableDetailPage.jsx        # /table/:slug
│   │   ├── EmuconRulesPage.jsx        # /emucon/rules
│   │   ├── NotFound.jsx               # * (404)
│   │   ├── Privacy.jsx                # /privacy
│   │   ├── Admin/
│   │   │   └── index.jsx              # /admin (auth state + login gate)
│   │   ├── Charroller/
│   │   │   ├── Landing.jsx            # /charroller
│   │   │   └── Manager.jsx            # /charroller/manager
│   │   └── Emucon/
│   │       ├── ThankYou.jsx           # /emucon, /emucon/live, /emucon/register/:token
│   │       ├── Sponsors.jsx           # /emucon/sponsors
│   │       ├── DemoHome.jsx           # /demo/emucon
│   │       └── DemoLive.jsx           # /demo/emucon/live
│   ├── test/
│   │   ├── setup.js                   # Vitest setup (@testing-library/jest-dom)
│   │   ├── fixtures/                  # Test mock data
│   │   ├── CharrollerResults.high.test.jsx
│   │   ├── CharrollerResults.medium.test.jsx
│   │   └── CharrollerResults.low.test.jsx
│   └── utils/
│       ├── auth.js                    # Session & API key management
│       └── characterStorage.js        # Character CRUD + localStorage
├── docs/
│   └── plans/                         # Design documents & plans
├── trash/                             # Archived/deprecated code
├── index.html                         # HTML entry point with SEO meta tags
├── e2e/
│   └── smoke.spec.js                  # Playwright smoke tests (all 15 routes)
├── playwright.config.js               # Playwright config (webServer: vite preview)
├── vite.config.js                     # Vite + Vitest configuration
├── tailwind.config.js                 # Custom theme (colors, fonts, keyframes)
├── postcss.config.js                  # PostCSS with Tailwind + Autoprefixer
├── eslint.config.js                   # ESLint flat config
└── package.json                       # Dependencies and scripts
```

---

## Architecture

### Routing

All routes are declared in `src/App.jsx` using React Router v6:

| Route | Component | Auth | Description |
|-------|----------|------|-------------|
| `/` | `HomePage` | Public | Landing page with team section, events preview, social links |
| `/events` | `EventsPage` | Public | Full event listing with WebSocket updates |
| `/table/:slug` | `TableDetailPage` | Public | Individual table details + player registration |
| `/admin` | `AdminPage` | Protected | Admin page — handles login gate, renders `AdminLogin` / `AdminMain` / `EmuconManagerDashboard` based on auth state |
| `/emucon` | `EmuconThankYou` | Public | EMUCON event page |
| `/emucon/live` | `EmuconThankYou` | Public | Live event board |
| `/emucon/sponsors` | `EmuconSponsors` | Public | Sponsor tiers and benefits |
| `/emucon/rules` | `EmuconRulesPage` | Public | Event rules (bilingual) |
| `/emucon/register/:token` | `EmuconThankYou` | Token | Token-based event registration |
| `/charroller` | `Charroller/Landing` | Public | Character tool landing (with audio) |
| `/charroller/manager` | `Charroller/Manager` | Public | Character manager (with audio) |
| `/demo/emucon` | `EmuconDemoHome` | Public | Demo EMUCON without backend |
| `/demo/emucon/live` | `EmuconDemoLive` | Public | Demo live board with mock data |
| `/privacy` | `Privacy` | Public | Privacy policy |
| `*` | `NotFound` | Public | 404 page |

Charroller routes are wrapped in `<GlobalAudioProvider>` to persist ambient music across navigation.

### State Management

The application uses React hooks for local state. There is no global state library (Redux, Zustand, etc.). State flows top-down:

```
App.jsx (pure router)
└── onLanguageSwitch callback → Pages → Navbar

pages/Admin/index.jsx (auth owner)
├── Auth: localStorage("login", "apiKey") with TTL expiration
└── Admin Type: "emurpg" | "emucon_manager" (determines dashboard view)
```

**localStorage Keys:**

| Key | Type | Description |
|-----|------|-------------|
| `selectedLanguage` | `"en"` \| `"tr"` | User's language preference |
| `login` | JSON | Session data with `expirationTime`, `adminType`, `clubId`, `clubName` |
| `apiKey` | String | Admin API key for protected endpoints |
| `emurpg_characters` | JSON | Charroller saved characters array |
| `emurpg_charroller_settings` | JSON | Charroller settings (volume, admin code) |

### Component Organization

Components follow a domain-based subfolder structure. All shared components are re-exported from `src/components/index.jsx`.

```
components/
├── layout/          # Navbar, MainFooter, BottomNavBar, EventsFooter
├── shared/          # UI atoms: SectionTitle, FireButton, ParallaxBackground, etc.
├── events/          # EventCard, EventList, RegistrationForm, etc.
├── tables/          # TableList, GameMasterCard, GameGuideModal
├── Charroller/      # Character sheet tool components
├── TavernRun/       # Tavern Run scenario components
└── Admin/           # Admin panel components
    ├── Emucon/      # EMUCON-specific admin components
    └── shared/      # Reusable admin UI primitives
```

**Standard component pattern:**

```jsx
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const MyComponent = ({ prop1, onCallback }) => {
  const { t } = useTranslation();
  // ...
};

MyComponent.propTypes = {
  prop1: PropTypes.string.isRequired,
  onCallback: PropTypes.func,
};

export default MyComponent;
```

### Barrel Exports

All shared components export through `src/components/index.jsx`:

```jsx
// Always import from the barrel:
import { Navbar, EventList, FireButton } from "../components";

// Charroller components are also re-exported:
import { CharrollerResults, DiceRoller } from "../components";

// Admin components have their own barrel:
import { AdminLogin, AdminMain } from "../components/Admin";

// EMUCON admin components:
import { EmuconManagerDashboard } from "../components/Admin/Emucon";
```

---

## Features

### Game Table Management

Core event management workflow for the RPG club:

- **Event Creation**: Admins create events with dates, descriptions, and table configurations
- **Table Management**: Each event has tables with game name, game master, player quota, and theme
- **Player Registration**: Public registration forms with validation, club selection, and terms acceptance
- **Real-Time Seats**: WebSocket-connected seat availability that updates live
- **CSV Export**: Export table and player data for offline analysis
- **Table Themes**: Visual themes applied to table cards (stored in R2 or as presets)

### EMUCON Convention Management

Full convention management for the EMU Club Convention:

**Public Pages:**
- Landing page with corners directory, club listings, and statistics
- Interactive schedule with time-slot based layout
- Live event status board with corner carousel
- Token-based registration with shareable invite links
- Event rules page (bilingual EN/TR)
- Sponsor tiers and benefits page

**Themed Corners:** Entertainment, Diversity, Health & Lifestyle, Art & Creativity, Technology & Science, Stage, Awareness, Folk & Social, and more.

**Admin Features:**
- Full CRUD for corners, clubs, events, and schedules
- EMUCON-specific manager login (separate from main admin)
- Club manager dashboard scoped to their own club
- Staff assignment to activities

**Demo Mode:** `/demo/emucon` and `/demo/emucon/live` routes work without a backend using mock data from `src/data/emuconMockData.js`.

### Charroller -- AI Character Sheet Companion

An AI-powered tool for tabletop RPG players (BETA):

**Character Creation:**
- **AI Generation**: Describe a character in plain text and get a complete roll list with all skills, attacks, and saves
- **PDF Upload**: Upload existing character sheet PDFs (D&D 5e, Pathfinder 2e, Call of Cthulhu, Fate Core) for automatic roll extraction
- **Rate Limiting**: 4 free AI creations per day (admin bypass available)

**Supported Systems:**

| System | Features |
|--------|----------|
| **D&D 5e** | HP + Temp HP, Death Saves (3 success/3 fail), Conditions |
| **Pathfinder 2e** | HP, Focus Points, Hero Points (max 3), Conditions |
| **Call of Cthulhu** | Sanity, Luck, Magic Points, HP, Wounds |
| **Fate Core** | Fate Points, Physical/Mental Stress, Consequences (mild/moderate/severe) |

**Character Management:**
- Save unlimited characters to browser localStorage
- Portraits and metadata per character
- Export/import characters as JSON
- Play count and last-played tracking
- Instant dice rolling with modifiers and critical detection (3D CSS animated dice)

**Themed Experience:**
- Landing page: Blue magical forest with parallax (moon, stars, fireflies, trees, dice, scrolls)
- Manager page: Warm tavern with candlelight effects and floating dust particles
- Ambient music: Persistent across navigation via `GlobalAudioContext`

### Admin Dashboard

Sidebar-organized admin panel (`AdminMain` + `AdminLayout`):

**Navigation Sections:**

| Section | Panels |
|---------|--------|
| *(ungrouped)* | Dashboard |
| **EMURPG** | Events, Tables, Table Themes, Games Library |
| **EMUCON** | Corners, Managers, Schedule |
| **Management** | Registrations, Reports, Analytics, Team Members, Admin Accounts |

**Features:**
- Responsive sidebar (collapsible on desktop, bottom sheet on mobile)
- Breadcrumb navigation
- Toast notifications via `useToast` hook
- Shared UI primitives: `AdminButton`, `AdminModal`, `ConfirmDialog`, `LoadingSpinner`, `Toast`

**Auth Types:**
- `emurpg` -- Full admin access to all panels
- `emucon_manager` -- Scoped to their club's EMUCON dashboard

### Real-Time Updates (WebSockets)

Three WebSocket connections for live data:

| Endpoint | Used In | Updates |
|----------|---------|---------|
| `/ws/updates` | `EventList`, `TableDetailPage` | Table availability, player counts |
| `/ws/updates` | `EventsAdminPanel` | Admin event data sync |

**Connection Pattern:**
- Auto-reconnect on disconnect (with guard against duplicate connections)
- Graceful fallback when backend is offline
- Browser compatibility check (`window.WebSocket`)

### Internationalization (i18n)

Bilingual support (English and Turkish) using i18next:

- **Translation files**: `src/locales/en.json` and `src/locales/tr.json`
- **Key structure**: `"section.subsection.key"` (e.g., `navbar.events`, `charroller.landing.title`)
- **First-time flow**: `LanguageSelector` modal appears if no `selectedLanguage` in localStorage
- **Persistence**: Language choice saved to localStorage, restored on reload
- **Fallback**: English (`en`) when translation key is missing

```jsx
import { useTranslation } from "react-i18next";
const { t } = useTranslation();
t("events_page.title");
```

**Coverage:**
- HomePage, EventsPage, Navbar -- complete
- Charroller sections -- complete
- Admin panels -- complete
- Some EMUCON pages -- partial

### Cloudflare R2 Image Storage

When `VITE_ENABLE_R2=true`, admin panels show image upload widgets:

- **Games Library**: Upload game cover images (optimized to WebP server-side)
- **Team Members**: Profile photo uploads
- **Table Themes**: Theme background images
- Upload endpoint: `POST /api/admin/games/upload` (returns R2 public URL)
- Automatic cleanup of old R2 images on update/delete

---

## Design System

### Theme & Colors

Medieval RPG aesthetic with gold accents on dark backgrounds:

| Token | Value | Usage |
|-------|-------|-------|
| **Primary** | `yellow-500` / `yellow-600` | CTAs, headings, active states |
| **Accent** | `yellow-400` | Highlights, links |
| **Background** | `gray-900` | Page background |
| **Surface** | `gray-800` | Cards, panels |
| **Text** | `gray-100` | Primary text |
| **Medieval pattern** | SVG cross-hatch | App wrapper background |

**Extended palette in `tailwind.config.js`:**

| Group | Colors | Usage |
|-------|--------|-------|
| `forest-*` | dark, deep, medium, light, glow | EMUCON nature theme |
| `arcane-*` | dark, deep, medium, light, glow, mist | Charroller blue theme |
| `silver-*` | DEFAULT, light, dark | Metallic accents |
| `gold-*` | DEFAULT, light, dark | Gold metallic accents |
| `tavern-*` | wood, parchment, candleGlow, ale, leather, stone | Charroller tavern theme |
| `emucon-*` | text-primary, text-secondary, text-muted | EMUCON text hierarchy |
| `cream` | `#f5f2e8` | Parchment-like backgrounds |

### Typography

| Font | Source | Usage |
|------|--------|-------|
| **Metamorphous** | Google Fonts | Primary medieval body font |
| **Cinzel** | Google Fonts | Charroller headings, archaic feel |
| System stack | Fallback | `system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto...` |

### Animations & Performance

**Optimization principle:** CSS animations are preferred over JavaScript animation libraries for low-end device performance.

**Available CSS animations (defined in `src/index.css`):**

| Class | Animation | Duration |
|-------|-----------|----------|
| `.animate-fadeIn` | Opacity 0 to 1 | 0.2s ease-out |
| `.animate-scaleIn` | Scale 0.95 to 1 + fade | 0.3s ease-out |
| `.animate-slideDown` | TranslateY -100% to 0 + fade | 0.2s ease-out |

**Tailwind animations (defined in `tailwind.config.js`):**

| Class | Animation | Duration |
|-------|-----------|----------|
| `animate-flame-dance` | ScaleY + translateY bounce | 2s infinite |
| `animate-flame-dance-delay` | Flame variant (delayed) | 2.5s infinite |
| `animate-flame-dance-slow` | Slower flame variant | 3s infinite |

**Rules:**
- Use CSS classes (`animate-fadeIn`, `animate-scaleIn`, `transition-*`) for transitions
- Avoid importing `motion` or `AnimatePresence` from framer-motion (being phased out)
- GPU-compositable properties only: `transform`, `opacity`

### Accessibility

- `@media (prefers-reduced-motion: reduce)` disables all animations and transitions
- `html.modal-open nav { display: none; }` hides navigation when modals are active
- Keyboard navigation support
- Semantic HTML with ARIA attributes where applicable
- `loading="lazy"` and `decoding="async"` on below-the-fold images

### Custom Tailwind Extensions

Custom Tailwind tokens are configured in `tailwind.config.js`:

```js
// Custom font family
fontFamily: {
  cinzel: ["Cinzel", "serif"],
}

// Custom flame keyframes for medieval fire effects
keyframes: {
  "flame-dance": { ... },
  "flame-dance-delay": { ... },
  "flame-dance-slow": { ... },
}
```

---

## Backend Integration

### API Communication

All HTTP requests use the native `fetch` API (no Axios despite being listed in the old docs):

```javascript
import config from "../config";

// Standard GET pattern
const response = await fetch(`${config.backendUrl}/api/tables`);
const data = await response.json();

// Admin endpoints require API key header
const response = await fetch(`${config.backendUrl}/api/admin/tables`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": localStorage.getItem("apiKey"),
  },
  body: JSON.stringify(payload),
});
```

**Backend URL resolution (from `src/config.jsx`):**
- `VITE_DEV=true` -- `http://localhost:8000`
- `VITE_DEV=false` -- `https://api.emurpg.com`

CORS is configured server-side; no Vite proxy is needed.

### WebSocket Pattern

```javascript
const connectWebSocket = () => {
  const socket = new WebSocket(`${config.backendUrl}/ws/updates`);

  socket.onopen = () => console.log("WebSocket connected");

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Update local state with fresh data
  };

  socket.onclose = () => {
    // Auto-reconnect logic with guard flag
    if (!wsConnected.current) connectWebSocket();
  };

  socket.onerror = () => {
    console.log("WebSocket error - backend may be offline");
  };
};
```

The URL protocol (`ws://` or `wss://`) is inferred from the `backendUrl` (`http://` becomes `ws://`, `https://` becomes `wss://` via the browser).

### Authentication Flow

1. Admin visits `/admin` -- sees `<AdminLogin>`
2. Login form hashes password with `js-sha256` and sends to `/api/admin/login`
3. Backend validates and returns API key + admin type
4. Frontend stores `apiKey` and `login` (with 30-min TTL) in localStorage
5. Subsequent admin API calls include `X-API-Key` header
6. On page reload, `App.jsx` checks if login data exists and hasn't expired
7. Expired sessions auto-clear localStorage

**Admin types:**
- `emurpg` -- Full admin, sees `<AdminMain>` with all panels
- `emucon_manager` -- Sees `<EmuconManagerDashboard>` scoped to their club

### API Endpoints Reference

**Public Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/events` | List all events |
| `GET` | `/api/tables` | List all game tables |
| `GET` | `/api/table/{slug}` | Get specific table details |
| `GET` | `/api/team-members` | Get team members |
| `GET` | `/api/games` | List game library |
| `GET` | `/api/emucon/corners` | EMUCON corners data |
| `GET` | `/api/emucon/schedule` | EMUCON schedule |
| `WS` | `/ws/updates` | Real-time event/table updates |

**Admin Endpoints (require `X-API-Key` header):**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Admin authentication |
| `POST` | `/api/admin/create_table` | Create game table |
| `PUT` | `/api/admin/update_table` | Update game table |
| `POST` | `/api/admin/add_player` | Add player to table |
| `DELETE` | `/api/admin/delete_player` | Remove player from table |
| `POST` | `/api/admin/games/upload` | Upload game image to R2 |
| `PUT` | `/api/admin/games/{game_id}` | Update game record |
| `DELETE` | `/api/admin/games/{game_id}` | Delete game + R2 image |
| `*` | `/api/admin/emucon/*` | EMUCON admin operations |

---

## Component Reference

### Pages

| Component | Route | Description |
|-----------|-------|-------------|
| `HomePage` | `/` | Landing with hero, team section (lazy-loaded with IntersectionObserver), events preview, dice roll quotes (200+ pop-culture references), and social CTAs |
| `EventsPage` | `/events` | Event listing with WebSocket-connected `EventList`, error boundary |
| `TableDetailPage` | `/table/:slug` | Individual table with live seat tracking, player registration form, game master info |
| `CharrollerLandingPage` | `/charroller` | Charroller intro with feature showcase, blue parallax background, autoplay ambient music |
| `CharrollerPage` | `/charroller/manager` | Sidebar character manager with create (AI/PDF), play, settings, and export workflows |
| `EmuconRulesPage` | `/emucon/rules` | EMUCON event rules with inline EN/TR language toggle |
| `Emucon/Home` | `/emucon` | Full EMUCON landing with schedule, stats, features, sponsors |
| `Emucon/Live` | `/emucon/live` | Live event status board with 11+ corner carousel |
| `Emucon/Register` | `/emucon/register/:token` | Token-gated event registration |
| `Emucon/Sponsors` | `/emucon/sponsors` | Sponsorship tiers and CTA |
| `Emucon/ThankYou` | (redirect target) | Post-registration confirmation |
| `Emucon/DemoHome` | `/demo/emucon` | Offline demo with mock data |
| `Emucon/DemoLive` | `/demo/emucon/live` | Demo live board with mock data |

### Shared Components

| Component | Description |
|-----------|-------------|
| `Navbar` | Responsive navigation with scroll-triggered style change, language switch button, mobile hamburger menu |
| `LanguageSelector` | First-visit modal for language selection (EN/TR), persists to localStorage |
| `EventList` | Fetches events + WebSocket connection for real-time updates, browser compatibility check |
| `TableList` | Game tables for selected event, WebSocket-connected, game theme display, guide modal trigger |
| `EventCard` | Single event card with stats (tables, players, dates) |
| `RegistrationForm` | Player signup with validation, club dropdown, terms checkbox |
| `GeneralEventRegistrationForm` | Event-wide registration (separate from per-table) |
| `GameMasterCard` | Team member card with photo (lazy loaded), name, title, CSS hover scale |
| `FireButton` | CTA button with flame animation effect |
| `GameGuideModal` | Modal overlay showing game rules and description |
| `ParallaxBackground` | Forest/cloud SVG parallax for homepage |
| `HomePageEventList` | Abbreviated event preview for homepage |
| `InstagramGrid` | Embedded Instagram posts grid |
| `MainFooter` | Site footer with copyright and social links |
| `EventsFooter` | Events-specific footer |
| `SocialButton` | Large social media link button |
| `SocialIcon` | Compact social icon (Discord, WhatsApp, GitHub, Globe) |
| `SectionTitle` | Styled heading with icon |
| `TestimonialCard` | Quote display card |
| `NewsCard` | News item with date, title, content |
| `ErrorBoundary` | React error boundary with fallback UI |
| `NotFound` | 404 page |
| `Privacy` | Privacy policy content |

### Admin Components

| Component | Description |
|-----------|-------------|
| `AdminLogin` | Dual login form (EMURPG admin + EMUCON club manager) |
| `AdminMain` | New admin shell with `AdminLayout` sidebar, panel routing |
| `AdminLayout` | Sidebar with grouped sections (EMURPG/EMUCON/Management), breadcrumb, responsive mobile menu |
| `AdminHeader` | Top bar with title and user actions |
| `AdminSidebar` | Left sidebar navigation |
| `EventsAdminPanel` | Events CRUD with WebSocket sync |
| `TablesAdminPanel` | Tables CRUD with player management |
| `GamesLibraryPanel` | Game library CRUD with R2 image upload (thumbnail preview, hover-to-remove) |
| `ThemesAdminPanel` | Table theme management |
| `TeamMembersPanel` | Team member profiles CRUD |
| `RegistrationsPanel` | View and manage player registrations |
| `ReportsPanel` | Reports and data export |
| `AnalyticsPanel` | Dashboard metrics and charts |
| `AdminAccountsPanel` | Admin account CRUD |

**Admin Shared Primitives:**

| Component | Description |
|-----------|-------------|
| `AdminButton` | Themed button with primary/secondary/danger variants, gradient backgrounds |
| `AdminModal` | Reusable modal with title, close button, and content slot |
| `ConfirmDialog` | Confirmation prompt with confirm/cancel actions |
| `LoadingSpinner` | Animated loading indicator |
| `Toast` | Notification banner (success/error/warning/info) |

**EMUCON Admin:**

| Component | Description |
|-----------|-------------|
| `EmuconAdminPanel` | Full admin for EMUCON events (corners, clubs, events, schedule) |
| `EmuconManagerDashboard` | Club-scoped dashboard for EMUCON managers |
| `EmuconManagersPanel` | Manage EMUCON club managers |
| `EmuconSchedulePanel` | Edit time periods and activity slots |

### EMUCON Components

| Component | Description |
|-----------|-------------|
| `EmuconHero` | Hero section with event branding |
| `EmuconNavbar` | EMUCON-themed navigation bar |
| `EmuconSchedule` | Detailed schedule with time slots and activities |
| `EmuconParallax` | Parallax background effect |
| `EmuconFooter` | EMUCON-branded footer |
| `EmuconContactGrid` | Contact information grid |
| `EmuconContentCard` | Generic content display card |
| `EmuconDivider` | Visual section divider |
| `EmuconFeatureCard` | Feature highlight card |
| `EmuconIcons` | SVG icon components for corner themes |
| `EmuconSectionHeader` | Styled section title |
| `EmuconStatsRow` | Statistics display (clubs, activities, participants) |
| `LiveCornerCarousel` | Carousel showing live/upcoming/completed status per corner |
| `SponsorHero` | Sponsor tier hero section |
| `SponsorBenefitCard` | Individual benefit description card |
| `SponsorTierCard` | Sponsorship tier pricing card |
| `SponsorContactCTA` | Sponsor contact call-to-action |

### Charroller Components

| Component | Description |
|-----------|-------------|
| `CharacterCard` | Character display in sidebar (portrait, system badge, play/delete) |
| `CharrollerBackground` | Blue magical forest parallax (SVG moon, stars, fireflies, dice, scrolls) |
| `CharrollerDescribe` | AI character description textarea with example prompts |
| `CharrollerFooter` | Charroller-branded footer |
| `CharrollerManager` | Character grid with usage tracking, create buttons, settings |
| `CharrollerNavbar` | Charroller-themed navigation with theme support |
| `CharrollerResults` | Gameplay view with categorized rolls, dice history, system-specific trackers |
| `CharrollerSystemSelector` | TTRPG system selection (D&D 5e, Pathfinder, CoC, Fate) with descriptions |
| `CharrollerUpload` | Drag-and-drop PDF upload with file type validation |
| `DiceRoller` | 3D CSS animated dice with critical success/fail visual effects |
| `LevelUpChoices` | Level-up choice selector (feats, subclass, etc.) |
| `MusicPlayer` | Audio player with play/pause/mute and volume |
| `SettingsPanel` | Admin code entry, sound controls, portrait toggle, JSON export/import |
| `TavernBackground` | Warm candlelight tavern parallax with floating dust particles |
| `TavernPlayer` | Fixed-position music control widget |

---

## Hooks & Contexts

### `useToast` Hook (`src/hooks/useToast.js`)

Manages toast notification state:

```jsx
const { toast, showToast, hideToast } = useToast();

showToast("Event created successfully", "success");
// toast = { isVisible: true, message: "...", type: "success" }

// Types: "success" | "error" | "warning" | "info"
```

### `GlobalAudioContext` (`src/contexts/GlobalAudioContext.jsx`)

Provides persistent audio playback across Charroller routes:

```jsx
const { isPlaying, volume, isMuted, isLoaded, play, pause, setVolume, setMuted } = useGlobalAudio();
```

- Audio element persists between component unmounts (singleton pattern)
- Syncs volume and mute state with `characterStorage.getSettings()`
- Automatically loads `tavern-ambient.mp3` for `/charroller` routes
- Used by wrapping routes in `<GlobalAudioProvider>` in `App.jsx`

---

## Utilities

### `auth.js` (`src/utils/auth.js`)

Session and API key management:

| Function | Description |
|----------|-------------|
| `getApiKey()` | Retrieve API key from localStorage |
| `setApiKey(apiKey)` | Store API key |
| `clearApiKey()` | Remove API key |
| `getLoginData()` | Get login info with expiration check |
| `setLoginData(data, expirationMinutes)` | Store login with TTL (default: 30 min) |
| `clearSession()` | Clear all auth data |
| `isLoggedIn()` | Boolean check with TTL validation |
| `getAdminType()` | Returns `"emurpg"` \| `"emucon_manager"` \| `null` |

### `characterStorage.js` (`src/utils/characterStorage.js`)

Charroller character CRUD operations backed by localStorage:

| Function | Description |
|----------|-------------|
| `generateId()` | Creates ID: `char_{timestamp}_{random}` |
| `getCharacters()` | Fetch all saved characters |
| `getCharacterById(id)` | Get single character |
| `saveCharacter(data, portraitUrl)` | Add new character |
| `updateCharacter(id, updates)` | Modify existing character |
| `markAsPlayed(id)` | Increment `play_count`, update `last_played` |
| `deleteCharacter(id)` | Remove character |
| `deleteAllCharacters()` | Wipe all characters |
| `exportCharacters()` | Download JSON backup |
| `importCharacters(file)` | Load characters from JSON file |
| `getSettings()` | Get Charroller settings (volume, admin code) |

**Character data model:**

```javascript
{
  id: "char_1709123456_abc123",
  name: "Thorin Oakenshield",
  system: "dnd5e",      // "dnd5e" | "pathfinder" | "cthulhu" | "fate"
  class: "Fighter",
  level: 5,
  portrait_url: "https://...",
  skills: { "Athletics": 7, "Perception": 3, ... },
  attacks: { "Longsword": { bonus: 7, damage: "1d8+4" }, ... },
  saves: { "Strength": 6, "Constitution": 5, ... },
  created_at: "2026-03-01T12:00:00.000Z",
  last_played: "2026-03-05T18:30:00.000Z",
  play_count: 3,
  updated_at: "2026-03-05T18:30:00.000Z"
}
```

---

## Data & Assets

### Mock Data (`src/data/emuconMockData.js`)

Provides mock API responses for EMUCON demo routes (`/demo/emucon/*`), enabling the live board and home page to function without a backend connection. Contains sample corners, clubs, events with statuses (`completed`, `live`, `upcoming`), timestamps, and participant counts.

### Static Assets

| Directory | Contents |
|-----------|----------|
| `src/assets/images/` | `cloud.png`, `forest-down-arrow.png`, `forest-silhouette.svg` (parallax) |
| `src/assets/logo/` | 7 logo variants: BLACK, DARKGRAY, LIGHTBLUE, LIGHTGRAY, ORIGINAL, WHITE, YELLOW (PNG) |
| `src/assets/member_photos/` | Team member profile pictures |
| `src/assets/sound/` | `tavern-ambient.mp3` (looping Charroller background music) |

---

## Testing

**Framework:** Vitest (Vite-native) + React Testing Library + jest-dom

**Setup:** `src/test/setup.js` imports `@testing-library/jest-dom` for DOM matchers.

**Existing Tests:**
- `CharrollerResults.high.test.jsx` -- High difficulty character scenarios
- `CharrollerResults.medium.test.jsx` -- Medium difficulty scenarios
- `CharrollerResults.low.test.jsx` -- Low difficulty scenarios
- `src/test/fixtures/` -- Mock data for tests

**Running Tests:**

```bash
npm run test         # Run unit tests once
npm run test:watch   # Unit tests in watch mode
npm run test:ui      # Browser-based Vitest dashboard
npm run test:e2e     # Playwright E2E smoke tests (requires built dist/)
```

**Vitest Configuration (in `vite.config.js`):**

```js
test: {
  globals: true,
  environment: "jsdom",
  setupFiles: "./src/test/setup.js",
  css: true,
}
```

**E2E Smoke Tests (Playwright):**

`e2e/smoke.spec.js` covers all 15 routes, verifying no React error boundaries trigger and the 404 page renders for unknown routes. Configured in `playwright.config.js` with `webServer: vite build && vite preview`.

**CI Pipeline (`.github/workflows/ci.yml`):**

Three jobs run on every PR and push to `main`:
1. `unit-tests` — `npm test`
2. `build` — `npm run build` (uploads `dist/` as artifact)
3. `e2e` — Playwright smoke tests against the build artifact

---

## SEO & Analytics

**Meta tags** are configured in `index.html`:
- OpenGraph: title, description, image, URL
- Twitter card: `summary_large_image`
- Description and keyword meta tags

**Sitemap** at `public/sitemap.xml` covers:
- `/` (weekly, priority 1.0)
- `/events` (daily, priority 0.8)
- `/emucon` (weekly, priority 0.9)
- `/emucon/rules` (monthly, priority 0.7)
- `/emucon/sponsors` (monthly, priority 0.7)

**Robots** at `public/robots.txt`: allows all crawlers, references sitemap.

**Google Analytics**: G-3R9QKBLJ00 (gtag.js loaded async in `index.html`).

---

## Conventions & Guidelines

### Code Style

- **Components**: PascalCase (`EventCard.jsx`)
- **Utilities**: camelCase (`characterStorage.js`)
- **Props validation**: Always add `PropTypes`
- **Translations**: `const { t } = useTranslation()` in every component that renders user-facing text
- **Imports**: Import shared components from the barrel (`../components`)
- **New components**: Export through `src/components/index.jsx`
- **Language switch**: Pass `onLanguageSwitch` callback from `App.jsx` through pages to `Navbar`

### Styling

- Use Tailwind CSS utility classes as the primary styling approach
- Prefer CSS animations (`.animate-fadeIn`, `transition-*`) over Framer Motion
- Follow the yellow-500/gray-900 medieval theme for public pages
- Admin panels use amber/gray tones with gradient buttons
- Charroller uses arcane blue (landing) and tavern brown (manager)
- EMUCON uses forest green / emerald / amber color system

### Performance

- `loading="lazy"` and `decoding="async"` on images below the fold
- IntersectionObserver for lazy-loading sections (e.g., team members on homepage)
- localStorage caching with stale-while-revalidate for team member data (1-hour TTL)
- CSS animations over JavaScript-driven animations
- `@media (prefers-reduced-motion: reduce)` support

### Translation

- Add keys to BOTH `src/locales/en.json` and `src/locales/tr.json`
- Key convention: `"section.subsection.key"` (e.g., `"navbar.events"`, `"charroller.landing.title"`)
- Always test both languages after adding new translations

---

## Known Gotchas

1. **HomePage renders `<Navbar />` twice** -- may be intentional for visual effect or a legacy bug. Check before modifying.

2. **LanguageSelector callback** -- must accept `onLanguageSelect` callback, NOT `onLanguageSwitch`.

3. **Framer Motion** -- still in `package.json` and used in some components (`GeneralEventRegistrationForm.jsx` uses `motion.button`). Do NOT add new framer-motion usage; prefer CSS animations.

4. **Global CSS base rules** -- `src/index.css` applies `text-yellow-500` to all `h1/h2/h3` and `text-yellow-400` to all `a` elements. Override explicitly when needed (e.g., admin panels, Charroller, EMUCON pages).

5. **EMUCON routes currently redirect to ThankYou** -- `/emucon` and `/emucon/live` both render `<EmuconThankYou>` (event ended). The full pages (`Emucon/Home`, `Emucon/Live`) are available but not wired to production routes.

6. **WebSocket URL** -- derived from `config.backendUrl`. The browser automatically converts `http://` to `ws://` and `https://` to `wss://` when creating `new WebSocket(url)`.

7. **R2 upload requires backend support** -- frontend upload widgets depend on backend endpoints (`/api/admin/games/upload`, etc.) and the `VITE_ENABLE_R2` env var.

8. **Test coverage** -- unit tests cover Charroller edge cases only. New pages must have an E2E smoke test entry in `e2e/smoke.spec.js`; new components with logic must have a unit test.

9. **`config.jsx` RPG quotes** -- contains 200+ themed quotes used for the dice roll feature on the homepage. This is intentional; the quotes are a core feature, not an artifact.

---

## Changelog

### [Unreleased] — 2026-03-09

#### Refactor
- **Component reorganization**: `src/components/` split into `layout/`, `shared/`, `events/`, `tables/` subfolders with a single barrel at `components/index.jsx`
- **Page-based architecture**: every route maps to exactly one file in `pages/`; `App.jsx` is now a pure router with no state or handlers
- **Admin extracted**: auth state and login gate moved from `App.jsx` into `pages/Admin/index.jsx`
- **Charroller pages grouped**: `pages/Charroller/Landing.jsx` and `pages/Charroller/Manager.jsx`
- **Dead code removed**: `AdminDashboard.jsx` deleted (`useNewAdmin` was hardcoded `true`)

#### CI / Testing
- **Playwright E2E smoke tests**: `e2e/smoke.spec.js` covers all 15 routes including 404 fallback
- **CI pipeline**: `.github/workflows/ci.yml` — unit tests → build → E2E smoke on every PR
- **CLAUDE.md**: agent workspace instructions requiring tests for all new features/pages

---

### [Unreleased] — 2026-03-08

#### Features
- **Tavern Run**: Add scenario loader and JSON templates for Tavern Run scenarios (`370e371`)

#### Style
- Format code for better readability across multiple components (`18c3f3e`)

---

### 2026-03-07

#### Features
- **Mobile**: Add mobile sidebar functionality and bottom navigation bar (`29fe4db`)
- **Games Library**: Add image upload functionality to GamesLibraryPanel and enhance GameMasterCard hover effects (`b885205`)
- **Admin**: Update color scheme for admin panels and components for better visibility (`9b3eae7`)
- **Toasts**: Implement premium toast notification system and graceful error handling (`b8263b6`)
- **R2**: Implement R2 fallback logic and admin UI feedback (`4d8258a`)
- **Themes**: Improve theme modal responsiveness and add background style handling (`0ad17f0`)
- **Team Members**: Dynamic team members from API with admin panels (`8137c16`)
- **CharRoller**: Implement CharRoller page with results and comprehensive tests, add ambient music player, and introduce new admin panels (`f23d426`)
- **Themes Admin**: Create Themes Admin Panel with live preview and LLM prompt (`fea3bb8`)
- **Table Themes**: Add theme selection to table creation and editing (`af650f2`)
- **Table Themes**: Apply dynamic theme classes to table cards (`0793af4`)

#### Fixes
- **GameMasterCard**: Improve static image fallback logic and format animation styles (`b5f8115`)

#### Refactor
- Refactor AdminLayout menu structure and update button styles (`8983385`)

#### Style
- Format font-family declaration for better readability in `index.css` and adjust description paragraph formatting in AdminLayout (`787f629`)

#### Chore
- Ignore trash folder (`19f0ff5`)

---

### 2026-03-05

#### Features
- **Audio**: Replace MusicPlayer with TavernPlayer (`react-h5-audio-player`) (`1d7b013`)
- **CharRoller**: Introduce CharRoller page for character creation, management, and display (`4947bba`)

#### Fixes
- **TavernPlayer**: Cleaner layout — single row, no progress bar, inline collapse button; untrack `docs/plans` (now gitignored) (`7286d03`)

---

### 2026-03-04

#### Features
- **CharRoller**: UI overhaul — tavern theme, localStorage fix, portrait size, button contrast (`f006ffa`)
- **CharRoller**: Improve level-up loading state and icon colors (`df59866`)

#### Fixes
- **Navbar**: Make CharRoller link active on events page (was showing Coming Soon) (`edfc135`)

---

### 2026-02-17

#### Features
- **EMUCON**: Add EMUCON event page, CharRoller character management system, internationalization, and global audio context (`28d5dbf`)
