/**
 * NPM has no categories, so a service is filed by matching its name against these keywords (see src/server/services.ts).
 * Keys are category ids from CATEGORIES. Keywords are lowercase letters and digits only; unmatched services go to "other".
 */
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  media: [
    "jellyfin", "plex", "emby", "sonarr", "radarr", "lidarr", "readarr", "prowlarr", "bazarr", "qbittorrent", "transmission",
    "deluge", "sabnzbd", "nzbget", "overseerr", "jellyseerr", "immich", "photoprism", "audiobookshelf", "navidrome", "tautulli",
    "kavita", "calibre", "komga", "tdarr", "photos", "stash",
  ],
  "smart-home": ["homeassistant", "frigate", "nodered", "zigbee2mqtt", "esphome", "mosquitto", "scrypted", "homebridge", "openhab", "ha"],
  storage: ["nextcloud", "owncloud", "paperless", "syncthing", "minio", "seafile", "filebrowser", "duplicati", "samba", "photoview", "cloud"],
  productivity: [
    "vaultwarden", "bitwarden", "mealie", "tandoor", "vikunja", "hedgedoc", "bookstack", "outline", "homepage", "heimdall",
    "homarr", "dashy", "linkding", "wallabag", "miniflux", "freshrss", "actual", "firefly", "vault",
  ],
  development: [
    "gitea", "gitlab", "forgejo", "portainer", "n8n", "jenkins", "drone", "woodpecker", "codeserver", "registry", "harbor", "nexus", "git",
  ],
  monitoring: ["grafana", "prometheus", "uptimekuma", "netdata", "loki", "zabbix", "glances", "graylog", "healthchecks", "gotify", "ntfy", "status"],
  networking: [
    "pihole", "adguard", "adguardhome", "unbound", "tailscale", "headscale", "wireguard", "wgeasy", "nginxproxymanager", "traefik",
    "technitium", "switch", "unifi", "omada",
  ],
  gaming: ["minecraft", "pterodactyl", "crafty", "valheim", "steam", "amp", "palworld", "pelican", "romm"],
  infrastructure: ["nginx", "reverseproxy", "proxmox", "proxmoxve", "pve", "pbs", "pegaprox", "unraid", "truenas", "opnsense", "pfsense", "idrac", "ilo"],
};
