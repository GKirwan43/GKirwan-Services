import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type ServiceStatus = "running" | "stopped" | "unknown";

export interface Service {
  id: string;
  name: string;
  url: string;
  host: string;
  ip: string | null;
  status: ServiceStatus;
  /** One of the ids in CATEGORIES (src/constants/categories.ts); anything else shows under "Other". */
  categoryId: string;
}

/** The JSON returned by /api/services. */
export interface ServicesResponse {
  services: Service[];
}

export interface Category {
  id: string;
  label: string;
  description: string;
  icon: IconDefinition;
  /** Accent hue (0-360) for the section bar. */
  hue: number;
}

export interface ServiceGroup {
  category: Category;
  services: Service[];
}
