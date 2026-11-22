"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/Button";
import { NpmConnectionFields } from "./NpmConnectionFields";
import { useConnectionForm } from "./useConnectionForm";

/** The settings page. The saved password is never sent to the browser, so an empty password field means "keep it". */
export function SettingsView({ initial }: { initial: { url: string; email: string } }) {
  const form = useConnectionForm({ ...initial, password: "" });

  return (
    <main className="mx-auto grid w-full max-w-2xl gap-6 px-6 py-10">
      <header className="flex items-center gap-3.5">
        <Link
          href="/"
          aria-label="Back to services"
          className="grid size-11 place-items-center rounded-control border border-edge text-muted transition hover:border-faint hover:text-fg"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <h1 className="text-[26px] font-bold tracking-tight">Settings</h1>
      </header>

      <section className="grid gap-5 rounded-control border border-edge bg-surface p-6">
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold">Nginx Proxy Manager</h2>
          <p className="text-sm text-muted">Where the services list comes from. Leave the password empty to keep the saved one.</p>
        </div>
        <NpmConnectionFields form={form} passwordSaved />
      </section>

      <div className="flex items-center justify-end gap-4">
        {form.saved && (
          <span className="flex animate-enter items-center gap-2 text-sm text-status-running">
            <FontAwesomeIcon icon={faCircleCheck} /> Saved
          </span>
        )}
        <Button onClick={form.save} loading={form.saving}>
          Save changes
        </Button>
      </div>
    </main>
  );
}
