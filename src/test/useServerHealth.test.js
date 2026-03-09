import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useServerHealth } from "../components/Admin/shared/useServerHealth";

vi.mock("../config", () => ({
  config: { backendUrl: "http://localhost" },
}));

describe("useServerHealth", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("starts in checking state with null responseMs", () => {
    vi.spyOn(performance, "now").mockReturnValue(0);
    vi.spyOn(globalThis, "fetch").mockImplementation(() => new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useServerHealth());
    expect(result.current.status).toBe("checking");
    expect(result.current.responseMs).toBeNull();
    expect(result.current.lastChecked).toBeNull();
  });

  it("sets status to online when response is fast (< 300ms)", async () => {
    // Make performance.now always return 0 so elapsed = Math.round(0 - 0) = 0
    // which is < 300, triggering "online"
    vi.spyOn(performance, "now").mockReturnValue(0);
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useServerHealth());

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.status).toBe("online");
    expect(result.current.lastChecked).toBeInstanceOf(Date);
  });

  it("sets status to degraded when response is slow (300-799ms)", async () => {
    // The hook calls performance.now() twice: once before fetch (start = 0) and once
    // after fetch resolves (end = 500). jsdom may call performance.now() internally
    // before the hook's first call, but NOT between the hook's two calls (fetch is
    // awaited, and the mock resolves synchronously via microtasks with no jsdom
    // activity interleaved). Strategy: track whether fetch has been called yet.
    // Before fetch: always return 0 (start time). After fetch resolves: return 500.
    let fetchResolved = false;
    vi.spyOn(performance, "now").mockImplementation(() => (fetchResolved ? 500 : 0));

    vi.spyOn(globalThis, "fetch").mockImplementation(() => {
      return Promise.resolve({ ok: true }).then((res) => {
        fetchResolved = true;
        return res;
      });
    });

    const { result } = renderHook(() => useServerHealth());

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.status).toBe("degraded");
    expect(result.current.responseMs).toBe(500);
    expect(result.current.lastChecked).toBeInstanceOf(Date);
  });

  it("sets status to offline when fetch errors out", async () => {
    vi.spyOn(performance, "now").mockReturnValue(0);
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useServerHealth());

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.status).toBe("offline");
    expect(result.current.responseMs).toBeNull();
    expect(result.current.lastChecked).toBeInstanceOf(Date);
  });

  it("polls again after 30 seconds (fetch called twice)", async () => {
    vi.useFakeTimers();
    vi.spyOn(performance, "now").mockReturnValue(0);
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useServerHealth());

    // Flush the initial fetch
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    // Advance 30 seconds to trigger the next poll
    await act(async () => {
      vi.advanceTimersByTime(30000);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });
});
