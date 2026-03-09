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
      if (!res.ok || elapsed >= 800) {
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
