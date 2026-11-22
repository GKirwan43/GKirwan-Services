import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/cn";

/** primary = filled, secondary = outlined. `loading` shows a spinner and disables the button. */
export function Button({
  variant = "primary",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: { variant?: "primary" | "secondary"; loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      disabled={disabled || loading}
      className={cn(
        "flex h-11 cursor-pointer items-center justify-center gap-2 rounded-control px-5 text-sm font-semibold whitespace-nowrap transition disabled:cursor-default disabled:opacity-50",
        variant === "primary" ? "bg-fg text-bg hover:bg-fg/85" : "border border-edge text-muted hover:border-faint hover:text-fg",
        className,
      )}
    >
      {loading && <FontAwesomeIcon icon={faSpinner} spin />}
      {children}
    </button>
  );
}
