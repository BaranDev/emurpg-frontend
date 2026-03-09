# Server Health Indicator — Design Doc

**Date:** 2026-03-09
**Status:** Approved

## Summary

Add a server health indicator to the admin dashboard showing API response time with green/yellow/red status. Visible in two places: a persistent badge in the header and an expanded card on the dashboard overview.

## Approach

Frontend-only ping (Approach A): the admin client fetches `GET /health` directly, measures round-trip with `performance.now()`, and polls every 30 seconds. No backend changes required.

## Thresholds

| Color  | Condition         | Label       |
|--------|-------------------|-------------|
| Green  | < 300ms           | Healthy     |
| Yellow | 300–800ms         | Slow        |
| Red    | > 800ms or error  | Unreachable |

## Components Affected

### `AdminMain.jsx`
- Add `serverHealth` state: `{ status, responseMs, lastChecked }`
- Add `fetchHealth()` function using `performance.now()` around a `fetch(${backendUrl}/health)`
- Poll every 30s via `setInterval` in a `useEffect`; clear on unmount
- Pass `serverHealth` as prop to `AdminHeader` and `DashboardPanel`

### `AdminHeader.jsx`
- Add a small colored dot + ms label to the header bar
- Always visible regardless of active panel

### `DashboardPanel` (inside `AdminMain.jsx`)
- Add a 5th card to the existing stats grid
- Shows: colored dot, status label, response time in ms, "last checked" relative time

## Data Flow

```
AdminMain
  ├── fetchHealth() → setServerHealth()
  ├── setInterval(fetchHealth, 30000)
  ├── AdminLayout → AdminHeader (receives serverHealth)
  └── DashboardPanel (receives serverHealth)
```

## No Backend Changes

The existing `GET /health` endpoint returns `{"status": "healthy"}` — sufficient. Response time is measured client-side.

## Out of Scope

- DB-level health breakdown
- WebSocket latency measurement
- Historical response time graph
