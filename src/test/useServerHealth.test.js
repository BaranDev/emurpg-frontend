import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useServerHealth } from "../components/Admin/shared/useServerHealth";

vi.mock("../config", () => ({
  config: { backendUrl: "http://localhost" },
}));

describe("useServerHealth", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts in checking state with null responseMs", () => {
    vi.spyOn(performance, "now").mockReturnValue(0);
    globalThis.fetch = vi.fn(() => new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useServerHealth());
    expect(result.current.status).toBe("checking");
    expect(result.current.responseMs).toBeNull();
    expect(result.current.lastChecked).toBeNull();
  });

  it("sets status to online when response is fast (< 300ms)", async () => {
    // Make performance.now always return 0 so elapsed = Math.round(0 - 0) = 0
    // which is < 300, triggering "online"
    vi.spyOn(performance, "now").mockReturnValue(0);
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useServerHealth());

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(result.current.status).toBe("online");
    expect(result.current.lastChecked).toBeInstanceOf(Date);
  });

  it("sets status to degraded when response is slow (300-799ms)", async () => {
    // Make elapsed = 500 by returning 0 for "start" and 500 for "end"
    // We replace the entire performance object to fully control timing
    const originalPerformance = globalThis.performance;
    let callIndex = 0;
    const nowValues = [0, 500];
    globalThis.performance = {
      ...originalPerformance,
      now: () => nowValues[Math.min(callIndex++, nowValues.length - 1)],
    };

    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useServerHealth());

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    globalThis.performance = originalPerformance;

    expect(result.current.status).toBe("degraded");
    expect(result.current.responseMs).toBe(500);
    expect(result.current.lastChecked).toBeInstanceOf(Date);
  });

  it("sets status to offline when fetch errors out", async () => {
    vi.spyOn(performance, "now").mockReturnValue(0);
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

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
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });

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

    vi.useRealTimers();
  });
});
