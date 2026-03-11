import { useEffect, useRef } from "react";
import { useWebSocketContext } from "../contexts/WebSocketContext";

/**
 * Subscribe to WebSocket messages by topic.
 * @param {string|null} topic  "tables" | "events" | null (null = all messages)
 * @param {Function}    callback  Called when a matching message arrives.
 */
export function useWebSocket(topic, callback) {
  const { subscribersRef } = useWebSocketContext();
  const latestCallbackRef = useRef(callback);

  useEffect(() => {
    latestCallbackRef.current = callback;
  });

  useEffect(() => {
    const topicKey = topic ?? null;
    const stableWrapper = () => latestCallbackRef.current?.();

    if (!subscribersRef.current.has(topicKey)) {
      subscribersRef.current.set(topicKey, new Set());
    }
    subscribersRef.current.get(topicKey).add(stableWrapper);

    return () => {
      subscribersRef.current.get(topicKey)?.delete(stableWrapper);
    };
  }, [topic, subscribersRef]);
}
