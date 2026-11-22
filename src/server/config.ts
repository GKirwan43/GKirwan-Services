import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export interface NpmConfig {
  /** Origin of the NPM admin UI, e.g. http://10.0.30.6:81 */
  url: string;
  email: string;
  password: string;
}

interface AppConfig {
  npm: NpmConfig;
}

/** Lives outside the release folder on the LXC (DATA_DIR) so updates never wipe it. */
const configFile = () => path.join(process.env.DATA_DIR ?? path.join(process.cwd(), "data"), "config.json");

const isString = (value: unknown): value is string => typeof value === "string";

/** The saved config, or null when setup hasn't been done (or the file is unreadable). */
export async function getConfig(): Promise<AppConfig | null> {
  try {
    const { npm } = JSON.parse(await readFile(configFile(), "utf8"));
    if (isString(npm?.url) && isString(npm?.email) && isString(npm?.password)) {
      return { npm: { url: npm.url, email: npm.email, password: npm.password } };
    }
  } catch {
    // Missing or corrupt: treated as not configured.
  }
  return null;
}

/** Writes the config atomically. The file holds the NPM password, so it's readable by the owner only. */
export async function saveConfig(config: AppConfig): Promise<void> {
  const file = configFile();
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temp = `${file}.tmp`;
  await writeFile(temp, JSON.stringify(config, null, 2), { mode: 0o600 });
  await rename(temp, file);
}
