# GKirwan services

The homelab services page, split out of the website. It shows the homelab's services grouped by category, with search
and status filters. For now the list is placeholder data (`src/server/placeholders.ts`). It is meant to run on the internal VLAN only (its own LXC, no Docker).

## Setup

Node 20 or later.

```bash
npm install
cp .env.example .env   # SHOW_PLACEHOLDER_SERVICES=true shows the fake list
npm run dev            # http://localhost:3000
```

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
  app/                  routing only: layout, page, global styles, api/services route
    globals.css         Tailwind import, design tokens (@theme), base styles
  components/
    ui/                 generic building blocks (Chip, SearchInput, SegmentedControl, …)
    services/           the services page; ServicesView.tsx is the entry point
  constants/            static data: categories, statuses, logo overrides
  hooks/                useServices (loads /api/services), useScrolled
  lib/                  pure helpers usable anywhere: filters, icons, strings, cn
  server/               server-only: getServices (what /api/services returns) and its data
  types/                shared types, including the /api/services response shape
```

To add a category, add an entry to `src/constants/categories.ts`. To plug in a real data source, change `getServices` in
`src/server/services.ts`; nothing else needs to know.

Styling is Tailwind. Colours, radii and easing are tokens in `globals.css` (e.g. `bg-surface`, `rounded-control`,
`ease-snappy`); add a token there rather than hard-coding a value in a component.
