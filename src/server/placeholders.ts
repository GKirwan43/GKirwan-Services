import "server-only";
import type { Service, ServiceStatus } from "@/types/service";

/** Fake services shown when SHOW_PLACEHOLDER_SERVICES=true. */
const rows: [name: string, categoryId: string, subdomain: string, ip: string, status: ServiceStatus][] = [
  ["Jellyfin", "media", "jellyfin", "10.0.0.21", "running"],
  ["Sonarr", "media", "sonarr", "10.0.0.22", "running"],
  ["Radarr", "media", "radarr", "10.0.0.23", "running"],
  ["qBittorrent", "media", "qbittorrent", "10.0.0.25", "stopped"],
  ["Immich", "media", "photos", "10.0.0.26", "running"],
  ["Home Assistant", "smart-home", "ha", "10.0.0.31", "running"],
  ["Frigate", "smart-home", "frigate", "10.0.0.32", "running"],
  ["Node-RED", "smart-home", "nodered", "10.0.0.33", "unknown"],
  ["Nextcloud", "storage", "cloud", "10.0.0.41", "running"],
  ["Paperless", "storage", "paperless", "10.0.0.42", "running"],
  ["Vaultwarden", "productivity", "vault", "10.0.0.51", "running"],
  ["Mealie", "productivity", "mealie", "10.0.0.52", "running"],
  ["Gitea", "development", "git", "10.0.0.61", "running"],
  ["Portainer", "development", "portainer", "10.0.0.62", "running"],
  ["n8n", "development", "n8n", "10.0.0.63", "stopped"],
  ["Grafana", "monitoring", "grafana", "10.0.0.71", "running"],
  ["Uptime Kuma", "monitoring", "status", "10.0.0.72", "running"],
  ["Pi-hole", "networking", "pihole", "10.0.0.2", "running"],
  ["Tailscale", "networking", "tailscale", "10.0.0.4", "running"],
  ["Minecraft", "gaming", "minecraft", "10.0.0.81", "running"],
  ["Proxmox VE", "infrastructure", "pve", "10.0.0.10", "running"],
];

export const PLACEHOLDER_SERVICES: Service[] = rows.map(([name, categoryId, sub, ip, status], i) => ({
  id: `placeholder-${i}`,
  name,
  url: `https://${sub}.example.com`,
  host: `${sub}.example.com`,
  ip,
  status,
  categoryId,
}));
