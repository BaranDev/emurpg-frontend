import { createContext, useContext, useEffect, useRef, useState } from "react";
import { config } from "../config";

export const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const subscribersRef = useRef(new Map());
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const backoffRef = useRef(1000);

  useEffect(() => {
    const wsUrl = config.backendUrl.replace(/^http/, "ws") + "/ws/updates";
    let disposed = false;

    function connect() {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (disposed) return;
        setIsConnected(true);
        backoffRef.current = 1000;
      };

      ws.onmessage = (event) => {
        if (disposed) return;
        let msg;
        try {
          msg = JSON.parse(event.data);
        } catch {
          console.warn("[WS] Received non-JSON message:", event.data);
          return;
        }
        const topics = new Set();
        if (typeof msg?.type === "string" && msg.type.length > 0) {
          topics.add(msg.type);
        } else if (
          typeof msg?.message === "string" &&
          msg.message.toLowerCase().includes("updated")
        ) {
          // Backward compatibility for older backend payloads:
          // {"message": "Records updated"} should refresh both data domains.
          topics.add("events");
          topics.add("tables");
        }

        topics.forEach((topic) => {
          subscribersRef.current.get(topic)?.forEach((fn) => fn(msg));
        });
        subscribersRef.current.get(null)?.forEach((fn) => fn(msg));
      };

      ws.onclose = () => {
        if (disposed) return;
        setIsConnected(false);
        reconnectTimerRef.current = setTimeout(() => {
          backoffRef.current = Math.min(backoffRef.current * 2, 30000);
          connect();
        }, backoffRef.current);
      };

      ws.onerror = () => {};
    }

    connect();

    return () => {
      disposed = true;
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
