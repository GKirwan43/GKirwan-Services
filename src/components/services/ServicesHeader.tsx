import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faAnglesUp, faGear } from "@fortawesome/free-solid-svg-icons";
import { SearchInput } from "@/components/ui/SearchInput";
import { cn } from "@/lib/cn";
import type { ServiceFilters } from "@/lib/filters";
import { useScrolled } from "@/hooks/useScrolled";
import type { ServiceGroup } from "@/types/service";
import { CategoryNav } from "./CategoryNav";
import { CategoryNavSkeleton } from "./ServicesSkeleton";
import { StatusFilter } from "./StatusFilter";

/** The sticky top bar: title, search, status filter, category chips and collapse-all. */
export function ServicesHeader({
  loading,
  total,
  groups,
  visible,
  filters,
  onFiltersChange,
  allCollapsed,
  canToggleAll,
  onToggleAll,
  onReset,
}: {
  loading: boolean;
  total: number;
  groups: ServiceGroup[];
  visible: ServiceGroup[];
  filters: ServiceFilters;
  onFiltersChange: (change: Partial<ServiceFilters>) => void;
  allCollapsed: boolean;
  canToggleAll: boolean;
  onToggleAll: () => void;
  onReset: () => void;
}) {
  // The fade under the header only shows once content has scrolled beneath it.
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-10 -mx-7 grid gap-2.5 bg-bg px-7 pt-6",
        "after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-9 after:bg-linear-to-b after:from-bg after:to-transparent after:transition-opacity after:duration-200",
        scrolled ? "after:opacity-100" : "after:opacity-0",
      )}
    >
      <div className="flex flex-wrap items-center gap-3.5">
        <h1 className="h-12 border-r border-edge pr-3.5">
          <button
            type="button"
            onClick={onReset}
            title="Show all services"
            className="block h-12 cursor-pointer text-[26px] leading-12 font-bold tracking-tight select-none"
          >
            Services
          </button>
        </h1>
        <SearchInput
          value={filters.query}
          onChange={(query) => onFiltersChange({ query })}
          placeholder={`Search ${total} services…`}
          className="min-w-50 flex-[1_1_280px]"
        />
        <StatusFilter value={filters.status} onChange={(status) => onFiltersChange({ status })} />
        <Link
          href="/settings"
          title="Settings"
          aria-label="Settings"
          className="grid size-12 shrink-0 place-items-center rounded-control border border-edge bg-surface text-muted transition hover:border-muted hover:bg-surface-2 hover:text-fg"
        >
          <FontAwesomeIcon icon={faGear} />
        </Link>
      </div>

      {loading && <CategoryNavSkeleton />}
      {groups.length > 1 && (
        <CategoryNav groups={groups} visible={visible} value={filters.category} onChange={(category) => onFiltersChange({ category })} />
      )}

      {/* While loading, keep the button's space (empty) so the skeleton below sits where the real content will. */}
      {loading && <div className="h-5" aria-hidden />}
      {/* Nothing to collapse after a failed load or with no services; stays (disabled) when a filter matches nothing. */}
      {!loading && total > 0 && (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onToggleAll}
          disabled={!canToggleAll}
          className="flex cursor-pointer items-center gap-2 pr-3 pl-1 text-sm whitespace-nowrap text-muted transition-colors hover:text-fg disabled:cursor-default disabled:opacity-50 disabled:hover:text-muted"
        >
          <FontAwesomeIcon icon={allCollapsed ? faAnglesDown : faAnglesUp} />
          {allCollapsed ? "Expand all" : "Collapse all"}
        </button>
      </div>
      )}
    </header>
  );
}
