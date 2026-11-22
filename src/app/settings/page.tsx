import { redirect } from "next/navigation";
import { connection } from "next/server";
import { SettingsView } from "@/components/settings/SettingsView";
import { getConfig } from "@/server/config";

export const metadata = { title: "Settings · Services" };

export default async function Page() {
  await connection();
  const config = await getConfig();
  if (!config) redirect("/setup");
  // The password stays on the server.
  return <SettingsView initial={{ url: config.npm.url, email: config.npm.email }} />;
}
