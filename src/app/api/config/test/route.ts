import { verifyConnection } from "@/server/connection";

/** Tries the form's connection details against NPM without saving anything. */
export async function POST(request: Request) {
  const result = await verifyConnection(await request.json().catch(() => null));
  if ("error" in result) return Response.json({ ok: false, message: result.error });
  return Response.json({ ok: true, url: result.conn.url, hosts: result.hosts });
}
