<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack

- Next.js 16.2.4 (App Router) + React 19.2.4 + TypeScript 5
- Tailwind CSS 4 (CSS-first config via `@import "tailwindcss"` in `app/globals.css`, no `tailwind.config.*`)
- shadcn 4.5.0 with `@base-ui/react` primitives (not radix-ui)
- Component styling uses OKLCH color space and CSS custom properties in `app/globals.css`

## Commands

- `bun dev` — start dev server (default port 3000)
- `bun build` — production build
- `bun lint` — ESLint (next/core-web-vitals + typescript presets)
- No test framework or typecheck script configured

## Conventions

- Path alias: `@/*` maps to project root (set in `tsconfig.json`)
- UI components in `components/ui/` follow shadcn patterns with `data-slot` attributes
- App routes use Next.js App Router in `app/` directory
- Theme toggling via `next-themes` with `class` strategy (dark mode = `dark` class)
- `next.config.ts` allows dev origins from `192.168.1.51`
