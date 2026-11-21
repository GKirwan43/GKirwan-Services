import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/cn";

/** A text input with a search icon. Escape removes focus. */
export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={cn("relative flex", className)}>
      <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-faint" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && e.currentTarget.blur()}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        className="h-12 w-full rounded-control border border-edge bg-surface pr-4 pl-11 outline-none placeholder:text-faint focus:border-muted focus:bg-surface-2"
      />
    </label>
  );
}
