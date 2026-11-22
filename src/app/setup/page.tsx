import { redirect } from "next/navigation";
import { connection } from "next/server";
import { SetupWizard } from "@/components/settings/SetupWizard";
import { getConfig } from "@/server/config";

export const metadata = { title: "Setup · Services" };

export default async function Page() {
  await connection();
  // Once set up, changes happen in Settings.
  if (await getConfig()) redirect("/settings");
  return <SetupWizard />;
}
