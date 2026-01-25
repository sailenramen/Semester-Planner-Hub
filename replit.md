# Study Planner - Semester Study Tracker

## Overview

A semester study planning application that helps students track their progress across four subjects: Math, Science/Biology, History/Humanities, and English. The app features weekly task management, exam alerts, progress visualization with charts, subject-specific notes, calendar view, and interactive study sessions with built-in timers. Data is persisted using browser localStorage, making it a client-heavy application with a minimal Express backend.

### Interactive Study Features
- **StudyModal**: Click any task to open an interactive study session with Victorian Curriculum-aligned content
- **Built-in Timer**: Pomodoro (25/5 min) and custom duration options with audio completion alerts
- **Study Modes**: Reading comprehension, Practice problems, Writing exercises, and Review flashcards
- **Subject-Specific Content**: Each subject has tailored educational material (Math formulas, Science equations, History sources, English analysis)
- **Content Library**: Located in `client/src/lib/studyContent.ts` with term-appropriate Victorian Curriculum Year 9/10 content

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
- **Data Persistence**: LocalStorage for tasks, notes, exams, and user preferences (`client/src/lib/storage.ts`)
- **Theme System**: ThemeProvider context with light/dark mode toggle

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **Server Structure**: Minimal REST API setup with routes in `server/routes.ts`
- **Storage Interface**: `IStorage` interface in `server/storage.ts` with in-memory implementation (MemStorage)
- **Static Serving**: Production builds served from `dist/public`
- **Development**: Vite dev server with HMR integration

### Database Schema
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts`
- **Current Models**: User schema with basic username field
- **Validation**: Zod schemas for Task, Exam, Note, and Subject types
- **Note**: Database is configured but the app primarily uses localStorage for data persistence

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