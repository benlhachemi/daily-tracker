# Project Context

## Application Overview
**DailyHabit** is a modern habit tracking application designed to help users build and maintain daily habits through an intuitive interface and comprehensive analytics.

## Core Features
- **Habit Creation**: Define custom habits with goals, units, emojis, and colors
- **Daily Tracking**: Mark habit completion and track progress over time
- **Analytics Dashboard**: Visualize habit streaks and completion rates
- **Responsive Design**: Works seamlessly on mobile and desktop devices
- **Local Storage**: Data stored locally using RxDB for privacy and offline access

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 16.2.4 (App Router)
- **UI Library**: React 19.2.4 + TypeScript 5
- **Styling**: Tailwind CSS 4 with OKLCH color space
- **Components**: shadcn 4.5.0 with @base-ui/react primitives
- **Animations**: Motion library for smooth transitions
- **Charts**: Recharts for data visualization

### Database & State
- **Database**: RxDB for reactive local database management
- **Schemas**: TypeScript-based schemas for habits and habit logs
- **State Management**: React hooks for data fetching and local state
- **Real-time Updates**: RxDB provides reactive data streams

### Key Dependencies
- `@base-ui/react`: Modern React component primitives
- `rxdb`: Reactive database for local data storage
- `recharts`: Chart library for analytics
- `lottie-react`: Lottie animations for habit celebrations
- `next-themes`: Dark/light theme support
- `date-fns` & `dayjs`: Date manipulation utilities

## Data Models

### Habit Schema
```typescript
interface Habit {
  id: string;
  name: string;
  color: HabitColor; // 11 predefined colors
  emoji: string;
  goal: number;
  unit: string;
  timestamp: string;
  isArchived: boolean;
  archivedAt: string;
}
```

### Habit Log Schema
```typescript
interface HabitLog {
  id: string;
  habitId: string;
  timestamp: string;
  value: number;
  completed: boolean;
}
```

## Component Architecture

### Core Components
- `CreateHabitCard`: Form for creating new habits
- `ActiveHabitCard`: Display and interaction for active habits
- `ArchivedHabitCard`: Management of archived habits
- `AnalyticsChart`: Data visualization for habit progress
- `StackedLayout`: Main application layout component

### UI Components
- Located in `components/ui/` following shadcn patterns
- Use `data-slot` attributes for proper styling
- Fully responsive with mobile-first approach

## Development Workflow

### Environment Setup
```bash
bun install          # Install dependencies
bun dev             # Start development server (port 3000)
bun build           # Production build
bun lint            # Code quality checks
```

### File Structure
```
app/                 # Next.js App Router pages
├── (home)/         # Home route
├── analytics/      # Analytics dashboard
└── my-habits/      # Habit management

components/          # React components
├── ui/             # shadcn UI components
├── blocks/         # Layout components
└── *.tsx           # Feature components

db/                 # Database configuration
├── schemas/        # RxDB schemas
├── index.ts        # Database setup
└── types.ts        # TypeScript types

hooks/              # Custom React hooks
lib/                # Utility functions
providers/          # React context providers
```

## Development Guidelines

### Code Standards
- TypeScript strict mode enabled
- ESLint with Next.js and TypeScript presets
- Path alias `@/*` for clean imports
- Component naming: PascalCase for components, camelCase for utilities

### Styling Conventions
- Tailwind CSS 4 with CSS-first configuration
- OKLCH color space for better color consistency
- Dark mode support via `next-themes`
- Responsive design with mobile-first approach

### Database Best Practices
- Use RxDB reactive queries for real-time updates
- Implement proper error handling for database operations
- Maintain data consistency with schema validation
- Handle offline scenarios gracefully

## User Experience Features

### Habit Management
- 11 color options for habit categorization
- Emoji support for visual habit identification
- Goal setting with customizable units
- Archive functionality for completed habits

### Analytics & Insights
- Streak tracking and visualization
- Completion rate statistics
- Historical data analysis
- Progress charts using Recharts

### Accessibility
- Keyboard navigation support
- Screen reader compatible components
- High contrast mode support
- Touch-friendly mobile interface

## Performance Considerations
- RxDB provides efficient local data storage
- Lazy loading for large datasets
- Optimized bundle size with Next.js
- Smooth animations using Motion library

## Future Enhancements
- Cloud sync capabilities
- Social features for habit sharing
- Advanced analytics and insights
- Habit templates and suggestions
