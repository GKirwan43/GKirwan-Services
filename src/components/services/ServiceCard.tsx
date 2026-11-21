import { STATUSES } from "@/constants/statuses";
import { cn } from "@/lib/cn";
import type { Service } from "@/types/service";
import { ServiceIcon } from "./ServiceIcon";

/** One service tile. Opens the service in a new tab. */
export function ServiceCard({ service }: { service: Service }) {
  const status = STATUSES[service.status];

  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 rounded-2xl border border-edge bg-surface p-4 transition hover:-translate-y-0.5 hover:border-edge-strong hover:bg-surface-2"
    >
      <ServiceIcon service={service} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold">{service.name}</h3>
        <p className="truncate text-sm text-muted">{service.host}</p>
        {service.ip && <p className="truncate font-mono text-xs text-faint">{service.ip}</p>}
      </div>
      <span className={cn("size-2.5 shrink-0 rounded-full", status.dot)} title={status.label} aria-label={status.label} />
    </a>
  );
}
