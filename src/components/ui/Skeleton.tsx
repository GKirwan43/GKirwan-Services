import { cn } from "@/lib/cn";

/** A pulsing placeholder block. Size and shape come from `className`. */
export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div aria-hidden className={cn("animate-pulse bg-surface", className)} style={style} />;
}
