# WebSocket Manager — Design Spec

**Date:** 2026-03-11
**Repos affected:** `emurpg-frontend`, `emurpg-backend`
**Status:** Approved

---

## Problem

Every component that needs real-time updates opens its own WebSocket connection to `/ws/updates`. With 5 consumer components (and `TablesAdminPanel` opening 2), a single browser tab can hold up to 6 concurrent connections. This wastes backend resources, duplicates reconnection logic across components, and is inconsistent in URL construction.

Additional bugs found during analysis:
- `ConnectionManager.broadcast()` sends every message twice (missing `return` after the `try` block).
- Backend broadcasts a generic string with no type information, causing all consumers to re-fetch regardless of whether the change is relevant to them.
- `TablesAdminPanel` opens a second orphaned WebSocket at L284 with no cleanup.
- Some components use `.replace("http", "ws")` for URL construction; others don't — both patterns coexist.

---

## Goal

**One WebSocket connection per browser tab.** All components share it via a React context. The backend sends typed messages so each component only re-fetches when the relevant data changes.

---

## Architecture

### Backend (`emurpg-backend/main.py`)

1. **Fix `broadcast()` double-send bug** — remove the `send_json` call outside the `try` block.
2. **Type the messages** — both monitor functions send a JSON object with a `type` field:
   - `monitor_table_changes()` → `{"type": "tables"}`
   - `monitor_event_changes()` → `{"type": "events"}`

No payload is included — consumers always re-fetch from REST after notification, consistent with current behaviour.

### Frontend (`emurpg-frontend/src/`)

#### New files

**`src/contexts/WebSocketContext.jsx`**

- Opens exactly one WebSocket connection on mount.
- Builds the URL once, correctly: `config.backendUrl.replace(/^http/, "ws") + "/ws/updates"`.
- Reconnects with exponential backoff (1 s → 2 s → 4 s → … capped at 30 s), reset on successful open.
- Parses incoming JSON. On parse failure, logs and ignores the message.
- Maintains a `Map<topic, Set<callback>>` subscriber registry.
- On message: calls all subscribers whose topic matches `message.type`, plus any subscribers registered with `null` (wildcard).
- Exposes `{ isConnected }` via context for future use (e.g. server health indicator).
- On provider unmount: calls `ws.close()` cleanly.

**`src/hooks/useWebSocket.js`**

```js
useWebSocket(topic, callback)
// topic: "tables" | "events" | null
// callback: must be a stable reference (caller wraps in useCallback)
```

Registers the callback on mount, unregisters on unmount. Does not manage the connection itself.

#### Modified files

**`src/App.jsx`** — wrap the router with `<WebSocketProvider>` once.

**5 consumer components** — delete local WebSocket boilerplate, add one hook call each:

| Component | Topic |
|---|---|
| `EventList.jsx` | `"events"` |
| `HomePageEventList.jsx` | `"events"` |
| `TableList.jsx` | `"tables"` |
| `TableDetailPage.jsx` | `"tables"` |
| `TablesAdminPanel.jsx` | `"tables"` (both usages consolidated into one) |
| `EventsAdminPanel.jsx` | `"events"` |

---

## Error Handling & Edge Cases

| Scenario | Behaviour |
|---|---|
| Backend offline on page load | Silent retry with backoff — no error surfaced to components |
| Connection drops mid-session | Auto-reconnect; components unaware |
| Component unmounts | `useWebSocket` unregisters callback; provider stays alive |
| Last subscriber unmounts | Provider keeps connection open |
| Provider unmounts | `ws.close()` called cleanly |
| Malformed JSON from backend | Caught, logged, ignored — no crash |
| Unknown `type` in message | No subscribers match, message silently dropped |

---

## Testing

### Backend (`tests/test_ws_updates.py`) — new file

- Connect to `/ws/updates` via TestClient, trigger a mock broadcast of `{"type": "tables"}`, assert client receives it exactly once.
- Assert `{"type": "events"}` message shape from `monitor_event_changes`.
- Regression test: each client receives each broadcast exactly 1 time (verifies the double-send bug is fixed).

### Frontend

- Existing component tests are unaffected — the hook hides WS internals.
- No new component tests required.

### Manual verification checklist

- [ ] Only 1 WebSocket connection visible in browser DevTools → Network → WS per tab
- [ ] Editing a table triggers `TableList` and `TablesAdminPanel` refresh, not `EventList`
- [ ] Editing an event triggers `EventList` and `EventsAdminPanel` refresh, not table components
- [ ] Tab close / reopen reconnects cleanly with backoff

---

## Files Changed

| Repo | File | Change |
|---|---|---|
| backend | `main.py` | Fix broadcast bug; type the two monitor messages |
| backend | `tests/test_ws_updates.py` | New test file |
| frontend | `src/contexts/WebSocketContext.jsx` | New — provider |
| frontend | `src/hooks/useWebSocket.js` | New — hook |
| frontend | `src/App.jsx` | Add `<WebSocketProvider>` wrapper |
| frontend | `src/components/events/EventList.jsx` | Replace local WS with hook |
| frontend | `src/components/tables/TableList.jsx` | Replace local WS with hook |
| frontend | `src/pages/TableDetailPage.jsx` | Replace local WS with hook |
| frontend | `src/components/Admin/TablesAdminPanel.jsx` | Replace both WS usages with one hook |
| frontend | `src/components/Admin/EventsAdminPanel.jsx` | Replace local WS with hook |
