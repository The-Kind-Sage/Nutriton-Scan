# NutritionScan

Scan anything. Understand everything. AI-powered nutrition clarity for real life.

NutritionScan turns a barcode, a food label, or a photo into a single meaningful
score, so you can make better choices without reading a chemistry degree.

## Features

- **AI barcode scan** — point the camera at a product and get an instant score.
- **Image & label scan** — no barcode? Upload a photo of the packaging instead.
- **One clear score** — a single 0–100 number that actually means something.
- **Ingredient clarity** — plain-language decoding of what is on the label.
- **Personalized swaps** — better alternatives for your goals.
- **Trends over time** — small scans build a picture of what works for you.

## Screens

| Route           | Description                                       |
| --------------- | ------------------------------------------------- |
| `/`             | Marketing landing page                            |
| `/app`          | Dashboard with score, nutrients and recent scans  |
| `/app/scan`     | Camera / upload capture flow with scan results    |
| `/app/history`  | Full scan diary grouped by meal                   |

## Tech stack

- [Next.js 16](https://nextjs.org) with App Router and React 19
- [Tailwind CSS v4](https://tailwindcss.com) via PostCSS
- [shadcn/ui](https://ui.shadcn.com) on top of [Base UI](https://base-ui.com)
- [lucide-react](https://lucide.dev) icons
- TypeScript (strict)

## Getting started

Requires Node.js 20+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

Note: the camera flow on `/app/scan` requires a secure context, so use
`localhost` or HTTPS. Browsers will prompt for camera permission.

## Scripts

| Command     | Description              |
| ----------- | ------------------------ |
| `pnpm dev`  | Start the dev server     |
| `pnpm build`| Production build         |
| `pnpm start`| Serve the production build |

## Project structure

```
app/
  layout.tsx            # Root layout, metadata, icons
  page.tsx              # Landing page
  globals.css           # Tailwind imports and design tokens
  app/
    page.tsx            # Dashboard
    scan/page.tsx       # Camera capture and results
    history/page.tsx    # Scan diary
components/
  app-bottom-nav.tsx    # Mobile bottom navigation
  ui/button.tsx         # Button primitive
lib/
  utils.ts              # cn() class-merge helper
public/                 # Icons and placeholder imagery
```

## License

Private project. All rights reserved.
