"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { NpmConnectionFields } from "./NpmConnectionFields";
import { useConnectionForm } from "./useConnectionForm";

/** First-run setup, shown until a config exists. Saving checks the login, then goes straight to the services page. */
export function SetupWizard() {
  const router = useRouter();
  const form = useConnectionForm({ url: "", email: "", password: "" });
  const { url, email, password } = form.value;

  const submit = async () => {
    if (await form.save()) router.push("/");
  };

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-xl content-center gap-6 px-6 py-12">
      <header className="grid gap-1">
        <h1 className="text-[26px] font-bold tracking-tight">Welcome to Services</h1>
        <p className="text-muted">Connect this dashboard to Nginx Proxy Manager to get started.</p>
      </header>

      <section className="grid animate-enter gap-5 rounded-control border border-edge bg-surface p-6">
        <h2 className="text-lg font-semibold">Connect to Nginx Proxy Manager</h2>
        <NpmConnectionFields form={form} />
        <div className="flex justify-end">
          <Button onClick={submit} disabled={!url.trim() || !email.trim() || !password} loading={form.saving}>
            Save and continue
          </Button>
        </div>
      </section>
    </main>
  );
}
