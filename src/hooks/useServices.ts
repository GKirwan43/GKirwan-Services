import { useEffect, useState } from "react";
import type { ServicesResponse } from "@/types/service";

/** Loads the service list from /api/services once on mount. `data` is null while loading or after a failure. */
export function useServices() {
  const [data, setData] = useState<ServicesResponse | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/services", { cache: "no-store", signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then(setData)
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, []);

  return { data, failed };
}
