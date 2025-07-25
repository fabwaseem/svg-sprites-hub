# Project Structure

## Root Directory Organization

```
├── app/                    # Next.js App Router pages and layouts
│   ├── (web)/             # Web application routes
│   ├── api/               # API routes and endpoints
│   ├── layout.tsx         # Root layout with providers
│   └── globals.css        # Global styles and CSS variables
├── components/            # React components organized by domain
│   ├── auth/              # Authentication-related components
│   ├── common/            # Shared/reusable components
│   ├── landing/           # Landing page components
│   ├── layout/            # Layout components (headers, sidebars)
│   ├── sprite/            # Sprite-specific components
│   ├── ui/                # Shadcn/ui components
│   └── upload/            # File upload components
├── config/                # Configuration files
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and configurations
│   ├── db/                # Database connection and utilities
│   ├── auth.ts            # Authentication configuration
│   └── utils.ts           # Shared utility functions
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── scripts/               # Build and utility scripts
└── types/                 # TypeScript type definitions
```

## Key Conventions

### File Naming
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useSprites.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **API routes**: kebab-case directories with `route.ts` files
- **Pages**: kebab-case directories with `page.tsx` files

### Import Aliases
- `@/*` - Root directory alias for clean imports
- `@/components` - Components directory
- `@/lib` - Library utilities
- `@/hooks` - Custom hooks
- `@/types` - Type definitions

### Component Organization
- **Domain-based**: Components grouped by feature/domain (auth, sprite, upload)
- **Shared components**: Common reusable components in `components/common/`
- **UI primitives**: Shadcn/ui components in `components/ui/`
- **Layout components**: Headers, navigation, providers in `components/layout/`

### Database Layer
- **Prisma schema**: Single source of truth in `prisma/schema.prisma`
- **Database client**: Centralized in `lib/db/prisma.ts`
- **Migrations**: Auto-generated in `prisma/migrations/`

### Authentication Flow
- **Configuration**: `lib/auth.ts` (Better Auth setup)
- **Client utilities**: `lib/auth-client.ts`
- **Route protection**: `middleware.ts` and `config/auth.ts`

### State Management Patterns
- **Server state**: TanStack Query hooks in `hooks/` directory
- **Form state**: React Hook Form with Zod validation
- **URL state**: nuqs for search params and filters
- **Theme state**: next-themes provider in layout

### API Structure
- **RESTful endpoints**: Organized in `app/api/` with route handlers
- **Database operations**: Direct Prisma client usage
- **Authentication**: Better Auth middleware integration

### Styling Approach
- **Tailwind classes**: Utility-first with custom design tokens
- **CSS variables**: Defined in `globals.css` for theming
- **Component variants**: Class Variance Authority (CVA) for component styling
- **Responsive design**: Mobile-first approach with Tailwind breakpoints