# EMURPG Frontend Context

---

## Stack

- **React 18** (JSX, functional components with hooks)
- **Vite 5** (build tool, `vite.config.js` not read but inferred from `@vitejs/plugin-react`)
- **Tailwind CSS 3** (utility classes, custom `font-cinzel`, `font-metamorphous` references)
- **React Router DOM 6** (`BrowserRouter`, `Routes`, `Route`, `Link`, `useParams`)
- **Framer Motion 11** (page/component animations)
- **i18next + react-i18next** (EN/TR bilingual support, saved to `localStorage`)
- **lucide-react** (icon set used in admin panels)
- **react-icons** (FA icons in public pages and forms)
- **js-sha256** (password hashing on the client before sending to API)
- **html-to-image** (announcement card PNG export)
- **antd 5** (imported but minimally used)
- **framer-motion** (animations throughout)
- **Vitest + @testing-library/react** (unit tests in `src/test/`)
- **Playwright** (E2E, `@playwright/test`)

---

## Project Structure

```
src/
  index.jsx            # App entry point, renders into #root with bg-gray-900 bg-medieval-pattern
  App.jsx              # Router, global providers (I18nextProvider, WebSocketProvider, GlobalAudioProvider)
  config.jsx           # Config object + rpgQuotes array
  i18n.js              # i18next init, EN/TR locales, localStorage persistence
  index.css            # Global styles

  pages/
    HomePage.jsx            # Route: /
    EventsPage.jsx          # Route: /events
    TableDetailPage.jsx     # Route: /table/:slug
    Admin/index.jsx          # Route: /admin  (login gate + panel router)
    EmuconRulesPage.jsx      # Route: /emucon/rules
    Emucon/
      ThankYou.jsx           # Routes: /emucon, /emucon/live, /emucon/register/:token
      Sponsors.jsx           # Route: /emucon/sponsors
      DemoHome.jsx           # Route: /demo/emucon
      DemoLive.jsx           # Route: /demo/emucon/live
    Charroller/
      Landing.jsx            # Route: /charroller  (wrapped in GlobalAudioProvider)
      Manager.jsx            # Route: /charroller/manager  (wrapped in GlobalAudioProvider)
    Privacy.jsx              # Route: /privacy
    NotFound.jsx             # Route: *

  components/
    Admin/             # Admin panel components (lazy-loaded panels)
    Charroller/        # Character roller mini-app components
    Emucon/            # Emucon public-facing components
    TavernRun/         # TavernRun mini-game components
    events/            # Event list and registration forms
    tables/            # Table list and related modals
    layout/            # Navbar, footers, BottomNavBar
    shared/            # FireButton, SocialButton, SectionTitle, etc.

  contexts/
    WebSocketContext.jsx   # Singleton WS connection with topic-based subscribers
    GlobalAudioContext.jsx # Singleton audio element for Charroller ambient music

  hooks/
    useWebSocket.js    # Subscribe to WS messages by topic
    useToast.js        # Toast notification state manager

  utils/
    auth.js                  # localStorage helpers for apiKey and login session
    registrationCountdown.js # Date math for registration open countdowns
    duplicateDetection.js    # Cross-table duplicate player detection
    characterStorage.js      # localStorage CRUD for Charroller characters/settings

  locales/
    en.json            # English translations
    tr.json            # Turkish translations

  data/
    tavern_run_scenarios/   # JSON scenario files for TavernRun mini-game
    emuconMockData.js        # Mock data for Emucon demo pages
```

---

## Routing (all pages and their paths)

| Path | Component | Notes |
|------|-----------|-------|
| `/` | `HomePage` | Main club homepage |
| `/events` | `EventsPage` | Public event listing |
| `/table/:slug` | `TableDetailPage` | Registration for a specific game table |
| `/admin` | `AdminPage` | Login gate, then full admin panel or Emucon manager dashboard |
| `/emucon` | `EmuconThankYou` | Emucon memories/thank-you page |
| `/emucon/live` | `EmuconThankYou` | Same component |
| `/emucon/register/:token` | `EmuconThankYou` | Same component |
| `/emucon/sponsors` | `EmuconSponsors` | Sponsor page |
| `/emucon/rules` | `EmuconRulesPage` | Rules page |
| `/charroller` | `CharrollerLanding` | Character roller landing (GlobalAudioProvider wraps it) |
| `/charroller/manager` | `CharrollerManager` | Character manager (GlobalAudioProvider wraps it) |
| `/demo/emucon` | `EmuconDemoHome` | Demo of Emucon live page (uses mock data) |
| `/demo/emucon/live` | `EmuconDemoLive` | Demo of Emucon live tracking |
| `/privacy` | `Privacy` | Privacy policy |
| `*` | `NotFound` | 404 fallback |

`BottomNavBar` is rendered outside `<Routes>` on all pages.

---

## Config / Environment

**File:** `src/config.jsx`

| Variable | Source | Purpose |
|----------|--------|---------|
| `DEV` | `import.meta.env.VITE_DEV === "true"` | Toggle dev vs prod backend |
| `backendUrl` | DEV ? `http://localhost:8000` : `https://api.emurpg.com` | Base URL for all API calls |
| `R2_PUBLIC_URL` | `import.meta.env.VITE_R2_PUBLIC_URL` or `https://r2.emurpg.com` | Cloudflare R2 public asset URL |
| `DISCORD_LINK` | hardcoded | `https://discord.gg/QFynV24URr` |
| `WHATSAPP_LINK` | hardcoded | `https://chat.whatsapp.com/IMoi88nhVWDDU5lS65dgLL` |
| `INSTAGRAM_LINK` | hardcoded | `https://www.instagram.com/emurpgclub/` |
| `LINKEDIN_LINK` | hardcoded | `https://www.linkedin.com/company/emu-rpg-club/` |
| `ENABLE_SCROLL_SNAP` | hardcoded `false` | Toggle for Emucon scroll snapping |
| `ENABLE_R2` | `import.meta.env.VITE_ENABLE_R2 === "true"` | Enable R2-hosted background images for table themes |
| `tavernAmbientUrl` | `${R2_PUBLIC_URL}/sound/tavern-ambient.mp3` | Ambient music for Charroller |

The `rpgQuotes` array (200+ pop-culture dice quotes) is also exported from `config.jsx` and used by the Charroller dice roller.

---

## Admin Panel

### Layout Structure

**File:** `src/components/Admin/AdminLayout.jsx`

The admin panel is a full-screen SPA layout:

- **Desktop (lg+):** Fixed left sidebar (`w-64` expanded / `w-20` collapsed) + main content area
- **Mobile:** Fixed top header bar + fixed bottom navigation with grouped tabs and an expanding secondary row

The sidebar has four sections:
1. **Dashboard** (no label) — Home
2. **EMURPG** — Events, Tables, Table Themes, Games Library
3. **EMUCON** — Corners (EmuconAdminPanel), Managers, Schedule
4. **Management** — Registrations, Reports, Analytics, Team Members, Admin Accounts

The mobile bottom nav groups them into: Home | Events (EMURPG section) | EMUCON | Manage. Tapping a group with sub-items expands a secondary chip row above the primary row. A Logout button is always visible.

A castle silhouette SVG with animated torch flames is rendered as a fixed decorative background.

**Server health** is displayed inline via `ServerStatus` (full text + ms) on desktop and `ServerStatusDot` on mobile, both in the sidebar and the mobile header. Health is polled every 30 seconds via `useServerHealth`.

### Admin Login Flow

**File:** `src/components/Admin/AdminLogin.jsx`

Two login modes:
1. **Credentials (Sign In):** Username + password (SHA-256 hashed before sending) → `POST /api/admin/login`. If `adminType === "emurpg"`, a second step opens a modal requiring an API key validated via `POST /api/admin/validate-key`. If `adminType === "emucon_manager"`, login completes directly and `sessionToken` from the response is stored in `localStorage.managerToken`.
2. **Invite Code:** Enter code → `POST /api/admin/verify-invite` → if valid, show Set Password form → `POST /api/admin/activate-invite`.

Session data stored in `localStorage`:
- `login` key: `{ username, adminType, clubId, clubName, expirationTime (30 min) }`
- `apiKey` key: raw API key string (EMURPG admins only — entered manually in 2FA modal)
- `managerToken` key: EMUCON manager session token (issued by backend on login/activation, sent as `X-Manager-Token` header on all `/api/emucon/manager/*` calls)

Two admin types routed differently in `AdminPage`:
- `emurpg` → `AdminMain` (full admin panel)
- `emucon_manager` → `EmuconManagerDashboard` (club manager view)

### Panels

All panels are **lazy-loaded** via `React.lazy` + `Suspense` in `AdminMain.jsx`.

---

#### Dashboard Panel (inline in AdminMain.jsx)

- Shows quick stats: Active Events, Game Tables, EMUCON Corners, Registrations, Server Health card
- Fetches from:
  - `GET /api/events` (with `apiKey` header) → counts events and calculates tableCount, playerCount
  - `GET /api/games` (with `apiKey` header) → game library count
  - `GET /api/admin/emucon/stats` (with `apiKey` header) → `{ stats: { totalCorners, activeManagers, totalParticipants } }`
- Quick action buttons navigate to `events`, `emucon`, `managers` panels

---

#### EventsAdminPanel (`src/components/Admin/EventsAdminPanel.jsx`)

**Purpose:** Create, edit, finish, and delete events; manage announcement images; detect duplicate players.

**API calls:**
- `GET /api/admin/events` → fetch all events with table details
- `POST /api/admin/events` → create event
- `PUT /api/admin/events/{slug}` → update event
- `DELETE /api/admin/events/{slug}` → delete event
- `POST /api/admin/events/{slug}/finish` → finish event (marks as done)
- `GET /api/admin/events/{slug}/tables` → fetch detailed table list for an event
- `POST /api/admin/announcement-image` → upload background image for announcement card
- `DELETE /api/admin/announcement-image/{type}` → delete an announcement background image (type: `game` or `general`)

All write calls include `apiKey` header.

**State managed:**
- `events` array (each event has nested `tableDetails`)
- `isCreateModalOpen`, `isEditModalOpen`, `isFinishModalOpen` (modal visibility)
- `selectedEvent` for current edit/finish target
- `formData`: `{ name, description, event_type, start_date, start_time, end_date, end_time, registration_start_date, registration_start_hour, venue_name, location_url, announcement_title, announcement_url, bus_time, bus_from, bus_to, clubs[] }`
- `duplicates`: array of duplicate-player groups from `findDuplicatePlayers()`
- Expanded/collapsed state per event row

**Actions:**
- Create event, Edit event, Delete event (with ConfirmDialog), Finish event (marks complete)
- Generate/preview announcement card image (opens `AnnouncementModal`)
- View duplicate player warnings (inline within event row)

**WebSocket:** Subscribes to `"tables"` topic via `useWebSocket` to auto-refresh when table data changes.

**Form fields (EventFormFields component):** Event name, type (game/general), description, start/end date+time, registration start date+hour (dropdown 0–23), venue name, Google Maps URL, announcement title+URL, bus time/from/to, participating clubs list (for general events only).

---

#### TablesAdminPanel (`src/components/Admin/TablesAdminPanel.jsx`)

**Purpose:** Create, edit, and delete game tables; manage player lists (approved/backup/joined/rejected); manage table images.

**API calls:**
- `GET /api/admin/events` → load events + their tables
- `GET /api/games` → game library for dropdowns
- `GET /api/themes` → table theme list
- `GET /api/admin/get_players/{tableSlug}` → fetch player lists for a table
- `POST /api/admin/tables` → create table
- `PUT /api/admin/tables/{slug}` → update table
- `DELETE /api/admin/tables/{slug}` → delete table
- `POST /api/admin/tables/{tableSlug}/approve/{playerName}` → approve player
- `POST /api/admin/tables/{tableSlug}/reject/{playerName}` → reject player
- `POST /api/admin/tables/{tableSlug}/move_to_backup/{playerName}` → move to backup
- `POST /api/admin/tables/{tableSlug}/move_to_approved/{playerName}` → move to approved from backup
- `DELETE /api/admin/tables/{tableSlug}/remove_player/{playerName}` → remove player
- `POST /api/admin/tables/{tableSlug}/add_player` → manually add player
- `POST /api/admin/tables/{tableSlug}/mark_full` → mark table as full
- `POST /api/admin/tables/{tableSlug}/unmark_full` → unmark as full
- `POST /api/admin/tables/upload-image/{tableSlug}` → upload table-specific image
- `GET /api/admin/events/{eventSlug}/tables` → load detailed tables for a specific event

All write calls include `apiKey` header.

**State managed:**
- `events`, `games`, `themes`
- Modal states: `isCreateModalOpen`, `isEditModalOpen`, `isPlayersModalOpen`
- `selectedEvent`, `selectedTable`, `players`
- `tableForm`: `{ game_name, game_master, player_quota, language, game_id, theme_id, game_image }`
- Duplicate player warnings via `findDuplicatePlayers()`

**Actions:** Create/Edit/Delete tables; Approve/Reject/Move/Remove players; Add player manually; Mark/Unmark full; Upload table image.

**WebSocket:** Subscribes to `"tables"` topic for real-time updates.

---

#### ThemesAdminPanel (`src/components/Admin/ThemesAdminPanel.jsx`)

**Purpose:** Manage visual themes for table cards.

**API calls:**
- `GET /api/themes` → list themes
- `POST /api/admin/themes` → create theme
- `PUT /api/admin/themes/{id}` → update theme
- `DELETE /api/admin/themes/{id}` → delete theme
- `POST /api/admin/themes/{id}/image` → upload background image for theme
- `DELETE /api/admin/themes/{id}/image` → delete theme background image

**Form fields:** `name`, `background_styles` (Tailwind), `background_image_url`, `card_styles`, `hover_animations`, `button_styles`.

**State:** themes list, modal states, form data, upload state, Toast notifications via `useToast`.

---

#### GamesLibraryPanel (`src/components/Admin/GamesLibraryPanel.jsx`)

**Purpose:** Manage the game library (game guide data shown on registration forms).

**API calls:**
- `GET /api/games` → list all games
- `POST /api/admin/games` → create game
- `PUT /api/admin/games/{id}` → update game
- `DELETE /api/admin/games/{id}` → delete game
- `POST /api/admin/games/upload` → upload game image (max 5 MB, returns `{ url }`)

**Form fields:** `id`, `name`, `avg_play_time`, `min_players`, `max_players`, `image_url`, `guide_text`, `guide_video_url`.

---

#### EmuconAdminPanel (`src/components/Admin/EmuconAdminPanel.jsx`)

**Purpose:** Manage EMUCON corner events (corners are activity listings shown on the Emucon schedule).

**Corner types:** entertainment, awareness, healthAndLifestyle, folkAndSocial, art, technology, science (each has English + Turkish labels).

**Event types:** scheduled, continuous, standTime, liveStage.

**Status options:** upcoming, live, completed.

**API calls:**
- `GET /api/admin/emucon/corners` (or equivalent) → list corners
- `POST /api/admin/emucon/corners` → create corner
- `PUT /api/admin/emucon/corners/{id}` → update corner
- `DELETE /api/admin/emucon/corners/{id}` → delete corner
- Also fetches EMUCON periods/schedule for slot assignment

**State:** corners list, modal states, form data, search term, filter by club/status.

**Features:** Generate a registration link per corner; copy club registration links; inline expand/collapse per club.

---

#### EmuconManagersPanel (`src/components/Admin/EmuconManagersPanel.jsx`)

**Purpose:** Create and manage EMUCON club manager accounts. Each club manager gets an invite code to activate their account.

**API calls:**
- `GET /api/admin/emucon-managers` (with `apiKey`) → list all managers
- `POST /api/admin/create-emucon-manager` (with `apiKey`) → create manager, returns `{ inviteCode, clubName }`
- `DELETE /api/admin/emucon-manager/{id}` (with `apiKey`) → delete manager
- `POST /api/admin/regenerate-invite/{managerId}` (with `apiKey`) → regenerate invite code
- `POST /api/admin/generate-all-invites` (with `apiKey`) → bulk-generate invites for all pending managers

**State:** `managers[]`, modal states, `newManager` form (`clubName`, `clubNameTr`, `clubId`, `contactEmail`), `generatedInvite`, `bulkResult`.

**Create form fields:** Club Name (EN), Club Name (TR), Club ID (slugified), Contact Email.

**Features:**
- After creating a manager, shows the generated invite code with copy button
- Copy ready-to-send invitation messages in Turkish or English (full step-by-step onboarding text)
- Pending managers show their invite code inline; active managers show a green "Active" badge
- Bulk generate invites creates/regenerates codes for all pending managers, shows summary (created/regenerated/skipped)

---

#### EmuconSchedulePanel (`src/components/Admin/EmuconSchedulePanel.jsx`)

**Purpose:** Manage time periods/slots for the EMUCON schedule.

**Period types:** opening, activity, performance, stand, closing (with color coding).

**API calls:**
- `GET /api/emucon/periods` (with `apiKey`) → list all periods
- `POST /api/admin/emucon/periods` → create period
- `PUT /api/admin/emucon/periods/{id}` → update period
- `DELETE /api/admin/emucon/periods/{id}` → delete period
- `POST /api/admin/emucon/periods/reset` → reset all periods to default

**Form fields:** `name`, `startTime`, `endTime`, `type`, `isEditable`.

---

#### RegistrationsPanel (`src/components/Admin/RegistrationsPanel.jsx`)

**Purpose:** Manage registrations for **general** (non-game) events.

**API calls:**
- `GET /api/admin/events` (with `apiKey`) → fetch all events, filter to `type === "general"`
- `GET /api/admin/general_registrations/{eventSlug}` (with `apiKey`) → list registrations for selected event
- `POST /api/admin/approve_general_registration` (with `apiKey`) → body: `{ event_slug, email }`
- `POST /api/admin/reject_general_registration` (with `apiKey`) → body: `{ event_slug, email }`
- `DELETE /api/admin/delete_general_registration/{eventSlug}/{email}` (with `apiKey`)
- `POST /api/admin/add_general_registration/{eventSlug}` (with `apiKey`) → manually add registration
- `GET /api/admin/events/{eventSlug}/attendance` (with `apiKey`) → download attendance CSV

**State:**
- `events[]` (general only), `selectedEvent`, `registrations[]`
- Filters: `searchTerm`, `statusFilter` (all/pending/approved/rejected), `clubMemberFilter`
- Stats: total, approved, pending, rejected, clubMembers counts
- Modal states: `isAddModalOpen`, `isDetailModalOpen`, `selectedRegistration`

**Add manual registration form fields:** `name`, `surname`, `email`, `phone`, `student_id`, `is_club_member` (checkbox).

**Actions:** Approve, Reject, Delete (with confirm dialog), Add manual registration, Download attendance CSV.

---

#### ReportsPanel (`src/components/Admin/ReportsPanel.jsx`)

**Purpose:** Generate and download CSV reports for events.

**API calls:**
- `POST /api/admin/generate-report` (with `apiKey`, `Content-Type: application/json`) → body: `{ type, language }` → response is a binary blob (CSV file)

**Report types:**
- `"current"` — Current active event (all tables, players)
- `"previous"` — Most recently completed event
- `"all"` — All events ever

**Language selector:** `"en"` (English) or `"tr"` (Turkish) — affects CSV column headers and status labels.

**State:** `isGenerating`, `selectedLanguage` (default `"en"`), `lastGenerated` (tracks last successful download), `error`.

**Behavior:**
1. Calls the backend which returns a CSV blob.
2. Reads `Content-Disposition` header for filename; falls back to `emurpg-report-{type}-{date}.csv`.
3. Creates a temporary anchor element, triggers download, then revokes the object URL.

**Current State / Known Behavior:**
- The panel is fully functional and straightforward.
- There are no complex bugs — it makes a single POST, downloads the blob, and displays success or error.
- `isGenerating` is shared across all three report cards; clicking any "Download CSV" button while one is already running disables all three. There is no per-card loading state — this is a minor UX issue (all buttons disable together), not a functional bug.
- The `lastGenerated` state tracks only the most recently generated report (not one per type).

---

#### AnalyticsPanel (`src/components/Admin/AnalyticsPanel.jsx`)

**Purpose:** Display statistics about events, tables, players, and club participation.

**API calls:**
- `GET /api/admin/reports/analytics` (with `apiKey`) → returns `analyticsData` object with: `summary`, `club_totals`, `event_reports[]`
- `GET /api/admin/events` (with `apiKey`) → returns full event list used to compute local stats

**Data sections displayed:**

1. **Main Stats Grid** (computed locally from `/api/admin/events`):
   - Total Events, Total Tables, Total Players (approved only), Active Events

2. **Event Type Distribution** (computed locally):
   - Game events vs. General events with horizontal progress bars

3. **Event Status Distribution** (computed locally):
   - Active vs. Finished with progress bars + completion rate percentage

4. **Averages** (computed locally):
   - Avg Tables/Event, Avg Players/Table, Players/Event, Game Event %

5. **Report Summary** (from `/api/admin/reports/analytics` → `analytics.summary`):
   - `total_events_reported`, `total_registrations`, `total_approved`, `overall_approval_rate`

6. **Club Participation All-Time** (from `analytics.club_totals`):
   - Bar chart of clubs sorted by participation count

7. **Per-Event Reports** (from `analytics.event_reports[]`):
   - Collapsible `<details>` elements, one per event slug
   - Each shows: statistics breakdown grid, club distribution bars, participating clubs tags, extra scalar fields
   - Statistics keys rendered: `total_registrations`, `approved`, and any others returned by backend

8. **Recent Events List** (from local events, first 5):
   - Name, date, table count, type — with active/finished indicator dot

**State:** `analytics` (server response), `events[]` (local copy for derived stats), `isLoading`, `error`.

**Current State:**
- Panel works correctly if `/api/admin/reports/analytics` returns a properly shaped response.
- `formatValue()` helper safely renders any nested objects/arrays from `event_reports` extras.
- The panel is resilient: computed local stats render even if the analytics API call fails; server analytics section only renders when `analytics !== null`.

---

#### TeamMembersPanel (`src/components/Admin/TeamMembersPanel.jsx`)

**Purpose:** Manage "Game Master" team members displayed on the homepage.

**API calls:**
- `GET /api/admin/team-members` (with `apiKey`) → list members
- `POST /api/admin/team-members` (with `apiKey`) → create member
- `PUT /api/admin/team-members/{id}` (with `apiKey`) → update member
- `DELETE /api/admin/team-members/{id}` (with `apiKey`) → delete member
- `PUT /api/admin/team-members/{id}/reorder` (with `apiKey`) → reorder display order
- `POST /api/admin/team-members/{id}/photo` (with `apiKey`) → upload photo (multipart)

**Form fields:** `name`, `title`, `description`, `display_order`, `is_active`, `socials` (instagram, linkedin, github, youtube, discord, website).

**State:** members list (sorted by `display_order`), modal states, form data, `photoFile`, `photoPreview`, Toast via `useToast`.

**Actions:** Create, Edit, Delete (with confirm), reorder via up/down arrows, upload photo.

---

#### AdminAccountsPanel (`src/components/Admin/AdminAccountsPanel.jsx`)

**Purpose:** Manage admin user accounts (requires super-admin access — returns 403 for non-super admins).

**API calls:**
- `GET /api/admin/admins` (with `getAuthHeaders()`) → list all admin accounts
- `POST /api/admin/admins` → create admin
- `PUT /api/admin/admins/{id}` → update admin (username/password)
- `DELETE /api/admin/admins/{id}` → delete admin
- `POST /api/admin/admins/{id}/rotate-api-key` → rotate API key, returns new key

**Form fields:** `username`, `password`.

**Features:** Shows admin list with `username`, `role` (crown icon for super-admin), creation date; modal to create/edit; API key rotation with display-once modal; delete with confirm.

**State:** `admins[]`, modal states, `createForm`, `editForm`, `displayedApiKey`, Toast.

---

#### EmuconManagerDashboard (`src/components/Admin/Emucon/EmuconManagerDashboard.jsx`)

**Purpose:** Dashboard for EMUCON club managers (shown when `adminType === "emucon_manager"`).

**API calls:**
- `GET /api/emucon/manager/events/{clubId}` → fetch club's own events
- `GET /api/emucon/manager/available-periods/{clubId}` → available slots for rescheduling (only for `eventType === "scheduled"`)
- `PUT /api/emucon/manager/events/{eventId}` → update event name/description
- `POST /api/emucon/manager/events/{eventId}/reschedule` → request period change
- `GET /api/emucon/manager/events/{eventId}/participants` → list participants
- `POST /api/emucon/manager/events/{eventId}/participants` → add participant
- `DELETE /api/emucon/manager/events/{eventId}/participants/{participantId}` → remove participant
- `GET /api/emucon/manager/registration-link/{eventId}` → get registration link

**State:** `events[]`, `selectedEvent`, modal states (edit, reschedule, participants, add-participant, registrationLink), `editForm`, `availableSlots`, `selectedSlot`, `participants[]`, `newParticipant`, `registrationLink`.

**Props:** `clubId: string`, `clubName: string`, `onLogout: func`.

---

## Public Pages

### HomePage (`src/pages/HomePage.jsx`)

**Purpose:** Main landing page for the EMURPG club.

**Props:** `onLanguageSwitch: func`

**API calls:**
- `GET /api/team-members` (no auth) → load team members lazily when the team section scrolls into view. Uses ETag-based cache in `localStorage` with 1-hour TTL and stale-while-revalidate pattern. Cache key: `"emurpg_team_members"`.

**Sections:**
1. Hero: Logo, title, subtitle, CTA buttons (Events, Discord, WhatsApp)
2. EMUCON'25 Memories: Stats (42+ clubs, 40+ activities, 5 performances, 600+ visitors), link to `/emucon`
3. About: Club description from i18n
4. Events: `HomePageEventList` component
5. Tavern Run Minigame: `TavernRun` component
6. Game Masters: `GameMasterCard` grid (lazy-loaded via IntersectionObserver)
7. Instagram Gallery: `InstagramGrid`
8. Join CTA: Discord + Events buttons
9. Footer: `MainFooter`

**Loading state:** 1.5s artificial delay showing a spinning D20 die icon.

---

### EventsPage (`src/pages/EventsPage.jsx`)

**Purpose:** Full event listing with embedded registration.

**Props:** `onLanguageSwitch: func`

**No direct API calls** — delegates to `EventList` component.

**Key feature:** Decorative arcane magic circle SVG used as a tiling background pattern (inline SVG encoded as data URL).

---

### TableDetailPage (`src/pages/TableDetailPage.jsx`)

**Purpose:** Standalone registration page for a single game table, accessible at `/table/:slug`.

**API calls:**
- `GET /api/table/{slug}` → fetch table data including `game_name`, `game_master`, `player_quota`, `game_info`, `slug`

**WebSocket:** Subscribes to `"tables"` topic — re-fetches table data on any table update.

**Renders:** `RegistrationForm` with table data as props.

---

### Admin Page (`src/pages/Admin/index.jsx`)

**Purpose:** Authentication gate. Routes to `AdminMain` or `EmuconManagerDashboard` based on `adminType`.

**State:** `isLoggedIn`, `adminType` (`"emurpg"` | `"emucon_manager"`), `managerData` (`{ clubId, clubName }`).

Session validated from `localStorage.login` on mount; expired sessions are cleaned up.

---

### Emucon Pages

- **ThankYou (`/emucon`, `/emucon/live`, `/emucon/register/:token`):** EMUCON'25 retrospective page with memories, stats, photo gallery, and a "Thank You" message. Uses all `Emucon/` components.
- **Sponsors (`/emucon/sponsors`):** Sponsor info page with tier cards, benefit cards, and contact CTA.
- **EmuconRulesPage (`/emucon/rules`):** Event rules static page.
- **DemoHome (`/demo/emucon`):** Demo of the Emucon landing page using mock data from `src/data/emuconMockData.js`.
- **DemoLive (`/demo/emucon/live`):** Demo of the live corner-activity tracking view.

---

### Charroller Pages

- **Landing (`/charroller`):** Character roller landing page with system selector, dice roller, and intro.
- **Manager (`/charroller/manager`):** Character manager — view/edit saved characters, level-up, post-creation options.

Both wrapped in `GlobalAudioProvider` for persistent ambient tavern music.

---

## Components

### Admin/

#### `AdminLayout`
**Props:** `children`, `activePanel: string`, `onPanelChange: func`, `onLogout: func`
Desktop sidebar + mobile bottom nav. Reads `loginData` from `getLoginData()` to show username. Torch flicker animation runs on a 150ms interval. Breadcrumb nav shown when not on dashboard.

#### `AdminLogin`
**Props:** `onLogin: func`, `onEmuconManagerLogin: func`
Handles credential login, invite-code activation, and API key second-factor. Uses `sha256` from `js-sha256`.

#### `AdminMain`
**Props:** `onLogout: func`
Loads stats, renders the panel switcher, lazy-loads all panels.

#### `AdminHeader`
**Props:** `username: string`, `adminType: string`, `onLogout: func`, `onSync: func`, `isSyncing: bool`, `lastSyncTime: string`
Sticky header (not currently used in the active layout — `AdminLayout` has its own mobile header). Exports `ServerStatus` and `ServerStatusDot` used by `AdminLayout`.

#### `AdminSidebar`
**Props:** `collapsed: bool`, `onToggle: func`, `adminType: string`
Legacy sidebar component with router `Link`s (not currently used — `AdminLayout` uses its own sidebar with button-based navigation, not router links).

#### `AnnouncementCard`
A 1080px-wide styled card for social media announcements, rendered to PNG via `html-to-image`. Supports multiple themes (`THEMES` export) and customizable colors (`DEFAULT_OPTIONS` export).

#### `AnnouncementModal`
**Props:** `isOpen`, `onClose`, `event`, `onSave`
Wraps `AnnouncementCard` with a preview (scaled to 680px) + theme/color pickers. Uploads background image to `POST /api/admin/announcement-image` (WebP-converted client-side). Downloads card as PNG via `toPng()`.

### Admin/shared/

#### `AdminButton`
**Props:** `onClick`, `disabled`, `variant` (`primary`|`secondary`|`danger`|`ghost`), `size` (`sm`|`md`|`lg`), `icon`, `className`, `type`, `loading`, `title`, `children`
Reusable button component with variant-based styling.

#### `AdminModal`
**Props:** `isOpen`, `onClose`, `title`, `children`, `size` (`sm`|`md`|`lg`|`xl`)
Overlay modal with backdrop click to close.

#### `ConfirmDialog`
**Props:** `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `confirmText`, `variant`
Confirmation dialog for destructive actions.

#### `LoadingSpinner`
**Props:** `size` (`sm`|`md`|`lg`), `message`
Animated spinner, optionally with text.

#### `Toast`
**Props:** `toast: { isVisible, message, type }`, `onHide: func`
Auto-dismissing toast notification (4s).

#### `useServerHealth` (hook in shared/)
Returns `{ status: "checking"|"online"|"degraded"|"offline", responseMs: number|null, lastChecked: Date|null }`. Pings `GET /health` every 30 seconds with a 5-second timeout. `degraded` = 300–799ms; `offline` = ≥800ms or error.

### events/

#### `EventList`
No props.
Fetches `GET /api/events` on mount. Subscribes to `"events"` and `"tables"` WS topics for live updates. Shows event cards in list view; clicking a game event navigates to `TableList`; clicking a general event shows `GeneralEventRegistrationForm`. Updates `now` every 30 seconds for registration countdown calculations. Handles countdown display via `registrationCountdown` utils.

Each event card in wide layout: 3-column grid (Identity | Logistics | Status+Date). In compact layout: stacked with a meta-detail box and footer strip.

**Status badge logic:**
- If countdown active: "Opens in Xd Xh Xm"
- If general event: "General Event — Registration Open" (sky blue)
- If available seats: "N seats available" (emerald)
- If no available tables: "Registrations not started" (rose)

#### `GeneralEventRegistrationForm`
**Props:** `eventSlug: string`, `clubs: string[]`

**API call:** `POST /api/register/general/{eventSlug}` → body: `{ student_id, name, event_slug, contact, clubs[] }`

Fields: Student ID, Name, Contact (optional), Club selection (shown only if `clubs.length > 1`), Terms/privacy checkbox.

If only one club in array, it is auto-selected and shown in terms text. If multiple clubs, checkboxes appear + "Not registered" option (mutually exclusive).

#### `RegistrationForm`
**Props:** `tableSlug: string`, `tableId: string|number`, `gameName: string`, `gameMaster: string`, `playerQuota: number`, `gameInfo: object`

**API call:** `POST /api/register/{tableSlug}` → body: `{ student_id, name, table_id, contact }`

Fields: Student ID, Name, Contact (optional), game-knowledge checkbox, terms/privacy checkbox.

Collapsible game info section shows: image, stat tiles (avg play time, player range, quota), guide text, video link button, important notice.

Rules modal shows hardcoded EN/TR rule list with language toggle.

#### `HomePageEventList`
No props. Fetches `GET /api/events`, shows compact version of events on the homepage.

#### `EventCard`
Smaller card variant for EventList items.

### tables/

#### `TableList`
**Props:** `eventSlug: string`

**API calls:**
- `GET /api/events/{eventSlug}/tables` → table list (auto-refreshed on `"tables"` WS topic)
- `GET /api/games` → game data (not used for display, just loaded)
- `GET /api/themes` → theme data (stored in `themes` map by ID)
- `GET /api/game/{gameId}` → individual game details for each table with `game_id`

Renders a grid of table cards via `tableListFunction()` helper. Each card: game image (with glow), name, language badge, quest master, play time, seats/full badge. Two action buttons: "Register" (links to `/table/{slug}`) and "Game Info" (opens `GameGuideModal`).

Last card is always "Host your own table" → opens `HostTableModal`.

Applies theme styles when `theme_id` is set and `ENABLE_R2` is true for background images.

#### `GameGuideModal`
**Props:** `isOpen`, `onClose`, `game`
Shows game guide info in a modal.

#### `HostTableModal`
**Props:** `isOpen`, `onClose`, `eventSlug`
Form to request hosting a new table.

#### `GameMasterCard`
**Props:** `name`, `title`, `description`, `image`, `socials`
Team member card with social links. Used on `HomePage`.

### layout/

#### `Navbar`
**Props:** `onLanguageSwitch: func`, `scrollEffectEnabled: bool`, `buttons: [{ label, onClick, disabled }]`
Top navigation bar. `scrollEffectEnabled` adds scroll-based styling. Shows EMURPG logo + customizable buttons + `LanguageSelector`.

#### `BottomNavBar`
**Props:** `onLanguageSwitch: func`
Fixed bottom navigation with Home, Events, Charroller, and language toggle. Rendered globally in `App.jsx` outside `Routes`.

#### `MainFooter`
Renders footer with social links for Discord, Instagram, LinkedIn, and footer text.

#### `EventsFooter`
Slim footer variant used on events pages.

### shared/

#### `FireButton`
**Props:** `onClick`, `text`, `color1`, `textcolor`
Animated flame-styled button (used on homepage CTA).

#### `SocialButton`
**Props:** `icon`, `text`, `onClick`
Social CTA button.

#### `SectionTitle`
**Props:** `icon`, `children`
Renders a section heading with an icon.

#### `ParallaxBackground`
Decorative parallax background for the homepage (forest silhouette, clouds).

#### `InstagramGrid`
Renders Instagram embedded posts grid.

#### `LanguageSelector`
**Props:** `onLanguageSwitch: func`
EN/TR toggle button.

#### `ErrorBoundary`
**Props:** `children`
Catches rendering errors and shows a fallback.

#### `SocialIcon`, `SocialButton`
Small icon + button components for social media links.

---

## Hooks

### `useWebSocket(topic, callback)`
**File:** `src/hooks/useWebSocket.js`

**Returns:** Nothing (side-effect only).

Subscribes `callback` to messages from `WebSocketContext` filtered by `topic`. Topic can be `"tables"`, `"events"`, or `null` (all messages). Uses a stable wrapper ref to avoid re-subscription on every render.

### `useToast()`
**File:** `src/hooks/useToast.js`

**Returns:** `{ toast: { isVisible, message, type }, showToast(message, type), hideToast() }`

Local toast state for admin panels. `type` can be `"success"`, `"error"`, `"warning"`, `"info"`.

### `useServerHealth()`
**File:** `src/components/Admin/shared/useServerHealth.js`

**Returns:** `{ status: "checking"|"online"|"degraded"|"offline", responseMs: number|null, lastChecked: Date|null }`

Polls `GET /health` every 30 seconds. Thresholds: <300ms = online, 300–799ms = degraded, ≥800ms or fetch error = offline.

### `useGlobalAudio()`
**File:** `src/contexts/GlobalAudioContext.jsx` (exported as hook)

**Returns:** `{ isPlaying, volume, isMuted, isLoaded, hasUserInteracted, play, pause, togglePlay, toggleMute, setVolume, startAutoPlay, unlockAudio }`

Must be used inside `GlobalAudioProvider`. Controls the singleton tavern ambient audio element.

### `useWebSocketContext()`
**File:** `src/contexts/WebSocketContext.jsx`

**Returns:** `{ isConnected: bool, subscribersRef: React.MutableRefObject<Map> }`

Low-level context hook; `useWebSocket` is the public API.

---

## Utils

### `src/utils/auth.js`

| Function | Description |
|----------|-------------|
| `getApiKey()` | Reads `localStorage.apiKey` (handles both raw string and `{ apiKey }` JSON) |
| `setApiKey(apiKey)` | Writes to `localStorage.apiKey` |
| `clearApiKey()` | Removes `localStorage.apiKey` |
| `getLoginData()` | Reads and validates `localStorage.login`; clears expired session, returns `null` |
| `setLoginData(data, expirationMinutes=30)` | Writes login object with expiration timestamp |
| `getManagerToken()` | Reads `localStorage.managerToken`; returns raw session token or `null` |
| `setManagerToken(token)` | Writes to `localStorage.managerToken` |
| `clearManagerToken()` | Removes `localStorage.managerToken` |
| `clearSession()` | Removes `login`, `apiKey`, and `managerToken` from localStorage |
| `isLoggedIn()` | `getLoginData() !== null` |
| `getAdminType()` | Returns `loginData.adminType` or `null` |
| `getAuthHeaders(includeContentType=true)` | Returns `{ "Content-Type": "application/json", apiKey }` |

### `src/utils/registrationCountdown.js`

| Function | Description |
|----------|-------------|
| `getRegistrationOpenAt(event)` | Parses `event.registration_start_hour` + `event.registration_start_date` (or `start_date`) into a `Date` object. Returns `null` if either is missing/invalid. |
| `isRegistrationOpen(event, now=new Date())` | Returns `true` if no open-at date is set, or if `now >= openAt` |
| `formatRegistrationCountdown(targetDate, now=new Date())` | Formats remaining time as `"Xd Xh Xm"` |

### `src/utils/duplicateDetection.js`

| Function | Description |
|----------|-------------|
| `normalizeName(name)` | Lowercase, Turkish char map, NFD strip, alphanumeric only |
| `normalizeId(id)` | Digits only |
| `findDuplicatePlayers(events)` | Phase 1: collect one entry per player per table (highest-priority status wins: approved > joined > backup > rejected). Phase 2: group by normalized name and student ID. Phase 3: merge groups. Returns `Array<{ reasons: string[], apps: object[] }>`. |

Player lists checked: `approved_players`, `joined_players`, `backup_players`, `rejected_players` (from `table.tableDetails`).

### `src/utils/characterStorage.js`

localStorage CRUD for the Charroller mini-app:

| Function | Description |
|----------|-------------|
| `getCharacters()` | Read all characters from `"emurpg_characters"` |
| `getCharacterById(id)` | Get one character |
| `saveCharacter(character)` | Save or update character |
| `deleteCharacter(id)` | Delete character |
| `exportCharacters()` | JSON export `{ version, characters, exportedAt }` |
| `importCharacters(data)` | Import from JSON, merges with existing |
| `getSettings()` | Read from `"emurpg_charroller_settings"` |
| `saveSettings(settings)` | Save/merge settings |
| `generateId()` | `char_{timestamp}_{random}` |

Settings shape: `{ musicEnabled, musicVolume }`.

---

## API Call Inventory

All base URLs are from `config.backendUrl` (`https://api.emurpg.com` in production).

### Public (no auth header)

| Method | URL | Component | Notes |
|--------|-----|-----------|-------|
| GET | `/api/events` | `EventList`, `HomePageEventList`, `AdminMain` | Public event list |
| GET | `/api/events/{eventSlug}/tables` | `TableList` | Tables for an event |
| GET | `/api/table/{slug}` | `TableDetailPage` | Single table details |
| GET | `/api/games` | `TableList` | Game library |
| GET | `/api/game/{gameId}` | `TableList` | Single game details |
| GET | `/api/themes` | `TableList`, `TablesAdminPanel` | Table themes |
| GET | `/api/team-members` | `HomePage` | Team members (ETag-cached) |
| GET | `/health` | `useServerHealth` | Health check |
| POST | `/api/register/{tableSlug}` | `RegistrationForm` | Game table registration |
| POST | `/api/register/general/{eventSlug}` | `GeneralEventRegistrationForm` | General event registration |
| POST | `/api/admin/login` | `AdminLogin` | Login (returns adminType) |
| POST | `/api/admin/verify-invite` | `AdminLogin` | Verify invite code |
| POST | `/api/admin/activate-invite` | `AdminLogin` | Activate invited manager account |
| POST | `/api/admin/validate-key` | `AdminLogin` | Validate API key (second factor; sends `apiKey` in header) |
| GET | `/api/emucon/manager/events/{clubId}` | `EmuconManagerDashboard` | Manager's club events |
| GET | `/api/emucon/manager/available-periods/{clubId}` | `EmuconManagerDashboard` | Available schedule slots |
| PUT | `/api/emucon/manager/events/{eventId}` | `EmuconManagerDashboard` | Update event name/desc |
| POST | `/api/emucon/manager/events/{eventId}/reschedule` | `EmuconManagerDashboard` | Reschedule event |
| GET | `/api/emucon/manager/events/{eventId}/participants` | `EmuconManagerDashboard` | List participants |
| POST | `/api/emucon/manager/events/{eventId}/participants` | `EmuconManagerDashboard` | Add participant |
| DELETE | `/api/emucon/manager/events/{eventId}/participants/{id}` | `EmuconManagerDashboard` | Remove participant |
| GET | `/api/emucon/manager/registration-link/{eventId}` | `EmuconManagerDashboard` | Get registration link |
| GET | `/api/emucon/periods` | `EmuconSchedulePanel` | List schedule periods |

### Admin (requires `apiKey` header)

| Method | URL | Component |
|--------|-----|-----------|
| GET | `/api/admin/events` | `AdminMain`, `EventsAdminPanel`, `TablesAdminPanel`, `RegistrationsPanel`, `AnalyticsPanel` |
| POST | `/api/admin/events` | `EventsAdminPanel` |
| PUT | `/api/admin/events/{slug}` | `EventsAdminPanel` |
| DELETE | `/api/admin/events/{slug}` | `EventsAdminPanel` |
| POST | `/api/admin/events/{slug}/finish` | `EventsAdminPanel` |
| GET | `/api/admin/events/{slug}/tables` | `EventsAdminPanel` |
| GET | `/api/admin/events/{eventSlug}/attendance` | `RegistrationsPanel` |
| GET | `/api/admin/emucon/stats` | `AdminMain` |
| GET | `/api/admin/emucon/corners` | `EmuconAdminPanel` |
| POST | `/api/admin/emucon/corners` | `EmuconAdminPanel` |
| PUT | `/api/admin/emucon/corners/{id}` | `EmuconAdminPanel` |
| DELETE | `/api/admin/emucon/corners/{id}` | `EmuconAdminPanel` |
| GET | `/api/admin/emucon-managers` | `EmuconManagersPanel` |
| POST | `/api/admin/create-emucon-manager` | `EmuconManagersPanel` |
| DELETE | `/api/admin/emucon-manager/{id}` | `EmuconManagersPanel` |
| POST | `/api/admin/regenerate-invite/{managerId}` | `EmuconManagersPanel` |
| POST | `/api/admin/generate-all-invites` | `EmuconManagersPanel` |
| POST | `/api/admin/emucon/periods` | `EmuconSchedulePanel` |
| PUT | `/api/admin/emucon/periods/{id}` | `EmuconSchedulePanel` |
| DELETE | `/api/admin/emucon/periods/{id}` | `EmuconSchedulePanel` |
| POST | `/api/admin/emucon/periods/reset` | `EmuconSchedulePanel` |
| POST | `/api/admin/tables` | `TablesAdminPanel` |
| PUT | `/api/admin/tables/{slug}` | `TablesAdminPanel` |
| DELETE | `/api/admin/tables/{slug}` | `TablesAdminPanel` |
| GET | `/api/admin/get_players/{tableSlug}` | `TablesAdminPanel` |
| POST | `/api/admin/tables/{tableSlug}/approve/{playerName}` | `TablesAdminPanel` |
| POST | `/api/admin/tables/{tableSlug}/reject/{playerName}` | `TablesAdminPanel` |
| POST | `/api/admin/tables/{tableSlug}/move_to_backup/{playerName}` | `TablesAdminPanel` |
| POST | `/api/admin/tables/{tableSlug}/move_to_approved/{playerName}` | `TablesAdminPanel` |
| DELETE | `/api/admin/tables/{tableSlug}/remove_player/{playerName}` | `TablesAdminPanel` |
| POST | `/api/admin/tables/{tableSlug}/add_player` | `TablesAdminPanel` |
| POST | `/api/admin/tables/{tableSlug}/mark_full` | `TablesAdminPanel` |
| POST | `/api/admin/tables/{tableSlug}/unmark_full` | `TablesAdminPanel` |
| POST | `/api/admin/tables/upload-image/{tableSlug}` | `TablesAdminPanel` |
| GET | `/api/admin/themes` | `ThemesAdminPanel` (also `GET /api/themes` public) |
| POST | `/api/admin/themes` | `ThemesAdminPanel` |
| PUT | `/api/admin/themes/{id}` | `ThemesAdminPanel` |
| DELETE | `/api/admin/themes/{id}` | `ThemesAdminPanel` |
| POST | `/api/admin/themes/{id}/image` | `ThemesAdminPanel` |
| DELETE | `/api/admin/themes/{id}/image` | `ThemesAdminPanel` |
| GET | `/api/games` | `AdminMain`, `GamesLibraryPanel` |
| POST | `/api/admin/games` | `GamesLibraryPanel` |
| PUT | `/api/admin/games/{id}` | `GamesLibraryPanel` |
| DELETE | `/api/admin/games/{id}` | `GamesLibraryPanel` |
| POST | `/api/admin/games/upload` | `GamesLibraryPanel` |
| GET | `/api/admin/general_registrations/{eventSlug}` | `RegistrationsPanel` |
| POST | `/api/admin/approve_general_registration` | `RegistrationsPanel` |
| POST | `/api/admin/reject_general_registration` | `RegistrationsPanel` |
| DELETE | `/api/admin/delete_general_registration/{slug}/{email}` | `RegistrationsPanel` |
| POST | `/api/admin/add_general_registration/{slug}` | `RegistrationsPanel` |
| POST | `/api/admin/generate-report` | `ReportsPanel` (returns CSV blob) |
| GET | `/api/admin/reports/analytics` | `AnalyticsPanel` |
| GET | `/api/admin/team-members` | `TeamMembersPanel` |
| POST | `/api/admin/team-members` | `TeamMembersPanel` |
| PUT | `/api/admin/team-members/{id}` | `TeamMembersPanel` |
| DELETE | `/api/admin/team-members/{id}` | `TeamMembersPanel` |
| PUT | `/api/admin/team-members/{id}/reorder` | `TeamMembersPanel` |
| POST | `/api/admin/team-members/{id}/photo` | `TeamMembersPanel` |
| GET | `/api/admin/admins` | `AdminAccountsPanel` |
| POST | `/api/admin/admins` | `AdminAccountsPanel` |
| PUT | `/api/admin/admins/{id}` | `AdminAccountsPanel` |
| DELETE | `/api/admin/admins/{id}` | `AdminAccountsPanel` |
| POST | `/api/admin/admins/{id}/rotate-api-key` | `AdminAccountsPanel` |
| POST | `/api/admin/announcement-image` | `AnnouncementModal` (upload background image) |
| DELETE | `/api/admin/announcement-image/{type}` | `EventsAdminPanel` (delete bg image, type = game|general) |

### WebSocket

| URL | Provider | Topics dispatched |
|-----|----------|-------------------|
| `ws://localhost:8000/ws/updates` or `wss://api.emurpg.com/ws/updates` | `WebSocketContext` | Dispatches by `msg.type` field; legacy `"updated"` in `msg.message` dispatches both `"events"` and `"tables"` |

---

## State Management

All state is **local `useState` / `useRef`** — there is no Redux, Zustand, or other global state store.

**Shared state mechanisms:**

| Mechanism | What it shares |
|-----------|---------------|
| `WebSocketContext` | Single WS connection + subscriber map (per-topic pub-sub) |
| `GlobalAudioContext` | Singleton HTML Audio element + playback state for Charroller ambient music |
| `I18nextProvider` | i18n instance (language, translations) |
| `localStorage` | Session (`login`), API key (`apiKey`), language preference (`selectedLanguage`), team member cache (`emurpg_team_members`), character data (`emurpg_characters`), charroller settings (`emurpg_charroller_settings`) |

---

## Key User Flows

### Admin Finishing an Event (step by step)

1. Admin logs in at `/admin` with username + password (SHA-256 hashed) → `POST /api/admin/login`.
2. If `adminType === "emurpg"`, API key modal appears → admin enters API key → `POST /api/admin/validate-key`.
3. `AdminMain` loads, fetches dashboard stats, renders `DashboardPanel`.
4. Admin clicks "Events" in sidebar → `setActivePanel("events")` → `EventsAdminPanel` lazy-loads.
5. `EventsAdminPanel` fetches `GET /api/admin/events` (full event + table data).
6. Admin locates the event, clicks the "Finish" button → confirm dialog opens.
7. On confirm → `POST /api/admin/events/{slug}/finish`.
8. `EventsAdminPanel` re-fetches events list. The event status changes to `"finished"`.

### Player Registering for a Game Table

1. Player visits `/events`.
2. `EventList` fetches `GET /api/events`, renders event cards.
3. Player clicks a game event card (must not be locked by registration countdown and must have tables).
4. `TableList` fetches `GET /api/events/{eventSlug}/tables`, `GET /api/games`, `GET /api/themes`.
5. For each table with `game_id`, `GET /api/game/{gameId}` is fetched for guide text/image.
6. Player clicks "Register" on a table card → navigates to `/table/{slug}`.
7. `TableDetailPage` fetches `GET /api/table/{slug}` for full table data.
8. `RegistrationForm` renders with game info (collapsible). Player expands game info, reviews it.
9. Player fills in Student ID, Name, (optional) Contact.
10. Player checks "game knowledge" checkbox and "terms + privacy" checkbox.
11. Player clicks "Begin Quest" → `POST /api/register/{tableSlug}` with `{ student_id, name, table_id, contact }`.
12. Success or error alert shown (native `alert()`).

### Admin Generating a Report

1. Admin is logged in, navigates to "Reports" panel.
2. `ReportsPanel` renders with language selector (EN/TR) and three report cards.
3. Admin selects language (default English).
4. Admin clicks "Download CSV" on one of: Current Event, Previous Event, All Events.
5. `generateReport(reportType)` called → `POST /api/admin/generate-report` with `{ type: reportType, language: selectedLanguage }` and `apiKey` header.
6. Response blob received → `Content-Disposition` header parsed for filename → fallback filename constructed.
7. Temporary `<a>` created and clicked → browser downloads the file.
8. `lastGenerated` state set → green success banner shown.

### Player Registering for a General Event

1. Player visits `/events`.
2. `EventList` loads events; general events are highlighted in sky blue with "General Event — Registration Open" badge.
3. Player clicks a general event card.
4. `GeneralEventRegistrationForm` renders with: Student ID, Name, Contact fields.
5. If `clubs.length > 1`: Club checkboxes appear; player selects one or more clubs, or checks "Not registered to any of these clubs" (mutually exclusive with club selection).
6. Player checks terms/privacy checkbox; link opens rules modal with EN/TR toggle.
7. Player clicks "Register for Event" → `POST /api/register/general/{eventSlug}` with `{ student_id, name, event_slug, contact, clubs }`.
8. Success alert shown, form resets.

---

## ReportsPanel — Current State

**File:** `src/components/Admin/ReportsPanel.jsx`

### What it does now

The `ReportsPanel` component has been fully rewritten from the old "three CSV download cards" design into a rich event-history viewer.

**Primary flow:**
1. On mount, calls `GET /api/admin/reports` (with `apiKey` header) to fetch the list of all finished events with their stats, table breakdowns, and registration data.
2. Shows a summary bar: Finished Events count, Total Participants, Anonymized count.
3. Renders one collapsible `EventCard` per finished event, sorted by start date (newest first).

**EventCard (per event):**
- Header always visible: event name, `EventTypeBadge` (Game/General), `AnonymizedBadge`, `NoReportBadge`, quick stats (tables + players for game events; registrations + approved for general events), **Excel** download button, **Anonymize** button.
- Clicking the header expands the detail area.
- **Game events:** Shows a clickable grid of table cards. Clicking a table opens a `PlayerListModal` showing all approved players with name, student ID, contact, and registration timestamp.
- **General events:** Shows a `RegistrationList` with each registrant's name, student ID, contact, status, and timestamp. If registrations were cleared at event finish, shows a placeholder message directing to Excel download.
- **General events with club data:** Shows a Club Distribution grid (club name → count).
- Footer shows report generation timestamp if available.

**PlayerListModal:** Full-screen overlay with table name, GM, fill stats, and a scrollable player list. Closes on Escape key or backdrop click.

**Bulk CSV Export section (bottom of panel):**
- Language selector: EN / TR.
- Three buttons: Current Events, Previous Events, All Events — each calls `POST /api/admin/generate-report` with `{ type, language }`.
- Per-button loading state (`generating` is `null` or the active type string); all buttons disable while one is running.
- Success/error shown via toast.

**State:**
```js
events: []          // array from GET /api/admin/reports
loading: bool
fetchError: string | null
toast: { type, message } | null
```

**API calls:**
- `GET /api/admin/reports` — load finished events list (primary)
- `GET /api/admin/events/{slug}/report` — download Excel report for one event
- `POST /api/admin/reports/{slug}/anonymize` — anonymize event data; refreshes list on success
- `POST /api/admin/generate-report` — bulk CSV download (via BulkCsvSection)

### Known issues / limitations

1. **Anonymize endpoint:** The panel calls `POST /api/admin/reports/{slug}/anonymize`. Verify this endpoint exists and is correctly implemented in the backend.

2. **No known functional bugs** — the rewrite addressed all previous UX issues (shared loading state, shared error, no per-event tracking).

---

## AnalyticsPanel — Current State

**File:** `src/components/Admin/AnalyticsPanel.jsx`

### What it does

`AnalyticsPanel` fetches from two endpoints in parallel:

1. **`GET /api/admin/reports/analytics`** → structured analytics from the backend
2. **`GET /api/admin/events`** → full event list for local computation

### Sections

**Locally computed (from `/api/admin/events`):**
- Main 4-stat grid: Total Events, Total Tables, Total Players (only `approved` status), Active Events
- Event Type Distribution: pie-chart-style bars for game vs. general events
- Event Status Distribution: bars for active vs. finished + completion rate
- Averages row: avg tables/event, avg players/table, players/event, game event %
- Recent Events list (first 5 events by array order)

**Server-provided (from `/api/admin/reports/analytics`):**
- **Summary KPIs:** `total_events_reported`, `total_registrations`, `total_approved`, `overall_approval_rate`
- **Club Participation (All Time):** `analytics.club_totals` — object of `{ clubName: count }`, sorted descending, bar chart
- **Per-Event Reports:** `analytics.event_reports[]` — collapsible `<details>` per event:
  - Header: event slug, report type
  - Statistics grid: all keys from `report.statistics` rendered as tiles
  - Club distribution bars: `report.club_distribution` object
  - Participating clubs chip list: `report.clubs[]`
  - Extra fields: any keys not in `[report_type, event_slug, statistics, club_distribution, clubs]` rendered as key-value tiles via `formatValue()`

### State

```js
analytics: null | { summary, club_totals, event_reports[] }
events: []   // full event array from /api/admin/events
isLoading: bool
error: string | null
```

### Behavior notes

- Both API calls are made in a single `fetchAnalytics` async function.
- If the analytics endpoint fails, `error` is set and a Retry button is shown for the entire panel.
- If only the events endpoint fails (`eventsResponse.ok === false`), events silently remains `[]`; computed local stats show zeros.
- The "Refresh" button in the header re-calls `fetchAnalytics()`.
- `formatValue()` is a recursive formatter: numbers get `toLocaleString()`, objects/arrays get flattened to `"key: value, ..."` strings. Prevents crashes when backend returns unexpected nested data.
- The "Recent Events" section shows the first 5 from `events` slice — no sorting, just array order from the API.
