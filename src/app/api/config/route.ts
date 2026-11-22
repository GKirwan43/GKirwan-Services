import { saveConfig } from "@/server/config";
import { verifyConnection } from "@/server/connection";

/** Saves the NPM connection, but only once it has been confirmed to work. */
export async function PUT(request: Request) {
  const result = await verifyConnection(await request.json().catch(() => null));
  if ("error" in result) return Response.json({ message: result.error }, { status: 400 });

  try {
    await saveConfig({ npm: result.conn });
  } catch {
    return Response.json({ message: "Couldn't write the config file. Check the data directory is writable." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
