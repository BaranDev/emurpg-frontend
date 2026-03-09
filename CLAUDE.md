# EMURPG Frontend — Agent Instructions

## Stack

- React 18 + Vite (no TypeScript)
- React Router v6, react-i18next, Tailwind CSS, Ant Design
- No path aliases — all imports are relative (`./` or `../`)
- Test runner: Vitest + React Testing Library
- E2E: Playwright (smoke tests in `e2e/`)

## Project Structure

```
src/
  pages/          # One file per route in App.jsx
  components/     # Shared UI — barrel at components/index.jsx
    layout/       # Navbar, MainFooter, BottomNavBar, EventsFooter
    shared/       # Atoms: SectionTitle, FireButton, ParallaxBackground, etc.
    events/       # EventCard, EventList, RegistrationForm, etc.
    tables/       # TableList, GameMasterCard, GameGuideModal
    Charroller/   # Charroller feature components
    TavernRun/    # TavernRun feature components
    Admin/        # Admin panel components
  contexts/       # React contexts (GlobalAudioContext, etc.)
  hooks/          # Custom hooks
  config.jsx      # API base URL, DEV flag
  i18n.js         # i18n setup
e2e/              # Playwright smoke tests
```

## Rules for Agents

### Testing — MANDATORY

- **Every new page** (`src/pages/`) MUST have a corresponding E2E smoke test in `e2e/smoke.spec.js`.
  Add the route to the smoke suite when creating or renaming any page file.

- **Every new component** with logic (hooks, state, effects) MUST have a unit test in `src/__tests__/`.
  Use `@testing-library/react`. Test behaviour, not implementation.

- **Every new hook** MUST have a unit test.

- Run `npm test` before committing. All 28+ tests must pass.

- Run `npm run build` before committing. Build must succeed with zero errors.

### Adding a New Route

1. Create `src/pages/MyPage.jsx`
2. Add `<Route path="/my-path" element={<MyPage />} />` to `src/App.jsx`
3. Add a smoke test in `e2e/smoke.spec.js` for `/my-path`
4. Export from `src/components/index.jsx` if the page re-uses shared components

### Moving/Renaming Files

- Update **all** relative import paths. Depth changes matter:
  - `components/` (depth 1) → `components/subfolder/` (depth 2): `../config` → `../../config`
- Re-run `python src/MAP_FILES.py` to verify no broken imports.
- Update `src/components/index.jsx` barrel if a component moved.

### DEV Flag

- `src/config.jsx` contains `const DEV = true;` during development.
- **Never merge with `DEV = true`.** CI enforces this.

### Commits

- Prefer small, focused commits per logical change.
- Message format: `feat:`, `fix:`, `refactor:`, `test:`, `chore:`
