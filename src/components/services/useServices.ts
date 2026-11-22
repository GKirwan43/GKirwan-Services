import { useEffect, useState } from "react";
import type { ServicesResponse } from "@/types/service";

/** Loads the service list from /api/services once on mount. `data` is null while loading or after a failure; `error` says why. */
export function useServices() {
  const [data, setData] = useState<ServicesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/services", { cache: "no-store", signal: controller.signal })
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error(body?.error ?? "Couldn't load services. Try refreshing.");
        setData(body);
      })
      .catch((e: Error) => {
        if (!controller.signal.aborted) setError(e.message);
      });
    return () => controller.abort();
  }, [attempt]);

  /** Clears the error and fetches again. */
  const refresh = () => {
    setError(null);
    setAttempt((n) => n + 1);
  };

  return { data, error, refresh };
}
