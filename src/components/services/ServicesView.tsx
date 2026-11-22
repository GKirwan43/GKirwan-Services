"use client";

import { useMemo, useState } from "react";
import { faMagnifyingGlass, faServer, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { filterGroups, groupByCategory, NO_FILTERS, type ServiceFilters } from "@/lib/filters";
import { ServiceSection } from "./ServiceSection";
import { ServicesHeader } from "./ServicesHeader";
import { ServicesSkeleton } from "./ServicesSkeleton";
import { useServices } from "./useServices";

/** The services page: loads the list, owns the filter and collapse state, and lays out the header and sections. */
export function ServicesView() {
  const { data, error, refresh } = useServices();
  const [filters, setFilters] = useState<ServiceFilters>(NO_FILTERS);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const groups = useMemo(() => groupByCategory(data?.services ?? []), [data]);
  const visible = useMemo(() => filterGroups(groups, filters), [groups, filters]);
  const sections = visible.filter((g) => !filters.category || g.category.id === filters.category);

  const total = data?.services.length ?? 0;
  const allCollapsed = sections.length > 0 && sections.every((g) => collapsed.has(g.category.id));

  const updateFilters = (change: Partial<ServiceFilters>) => setFilters((f) => ({ ...f, ...change }));

  const toggleSection = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const toggleAll = () =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      for (const g of sections) {
        if (allCollapsed) next.delete(g.category.id);
        else next.add(g.category.id);
      }
      return next;
    });

  // Clicking the title returns to the default view: no filters, every section expanded.
  const reset = () => {
    setFilters(NO_FILTERS);
    setCollapsed(new Set());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Changing any filter remounts the sections so the tiles replay their entrance animation.
  const filterKey = `${filters.category}|${filters.status}|${filters.query.trim().toLowerCase()}`;

  function renderContent() {
    if (error) {
      return (
        <EmptyState
          icon={faTriangleExclamation}
          title="Couldn't load services"
          description={error}
          className="mt-6 mb-3"
          action={{ label: "Refresh", onClick: refresh }}
        />
      );
    }
    if (!data) return <ServicesSkeleton />;

    if (total === 0) {
      return (
        <EmptyState
          icon={faServer}
          title="No services detected"
          description="Add a proxy host in Nginx Proxy Manager and it will show up here automatically."
          className="mt-6 mb-3"
        />
      );
    }

    if (sections.length === 0) {
      return (
        <EmptyState
          icon={faMagnifyingGlass}
          title="No services match"
          description="Try a different search or filter."
          className="mt-6 mb-3"
          action={{ label: "Clear filters", onClick: () => setFilters(NO_FILTERS) }}
        />
      );
    }

    return (
      <div className="-mt-1">
        {sections.map(({ category, services }) => (
          <ServiceSection
            key={`${filterKey}|${category.id}`}
            category={category}
            services={services}
            open={!collapsed.has(category.id)}
            onToggle={() => toggleSection(category.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-7">
      <ServicesHeader
        loading={!data && !error}
        total={total}
        groups={groups}
        visible={visible}
        filters={filters}
        onFiltersChange={updateFilters}
        allCollapsed={allCollapsed}
        canToggleAll={sections.length > 0}
        onToggleAll={toggleAll}
        onReset={reset}
      />

      <main>{renderContent()}</main>
    </div>
  );
}
