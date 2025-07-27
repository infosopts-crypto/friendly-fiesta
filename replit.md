# Quran Circle Management System

## Overview

This is a comprehensive web application for managing Quran memorization circles (حلقات القرآن) built for Jamae Al-Ruwaishid (جامع الرويشد). The system is designed exclusively for teachers to manage students and track their Quran memorization progress. It features gender-separated learning environments for male and female students with appropriate theming and full Arabic RTL language support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Validation**: Zod schemas for request/response validation
- **Build Tool**: ESBuild for production builds

### Data Storage Architecture
- **Primary Storage**: Firebase Firestore (cloud NoSQL database)
- **Development Storage**: In-memory storage implementation (current fallback)
- **Authentication**: Simple password-based authentication system
- **Real-time Features**: Firebase Firestore real-time listeners support
- **Offline Support**: Firestore offline persistence capabilities
- **Backup Options**: PostgreSQL/Supabase integration available as alternative

## Key Components

### Authentication System
- Teacher-only authentication system
- Gender-based theming (men's vs women's circles)
- Session persistence via localStorage
- Secure credential management

## Recent Changes (July 2025)
- **Created comprehensive home page** with separate teacher and parent portals
- **Added parent portal** for public viewing of all students without authentication  
- **Integrated Firebase Firestore** as primary database (currently using memory storage as fallback)
- **Added all 13 teachers** with standardized credentials (username/password: 123456)
- **Populated system with sample students** across male and female circles
- **Added developer footer** with attribution to عبدالله بن محمد and Telegram link
- **Complete system ready for deployment** with full Arabic RTL support
- **Fixed deployment configuration** with proper build scripts and deployment guides
- **Created deployment workarounds** for static file serving mismatch between Vite and Express

### Student Management
- CRUD operations for student records
- Student categorization by skill level (beginner, intermediate, advanced)
- Teacher-student relationships
- Age and contact information tracking

### Daily Record System
- Comprehensive daily memorization tracking
- Hijri date support with Arabic calendar integration
- Multiple tracking categories:
  - Daily lessons with verse ranges
  - Review sessions
  - Error tracking
  - Behavior evaluation
  - Attendance monitoring

### Quran Viewer & Error Tracking
- Interactive Quran verse display
- Real-time error marking and categorization
- Error type classification (repeated vs previous errors)
- Visual highlighting system for tracking mistakes

### Reporting System
- Individual student reports
- Class-wide analytics
- Export capabilities (PDF/Excel planned)
- Progress tracking over time periods

## Data Flow

1. **Authentication Flow**: User logs in → credentials validated → teacher data stored in localStorage → dashboard access granted
2. **Student Management Flow**: Teacher selects students → CRUD operations via API → real-time UI updates via React Query
3. **Daily Records Flow**: Teacher creates daily record → form validation → API submission → cache invalidation → UI refresh
4. **Error Tracking Flow**: Teacher views Quran → selects verses → marks errors → categorizes mistakes → saves to database

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React ecosystem (@radix-ui components, react-hook-form, @tanstack/react-query)
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for iconography
- **Build Tools**: Vite for development and building

### Backend Dependencies
- **Web Framework**: Express.js with standard middleware
- **Database**: Drizzle ORM with @neondatabase/serverless for PostgreSQL
- **Validation**: Zod for schema validation and type safety
- **Development**: tsx for TypeScript execution

### Development Dependencies
- **Database Tools**: Drizzle Kit for migrations and schema management
- **Build Tools**: ESBuild for production bundling
- **Development Server**: Vite with HMR and error overlay
- **Replit Integration**: Custom plugins for Replit development environment

## Deployment Strategy

### Development Environment
- Vite development server with HMR
- In-memory storage for rapid prototyping
- Environment-specific configurations
- Replit-specific tooling and banners

### Production Build Process
1. Frontend: Vite builds React app to `dist/public`
2. Backend: ESBuild bundles server code to `dist/index.js`
3. Database: Drizzle migrations applied via `db:push` command
4. Deployment: Node.js serves bundled application

### Database Configuration
- PostgreSQL connection via DATABASE_URL environment variable
- Drizzle ORM handles connection pooling and query building
- Schema definitions in `shared/schema.ts` for type safety
- Migration files generated in `./migrations` directory

### Static Asset Serving
- Production: Express serves static files from `server/public` 
- Development: Vite middleware handles asset serving
- Vite configuration handles path resolution and aliases
- **Current Issue**: Vite outputs to `dist/public` but server expects `server/public`

### Deployment Options & Fixes

#### Option 1: Autoscale Deployment (Recommended)
This is the recommended approach for the full-stack application:
1. **Deployment Type**: Autoscale 
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`
4. **Workaround**: Run `node scripts/prepare-production.js` after build to copy static files to correct location

#### Option 2: Static Deployment
For frontend-only deployment (no API endpoints):
1. **Deployment Type**: Static
2. **Public Directory**: `dist/public`
3. **Build Command**: `vite build`
4. **Alternative**: Use `node scripts/build-for-static.js` to copy files to `dist/` root

#### Deployment Scripts Created
- `scripts/prepare-production.js`: Copies `dist/public/*` to `server/public/` for autoscale deployment
- `scripts/build-for-static.js`: Copies `dist/public/*` to `dist/` for static deployment
- `deployment-guide.md`: Comprehensive deployment documentation

The application is designed to be deployed on platforms supporting Node.js with PostgreSQL databases, with specific optimizations for Replit's environment during development.