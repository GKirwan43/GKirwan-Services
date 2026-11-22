# GKirwan services

The homelab services page, split out of the website. It shows the homelab's services grouped by category, with search
and status filters. The list comes from Nginx Proxy Manager: one service per proxy host. It is meant to run on the internal VLAN only (its own LXC, no Docker).

## Setup

Node 20 or later.

```bash
npm install
cp .env.example .env   # optional: PORT, DATA_DIR
npm run dev            # http://localhost:3000
```

On first launch the app redirects to `/setup`, where you enter the NPM address (an IP or hostname is fine; port 81 is assumed),
email and password. The connection is tested before it is saved. The gear icon on the services page opens `/settings` to change
it later. There is no login on the app itself, so keep it on the internal VLAN, and use a dedicated NPM user with view-only
access to proxy hosts rather than your admin account.

The connection is saved to `config.json` in `DATA_DIR` (default `./data`, mode 600, holds the NPM password). On the LXC that is
`/var/lib/gkirwan-services`, outside the release folder so updates keep it.

## Building and running

```bash
npm run build          # a self-contained build in .next/standalone
npm start              # next start, on PORT (default 3000)
```

For the LXC, run it under systemd with `node .next/standalone/server.js` (copy `.next/static` into `.next/standalone/.next/`, as
the Next standalone docs describe), with the `.env` values set in the unit's environment.

## Layout

```
src/
  app/                  routing only: layout, pages (/, /setup, /settings), global styles, api routes
    globals.css         Tailwind import, design tokens (@theme), base styles
  components/
    ui/                 generic building blocks (Button, Field, Chip, SearchInput, SegmentedControl, …)
    services/           the services page; ServicesView.tsx is the entry point, useServices loads /api/services
    settings/           the NPM connection form (useConnectionForm), used by SetupWizard and SettingsView
  constants/            static data: categories and their keywords, statuses, logo overrides
  hooks/                generic hooks not tied to a feature (useScrolled)
  lib/                  pure helpers usable anywhere: filters, icons, strings, cn
  server/               server-only: config file, NPM client, connection checks, getServices
  types/                shared types, including the /api/services response shape
```

NPM has no categories or status, so `src/server/services.ts` derives them: a service is named after its first domain and filed by
keyword (`src/constants/categoryKeywords.ts`, unmatched goes to Other), and its status is whether the proxy target accepts a TCP
connection from this server (disabled hosts show as stopped). To add a category, add an entry to `src/constants/categories.ts`
and its keywords.

Styling is Tailwind. Colours, radii and easing are tokens in `globals.css` (e.g. `bg-surface`, `rounded-control`,
`ease-snappy`); add a token there rather than hard-coding a value in a component.
