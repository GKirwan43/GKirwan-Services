import "server-only";
import { getConfig, type NpmConfig } from "./config";
import { listProxyHosts, NpmError } from "./npm";

const NPM_ADMIN_PORT = "81";

/**
 * Turns what a person types into a full NPM admin URL, or null if it can't be one.
 * "10.0.30.6" -> "http://10.0.30.6:81", "npm.lan:8181" -> "http://npm.lan:8181", "https://npm.lan" is kept as is.
 */
function normalizeNpmUrl(input: string): string | null {
  const text = input.trim();
  if (!text) return null;

  const hasScheme = /^https?:\/\//i.test(text);
  let url: URL;
  try {
    url = new URL(hasScheme ? text : `http://${text}`);
  } catch {
    return null;
  }

  // Only add the default port when the person gave neither a port nor an explicit scheme.
  if (!hasScheme && !url.port) url.port = NPM_ADMIN_PORT;
  return url.origin;
}

/**
 * Turns the setup/settings form into an NPM connection.
 * An empty password means "keep the saved one", but only while the address and email are unchanged,
 * so the saved password can never be sent to a different server.
 */
async function resolveConnection(input: unknown): Promise<NpmConfig | string> {
  const body = (input ?? {}) as Record<string, unknown>;
  const url = normalizeNpmUrl(typeof body.url === "string" ? body.url : "");
  const email = typeof body.email === "string" ? body.email.trim() : "";
  let password = typeof body.password === "string" ? body.password : "";

  if (!url) return "That doesn't look like an address. Try something like 10.0.30.6 or http://npm.lan:81";
  if (!email) return "Enter the NPM email.";

  if (!password) {
    const saved = (await getConfig())?.npm;
    if (saved && saved.url === url && saved.email === email) password = saved.password;
  }
  if (!password) return "Enter the NPM password.";

  return { url, email, password };
}

/** Checks the form's connection details by logging in to NPM. Returns the connection and its host count, or a message to show. */
export async function verifyConnection(input: unknown): Promise<{ conn: NpmConfig; hosts: number } | { error: string }> {
  const conn = await resolveConnection(input);
  if (typeof conn === "string") return { error: conn };

  try {
    return { conn, hosts: (await listProxyHosts(conn)).length };
  } catch (error) {
    if (error instanceof NpmError) return { error: error.message };
    throw error;
  }
}
