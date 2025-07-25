# Technology Stack

## Framework & Runtime
- **Next.js 15.4.3** with App Router (React 19.1.0)
- **TypeScript 5.8.3** for type safety
- **Node.js** runtime environment

## Database & ORM
- **PostgreSQL** as primary database
- **Prisma 6.12.0** as ORM with client generation
- Database migrations managed through Prisma

## Authentication
- **Better Auth 1.3.3** with multiple providers:
  - Google OAuth
  - Magic link authentication
  - Username/password
  - Admin plugin for role management

## UI & Styling
- **Tailwind CSS 4** for styling with custom design system
- **Radix UI** components for accessible primitives
- **Shadcn/ui** component library (New York style)
- **Framer Motion** for animations
- **Lucide React** for icons
- **Plus Jakarta Sans** and **Poppins** fonts
- Dark/light theme support with **next-themes**

## State Management & Data Fetching
- **TanStack React Query 5.83.0** for server state
- **React Hook Form** with **Zod** validation
- **nuqs** for URL state management

## SVG Processing
- **SVGO 4.0.0** for SVG optimization
- **svg-sprite 2.0.4** for sprite generation
- **svgstore 3.0.1** for SVG bundling
- **is-svg** for SVG validation

## Development Tools
- **ESLint 9** with Next.js config
- **Turbopack** for fast development builds
- **tsx** for TypeScript execution

## Common Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build           # Production build
npm start              # Start production server

# Database
npm run postinstall    # Push DB schema and generate Prisma client
npx prisma db push     # Push schema changes
npx prisma generate    # Generate Prisma client
npx prisma studio      # Open Prisma Studio

# Linting & Quality
npm run lint           # Run ESLint

# Data Collection
npm run scrape:svgrepo # Scrape SVG collections from SVGRepo
```

## Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret