import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  /** Shown instead of the label; the label then becomes the tooltip and accessible name. */
  icon?: React.ReactNode;
}

/** A row of buttons with a highlight that slides to the selected one. */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  fullWidth,
}: {
  /** Accessible name for the group. */
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Stretch the buttons to share the full width. */
  fullWidth?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number; animate: boolean } | null>(null);

  // Measure the selected button and move the highlight under it. No animation on the first placement.
  useLayoutEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>(`[data-value="${value}"]`);
    if (el) setPill((p) => ({ left: el.offsetLeft, width: el.offsetWidth, animate: p !== null }));
  }, [value]);

  return (
    <div ref={ref} role="group" aria-label={label} className="relative flex h-12 gap-0.5 rounded-control border border-edge bg-surface p-1">
      {pill && (
        <span
          aria-hidden
          className={cn("absolute inset-y-1 rounded-control-inner bg-fg", pill.animate && "transition-[left,width] duration-300 ease-snappy")}
          style={{ left: pill.left, width: pill.width }}
        />
      )}
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          data-value={option.value}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          title={option.icon ? option.label : undefined}
          aria-label={option.icon ? option.label : undefined}
          className={cn(
            "relative z-1 flex cursor-pointer items-center rounded-control-inner px-3.5 text-sm font-medium transition-colors duration-300",
            fullWidth && "flex-1 justify-center",
            option.value === value ? "text-bg" : "text-muted hover:text-fg",
          )}
        >
          {option.icon ?? option.label}
        </button>
      ))}
    </div>
  );
}
