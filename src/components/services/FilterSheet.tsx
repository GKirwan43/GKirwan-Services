import { useEffect } from "react";
import { cn } from "@/lib/cn";
import type { ServiceFilters } from "@/lib/filters";
import type { ServiceGroup } from "@/types/service";
import { CategoryNav } from "./CategoryNav";
import { StatusFilter } from "./StatusFilter";

const headingClass = "mb-2 text-xs font-semibold tracking-wider text-faint uppercase";

/** Mobile-only bottom sheet holding the category and status filters that don't fit in the header. */
export function FilterSheet({
  open,
  onClose,
  groups,
  visible,
  filters,
  onFiltersChange,
}: {
  open: boolean;
  onClose: () => void;
  groups: ServiceGroup[];
  visible: ServiceGroup[];
  filters: ServiceFilters;
  onFiltersChange: (change: Partial<ServiceFilters>) => void;
}) {
  // Escape closes the sheet, and the page behind it doesn't scroll while it's open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  // Every choice applies immediately and dismisses the sheet.
  const apply = (change: Partial<ServiceFilters>) => {
    onFiltersChange(change);
    onClose();
  };

  return (
    <div className="sm:hidden">
      <div
        aria-hidden
        onClick={onClose}
        className={cn("fixed inset-0 z-40 bg-black/60 transition-opacity duration-200", open ? "opacity-100" : "pointer-events-none opacity-0")}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        inert={!open}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-edge-strong bg-surface px-5 pt-3 pb-6 transition-transform duration-300 ease-snappy",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-edge-strong" />

        {groups.length > 1 && (
          <>
            <h2 className={headingClass}>Category</h2>
            <CategoryNav groups={groups} visible={visible} value={filters.category} onChange={(category) => apply({ category })} />
          </>
        )}

        <h2 className={cn(headingClass, "mt-5")}>Status</h2>
        <StatusFilter fullWidth value={filters.status} onChange={(status) => apply({ status })} />
      </div>
    </div>
  );
}
