import { cn } from "@/lib/cn";

/** A rounded toggle button with a count, used for filtering. */
export function Chip({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition",
        active ? "border-fg bg-fg text-bg" : "border-edge text-muted hover:border-faint hover:text-fg",
      )}
    >
      {children}
      <span className={cn("text-xs", active ? "opacity-60" : "text-faint")}>{count}</span>
    </button>
  );
}
