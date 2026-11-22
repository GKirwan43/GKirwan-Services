import { getConfig } from "@/server/config";
import { NpmError } from "@/server/npm";
import { getServices } from "@/server/services";

export async function GET() {
  const config = await getConfig();
  if (!config) return Response.json({ error: "Setup hasn't been done yet." }, { status: 409 });

  try {
    return Response.json(await getServices(config.npm));
  } catch (error) {
    if (error instanceof NpmError) return Response.json({ error: error.message }, { status: 502 });
    throw error;
  }
}
