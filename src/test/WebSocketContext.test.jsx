import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act, renderHook } from "@testing-library/react";
import { useContext } from "react";
import {
  WebSocketProvider,
  WebSocketContext,
} from "../contexts/WebSocketContext";

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

const wrapper = ({ children }) => (
  <WebSocketProvider>{children}</WebSocketProvider>
);

describe("WebSocketProvider", () => {
  it("constructs WS URL using ws:// not http://", () => {
    render(<WebSocketProvider><div /></WebSocketProvider>);
    expect(mockWsInstance.url).toBe("ws://localhost:8000/ws/updates");
  });

  it("does not throw SyntaxError — URL uses ws:// not http://", () => {
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

    await act(() => firstWs.close());

    await act(() => vi.advanceTimersByTime(1100));

    expect(mockWsInstance).not.toBe(firstWs);
  });

  it("cancels reconnect timer on provider unmount", async () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = render(<WebSocketProvider><div /></WebSocketProvider>);
    await act(() => mockWsInstance.simulateOpen());
    await act(() => mockWsInstance.close());

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    const wsAfterUnmount = mockWsInstance;
    await act(() => vi.advanceTimersByTime(5000));
  });
});
