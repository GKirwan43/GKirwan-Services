import {
  faChartLine,
  faCode,
  faCube,
  faFilm,
  faGamepad,
  faHardDrive,
  faHouseSignal,
  faListCheck,
  faNetworkWired,
  faServer,
} from "@fortawesome/free-solid-svg-icons";
import type { Category } from "@/types/service";

const OTHER_CATEGORY: Category = {
  id: "other",
  label: "Other",
  description: "Everything else.",
  icon: faCube,
  hue: 250,
};

/** In display order. */
export const CATEGORIES: Category[] = [
  {
    id: "media",
    label: "Media",
    description: "Streaming, libraries, and downloads.",
    icon: faFilm,
    hue: 330,
  },
  {
    id: "smart-home",
    label: "Smart Home",
    description: "Home automation and cameras.",
    icon: faHouseSignal,
    hue: 40,
  },
  {
    id: "storage",
    label: "Storage & Files",
    description: "File sync, backups, and documents.",
    icon: faHardDrive,
    hue: 200,
  },
  {
    id: "productivity",
    label: "Productivity",
    description: "Everyday tools and dashboards.",
    icon: faListCheck,
    hue: 150,
  },
  {
    id: "development",
    label: "Development",
    description: "Source control, CI, and containers.",
    icon: faCode,
    hue: 265,
  },
  {
    id: "monitoring",
    label: "Monitoring",
    description: "Metrics, logs, and uptime.",
    icon: faChartLine,
    hue: 20,
  },
  {
    id: "networking",
    label: "Networking",
    description: "DNS, proxies, and VPN.",
    icon: faNetworkWired,
    hue: 180,
  },
  {
    id: "gaming",
    label: "Gaming",
    description: "Game servers.",
    icon: faGamepad,
    hue: 300,
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    description: "The hypervisor and core systems.",
    icon: faServer,
    hue: 230,
  },
  OTHER_CATEGORY,
];

export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id) ?? OTHER_CATEGORY;
