import "server-only";
import type { NpmConfig } from "./config";

/** A failure talking to Nginx Proxy Manager. The message is safe to show to the user. */
export class NpmError extends Error {}

export interface NpmProxyHost {
  id: number;
  domain_names: string[];
  forward_host: string;
  forward_port: number;
  certificate_id: number | string;
  enabled: boolean | number;
}

const TIMEOUT_MS = 8000;

async function npmFetch({ url }: Pick<NpmConfig, "url">, path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${url}${path}`, { ...init, cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch {
    throw new NpmError(`Could not reach Nginx Proxy Manager at ${url}. Check the address and that it's running.`);
  }
}

const readJson = (res: Response) =>
  res.json().catch(() => {
    throw new NpmError("That address didn't respond like Nginx Proxy Manager.");
  });

/** Logs in and returns a short-lived API token. */
async function login(conn: NpmConfig): Promise<string> {
  const res = await npmFetch(conn, "/api/tokens", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: conn.email, secret: conn.password }),
  });
  if (res.status === 400 || res.status === 401) throw new NpmError("Nginx Proxy Manager rejected that email or password.");
  if (!res.ok) throw new NpmError(`Nginx Proxy Manager answered the login with an error (${res.status}).`);

  const body = await readJson(res);
  if (body?.requires_2fa) throw new NpmError("This NPM user has two-factor login on. Use a separate user without it for this app.");
  if (typeof body?.token !== "string") throw new NpmError("That address didn't respond like Nginx Proxy Manager.");
  return body.token;
}

/** Every proxy host configured in NPM. */
export async function listProxyHosts(conn: NpmConfig): Promise<NpmProxyHost[]> {
  const token = await login(conn);
  const res = await npmFetch(conn, "/api/nginx/proxy-hosts", { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 403) throw new NpmError("That NPM user isn't allowed to view proxy hosts.");
  if (!res.ok) throw new NpmError(`Nginx Proxy Manager couldn't list proxy hosts (${res.status}).`);

  const hosts = await readJson(res);
  if (!Array.isArray(hosts)) throw new NpmError("Nginx Proxy Manager sent back something unexpected.");
  return hosts;
}
