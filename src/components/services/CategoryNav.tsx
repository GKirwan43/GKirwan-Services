import { Chip } from "@/components/ui/Chip";
import type { ServiceGroup } from "@/types/service";

/** One chip per category, with how many services in it pass the current search and status filters. */
export function CategoryNav({
  groups,
  visible,
  value,
  onChange,
}: {
  /** Every category that has services. */
  groups: ServiceGroup[];
  /** The groups after search and status filtering, for the counts. */
  visible: ServiceGroup[];
  value: string | null;
  onChange: (category: string | null) => void;
}) {
  const countFor = (id: string) => visible.find((g) => g.category.id === id)?.services.length ?? 0;

  return (
    <nav aria-label="Categories" className="flex flex-wrap gap-2 py-0.5">
      <Chip active={!value} onClick={() => onChange(null)} count={visible.reduce((n, g) => n + g.services.length, 0)}>
        All
      </Chip>
      {groups.map(({ category }) => (
        <Chip
          key={category.id}
          active={value === category.id}
          onClick={() => onChange(value === category.id ? null : category.id)}
          count={countFor(category.id)}
        >
          {category.label}
        </Chip>
      ))}
    </nav>
  );
}
