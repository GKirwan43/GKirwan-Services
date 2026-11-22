import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ServicesView } from "@/components/services/ServicesView";
import { getConfig } from "@/server/config";

// Until the NPM connection is set up, go to first-run setup. Otherwise the shell renders instantly
// and the service list loads client-side from /api/services.
export default async function Page() {
  await connection();
  if (!(await getConfig())) redirect("/setup");
  return <ServicesView />;
}
