import type { ServiceStatus } from "@/types/service";

/** Label and dot colour for each status, in display order. */
export const STATUSES: Record<ServiceStatus, { label: string; dot: string }> = {
  running: { label: "Running", dot: "bg-status-running" },
  stopped: { label: "Stopped", dot: "bg-status-stopped" },
  unknown: { label: "Unknown", dot: "bg-status-unknown" },
};
