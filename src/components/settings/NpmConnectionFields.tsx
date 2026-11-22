"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import type { ConnectionForm } from "./useConnectionForm";

/** The NPM URL + login fields, the "Test connection" button and the last test/save result. Shared by setup and settings. */
export function NpmConnectionFields({
  form: { value, change, result, test },
  passwordSaved = false,
}: {
  form: ConnectionForm;
  /** Settings only: a password is already stored, so an empty field means "keep it". */
  passwordSaved?: boolean;
}) {
  return (
    <div className="grid gap-4">
      <Field
        label="Nginx Proxy Manager URL"
        hint="The admin UI address. An IP or hostname is fine; port 81 is assumed if you leave it off."
        value={value.url}
        onChange={(url) => change({ url })}
        placeholder="10.0.30.6"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" type="email" value={value.email} onChange={(email) => change({ email })} placeholder="services@homelab.local" autoComplete="username" />
        <Field
          label="Password"
          type="password"
          value={value.password}
          onChange={(password) => change({ password })}
          placeholder={passwordSaved ? "•••••••• (saved)" : undefined}
          autoComplete="current-password"
        />
      </div>
      <p className="text-xs text-faint">Tip: create a separate NPM user with view-only access to proxy hosts instead of using your admin login.</p>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={test} disabled={!value.url.trim()} loading={result.status === "testing"}>
          Test connection
        </Button>
        {result.status === "ok" && (
          <span className="flex items-center gap-2 text-sm text-status-running">
            <FontAwesomeIcon icon={faCircleCheck} /> Connected to {result.url}. Found {result.hosts} proxy hosts.
          </span>
        )}
        {result.status === "failed" && (
          <span className="flex items-center gap-2 text-sm text-status-stopped">
            <FontAwesomeIcon icon={faCircleXmark} /> {result.message}
          </span>
        )}
      </div>
    </div>
  );
}
