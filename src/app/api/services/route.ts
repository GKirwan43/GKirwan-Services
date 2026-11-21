import { getServices } from "@/server/services";

export async function GET() {
  return Response.json(await getServices());
}
