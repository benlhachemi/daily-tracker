# Claude AI Assistant Guidelines

## Project Overview
This is a habit tracking application built with Next.js 16.2.4, React 19.2.4, and TypeScript 5. The app helps users track daily habits and provides analytics.

## Key Technologies & Patterns
- **Database**: RxDB for reactive local database management
- **Styling**: Tailwind CSS 4 with OKLCH color space
- **UI Components**: shadcn 4.5.0 with @base-ui/react primitives
- **State Management**: React hooks for data fetching and local state

## File Structure Conventions
```
app/                 # Next.js App Router pages
components/          # Reusable React components
├── ui/             # shadcn UI components
├── blocks/         # Layout components
└── *.tsx           # Feature-specific components
db/                 # Database schemas and types
hooks/              # Custom React hooks
lib/                # Utility functions
providers/          # React context providers
public/             # Static assets
```

## Development Guidelines
- Follow existing component patterns in `components/ui/`
- Use `data-slot` attributes for shadcn components
- Maintain TypeScript strict mode compliance
- Use path alias `@/*` for imports
- Implement responsive design with Tailwind classes

## Database Schema
- **habits**: Core habit definitions and properties
- **habit-logs**: Daily completion records for habits

## Common Tasks
- Creating new habits: Use `CreateHabitCard` component
- Tracking progress: `ActiveHabitCard` for current habits
- Analytics: `AnalyticsChart` for visualization
- Mobile responsiveness: `useMobile` hook available

## Testing & Quality
- Run `npm run lint` for code quality checks
- Ensure components work on mobile and desktop
- Test database operations thoroughly with RxDB

@AGENTS.md
