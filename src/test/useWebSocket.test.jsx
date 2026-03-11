import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { WebSocketProvider } from "../contexts/WebSocketContext";
import { useWebSocket } from "../hooks/useWebSocket";

let mockWsInstance;
class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    mockWsInstance = this;
  }
  close() {
    this.onclose?.({ code: 1000 });
  }
  simulateMessage(data) {
    this.onmessage?.({ data: JSON.stringify(data) });
  }
  simulateOpen() {
    this.onopen?.();
  }
}

vi.mock("../config", () => ({
  config: { backendUrl: "http://localhost:8000" },
}));

beforeEach(() => {
  vi.stubGlobal("WebSocket", MockWebSocket);
  vi.useFakeTimers();
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const wrapper = ({ children }) => (
  <WebSocketProvider>{children}</WebSocketProvider>
);

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
    const { unmount } = renderHook(() => useWebSocket("tables", cb), {
      wrapper,
    });

    await act(() => mockWsInstance.simulateOpen());
    unmount();
    await act(() => mockWsInstance.simulateMessage({ type: "tables" }));

    expect(cb).not.toHaveBeenCalled();
  });

  it("does not double-register if callback reference changes between renders", async () => {
    let callCount = 0;
    const { rerender } = renderHook(
      () => useWebSocket("tables", () => callCount++),
      { wrapper },
    );

    rerender();
    rerender();
    rerender();
    rerender();
    rerender();

    await act(() => mockWsInstance.simulateOpen());
    await act(() => mockWsInstance.simulateMessage({ type: "tables" }));

    expect(callCount).toBe(1);
  });
});
