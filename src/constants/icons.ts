import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faEthernet } from "@fortawesome/free-solid-svg-icons";

/** Logos come from github.com/homarr-labs/dashboard-icons. */
export const LOGO_CDN = "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg";

/** Logo slugs where the kebab-cased name doesn't match, keyed by normalized name. */
export const LOGO_SLUGS: Record<string, string> = {
  proxmoxve: "proxmox",
  adguardhome: "adguard-home",
  homeassistant: "home-assistant",
  pelican: "pelican-panel",
};

/** Full logo URLs for services missing from dashboard-icons, keyed by normalized name. */
export const LOGO_URLS: Record<string, string> = {
  pegaprox: "https://cdn.jsdelivr.net/gh/PegaProx/project-pegaprox/images/pegaprox-logo-square-dark.png",
};

/** Icons for services with no logo in dashboard-icons, matched against the name. */
export const CUSTOM_ICONS: [pattern: RegExp, icon: IconDefinition][] = [
  [/^switch\d*$/i, faEthernet],
];
