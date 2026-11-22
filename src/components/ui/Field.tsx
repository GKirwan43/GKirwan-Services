"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/cn";

/** A labelled text input with an optional hint. type="password" gets a show/hide toggle. */
export function Field({
  label,
  hint,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete = "off",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "password" | "email";
  placeholder?: string;
  autoComplete?: string;
}) {
  const [shown, setShown] = useState(false);
  const isPassword = type === "password";

  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <span className="relative flex">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={isPassword && shown ? "text" : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          spellCheck={false}
          className={cn(
            "h-11 w-full rounded-control border border-edge bg-surface-2 px-4 outline-none placeholder:text-faint focus:border-muted",
            isPassword && "pr-11",
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShown((s) => !s)}
            aria-label={shown ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1 text-faint transition-colors hover:text-fg"
          >
            <FontAwesomeIcon icon={shown ? faEyeSlash : faEye} />
          </button>
        )}
      </span>
      {hint && <span className="text-xs text-faint">{hint}</span>}
    </label>
  );
}
