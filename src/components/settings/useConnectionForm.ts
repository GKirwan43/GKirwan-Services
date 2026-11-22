"use client";

import { useState } from "react";

export type NpmConnection = { url: string; email: string; password: string };

/** The outcome of the last test or save, shown under the form. A failed save replaces the test result. */
export type ConnectionResult =
  | { status: "idle" }
  | { status: "testing" }
  | { status: "ok"; url: string; hosts: number }
  | { status: "failed"; message: string };

const UNREACHABLE = "Couldn't reach this app's server. Try again.";

/** Sends the form to one of the /api/config routes. Throws only when this app's server can't be reached. */
async function send(method: "POST" | "PUT", path: string, value: NpmConnection) {
  const res = await fetch(path, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(value) });
  return { ok: res.ok, body: await res.json().catch(() => null) };
}

/** State for the NPM connection form shared by setup and settings: the values, the last test/save result, and saving. */
export function useConnectionForm(initial: NpmConnection) {
  const [value, setValue] = useState(initial);
  const [result, setResult] = useState<ConnectionResult>({ status: "idle" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  /** Editing clears the last result, since it no longer describes these values. */
  const change = (patch: Partial<NpmConnection>) => {
    setValue((v) => ({ ...v, ...patch }));
    setResult({ status: "idle" });
    setSaved(false);
  };

  /** Asks the server to log in to NPM with the form's values (nothing is saved). */
  async function test() {
    setResult({ status: "testing" });
    try {
      const { body } = await send("POST", "/api/config/test", value);
      setResult(body?.ok ? { status: "ok", url: body.url, hosts: body.hosts } : { status: "failed", message: body?.message ?? UNREACHABLE });
    } catch {
      setResult({ status: "failed", message: UNREACHABLE });
    }
  }

  /**
   * Saves the connection (the server only accepts it once a login works). Resolves true when saved.
   * The password field is then cleared, since the saved one is kept while it's empty.
   */
  async function save(): Promise<boolean> {
    setSaving(true);
    try {
      const { ok, body } = await send("PUT", "/api/config", value);
      if (ok) {
        setValue((v) => ({ ...v, password: "" }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        return true;
      }
      setResult({ status: "failed", message: body?.message ?? "Couldn't save. Try again." });
    } catch {
      setResult({ status: "failed", message: UNREACHABLE });
    } finally {
      setSaving(false);
    }
    return false;
  }

  return { value, change, result, test, save, saving, saved };
}

export type ConnectionForm = ReturnType<typeof useConnectionForm>;
