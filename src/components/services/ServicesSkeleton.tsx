import { Skeleton } from "@/components/ui/Skeleton";

/** Placeholder for the category chips while loading, so the content below doesn't jump when they arrive. */
export function CategoryNavSkeleton() {
  return (
    <div className="flex gap-2 py-0.5">
      {[64, 80, 96, 112, 96].map((width, i) => (
        <Skeleton key={i} className="h-[34px] rounded-full" style={{ width }} />
      ))}
    </div>
  );
}

/** Placeholder for a section of service tiles while loading. */
export function ServicesSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading services">
      <div className="mb-5 flex gap-4">
        <span className="w-1.5 rounded-full bg-surface-2" />
        <Skeleton className="h-[52px] w-48 rounded-lg" />
      </div>
      <div className="grid-cards">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-[74px] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
