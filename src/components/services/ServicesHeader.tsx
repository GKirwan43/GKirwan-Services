import { useCallback, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faAnglesUp, faFilter, faGear } from "@fortawesome/free-solid-svg-icons";
import { SearchInput } from "@/components/ui/SearchInput";
import { cn } from "@/lib/cn";
import type { ServiceFilters } from "@/lib/filters";
import { useScrolled } from "@/hooks/useScrolled";
import type { ServiceGroup } from "@/types/service";
import { CategoryNav } from "./CategoryNav";
import { FilterSheet } from "./FilterSheet";
import { CategoryNavSkeleton } from "./ServicesSkeleton";
import { StatusFilter } from "./StatusFilter";

const textButtonClass = "flex cursor-pointer items-center gap-2 text-sm whitespace-nowrap text-muted transition-colors hover:text-fg";

/**
 * The sticky top bar: title, search, settings, then the filters and collapse-all.
 * On desktop the status filter and category chips sit in the bar; on mobile they move into a bottom sheet.
 */
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const activeFilters = (filters.category ? 1 : 0) + (filters.status ? 1 : 0);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-10 -mx-4 grid gap-2.5 bg-bg px-4 pt-3 max-sm:pb-2 sm:-mx-7 sm:px-7 sm:pt-6",
          "after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-9 after:bg-linear-to-b after:from-bg after:to-transparent after:transition-opacity after:duration-200",
          scrolled ? "after:opacity-100" : "after:opacity-0",
        )}
      >
        <div className="flex flex-wrap items-center gap-3.5 max-sm:flex-nowrap max-sm:gap-2.5">
          <h1 className="h-12 border-r border-edge pr-3.5 max-sm:pr-2.5">
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
            className="min-w-50 flex-[1_1_280px] max-sm:min-w-0 max-sm:flex-1"
          />
          <div className="max-sm:hidden">
            <StatusFilter value={filters.status} onChange={(status) => onFiltersChange({ status })} />
          </div>
          <Link
            href="/settings"
            title="Settings"
            aria-label="Settings"
            className="grid size-12 shrink-0 place-items-center rounded-control border border-edge bg-surface text-muted transition hover:border-muted hover:bg-surface-2 hover:text-fg"
          >
            <FontAwesomeIcon icon={faGear} />
          </Link>
        </div>

        <div className="grid gap-2.5 max-sm:hidden">
          {loading && <CategoryNavSkeleton />}
          {groups.length > 1 && (
            <CategoryNav groups={groups} visible={visible} value={filters.category} onChange={(category) => onFiltersChange({ category })} />
          )}
        </div>

        {/* While loading, keep the row's space (empty) so the skeleton below sits where the real content will. */}
        {loading && <div className="h-5" aria-hidden />}
        {/* Nothing to collapse after a failed load or with no services; stays (disabled) when a filter matches nothing. */}
        {!loading && total > 0 && (
          <div className="flex items-center justify-end max-sm:justify-between max-sm:py-1">
            <button type="button" onClick={() => setSheetOpen(true)} className={cn(textButtonClass, "sm:hidden")}>
              <FontAwesomeIcon icon={faFilter} />
              Filters
              {activeFilters > 0 && (
                <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-fg px-1 text-[11px] font-bold text-bg">
                  {activeFilters}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={onToggleAll}
              disabled={!canToggleAll}
              className={cn(textButtonClass, "pr-3 pl-1 disabled:cursor-default disabled:opacity-50 disabled:hover:text-muted")}
            >
              <FontAwesomeIcon icon={allCollapsed ? faAnglesDown : faAnglesUp} />
              {allCollapsed ? "Expand all" : "Collapse all"}
            </button>
          </div>
        )}
      </header>

      <FilterSheet open={sheetOpen} onClose={closeSheet} groups={groups} visible={visible} filters={filters} onFiltersChange={onFiltersChange} />
    </>
  );
}
