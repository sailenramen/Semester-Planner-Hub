# Study Planner - Semester Study Tracker

## Overview

A semester study planning application that helps students track their progress across four subjects: Math, Science/Biology, History/Humanities, and English. The app features weekly task management, exam alerts, progress visualization with charts, subject-specific notes, calendar view, and interactive study sessions with built-in timers. Data is now persisted in a PostgreSQL database with full user authentication, replacing the previous browser localStorage approach.

### Interactive Study Features
- **Study Page**: Click any task to open a full-page interactive study session at `/study/:taskId`
- **Built-in Timer**: Pomodoro (25/5 min) and custom duration options with audio completion alerts
- **Study Tabs**: Questions, Reading, Writing, and Summary sections
- **25 Questions Per Subject**: Comprehensive question banks for Math, Science, History, and English aligned with Victorian Curriculum Year 9/10
- **Progress Tracking**: Tracks answered questions, correct answers, and overall progress
- **Content Library**: Located in `client/src/lib/studyContent.ts` with subject-specific educational content
- **Week-Specific Reading**: 17 weeks of reading materials per subject, covering curriculum-aligned topics with paragraphs and key points

### Gamification System
- **Daily Streak Tracker**: Count consecutive study days with visual flame icon that grows with streak length
- **Streak Freezes**: 2 skip days per month to protect streak
- **Achievement Badges**: 19 badges across categories (streak, tasks, grades, time, special)
- **Points System**: Earn points for completing tasks (10 pts), Pomodoro sessions (15 pts), maintaining streaks (5 pts/day)
- **Level System**: Progress through levels 1-50 based on total points earned
- **Profile Page**: View stats, study insights, subject breakdown, and badge trophy case at `/profile`
- **Visual Rewards**: Confetti animations for badge unlocks and level ups
- **Badge Components**: Located in `client/src/components/` (StreakTracker, BadgeDisplay, PointsDisplay, BadgeIcon, Confetti, BadgeUnlockModal)

### Avatar System
- **LevelAvatar Component**: Customizable avatar displayed on Profile page at `client/src/components/LevelAvatar.tsx`
- **8 Color Themes**: blue, purple, green, orange, pink, teal, red, yellow (each with matching gradient colors)
- **3 Avatar Styles**: default (sharp corners), rounded (soft corners), hexagon (clipped hexagon shape)
- **7 Accessories**: Unlock at specific levels - crown (5), halo (10), flame (15), sparkle (20), lightning (25), rainbow (30)
- **Visual Evolution**: Glow effects increase at levels 10+, 20+, 30+, 40+ with special ring effects
- **Avatar Settings Storage**: Persisted in database under user's account

### Badge Showcase
- **BadgeShowcase Component**: Featured badges display at `client/src/components/BadgeShowcase.tsx`
- **Featured Badges**: Users can select up to 4 earned badges to showcase prominently on their profile
- **Edit Modal**: Opens badge selection dialog with all earned badges
- **Persistence**: Selected showcase badges saved in UserStats.showcasedBadges field

### Authentication System
- **Login Page**: Located at `/login` with login and registration tabs
- **AuthContext**: Authentication state management at `client/src/contexts/AuthContext.tsx`, uses API calls
- **Session-Based Auth**: Server-side session storage with `express-session` and `connect-pg-simple` for PostgreSQL
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Protected Routes**: All app routes require authentication, unauthenticated users redirected to `/login`
- **Personalized Greeting**: Dashboard greeting uses logged-in user's name with time-based messages (AEST timezone)
- **Header User Info**: Displays user's name and logout button in app header
- **Session Expiry**: 7-day cookie expiration with httpOnly and secure (in production) flags

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState/useEffect for local state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Build Tool**: Vite with hot module replacement

### Key Frontend Patterns
- **Component Structure**: Pages in `client/src/pages/`, reusable components in `client/src/components/`
- **UI Components**: Pre-built shadcn/ui components in `client/src/components/ui/`
- **Data Fetching**: React Query hooks in `client/src/hooks/useApi.ts` for all API data operations
- **API Communication**: All data (tasks, notes, exams, grades, stats) fetched from backend API
- **Theme System**: ThemeProvider context with light/dark mode toggle (localStorage for theme preference only)

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **Server Structure**: Full REST API with routes in `server/routes.ts` for all CRUD operations
- **Storage Interface**: `IStorage` interface in `server/storage.ts` with DatabaseStorage implementation
- **Authentication**: Session-based auth using `express-session` with PostgreSQL session store
- **Authorization**: `requireAuth` middleware protects all data routes
- **Static Serving**: Production builds served from `dist/public`
- **Development**: Vite dev server with HMR integration

### Database Schema
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts`
- **Tables**: users, tasks, notes, exams, grades, streaks, user_stats, avatar_settings, custom_todos, study_time, day_notes, weekly_goals
- **User-Scoped Data**: All tables reference userId for data isolation between users
- **Validation**: Zod schemas for Task, Exam, Note, and Subject types
- **Migrations**: Use `npm run db:push` to sync schema changes

### Build System
- **Client Build**: Vite bundles React app to `dist/public`
- **Server Build**: esbuild bundles server to `dist/index.cjs`
- **Shared Code**: TypeScript path aliases (`@shared/*`) for shared types between client and server

## External Dependencies

### Core Libraries
- **React Query**: Server state management and caching
- **Recharts**: Progress visualization charts
- **date-fns**: Date manipulation and formatting
- **Zod**: Runtime type validation

### UI Framework
- **Radix UI**: Accessible component primitives (dialog, popover, tabs, etc.)
- **shadcn/ui**: Pre-styled component library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Database & ORM
- **Drizzle ORM**: TypeScript ORM for database operations
- **PostgreSQL**: Database (configured via `DATABASE_URL` environment variable)
- **drizzle-kit**: Database migration and schema management

### Development Tools
- **Vite**: Frontend build tool and dev server
- **esbuild**: Server bundling
- **TypeScript**: Type checking across the entire codebase

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development environment indicator