import "server-only";
import { CATEGORY_KEYWORDS } from "@/constants/categoryKeywords";
import { normalize } from "@/lib/strings";
import type { Service, ServicesResponse } from "@/types/service";
import type { NpmConfig } from "./config";
import { isReachable } from "./health";
import { listProxyHosts, type NpmProxyHost } from "./npm";

const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;

/** "uptime-kuma.example.com" -> "Uptime Kuma". Skips a leading "www". */
function displayName(domain: string): string {
  const labels = domain.split(".");
  const label = labels[0] === "www" && labels.length > 1 ? labels[1] : labels[0];
  return label
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

/** Short keywords (like "ha" or "git") must match the whole name; longer ones can appear anywhere in it. */
function guessCategory(name: string): string {
  const key = normalize(name);
  for (const [categoryId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((word) => (word.length > 4 ? key.includes(word) : key === word))) return categoryId;
  }
  return "other";
}

async function toService(host: NpmProxyHost): Promise<Service | null> {
  const domain = host.domain_names[0];
  if (!domain) return null;

  const enabled = Boolean(host.enabled);
  const https = Number(host.certificate_id) > 0;
  const name = displayName(domain);

  return {
    id: `npm-${host.id}`,
    name,
    url: `${https ? "https" : "http"}://${domain}`,
    host: domain,
    ip: IPV4.test(host.forward_host) ? host.forward_host : null,
    // NPM doesn't know whether a service is up, so check the target directly. A disabled host isn't being served at all.
    status: enabled && (await isReachable(host.forward_host, host.forward_port)) ? "running" : "stopped",
    categoryId: guessCategory(name),
  };
}

/** One service per NPM proxy host, named after its first domain. */
export async function getServices(npm: NpmConfig): Promise<ServicesResponse> {
  const hosts = await listProxyHosts(npm);
  const services = await Promise.all(hosts.map(toService));
  return { services: services.filter((s): s is Service => s !== null) };
}
