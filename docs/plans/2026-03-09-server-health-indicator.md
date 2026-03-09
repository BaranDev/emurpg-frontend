# Server Health Indicator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Show a live server health badge (colored dot + ms) in the admin header/sidebar, and an expanded health card on the dashboard overview panel.

**Architecture:** Extract the existing `ServerStatus` component from `AdminHeader.jsx` into a shared hook + two presentational components. Wire the badge into `AdminLayout` (both mobile header and desktop sidebar). Add an expanded card to `DashboardPanel` in `AdminMain.jsx`. Each component polls `GET /health` independently every 30s using `performance.now()` for timing.

**Tech Stack:** React 18, Tailwind CSS, lucide-react, FastAPI `/health` endpoint (`GET https://api.emurpg.com/health` → `{"status":"healthy"}`)

---

## Current State (read before starting)

- `src/components/Admin/AdminHeader.jsx` — Has a complete self-contained `ServerStatus` component (lines 6–83) that already polls correctly. It is exported as a default (`AdminHeader`) but `ServerStatus` is NOT exported. `AdminHeader` itself is **never rendered anywhere** in the app.
- `src/components/Admin/AdminLayout.jsx` — Renders the desktop sidebar + mobile top header + mobile bottom nav. The mobile top header (line 374–381) only shows branding. The desktop sidebar (line 265–371) only shows logo, nav, and user/logout. **No health indicator appears anywhere.**
- `src/components/Admin/AdminMain.jsx` — Contains `DashboardPanel` (lines 31–211) with a 4-card stats grid and a "Quick Overview" section. No health card exists.
- `src/config.js` — exports `config.backendUrl` (used throughout admin components).

## Thresholds

| Status     | Condition          | Dot color   | Label           |
|------------|--------------------|-------------|-----------------|
| `checking` | initial / pending  | amber pulse | Checking Realm… |
| `online`   | < 300ms            | emerald     | Realm Online    |
| `degraded` | 300–800ms or !ok   | amber pulse | Realm Strained  |
| `offline`  | error / timeout    | red         | Realm Unreachable |

> Note: the existing `ServerStatus` in `AdminHeader.jsx` uses 800ms as the only threshold (online vs degraded). **Update** it to use 300ms as the green/yellow split during Task 1.

---

## Task 1: Create `useServerHealth` hook

**Files:**
- Create: `src/components/Admin/shared/useServerHealth.js`

**Step 1: Write the file**

```js
import { useState, useEffect, useCallback } from "react";
import { config } from "../../../config";

export function useServerHealth() {
  const [status, setStatus] = useState("checking");
  const [responseMs, setResponseMs] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = useCallback(async () => {
    const start = performance.now();
    try {
      const res = await fetch(`${config.backendUrl}/health`, {
        signal: AbortSignal.timeout(5000),
        cache: "no-store",
      });
      const elapsed = Math.round(performance.now() - start);
      setResponseMs(elapsed);
      setLastChecked(new Date());
      if (!res.ok) {
        setStatus("degraded");
      } else if (elapsed >= 800) {
        setStatus("degraded");
      } else if (elapsed >= 300) {
        setStatus("degraded");
      } else {
        setStatus("online");
      }
    } catch {
      setStatus("offline");
      setResponseMs(null);
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const id = setInterval(checkHealth, 30000);
    return () => clearInterval(id);
  }, [checkHealth]);

  return { status, responseMs, lastChecked };
}
```

**Step 2: Commit**

```bash
git add src/components/Admin/shared/useServerHealth.js
git commit -m "feat: add useServerHealth polling hook"
```

---

## Task 2: Rewrite `ServerStatus` badge to use the hook

The existing `ServerStatus` in `AdminHeader.jsx` (lines 6–83) has its own inline polling. Replace it with the hook, and fix the threshold so 300ms is the green/yellow cutoff. Also **add a named export** so `AdminLayout` can import it.

**Files:**
- Modify: `src/components/Admin/AdminHeader.jsx`

**Step 1: Replace the top of `AdminHeader.jsx`**

Replace everything from line 1 through line 83 (the `ServerStatus` component) with:

```jsx
import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { LogOut, Bell, RefreshCw, User, Swords } from "lucide-react";
import { useServerHealth } from "./shared/useServerHealth";

const STATUS_CONFIG = {
  checking: {
    dotClass: "bg-amber-400 animate-pulse",
    label: "Checking Realm...",
    labelClass: "text-amber-400",
  },
  online: {
    dotClass: "bg-emerald-500",
    label: "Realm Online",
    labelClass: "text-emerald-400",
  },
  degraded: {
    dotClass: "bg-amber-500 animate-pulse",
    label: "Realm Strained",
    labelClass: "text-amber-400",
  },
  offline: {
    dotClass: "bg-red-500",
    label: "Realm Unreachable",
    labelClass: "text-red-400",
  },
};

export const ServerStatus = () => {
  const { status, responseMs } = useServerHealth();
  const { dotClass, label, labelClass } = STATUS_CONFIG[status];

  return (
    <div
      className="flex items-center gap-2 rounded-md border border-amber-800/40 bg-gray-800/80 px-3 py-1.5 text-xs"
      title="API server health — checked every 30s"
    >
      <Swords className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
      <div className={`h-2 w-2 flex-shrink-0 rounded-full ${dotClass}`} />
      <span className={`font-medium ${labelClass}`}>{label}</span>
      {responseMs !== null && (
        <>
          <span className="text-gray-500">·</span>
          <span
            className={
              responseMs >= 800
                ? "text-red-400"
                : responseMs >= 300
                  ? "text-amber-400"
                  : "text-emerald-400"
            }
          >
            {responseMs}ms
          </span>
        </>
      )}
    </div>
  );
};
```

> Keep the rest of `AdminHeader.jsx` (the `AdminHeader` component and its propTypes) unchanged. Remove the now-unused `config` import from line 4 since `useServerHealth` handles it internally.

**Step 2: Remove unused import**

In the updated file, the line `import { config } from "../../config";` is no longer needed — delete it.

**Step 3: Commit**

```bash
git add src/components/Admin/AdminHeader.jsx
git commit -m "refactor: wire ServerStatus badge to useServerHealth hook, add named export"
```

---

## Task 3: Add `ServerStatus` badge to `AdminLayout`

Wire the badge into two places in `AdminLayout`:
- **Desktop sidebar** — below the logo/header section, above the nav
- **Mobile top header** — right side of the branding bar

**Files:**
- Modify: `src/components/Admin/AdminLayout.jsx`

**Step 1: Add import at top of `AdminLayout.jsx`**

After the existing imports, add:

```js
import { ServerStatus } from "./AdminHeader";
```

**Step 2: Desktop sidebar — add badge below logo**

Find the sidebar logo/header block (around line 272–286):
```jsx
{/* Logo/Header */}
<div className="p-4 border-b border-yellow-900/30">
  <div className="flex items-center gap-3">
    ...
  </div>
</div>
```

Below that `</div>` closing the logo block, add a conditional render:

```jsx
{/* Server health badge — only when sidebar is expanded */}
{isSidebarOpen && (
  <div className="px-4 py-2 border-b border-yellow-900/20">
    <ServerStatus />
  </div>
)}
```

**Step 3: Mobile top header — add badge to right side**

Find the mobile header block (around line 374–381):
```jsx
<div className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-gray-900/95 border-b border-yellow-900/30 backdrop-blur-sm">
  <div className="flex items-center gap-2 p-3 sm:p-4">
    <Castle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
    <span className="font-bold text-yellow-500 font-cinzel text-sm sm:text-base">
      EMURPG Admin
    </span>
  </div>
</div>
```

Change the inner div to `justify-between` and add the badge on the right:

```jsx
<div className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-gray-900/95 border-b border-yellow-900/30 backdrop-blur-sm">
  <div className="flex items-center justify-between p-3 sm:p-4">
    <div className="flex items-center gap-2">
      <Castle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
      <span className="font-bold text-yellow-500 font-cinzel text-sm sm:text-base">
        EMURPG Admin
      </span>
    </div>
    <ServerStatus />
  </div>
</div>
```

**Step 4: Commit**

```bash
git add src/components/Admin/AdminLayout.jsx
git commit -m "feat: add server health badge to admin sidebar and mobile header"
```

---

## Task 4: Add `ServerHealthCard` to `DashboardPanel`

Add a 5th card to the stats grid in `DashboardPanel` (inside `AdminMain.jsx`) showing expanded health info: status, ms, and "last checked" time.

**Files:**
- Modify: `src/components/Admin/AdminMain.jsx`

**Step 1: Add `useServerHealth` import**

At the top of `AdminMain.jsx`, add:

```js
import { useServerHealth } from "./shared/useServerHealth";
```

Also add `Activity` to the lucide-react import line (it's used for the card icon):

```js
import { Calendar, Users, Table2, Clock, Sparkles, Activity } from "lucide-react";
```

**Step 2: Add `ServerHealthCard` component**

Add this component above `DashboardPanel` (after `AdminMain`'s imports):

```jsx
const STATUS_HEALTH = {
  checking: { dot: "bg-amber-400 animate-pulse", text: "text-amber-400", label: "Checking..." },
  online:   { dot: "bg-emerald-500",             text: "text-emerald-400", label: "Healthy" },
  degraded: { dot: "bg-amber-500 animate-pulse", text: "text-amber-400", label: "Slow" },
  offline:  { dot: "bg-red-500",                 text: "text-red-400",   label: "Unreachable" },
};

const ServerHealthCard = () => {
  const { status, responseMs, lastChecked } = useServerHealth();
  const { dot, text, label } = STATUS_HEALTH[status];

  const formatLastChecked = (date) => {
    if (!date) return "—";
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 5) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    return `${Math.floor(diff / 60)}m ago`;
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-center sm:gap-3 text-center sm:text-left">
        <div className="p-2 bg-gray-700/50 rounded-lg mb-2 sm:mb-0">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        </div>
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-0.5">
            <div className={`h-2 w-2 rounded-full flex-shrink-0 ${dot}`} />
            <p className={`text-xl sm:text-2xl font-bold ${text}`}>
              {responseMs !== null ? `${responseMs}ms` : "—"}
            </p>
          </div>
          <p className={`text-[10px] sm:text-xs font-medium ${text}`}>{label}</p>
          <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5">
            {formatLastChecked(lastChecked)}
          </p>
        </div>
      </div>
    </div>
  );
};
```

**Step 3: Add `ServerHealthCard` to the stats grid**

In `DashboardPanel`, find the stats grid (the `div` with `grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4`).

Change `md:grid-cols-4` to `md:grid-cols-5` (or keep 4 and let the 5th wrap), then add `<ServerHealthCard />` as the 5th card after the Registrations card:

```jsx
<div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">
  {/* ... existing 4 cards ... */}
  <ServerHealthCard />
</div>
```

> If 5 columns feels too cramped, use `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5` instead.

**Step 4: Commit**

```bash
git add src/components/Admin/AdminMain.jsx
git commit -m "feat: add server health card to admin dashboard overview"
```

---

## Task 5: Write a unit test for `useServerHealth`

**Files:**
- Create: `src/test/useServerHealth.test.js`

**Step 1: Write the test**

```js
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useServerHealth } from "../components/Admin/shared/useServerHealth";

// Mock config
vi.mock("../config", () => ({ config: { backendUrl: "http://localhost" } }));

describe("useServerHealth", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("starts in checking state", () => {
    global.fetch = vi.fn(() => new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useServerHealth());
    expect(result.current.status).toBe("checking");
    expect(result.current.responseMs).toBeNull();
  });

  it("sets status to online when response is fast", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    vi.spyOn(performance, "now")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(150); // 150ms elapsed

    const { result } = renderHook(() => useServerHealth());
    await act(async () => {});
    expect(result.current.status).toBe("online");
    expect(result.current.responseMs).toBe(150);
  });

  it("sets status to degraded when response is slow (>=300ms)", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    vi.spyOn(performance, "now")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(500);

    const { result } = renderHook(() => useServerHealth());
    await act(async () => {});
    expect(result.current.status).toBe("degraded");
  });

  it("sets status to offline on fetch error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useServerHealth());
    await act(async () => {});
    expect(result.current.status).toBe("offline");
    expect(result.current.responseMs).toBeNull();
  });

  it("polls again after 30s", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    vi.spyOn(performance, "now").mockReturnValue(0);

    renderHook(() => useServerHealth());
    await act(async () => {});
    expect(global.fetch).toHaveBeenCalledTimes(1);

    await act(async () => { vi.advanceTimersByTime(30000); });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
```

**Step 2: Run the tests**

```bash
npm test -- --run
```

Expected: all existing 28 tests pass + 5 new useServerHealth tests pass.

**Step 3: Commit**

```bash
git add src/test/useServerHealth.test.js
git commit -m "test: add unit tests for useServerHealth hook"
```

---

## Task 6: Add E2E smoke test assertion for dashboard health card

The existing `e2e/smoke.spec.js` already tests `/admin`. Extend the admin test to assert the health card renders (without caring about the status value).

**Files:**
- Modify: `e2e/smoke.spec.js`

**Step 1: Update the `/admin` test**

Find:
```js
test("/admin — AdminPage loads login form", async ({ page }) => {
  await page.goto("/admin");
  await expectNoRenderErrors(page);
  // Should show login (not logged in by default)
  await expect(page.locator("text=404")).toHaveCount(0);
});
```

The admin page shows a login form when not authenticated — the health indicator is only visible post-login, so **no change is needed to the smoke test** (it can't authenticate). Leave this task as a no-op.

> If you want to test the authenticated dashboard in the future, you'd need to mock auth or use test credentials — out of scope for now.

**Step 2: Commit (only if you modified anything)**

If nothing changed, skip the commit.

---

## Done

After Task 5 passes, the feature is complete:
- Header badge visible on every admin panel (desktop sidebar + mobile header)
- Dashboard card visible on the overview panel
- Hook tested with unit tests
