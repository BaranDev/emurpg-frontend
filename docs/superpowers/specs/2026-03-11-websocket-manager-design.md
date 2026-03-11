# WebSocket Manager — Design Spec

**Date:** 2026-03-11
**Repos affected:** `emurpg-frontend`, `emurpg-backend`
**Status:** Approved

---

## Problem

Every component that needs real-time updates opens its own WebSocket connection to `/ws/updates`. With 5 consumer components (`TablesAdminPanel` opens 2), a single browser tab can hold up to 6 concurrent connections. This wastes backend resources, duplicates reconnection logic, and is inconsistent.

Additional bugs found during analysis:

- `ConnectionManager.broadcast()` calls `send_json` twice per connection — once inside the `try` block and once unconditionally outside it. The fix is to remove the call outside the `try` block.
- Backend broadcasts a generic string with no type information, causing all consumers to re-fetch regardless of whether the change is relevant to them.
- `TablesAdminPanel` opens a second WebSocket at L284 (assigned to `playerWsRef.current`) with no `onclose` handler and no cleanup.
- `TablesAdminPanel` and `EventsAdminPanel` use `.replace("http", "ws")` for URL construction; the other three components don't — both patterns coexist. Additionally, `EventList.jsx`, `TableList.jsx`, and `TableDetailPage.jsx` all pass the raw `http://` URL directly to `new WebSocket()`, which is an invalid WebSocket URL and throws a `SyntaxError` in production (should be `ws://`).

---

## Goal

**One WebSocket connection per browser tab.** All components share it via a React context. The backend sends typed messages so each component only re-fetches when the relevant data changes.

---

## Architecture

### Backend (`emurpg-backend/main.py`)

1. **Fix `broadcast()` double-send bug** — remove the `send_json` call that sits outside the `try` block (after the `except` block). The call inside the `try` block is correct and must stay.
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
- Tracks the pending reconnect timer in a `ref` and calls `clearTimeout` in the cleanup function, preventing a stale reconnect after the provider unmounts.
- Parses incoming JSON. On parse failure, logs and ignores — no crash.
- Maintains a `Map<topic, Set<callback>>` subscriber registry.
- On message: calls all subscribers whose topic matches `message.type`, plus any registered with `null` (wildcard, fires for every message).
- Exposes `{ isConnected }` via context for future use (e.g. server health indicator).
- On provider unmount: cancels the reconnect timer, then calls `ws.close()`.

**`src/hooks/useWebSocket.js`**

```js
useWebSocket(topic, callback)
// topic: "tables" | "events" | null
// callback: caller should wrap in useCallback for stability
```

- Internally stores `callback` in a `ref` (`latestCallback`) on every render so that the subscriber registry always invokes the latest version without re-registering.
- Registers/unregisters a stable wrapper function (not the callback directly) so the `Set` identity stays constant across renders — callers who forget `useCallback` do not cause duplicate subscriptions.

#### Modified files

**`src/App.jsx`** — wrap `<Router>` (currently `BrowserRouter`) with `<WebSocketProvider>`:
```jsx
<WebSocketProvider>
  <Router>...</Router>
</WebSocketProvider>
```

**5 consumer components** — delete local WebSocket boilerplate, add one hook call each:

| Component | Topic |
|---|---|
| `EventList.jsx` | `"events"` |
| `TableList.jsx` | `"tables"` |
| `TableDetailPage.jsx` | `"tables"` |
| `TablesAdminPanel.jsx` | `"tables"` (both usages consolidated into one; `playerWsRef` socket removed) |
| `EventsAdminPanel.jsx` | `"events"` |

---

## Error Handling & Edge Cases

| Scenario | Behaviour |
|---|---|
| Backend offline on page load | Silent retry with backoff — no error surfaced to components |
| Connection drops mid-session | Auto-reconnect; components unaware |
| Component unmounts | `useWebSocket` unregisters stable wrapper; provider stays alive |
| Last subscriber unmounts | Provider keeps connection open |
| Provider unmounts | Pending reconnect timer cancelled; `ws.close()` called |
| Malformed JSON from backend | Caught, logged, ignored — no crash |
| Unknown `type` in message | No subscribers match, message silently dropped |
| MongoDB change stream crash (backend) | **Out of scope.** Both monitor tasks exit permanently on `PyMongoError` and are not restarted. This pre-existing behaviour is unchanged by this spec. After a MongoDB crash the backend will stop broadcasting until the server restarts. Track as a separate follow-up. |

---

## Testing

### Backend (`tests/test_ws_updates.py`) — new file

- Connect to `/ws/updates` via TestClient, trigger a mock broadcast of `{"type": "tables"}`, assert client receives it exactly once.
- Assert `{"type": "events"}` message shape from `monitor_event_changes`.
- Regression test: each client receives each broadcast exactly 1 time (verifies the double-send bug fix).

### Frontend

**Unit tests for `WebSocketContext`** using a mocked `WebSocket` global:
- Subscriber registered with `"tables"` is called on `{"type": "tables"}` message, not on `{"type": "events"}`.
- Wildcard subscriber (`null`) is called for both message types.
- Subscriber is unregistered after `useWebSocket` cleanup runs.
- Reconnect timer is cancelled on provider unmount (no new socket created after teardown).
- Passing an `http://` URL to `new WebSocket()` throws a `SyntaxError` synchronously. Regression test: after the `replace(/^http/, "ws")` fix, no `SyntaxError` is thrown. This covers the existing bug in `EventList.jsx` where `config.backendUrl` (`http://...`) was passed directly.

### Manual verification checklist

- [ ] Only 1 WebSocket connection visible in browser DevTools → Network → WS per tab
- [ ] Editing a table triggers `TableList` and `TablesAdminPanel` refresh, not `EventList`
- [ ] Editing an event triggers `EventList` and `EventsAdminPanel` refresh, not table components
- [ ] Tab close / reopen reconnects cleanly with backoff

---

## Files Changed

| Repo | File | Change |
|---|---|---|
| backend | `main.py` | Fix broadcast bug; type the two monitor messages; remove the now-unused `WS_MESSAGE` constant |
| backend | `tests/test_ws_updates.py` | New test file |
| frontend | `src/contexts/WebSocketContext.jsx` | New — provider |
| frontend | `src/hooks/useWebSocket.js` | New — hook |
| frontend | `src/App.jsx` | Add `<WebSocketProvider>` wrapper |
| frontend | `src/components/events/EventList.jsx` | Replace local WS with hook |
| frontend | `src/components/tables/TableList.jsx` | Replace local WS with hook |
| frontend | `src/pages/TableDetailPage.jsx` | Replace local WS with hook |
| frontend | `src/components/Admin/TablesAdminPanel.jsx` | Replace both WS usages with one hook |
| frontend | `src/components/Admin/EventsAdminPanel.jsx` | Replace local WS with hook |
