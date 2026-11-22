import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/lib/cn";

/** A dashed placeholder box for when there's nothing to show, with an optional pill button (e.g. "Refresh"). */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: IconDefinition;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center rounded-2xl border border-dashed border-edge px-6 py-16 text-center", className)}>
      <div className="flex size-14 items-center justify-center rounded-2xl border border-edge bg-surface text-muted">
        <FontAwesomeIcon icon={icon} className="text-xl" />
      </div>
      <h2 className="mt-5 text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted">{description}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 cursor-pointer rounded-full border border-edge px-4 py-1.5 text-sm font-medium text-muted transition hover:border-faint hover:text-fg"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
