import { CATEGORIES, categoryById } from "@/constants/categories";
import type { Service, ServiceGroup, ServiceStatus } from "@/types/service";

export interface ServiceFilters {
  query: string;
  category: string | null;
  status: ServiceStatus | null;
}

export const NO_FILTERS: ServiceFilters = { query: "", category: null, status: null };

/** Services grouped by category in display order, sorted by name, with empty categories left out. */
export function groupByCategory(services: Service[]): ServiceGroup[] {
  return CATEGORIES.map((category) => ({
    category,
    services: services
      .filter((s) => categoryById(s.categoryId) === category)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((g) => g.services.length > 0);
}

const matchesQuery = (s: Service, q: string) =>
  !q || [s.name, s.host, s.ip, categoryById(s.categoryId).label].join(" ").toLowerCase().includes(q);

/**
 * Applies the search and status filters, dropping groups left empty.
 * The category filter is applied separately so the category chips can still count every category.
 */
export function filterGroups(groups: ServiceGroup[], { query, status }: ServiceFilters): ServiceGroup[] {
  const q = query.trim().toLowerCase();
  return groups
    .map((g) => ({ ...g, services: g.services.filter((s) => matchesQuery(s, q) && (!status || s.status === status)) }))
    .filter((g) => g.services.length > 0);
}
