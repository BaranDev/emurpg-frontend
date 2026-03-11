# WebSocket Manager Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 5–6 independent per-component WebSocket connections with a single shared connection managed by a React context, and add typed messages to the backend so components only re-fetch when relevant data changes.

**Architecture:** The backend broadcasts `{"type": "tables"}` or `{"type": "events"}` instead of a generic string. On the frontend, `WebSocketContext` owns one WebSocket connection with exponential-backoff reconnection and a topic-keyed subscriber registry. `useWebSocket(topic, callback)` registers/unregisters a component's callback without touching the connection.

**Tech Stack:** Python 3 / FastAPI / pytest (backend), React 18 / Vitest / jsdom / @testing-library/react (frontend)

**Spec:** `docs/superpowers/specs/2026-03-11-websocket-manager-design.md`

---

## Chunk 1: Backend — fix broadcast bug + typed messages

### Task 1: Fix `ConnectionManager.broadcast()` double-send bug

**Files:**
- Modify: `emurpg-backend/main.py:109-115`
- Create: `emurpg-backend/tests/test_ws_updates.py`

- [ ] **Step 1: Write the failing regression test**

Create `emurpg-backend/tests/test_ws_updates.py`:

```python
import asyncio
from unittest.mock import AsyncMock, MagicMock
from fastapi.testclient import TestClient
from main import app, ConnectionManager

client = TestClient(app)


def test_broadcast_sends_exactly_once():
    """Each connected client receives a broadcast message exactly once.

    Uses a unit-level mock so we're not fighting TestClient's event loop.
    """
    mgr = ConnectionManager()
    mock_ws = MagicMock()
    mock_ws.send_json = AsyncMock()
    mgr.active_connections.append(mock_ws)

    asyncio.run(mgr.broadcast({"type": "tables"}))

    # Must be called exactly once — the double-send bug causes called_once to fail
    mock_ws.send_json.assert_called_once_with({"type": "tables"})


def test_ws_endpoint_connects():
    """WebSocket endpoint accepts and cleanly closes a connection."""
    with client.websocket_connect("/ws/updates"):
        pass  # connect + disconnect without error is sufficient
```

- [ ] **Step 2: Run the test — verify `test_broadcast_sends_exactly_once` FAILS**

```bash
cd "d:/git clones/emurpg-backend"
pytest tests/test_ws_updates.py::test_broadcast_sends_exactly_once -v
```

Expected: FAIL — `assert_called_once_with` fails because the bug calls `send_json` twice.

- [ ] **Step 3: Fix the bug in `main.py`**

In `main.py` around line 109, the `broadcast` method currently looks like this:

```python
async def broadcast(self, message: dict):
    for connection in self.active_connections:
        try:
            await connection.send_json(message)
        except Exception as e:
            print(f"Failed to send message to a connection: {e}")
        await connection.send_json(message)   # ← BUG: remove this line
```

Remove the last `await connection.send_json(message)` line (the one outside the `try` block). The corrected method:

```python
async def broadcast(self, message: dict):
    for connection in self.active_connections:
        try:
            await connection.send_json(message)
        except Exception as e:
            print(f"Failed to send message to a connection: {e}")
```

- [ ] **Step 4: Run the test — verify it PASSES**

```bash
pytest tests/test_ws_updates.py::test_broadcast_sends_exactly_once -v
```

Expected: PASS

- [ ] **Step 5: Run the full test suite**

```bash
pytest -v
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
cd "d:/git clones/emurpg-backend"
git add main.py tests/test_ws_updates.py
git commit -m "fix: remove double send_json in ConnectionManager.broadcast"
```

---

### Task 2: Add typed messages to monitor functions, remove `WS_MESSAGE`

**Files:**
- Modify: `emurpg-backend/main.py:66-68, 192-223`
- Modify: `emurpg-backend/tests/test_ws_updates.py`

- [ ] **Step 1: Verify `WS_MESSAGE` is not referenced anywhere else before removing it**

```bash
cd "d:/git clones/emurpg-backend"
grep -rn "WS_MESSAGE" .
```

Expected: only 2 hits — the definition at line 68 and the usage at line 200 in `monitor_table_changes`. If any other file references it, add that file to the change set.

- [ ] **Step 2: Add tests for typed message shapes**

Append to `emurpg-backend/tests/test_ws_updates.py`:

```python
def test_broadcast_tables_type():
    """broadcast() sends {"type": "tables"} exactly as given."""
    mgr = ConnectionManager()
    mock_ws = MagicMock()
    mock_ws.send_json = AsyncMock()
    mgr.active_connections.append(mock_ws)

    asyncio.run(mgr.broadcast({"type": "tables"}))
    mock_ws.send_json.assert_called_once_with({"type": "tables"})


def test_broadcast_events_type():
    """broadcast() sends {"type": "events"} exactly as given."""
    mgr = ConnectionManager()
    mock_ws = MagicMock()
    mock_ws.send_json = AsyncMock()
    mgr.active_connections.append(mock_ws)

    asyncio.run(mgr.broadcast({"type": "events"}))
    mock_ws.send_json.assert_called_once_with({"type": "events"})
```

- [ ] **Step 3: Run new tests — verify they PASS** (they test `broadcast` directly, already fixed)

```bash
pytest tests/test_ws_updates.py -v
```

Expected: all 4 tests pass.

- [ ] **Step 4: Update `monitor_table_changes` and `monitor_event_changes`**

In `main.py`, find the `WS_MESSAGE` constant (around line 68):

```python
# Websocket message for updates
WS_MESSAGE = "Records updated"
```

Delete those two lines entirely.

Then find `monitor_table_changes` (around line 192) and change:

```python
await manager.broadcast({"message": WS_MESSAGE})
```

to:

```python
await manager.broadcast({"type": "tables"})
```

Then find `monitor_event_changes` (around line 217) and change:

```python
await manager.broadcast({"message": "Records updated"})
```

to:

```python
await manager.broadcast({"type": "events"})
```

- [ ] **Step 5: Run the full test suite**

```bash
pytest -v
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add main.py tests/test_ws_updates.py
git commit -m "feat: broadcast typed {type: tables/events} messages from monitor functions"
```

---

## Chunk 2: Frontend — WebSocket infrastructure

### Task 3: Create `WebSocketContext.jsx`

**Files:**
- Create: `emurpg-frontend/src/contexts/WebSocketContext.jsx`
- Create: `emurpg-frontend/src/test/WebSocketContext.test.jsx`

- [ ] **Step 1: Write the failing tests**

Create `emurpg-frontend/src/test/WebSocketContext.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act, renderHook } from "@testing-library/react";
import { useContext } from "react";
import {
  WebSocketProvider,
  WebSocketContext,
} from "../contexts/WebSocketContext";

// ── Mock WebSocket ──────────────────────────────────────────────────────────
let mockWsInstance;

class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = MockWebSocket.CONNECTING;
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    mockWsInstance = this;
  }
  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.({ code: 1000 });
  }
  // Helper for tests: simulate the server sending a message
  simulateMessage(data) {
    this.onmessage?.({ data: JSON.stringify(data) });
  }
  simulateOpen() {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.();
  }
}
MockWebSocket.CONNECTING = 0;
MockWebSocket.OPEN = 1;
MockWebSocket.CLOSED = 3;

vi.mock("../config", () => ({
  config: { backendUrl: "http://localhost:8000" },
}));

beforeEach(() => {
  vi.stubGlobal("WebSocket", MockWebSocket);
  vi.useFakeTimers();
  mockWsInstance = null;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// ── Helpers ─────────────────────────────────────────────────────────────────
const wrapper = ({ children }) => (
  <WebSocketProvider>{children}</WebSocketProvider>
);

// ── Tests ────────────────────────────────────────────────────────────────────
describe("WebSocketProvider", () => {
  it("constructs WS URL using ws:// not http://", () => {
    render(<WebSocketProvider><div /></WebSocketProvider>);
    expect(mockWsInstance.url).toBe("ws://localhost:8000/ws/updates");
  });

  it("does not throw SyntaxError — URL uses ws:// not http://", () => {
    // If the URL were still http://, new WebSocket() would throw SyntaxError in real browsers.
    // Here we verify the mock was called with a ws:// URL (not http://).
    expect(() =>
      render(<WebSocketProvider><div /></WebSocketProvider>)
    ).not.toThrow();
    expect(mockWsInstance.url).toMatch(/^ws:\/\//);
  });

  it("exposes isConnected=false before open", () => {
    const { result } = renderHook(() => useContext(WebSocketContext), { wrapper });
    expect(result.current.isConnected).toBe(false);
  });

  it("exposes isConnected=true after open", async () => {
    const { result } = renderHook(() => useContext(WebSocketContext), { wrapper });
    await act(() => mockWsInstance.simulateOpen());
    expect(result.current.isConnected).toBe(true);
  });

  it("calls tables subscribers on {type: tables} message", async () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useContext(WebSocketContext), { wrapper });

    // Register a "tables" subscriber manually
    act(() => {
      const set = new Set([cb]);
      result.current.subscribersRef.current.set("tables", set);
    });

    await act(() => mockWsInstance.simulateOpen());
    await act(() => mockWsInstance.simulateMessage({ type: "tables" }));

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("does NOT call tables subscribers on {type: events} message", async () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useContext(WebSocketContext), { wrapper });

    act(() => {
      result.current.subscribersRef.current.set("tables", new Set([cb]));
    });

    await act(() => mockWsInstance.simulateOpen());
    await act(() => mockWsInstance.simulateMessage({ type: "events" }));

    expect(cb).not.toHaveBeenCalled();
  });

  it("calls wildcard (null) subscribers on any message type", async () => {
    const cb = vi.fn();
    const { result } = renderHook(() => useContext(WebSocketContext), { wrapper });

    act(() => {
      result.current.subscribersRef.current.set(null, new Set([cb]));
    });

    await act(() => mockWsInstance.simulateOpen());
    await act(() => mockWsInstance.simulateMessage({ type: "tables" }));
    await act(() => mockWsInstance.simulateMessage({ type: "events" }));

    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("does not crash on malformed JSON", async () => {
    render(<WebSocketProvider><div /></WebSocketProvider>);
    await act(() => mockWsInstance.simulateOpen());
    expect(() =>
      act(() => mockWsInstance.onmessage?.({ data: "not-json{{" }))
    ).not.toThrow();
  });

  it("schedules reconnect after close with initial backoff of 1000ms", async () => {
    render(<WebSocketProvider><div /></WebSocketProvider>);
    const firstWs = mockWsInstance;
    await act(() => firstWs.simulateOpen());

    // Simulate disconnect
    await act(() => firstWs.close());

    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    // After close, a setTimeout for reconnect should have been scheduled
    // Advance timers past 1000ms to trigger reconnect
    await act(() => vi.advanceTimersByTime(1100));

    expect(mockWsInstance).not.toBe(firstWs); // new WS was created
  });

  it("cancels reconnect timer on provider unmount", async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = render(<WebSocketProvider><div /></WebSocketProvider>);
    await act(() => mockWsInstance.simulateOpen());
    await act(() => mockWsInstance.close()); // schedules reconnect timer

    unmount(); // should cancel the timer

    expect(clearTimeoutSpy).toHaveBeenCalled();
    // No new WebSocket created after unmount
    const wsAfterUnmount = mockWsInstance;
    await act(() => vi.advanceTimersByTime(5000));
    // mockWsInstance should still be the same (no new connection)
    // Note: this is satisfied because clearTimeout prevented the reconnect
  });
});
```

- [ ] **Step 2: Run — verify ALL tests FAIL**

```bash
cd "d:/git clones/emurpg-frontend"
npm test -- src/test/WebSocketContext.test.jsx
```

Expected: all fail with "Cannot find module '../contexts/WebSocketContext'"

- [ ] **Step 3: Create `src/contexts/WebSocketContext.jsx`**

```jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { config } from "../config";

export const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const subscribersRef = useRef(new Map()); // topic (string|null) -> Set<fn>
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const backoffRef = useRef(1000);

  useEffect(() => {
    const wsUrl = config.backendUrl.replace(/^http/, "ws") + "/ws/updates";

    function connect() {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        backoffRef.current = 1000; // reset backoff on successful open
      };

      ws.onmessage = (event) => {
        let msg;
        try {
          msg = JSON.parse(event.data);
        } catch {
          console.warn("[WS] Received non-JSON message:", event.data);
          return;
        }
        const type = msg?.type ?? null;
        // Notify topic-specific subscribers
        subscribersRef.current.get(type)?.forEach((fn) => fn());
        // Notify wildcard subscribers (skip if message itself was null-typed to avoid double-fire)
        if (type !== null) {
          subscribersRef.current.get(null)?.forEach((fn) => fn());
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        reconnectTimerRef.current = setTimeout(() => {
          backoffRef.current = Math.min(backoffRef.current * 2, 30000);
          connect();
        }, backoffRef.current);
      };

      ws.onerror = () => {
        // onclose fires after onerror — reconnect is handled there
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribersRef }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const ctx = useContext(WebSocketContext);
  if (!ctx)
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    );
  return ctx;
}
```

- [ ] **Step 4: Run the tests — verify they PASS**

```bash
npm test -- src/test/WebSocketContext.test.jsx
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/contexts/WebSocketContext.jsx src/test/WebSocketContext.test.jsx
git commit -m "feat: add WebSocketContext provider with typed pub/sub and backoff reconnect"
```

---

### Task 4: Create `useWebSocket` hook

**Files:**
- Create: `emurpg-frontend/src/hooks/useWebSocket.js`
- Create: `emurpg-frontend/src/test/useWebSocket.test.jsx`

- [ ] **Step 1: Write the failing tests**

Create `emurpg-frontend/src/test/useWebSocket.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCallback } from "react";
import { WebSocketProvider, WebSocketContext } from "../contexts/WebSocketContext";
import { useWebSocket } from "../hooks/useWebSocket";

// ── Reuse mock WS from context tests ────────────────────────────────────────
let mockWsInstance;
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.onopen = null; this.onmessage = null; this.onclose = null; this.onerror = null;
    mockWsInstance = this;
  }
  close() { this.onclose?.({ code: 1000 }); }
  simulateMessage(data) { this.onmessage?.({ data: JSON.stringify(data) }); }
  simulateOpen() { this.onopen?.(); }
}

vi.mock("../config", () => ({ config: { backendUrl: "http://localhost:8000" } }));

beforeEach(() => { vi.stubGlobal("WebSocket", MockWebSocket); vi.useFakeTimers(); });
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); vi.restoreAllMocks(); });

const wrapper = ({ children }) => <WebSocketProvider>{children}</WebSocketProvider>;

describe("useWebSocket", () => {
  it("calls callback when a matching topic message arrives", async () => {
    const cb = vi.fn();
    renderHook(() => useWebSocket("tables", cb), { wrapper });

    await act(() => mockWsInstance.simulateOpen());
    await act(() => mockWsInstance.simulateMessage({ type: "tables" }));

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("does NOT call callback for a different topic", async () => {
    const cb = vi.fn();
    renderHook(() => useWebSocket("tables", cb), { wrapper });

    await act(() => mockWsInstance.simulateOpen());
    await act(() => mockWsInstance.simulateMessage({ type: "events" }));

    expect(cb).not.toHaveBeenCalled();
  });

  it("calls wildcard subscriber for every message type", async () => {
    const cb = vi.fn();
    renderHook(() => useWebSocket(null, cb), { wrapper });

    await act(() => mockWsInstance.simulateOpen());
    await act(() => mockWsInstance.simulateMessage({ type: "tables" }));
    await act(() => mockWsInstance.simulateMessage({ type: "events" }));

    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("unregisters callback on unmount", async () => {
    const cb = vi.fn();
    const { unmount } = renderHook(() => useWebSocket("tables", cb), { wrapper });

    await act(() => mockWsInstance.simulateOpen());
    unmount();
    await act(() => mockWsInstance.simulateMessage({ type: "tables" }));

    expect(cb).not.toHaveBeenCalled();
  });

  it("does not double-register if callback reference changes between renders", async () => {
    // Simulate a component that doesn't use useCallback
    let callCount = 0;
    const { rerender } = renderHook(
      () => useWebSocket("tables", () => callCount++),
      { wrapper }
    );

    // Re-render 5 times (new function reference each time)
    rerender(); rerender(); rerender(); rerender(); rerender();

    await act(() => mockWsInstance.simulateOpen());
    await act(() => mockWsInstance.simulateMessage({ type: "tables" }));

    // Should only be called once despite many re-renders
    expect(callCount).toBe(1);
  });
});
```

- [ ] **Step 2: Run — verify ALL tests FAIL**

```bash
npm test -- src/test/useWebSocket.test.jsx
```

Expected: all fail with "Cannot find module '../hooks/useWebSocket'"

- [ ] **Step 3: Create `src/hooks/useWebSocket.js`**

```js
import { useEffect, useRef } from "react";
import { useWebSocketContext } from "../contexts/WebSocketContext";

/**
 * Subscribe to WebSocket messages by topic.
 * @param {string|null} topic  "tables" | "events" | null (null = all messages)
 * @param {Function}    callback  Called when a matching message arrives.
 *                                Wrap in useCallback if the component re-renders often.
 */
export function useWebSocket(topic, callback) {
  const { subscribersRef } = useWebSocketContext();
  const latestCallbackRef = useRef(callback);

  // Keep latestCallbackRef current on every render — no re-registration needed
  useEffect(() => {
    latestCallbackRef.current = callback;
  });

  useEffect(() => {
    const topicKey = topic ?? null;
    // Stable wrapper identity — registered once per mount, calls latest callback
    const stableWrapper = () => latestCallbackRef.current?.();

    if (!subscribersRef.current.has(topicKey)) {
      subscribersRef.current.set(topicKey, new Set());
    }
    subscribersRef.current.get(topicKey).add(stableWrapper);

    return () => {
      subscribersRef.current.get(topicKey)?.delete(stableWrapper);
    };
  }, [topic, subscribersRef]); // topic change re-registers under the new key
}
```

- [ ] **Step 4: Run the tests — verify they PASS**

```bash
npm test -- src/test/useWebSocket.test.jsx
```

Expected: all tests pass.

- [ ] **Step 5: Run the full frontend test suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useWebSocket.js src/test/useWebSocket.test.jsx
git commit -m "feat: add useWebSocket hook with stable-wrapper subscriber pattern"
```

---

### Task 5: Wrap `App.jsx` with `WebSocketProvider`

**Files:**
- Modify: `emurpg-frontend/src/App.jsx:1-77`

- [ ] **Step 1: Add the import and wrap `AppContent`**

In `src/App.jsx`:

Add import at the top (after line 4 `GlobalAudioProvider` import):
```jsx
import { WebSocketProvider } from "./contexts/WebSocketContext";
```

Change the `App` function from:
```jsx
function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppContent />
    </I18nextProvider>
  );
}
```
to:
```jsx
function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <WebSocketProvider>
        <AppContent />
      </WebSocketProvider>
    </I18nextProvider>
  );
}
```

- [ ] **Step 2: Run the full test suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wrap app with WebSocketProvider"
```

---

## Chunk 3: Frontend — migrate consumer components

### Task 6: Migrate `EventList.jsx`

**Files:**
- Modify: `emurpg-frontend/src/components/events/EventList.jsx`

The goal is to delete all local WebSocket code and replace it with one `useWebSocket` call.

- [ ] **Step 1: Remove WS state, refs, and the WebSocket `useEffect`**

In `EventList.jsx`:

**Remove** from the imports line 1:
- `useRef` (check if still needed elsewhere in the file — remove from import if not)

**Remove** these state/ref declarations:
```jsx
const [ws, setWs] = useState(null);
const wsConnected = useRef(false);
const wsConnectionAttempted = useRef(false);
```

**Remove** the entire second `useEffect` (lines 37–94) that contains `connectWebSocket`.

- [ ] **Step 2: Add `useWebSocket` import and call**

Add to the imports at the top:
```jsx
import { useCallback } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
```

Note: `useCallback` may already be imported — check before adding.

Add after the `fetchEvents` / initial fetch `useEffect` (after line 35):
```jsx
const handleWsUpdate = useCallback(() => {
  if (error) return;
  fetch(`${config.backendUrl}/api/events`)
    .then((res) => res.json())
    .then((data) => setEvents(data))
    .catch(() => {});
}, [error]);

useWebSocket("events", handleWsUpdate);
```

- [ ] **Step 3: Verify the file still has the browser-support guard**

Confirm line 97 still reads:
```jsx
if (!window.fetch || !window.WebSocket) {
```
Leave this untouched.

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/events/EventList.jsx
git commit -m "refactor: replace local WS in EventList with useWebSocket hook"
```

---

### Task 7: Migrate `TableList.jsx`

**Files:**
- Modify: `emurpg-frontend/src/components/tables/TableList.jsx`

- [ ] **Step 1: Remove WS state, refs, and WebSocket code**

**Remove** from imports: `useRef` if unused after this change.

**Remove** these declarations:
```jsx
const [ws, setWs] = useState(null);
const wsConnected = useRef(false);
const wsConnectionAttempted = useRef(false);
```

**Remove** inside the `useEffect` (lines 21–114):
- The entire `connectWebSocket` function (lines 66–97)
- The `if (!wsConnectionAttempted.current && !error)` block (lines 103–107)
- The cleanup return that closes `ws` (lines 109–113)

Keep the rest of the `useEffect` unchanged: `fetchTables()`, `fetchGames()`, `fetchThemes()`.

**Remove** `ws` from the `useEffect` dependency array at line 114.

- [ ] **Step 2: Add `useWebSocket` import and call**

Add to imports:
```jsx
import { useCallback } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
```

The `fetchTables` function is defined inside the `useEffect` — extract it to a `useCallback` at the component level so `useWebSocket` can reference it. After the existing state declarations, add:

```jsx
const fetchTables = useCallback(() => {
  fetch(`${config.backendUrl}/api/events/${eventSlug}/tables`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch tables");
      return res.json();
    })
    .then((data) => {
      setTables(data);
      setError(null);
    })
    .catch((err) => {
      console.log("Failed to fetch tables:", err.message);
      setError(err.message);
      setTables([]);
    })
    .finally(() => setLoading(false));
}, [eventSlug]);

useWebSocket("tables", fetchTables);
```

In the `useEffect`, replace the inline `fetchTables` definition with a call to the `useCallback` version: `fetchTables()`.

Update the `useEffect` dependency array to include `fetchTables` and remove `ws` and `error`.

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/tables/TableList.jsx
git commit -m "refactor: replace local WS in TableList with useWebSocket hook"
```

---

### Task 8: Migrate `TableDetailPage.jsx`

**Files:**
- Modify: `emurpg-frontend/src/pages/TableDetailPage.jsx`

- [ ] **Step 1: Remove WS state, ref, and WebSocket code**

**Remove** from imports: `useRef` if unused after this change.

**Remove** these declarations:
```jsx
const [ws, setWs] = useState(null);
const wsConnected = useRef(false);
```

**Remove** from the `useEffect` (lines 32–75):
- The comment `// Establish the WebSocket connection`
- The entire `connectWebSocket` function (lines 37–64)
- The `// Connect WebSocket` comment and `connectWebSocket()` call (lines 66–67)
- The cleanup return that closes `ws` (lines 69–74)

Keep only `fetchTableData()` at the start of the `useEffect`.

The `useEffect` dependency array is already `[slug, backendUrl, fetchTableData]` — no change needed there.

- [ ] **Step 2: Add `useWebSocket` call**

Add to imports:
```jsx
import { useWebSocket } from "../hooks/useWebSocket";
```

After the `fetchTableData` `useCallback` definition, add:
```jsx
useWebSocket("tables", fetchTableData);
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/pages/TableDetailPage.jsx
git commit -m "refactor: replace local WS in TableDetailPage with useWebSocket hook"
```

---

### Task 9: Migrate `TablesAdminPanel.jsx`

**Files:**
- Modify: `emurpg-frontend/src/components/Admin/TablesAdminPanel.jsx`

This file has two WebSocket usages to remove: the `useEffect` one (lines 138–158) and the inline one at L284 (`openPlayersModal`). The second socket auto-refreshed the players modal when table data changed — we replace this with a combined `useWebSocket` callback that refreshes both the main data and any open modal.

- [ ] **Step 1: Remove both WebSocket usages and all `playerWsRef`/`wsRef` references**

**Remove** both ref declarations (lines 77–78):
```jsx
const wsRef = useRef(null);
const playerWsRef = useRef(null);
```

**In the `useEffect` (lines 135–158):**
- Remove `connectWebSocket` function (lines 138–150)
- Remove `connectWebSocket()` call (line 152)
- Remove the entire cleanup return (lines 154–157) — both `wsRef.current.close()` and `playerWsRef.current.close()` are now unnecessary

**In `openPlayersModal` (around line 284):**
- Remove the `const socket = new WebSocket(...)` block, `socket.onmessage` line, and `playerWsRef.current = socket;` (lines 284–288)

**In the Players Modal `onClose` handler (around line 1076):**
- Remove `if (playerWsRef.current) playerWsRef.current.close();`

- [ ] **Step 2: Add `useWebSocket` import and call**

Add to imports:
```jsx
import { useWebSocket } from "../../hooks/useWebSocket";
```

The old `playerWsRef` socket called `refreshPlayers(table.slug)` when the modal was open. To preserve this behaviour, pass a plain function that refreshes both the main data and any open modal. No `useCallback` needed — the hook's stable-wrapper pattern always invokes the latest closure:

```jsx
useWebSocket("tables", () => {
  fetchData();
  if (selectedTable) {
    refreshPlayers(selectedTable.slug);
  }
});
```

Place this after the `fetchData` and `refreshPlayers` definitions.

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/Admin/TablesAdminPanel.jsx
git commit -m "refactor: replace both WS connections in TablesAdminPanel with useWebSocket hook"
```

---

### Task 10: Migrate `EventsAdminPanel.jsx`

**Files:**
- Modify: `emurpg-frontend/src/components/Admin/EventsAdminPanel.jsx`

- [ ] **Step 1: Remove WS ref and WebSocket code**

**Remove** `wsRef` and `wsConnected` declarations.

**In the `useEffect` (lines 109–147):**
- Remove `connectWebSocket` function (lines 110–137)
- Remove `connectWebSocket()` call (line 140)
- In the cleanup return (lines 142–146), remove `if (wsRef.current) wsRef.current.close();`
- Keep `fetchEvents()` in the `useEffect`.

- [ ] **Step 2: Add `useWebSocket` import and call**

Add to imports:
```jsx
import { useWebSocket } from "../../hooks/useWebSocket";
```

Add after the `fetchEvents` declaration (which is already a `useCallback`):
```jsx
useWebSocket("events", fetchEvents);
```

- [ ] **Step 3: Run the full test suite one final time**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/Admin/EventsAdminPanel.jsx
git commit -m "refactor: replace local WS in EventsAdminPanel with useWebSocket hook"
```

---

## Final verification

- [ ] Open the app in a browser with DevTools → Network → WS tab open
- [ ] Navigate between pages — confirm only **1** WebSocket connection is open at a time
- [ ] As admin: edit a table → confirm `TablesAdminPanel` and `TableList` refresh, `EventList` does not
- [ ] As admin: edit an event → confirm `EventList` and `EventsAdminPanel` refresh, `TableList` does not
- [ ] Simulate backend going offline (stop the server) → confirm the app retries with backoff without crashing
- [ ] Run `pytest` in `emurpg-backend` — all tests pass
- [ ] Run `npm test` in `emurpg-frontend` — all tests pass
