# Kyubii - AI Coding Guidelines

## Project Overview
Kyubii is a tourism digital map application for Nasu Town, Japan, developed as part of CEP (Community Engagement Project) at Shibaura Institute of Technology. The app lives in `kyubii-app/`.

## Tech Stack
- **Framework**: Next.js 16.0.8 with App Router (`app/` directory)
- **Language**: TypeScript 5.x (strict mode enabled)
- **Styling**: Tailwind CSS v4 using CSS-first config (`@import "tailwindcss"` + `@theme`)
- **Fonts**: Geist Sans/Mono via `next/font/google` with CSS variables
- **Map Engine**: react-leaflet with OpenStreetMap (requires `next/dynamic` with `ssr: false`)
- **Icons**: lucide-react
- **React**: 19.2.1

## Development Commands
All commands run from `kyubii-app/`:
```bash
npm run dev    # Start dev server at localhost:3000
npm run build  # Production build
npm run lint   # ESLint with Next.js core-web-vitals + TypeScript rules
```

## Architecture Patterns

### File Structure
```
app/
├── page.tsx              # Main page (Client Component with state management)
├── layout.tsx            # Root layout with fonts and global CSS
├── globals.css           # Tailwind v4 imports, theme variables, Leaflet CSS
├── data.ts               # Tourism data: spots, courses, categories, helpers
└── components/
    ├── index.ts          # Barrel exports
    ├── Map.tsx           # Dynamic wrapper (ssr: false)
    ├── MapContent.tsx    # Leaflet map with markers/polylines
    ├── CategoryFilter.tsx
    ├── CourseSelector.tsx
    ├── SpotList.tsx
    └── TripPlannerModal.tsx
```

### Data Layer (`data.ts`)
- **Types**: `Spot`, `Course`, `Category`, `TripDuration`, `TripPlan`
- **Constants**: `spots[]` (32 locations with lat/lng), `courses[]` (5 bus routes), `categoryInfo`
- **Helpers**: `getVisibleSpots()`, `filterSpotsByCategories()`, `getCourseCoordinates()`, `planTrip()`
- Spot 10 (Tokyu Harvest Club) has `status: "suspended"` – shown in list but NOT on map

### Leaflet Integration Pattern
**Critical**: Leaflet requires browser APIs. Always use dynamic import:
```tsx
// Map.tsx - wrapper component
const MapContent = dynamic(() => import("./MapContent"), { ssr: false });
```
**Do NOT** export `MapContent` from barrel `index.ts` – only export the `Map` wrapper to prevent SSR issues.

### Styling Conventions
- Tailwind utility classes directly in JSX
- Dark mode via `dark:` prefix and `prefers-color-scheme`
- Theme colors as CSS variables in `globals.css` (`--kyubii-primary`, `--color-gourmet`, etc.)
- Custom marker styles in CSS (`.custom-marker`, `.custom-marker.gourmet`, etc.)
- Font variables: `--font-geist-sans`, `--font-geist-mono`

### Path Aliases
Use `@/*` for imports from project root (configured in `tsconfig.json`):
```typescript
import { Component } from "@/app/components";
```

### Images
Use `next/image` for all images with explicit `width`, `height`, and `alt`:
```tsx
<Image src="/logo.svg" alt="Description" width={100} height={20} priority />
```

## UI/UX Patterns
- **Mobile-first**: Bottom sheet drawer for spot list
- **Desktop**: Left sidebar (w-96, fixed)
- **Responsive**: `lg:` breakpoint switches between mobile/desktop layouts
- Modular components ready for Adobe XD design replacement

## Code Style
- Functional components with TypeScript
- Client Components with `"use client"` for interactive features
- Server Components by default for static content
- ESLint enforces Next.js core-web-vitals and TypeScript best practices
- Prefer `className` strings with Tailwind utilities over CSS modules
