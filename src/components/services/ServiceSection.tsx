import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/cn";
import type { Category, Service } from "@/types/service";
import { ServiceCard } from "./ServiceCard";

/** A category heading that collapses and expands its grid of service tiles. */
export function ServiceSection({
  category,
  services,
  open,
  onToggle,
}: {
  category: Category;
  services: Service[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    // Collapsed sections stack tightly; an open one gets room above it, and more after another open one.
    <section
      data-open={open || undefined}
      className="transition-[margin] duration-300 ease-out data-open:[:not([data-open])+&]:mt-3 data-open:[[data-open]+&]:mt-8"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full cursor-pointer items-stretch gap-4 py-3 pr-3 text-left select-none"
      >
        <span
          className="w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: `hsl(${category.hue} 65% 62%)` }}
        />
        <span className="min-w-0 flex-1 transition-transform duration-200 ease-out group-hover:translate-x-1">
          <h2 className="text-2xl font-bold tracking-tight">{category.label}</h2>
          <p className="text-sm text-faint">{category.description}</p>
        </span>
        <span className="self-center text-sm whitespace-nowrap text-muted transition-colors group-hover:text-fg">
          {services.length} {services.length === 1 ? "service" : "services"}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={cn("self-center text-faint transition-[transform,color] group-hover:text-fg", !open && "-rotate-90")}
        />
      </button>

      {/* Animating grid rows from 0fr to 1fr gives a smooth height transition without measuring. */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="grid-cards py-3">
            {services.map((service, i) => (
              <li key={service.id} className="animate-enter motion-reduce:animate-none" style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
