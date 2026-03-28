<h1 align="center">StudyPilot</h1>
<h3 align="center">AI-Powered Study Dashboard</h3>

<p align="center">
  <em>Your AI-powered academic companion for smarter studying.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Azure_OpenAI-GPT--5.2-0078D4?logo=microsoftazure&logoColor=white" alt="Azure OpenAI" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Tests-315_passing-brightgreen?logo=vitest" alt="Tests" />
  <img src="https://img.shields.io/badge/Coverage-87%25-brightgreen" alt="Coverage" />
</p>

<p align="center">
  <strong>CMPE 280 — Web UI Design and Development | Spring 2026 | San Jose State University</strong>
</p>

---

## Table of Contents

- [Team Members](#team-members)
- [Problem Statement](#problem-statement)
- [Demo Walkthrough](#demo-walkthrough-for-presentation)
- [Technical Summary](#technical-summary)
- [Individual Contributions](#individual-contributions)
- [What We Built](#what-we-built)
- [Tech Stack](#tech-stack)
- [Design System and Patterns](#design-system-and-patterns)
- [Animation System](#animation-system-framer-motion)
- [Component Architecture](#component-architecture)
- [Backend Architecture](#backend-architecture)
- [Voice Assistant](#voice-assistant)
- [AI Integration](#ai-integration)
- [Testing](#testing)
- [Demo Credentials](#demo-credentials)
- [How to Run](#how-to-run)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Libraries and Dependencies](#libraries-and-dependencies)
- [Presentation Guide](#presentation-guide----design-decisions-and-technical-implementation)
- [Hackathon Rubric Alignment](#hackathon-rubric-alignment)

---

## Team Members

| Name | SJSU Email | GitHub |
|------|-----------|--------|
| Vineet Kumar | vineet.kumar@sjsu.edu | [@vineetkia](https://github.com/vineetkia) |
| Vritika Malhotra | vritika.malhotra@sjsu.edu | [@VritikaMalhotra](https://github.com/VritikaMalhotra) |
| Disha Jadav | disha.jadav@sjsu.edu | [@dishajadav12](https://github.com/dishajadav12) |
| Kumar Harsh | kumar.harsh@sjsu.edu | [@KHarsh98](https://github.com/KHarsh98) |
| Sriram Lakumarapu | sriram.lakumarapu@sjsu.edu | [@SriramLakumarapu](https://github.com/SriramLakumarapu) |

**Instructor:** Dr. Xiuduan Fang

---

## Problem Statement

**The Problem:** College students are overwhelmed. They juggle assignments across Canvas, keep deadlines in their heads, and use scattered tools that don't talk to each other -- Google Calendar for events, a notes app for todos, and random websites for study help. There is no single place where a student can see everything they need to do, plan their study time, and get instant help understanding course material.

**Our Solution:** StudyPilot is a unified study dashboard that brings everything into one place. Instead of switching between five different apps, students open StudyPilot and immediately see their todos, assignments, calendar, and can ask an AI tutor for help -- all in one tab. The AI doesn't just answer questions; it looks at your actual assignments and deadlines to generate personalized study plans and suggest tasks you should create. For students with disabilities, the entire app can be controlled by voice alone -- no keyboard or mouse required.

**In one sentence:** StudyPilot is an AI-powered study companion that replaces the scattered mess of student productivity tools with a single, intelligent dashboard.

---

## Demo Walkthrough (for Presentation)

Here is a suggested flow for demonstrating StudyPilot in class:

1. **Dashboard** — Open the app and show the four stat cards counting up. Point out the glassmorphism cards and the animated gradient background. Toggle dark mode to show the theme system.
2. **AI Study Plan** — Click "Generate Study Plan" on the dashboard. The AI reads your actual assignments and deadlines and streams a personalized day-by-day plan in real time.
3. **Todos** — Navigate to Todos. Add a task, filter by priority, then click "AI Suggest" to show the AI analyzing your workload and recommending tasks. Add one with a single click.
4. **Assignments** — Open the Assignments page. Click the sparkle icon on any assignment to open the AI tutor — it knows which assignment you selected and gives contextual help.
5. **Calendar** — Show the month grid on desktop, then resize the browser to demonstrate the responsive agenda view on mobile.
6. **AI Chat** — Open the Chat page and ask a study question. Point out the streaming text effect (words appear one by one, not all at once) and the blinking cursor.
7. **Voice Assistant** — Click the **Voice Assistant** button in the sidebar (or press Ctrl+Shift+V). Say "Add a todo" and watch it open the form. Say "Go to calendar" to navigate by voice. The sidebar button shows real-time state with animated indicators and sound bars.
8. **Accessibility** — Show the `prefers-reduced-motion` behavior (all animations stop). Mention ARIA labels, keyboard navigation, and WCAG AA contrast.

---

## Technical Summary

Built with Next.js 16, backed by a PostgreSQL database running in Docker, and powered by Azure OpenAI GPT-5.2, the app features JWT authentication with user-scoped data isolation, real-time AI streaming, a voice-first interface using Azure Speech Services, a glassmorphism design system with dark/light themes, and a fully responsive interface that works seamlessly on desktop and mobile. Deployed on an Azure Ubuntu VM with Docker Compose.

### Architecture Diagram

<p align="center">
  <img src="diagram/architecture-diagram.png" alt="StudyPilot Architecture Diagram" width="800" />
</p>

### Key Highlights

- **4 AI-powered features** — Chat, Study Plan Generator, Assignment AI Tutor, Todo Suggestions — all using GPT-5.2 with real-time streaming
- **Voice-first interface** — Full app control via voice commands with wake word "Hey StudyPilot"
- **JWT authentication** — Secure login/register with httpOnly cookies, bcrypt password hashing, and user-scoped data isolation
- **Full-stack architecture** — PostgreSQL 16 + Prisma ORM + 19 RESTful API routes + Docker containerization
- **315 unit tests** across 52 test files with 87%+ code coverage
- **50+ React components** with a glassmorphism design system, dark/light themes, and 15+ reusable animation variants
- **Accessibility-first** — WCAG AA compliance, `prefers-reduced-motion` support, ARIA labels, keyboard navigation, screen reader support

### Accessibility for Persons with Disabilities

StudyPilot is designed with inclusivity at its core. **Students with visual impairments, motor disabilities, or learning differences can operate the entire application using voice commands alone.** The voice assistant -- powered by Azure Neural Speech-to-Text and Text-to-Speech -- allows users to:

- **Create, complete, and manage todos** by speaking naturally (e.g., "Add a todo to study for the math exam")
- **Navigate between pages** using voice commands (e.g., "Go to assignments", "Open calendar")
- **Ask AI study questions** and receive spoken responses through Azure Neural TTS (`en-US-JennyNeural`)
- **Activate hands-free** with the "Hey StudyPilot" wake word -- no clicks required

Beyond voice, the app supports `prefers-reduced-motion` for users with vestibular disorders, proper ARIA labels for screen readers, keyboard navigation with skip-to-content links, and WCAG AA color contrast in both themes. This makes StudyPilot a genuinely accessible study tool -- not just for the average student, but for students who rely on assistive technologies.

---

## Individual Contributions

### Vineet Kumar
Led AI integration, backend architecture, voice assistant, and the Chat module. Built the full PostgreSQL backend with Docker Compose, Prisma ORM v6 schema with 5 models, 14 RESTful API routes for CRUD operations, and migrated all frontend hooks from localStorage to real API persistence. Implemented the voice assistant using Azure Speech SDK for STT/TTS with wake word detection ("Hey StudyPilot"), natural language command processing, sidebar-integrated controls with animated indicators (passive/active/processing/speaking states), and floating glassmorphism transcript badges. Built the AI Chat page with streaming text display, conversation management, and chat history persisted to PostgreSQL. Implemented the Azure OpenAI client library with SSE streaming via async generators, server-side API proxy routes, and graceful fallback to mock responses. Also set up the project foundation -- Next.js 16 with App Router, TypeScript config, Tailwind CSS v4, Docker containerization, and all build tooling.

### Vritika Malhotra
Owned the Dashboard experience and the shared UI component library. Built the Dashboard page with four animated stat cards (animated number counters, staggered entrances, progress bars), RecentTasks summary, UpcomingAssignments preview, AskAI quick-query widget, and the StudyPlanGenerator that analyzes user data to create personalized study schedules. Implemented 14 reusable UI primitives using Radix UI (Dialog, Select, Checkbox, Progress, ScrollArea, AlertDialog, Toast, Label, Badge, Button, Input, Textarea, Skeleton) with the CVA variant system. Created the layout system -- Sidebar with animated `layoutId` navigation indicator, TopBar with animated theme toggle, and ClientLayout with ErrorBoundary and page transitions.

### Disha Jadav
Built the Assignments and Calendar modules with full CRUD functionality. Created the Assignment Tracker page with AssignmentTable, AssignmentCard (responsive mobile view), AssignmentForm (create/edit dialog), AssignmentFilters (search, status, priority), AssignmentStats (summary cards), and AssignmentAIHelper (per-assignment AI tutoring dialog with context-aware suggested questions). Developed the Calendar page with responsive grid view (desktop) and agenda view (mobile), CalendarHeader with month navigation, and EventForm for adding events with type classification and color coding.

### Kumar Harsh
Owned the Todos module, the comprehensive test suite, and shared infrastructure. Built the Todo Manager page with TodoForm, TodoItem, TodoFilters, TodoHeader, and TodoAISuggestions (AI-powered task recommendation with one-click or bulk-add). Implemented the core data layer including all custom hooks (`useTodos`, `useAssignments`, `useEvents`, `useConversations`, `useLocalStorage`, `useReducedMotion`, `useToast`), the type system, design token constants, the glassmorphism CSS variable system, and the animation library with 15+ reusable Framer Motion variants. Wrote 315 unit tests across 52 test files achieving 87%+ code coverage. Created the ThemeContext, mock data seeding system, and the Framer Motion test mock.

### Sriram Lakumarapu
Owned the Docker infrastructure and voice system visual layer. Built the entire Docker containerization setup -- Dockerfile with multi-stage build (deps → builder → runner), docker-compose.yml with PostgreSQL 16 Alpine and Next.js services, docker-entrypoint.sh for automated Prisma migrations on startup, and .dockerignore for optimized build context. Set up the Prisma client with connection pooling and created the database migration for user authentication tables with foreign key constraints. Developed the voice assistant's visual feedback system including the WebGL Orb renderer with custom GLSL shaders (siri-orb.glsl.ts), orb state management (OrbStates.ts), voice transcript overlay component (VoiceTranscript.tsx), and audio feedback sounds for voice activation/deactivation. Built the VoiceInput component with Web Speech API integration and speech type definitions. Integrated the voice orb into the main app layout (ClientLayout). Created API endpoints for health checks (/api/health with database connectivity verification) and Azure Speech token management (/api/speech-token with 9-minute caching). Migrated the assignments and events hooks from localStorage to REST API persistence. Maintained environment configuration (.env.example, .gitignore) and authored README documentation updates.

---

## What We Built

StudyPilot is a full-stack study management platform with five core modules:

### 1. Dashboard
The landing page gives you an at-a-glance view of where you stand. Four stat cards show tasks completed, assignments done, upcoming events, and weekly progress -- each with animated counters and progress bars that fill on load. Below that, you get your most recent tasks, upcoming assignments, a quick-access "Ask AI" prompt, and an AI-powered study plan generator that analyzes your actual data to build a personalized schedule.

### 2. Todo Manager
Full CRUD todo management with priority levels (high, medium, low), category tags (study, assignment, exam, project), and completion tracking. A global progress bar shows how much you have knocked out. Search and filter let you drill down by priority or category. The standout feature is the AI Suggestions button -- it looks at your assignments, calendar events, and existing tasks, then recommends specific todos you should probably create. You can add them one at a time or bulk-add with "Add All."

### 3. Assignment Tracker
A table-based view for managing assignments across courses. You can sort, filter by status and priority, and track each assignment through not-started, in-progress, and completed stages. Every assignment card has a dedicated AI tutor button that opens a dialog with context-aware suggested questions and streaming responses. The AI knows which assignment you are working on and tailors its guidance accordingly.

### 4. Calendar
Desktop users get a full month grid with color-coded event dots. On mobile, it switches to a chronological agenda view for easier scrolling. Events can be added with type classification (class, exam, assignment, study session) and each type gets its own color for quick scanning.

### 5. AI Chat
A conversational interface for asking study questions, getting explanations, or working through problems. Messages stream in real-time via Server-Sent Events, so you see the response building word by word instead of waiting for a wall of text. Conversation history is persisted to the PostgreSQL database, and you can manage multiple conversations with a sidebar conversation list.

### 6. Voice Assistant
A voice-first interface that lets users control the entire application hands-free. The voice assistant is integrated into the sidebar as a navigation button with animated indicators -- a green dot for passive listening, a pulsing white dot and animated sound bars when actively listening, and contextual status text ("Processing...", "Speaking...") during command handling. Transcript notifications appear as floating glassmorphism badges at the top-center of the screen, showing real-time speech-to-text and AI responses. Powered by Azure Speech SDK for high-accuracy speech-to-text and Azure Neural TTS (`en-US-JennyNeural`) for natural-sounding spoken responses. Supports a "Hey StudyPilot" wake word for passive activation, natural language commands for CRUD operations (e.g., "Add a todo to study for physics"), page navigation, theme switching, and conversational AI queries -- all with spoken feedback.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, CSS custom properties |
| Animations | Framer Motion (`motion/react`) |
| UI Components | Radix UI primitives, custom glassmorphism system |
| AI Backend | Azure OpenAI (GPT-5.2), Server-Sent Events streaming |
| Voice Assistant | Azure Speech SDK (STT + TTS), wake word detection |
| Database | PostgreSQL 16 with Prisma ORM v6 |
| Authentication | JWT (httpOnly cookies) + bcryptjs password hashing |
| Containerization | Docker Compose (PostgreSQL + Next.js) |
| State Management | React hooks + REST API persistence |
| Testing | Vitest + React Testing Library (315 tests, 87%+ coverage) |
| Deployment | Azure Ubuntu VM + Docker Compose |

---

## Design System and Patterns

### Glassmorphism Design Language

The entire UI is built on a glassmorphism design system. Every card, panel, and container uses backdrop blur with semi-transparent backgrounds, creating a layered depth effect against the animated gradient background that subtly shifts across the viewport. We defined this as a shared design token so every component stays visually consistent:

```ts
// src/lib/constants.ts
export const glassCard =
  "backdrop-blur-2xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl shadow-lg glass-panel";

export const glassCardHover =
  "backdrop-blur-2xl bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl shadow-lg glass-panel hover:shadow-xl hover:border-[var(--border)] transition-all";

export const gradientButton =
  "bg-[var(--primary-solid)] hover:opacity-90 transition-opacity";
```

The `--glass` and `--glass-border` values are CSS custom properties that swap between light and dark mode, so the entire theme system is driven by a small set of variables rather than duplicated Tailwind classes. Components just import `glassCard` and get the correct look in both themes automatically.

### Dark Mode

Full light/dark theme support with a CSS variable system. The `ThemeProvider` context reads the user's stored preference from localStorage on mount, applies it to the document root, and persists any changes. The toggle in the top bar uses a rotating sun/moon icon animation for a smooth visual swap. We avoid the flash-of-wrong-theme problem by waiting for the `mounted` flag before rendering theme-dependent content.

### Design Tokens

We centralized all shared styling constants to keep the codebase consistent across independently-built features:

```ts
// Priority, status, category, and event type all have dedicated color maps
export const priorityColors = {
  high: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
};

export const statusColors = {
  'not-started': 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
  'in-progress': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'completed': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

export const eventTypeColors = {
  class: '#3b82f6',
  exam: '#ef4444',
  assignment: '#f59e0b',
  study: '#10b981',
  other: '#8b5cf6',
};
```

Every component that renders a priority badge, status indicator, or event dot pulls from these constants instead of hardcoding colors, which made it trivial to adjust the palette globally during design iterations.

---

## Animation System (Framer Motion)

Animations were a first-class concern in this project, not an afterthought. We built a centralized animation library in `src/lib/animations.ts` with reusable variants that any component can import. The goal was to make the app feel responsive and polished without turning it into a carnival -- every animation has a purpose.

### Reusable Animation Variants

All variants follow a consistent `hidden -> visible -> exit` pattern for use with `AnimatePresence`:

**Directional entrances:**
- `fadeIn` -- Simple opacity fade (300ms)
- `fadeInUp`, `fadeInDown` -- Vertical slide with fade (16px travel, cubic-bezier easing)
- `fadeInLeft`, `fadeInRight` -- Horizontal slide with fade (20px travel)

**Scale-based entrances:**
- `scaleIn` -- Subtle scale from 0.92 with spring physics (stiffness: 400, damping: 30)
- `popIn` -- Bouncier scale from 0.8 with stiffer spring (stiffness: 500, damping: 25)

**Orchestrated animations:**
- `staggerContainer(delay)` -- Parent variant that staggers children's entrance. Default 60ms between items.
- `staggerItem` -- Child variant with spring-based slide-up
- `fastStaggerContainer` / `fastStaggerItem` -- Optimized for large lists and tables (30ms stagger, tween instead of spring)

**Page and panel transitions:**
- `pageTransition` -- Blur-fade effect (`filter: blur(4px)` to `blur(0px)`) used for route changes
- `slideFromLeft`, `slideFromRight`, `slideFromBottom` -- Full-panel spring slides for drawers and mobile overlays

**Interactive micro-interactions:**
- `cardHover` -- Lift effect: `y: -2, scale: 1.01` on hover, `scale: 0.99` on tap
- `buttonHover` -- Subtle pulse: `scale: 1.03` on hover, `scale: 0.97` on tap
- `subtleHover` -- Horizontal nudge: `x: 3` on hover (used in sidebar nav links)
- `iconButtonHover` -- Scale (1.1) + slight rotation (5deg) for icon buttons

**Utilities:**
- `backdrop` -- Modal overlay fade (200ms in, 150ms out)
- `skeletonPulse` -- Loading skeleton with infinite opacity oscillation (0.3 -> 0.6 -> 0.3)
- `counterSpring` -- Config for animated number counters (spring, stiffness: 100, duration: 1.2s)

Here is what the variant pattern looks like in practice:

```ts
// src/lib/animations.ts
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: smoothTransition },
  exit: { opacity: 0, y: -8, transition: quickTransition },
};

export const staggerContainer = (staggerDelay = 0.06): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
});
```

### Where We Used Animations

**Page transitions:** `AnimatePresence` in `ClientLayout` wraps every route change with a blur-fade. The `key={pathname}` pattern ensures clean mount/unmount transitions between pages:

```tsx
// src/components/layout/ClientLayout.tsx
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
    animate={{
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }
    }}
    exit={{
      opacity: 0, y: -8, filter: 'blur(2px)',
      transition: { duration: 0.2 }
    }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

**Dashboard stat cards:** The four stat cards use `staggerContainer` on the parent grid and `staggerItem` on each card, so they cascade in from top. Each card also has an animated number counter built with `requestAnimationFrame` and cubic easing that counts up from 0 to the target value over 1.2 seconds with staggered delays. The progress bars fill with a delayed width animation.

**Sidebar navigation:** The active nav indicator uses Framer Motion's `layoutId="activeNav"` to create a sliding highlight that smoothly follows you between pages. The spring config (`stiffness: 350, damping: 30`) gives it a natural feel without overshooting.

**Theme toggle:** The sun/moon icon swap uses a rotation animation during the transition.

**Todo items:** Items slide up on entrance and slide left on delete via `AnimatePresence` exit animations.

**Card hover states:** A spring-based lift effect (`y: -4, scale: 1.02`) on stat cards, with `whileTap` providing a subtle press-down (`scale: 0.98`).

**Forms and dialogs:** Modal content uses `scaleIn` for the dialog body and `backdrop` for the overlay.

**Chat messages:** Messages animate in with a smooth slide-up entrance. AI responses use a Gemini-style streaming text effect -- a custom `StreamingText` component reveals incoming characters with a blur-to-sharp fade animation (`filter: blur(2px)` to `blur(0)` over 300ms), creating a smooth typewriter feel. A blinking cursor (`streaming-cursor` CSS animation) sits at the insertion point during streaming and disappears when the response completes. Before the first chunk arrives, an opacity-pulsing three-dot indicator shows the AI is thinking.

**Loading states:** Skeleton components use a pulse-shimmer animation for placeholder content during data hydration on first load.

### Accessibility

Motion accessibility was non-negotiable for us:

- The `useReducedMotion` hook wraps the `prefers-reduced-motion: reduce` media query and is used throughout components to conditionally disable hover/tap animations.
- The sidebar explicitly passes `undefined` for `whileHover` and `whileTap` when reduced motion is preferred, so keyboard and screen reader users never get unexpected movement.
- A global CSS rule `@media (prefers-reduced-motion: reduce)` kills all transitions and animations as a safety net, so even components that forget to check the hook still respect the user's system preference.

---

## Component Architecture

We decomposed the UI into focused, single-responsibility components with a clear hierarchy:

- **5 page-level orchestrators** (Dashboard, Todos, Calendar, Assignments, Chat) -- these are thin wrappers that compose sub-components and wire up hooks. No business logic lives at the page level.
- **26 feature sub-components** across 7 directories:
  - `assignments/` -- AssignmentCard, AssignmentAIHelper, AssignmentStats, AssignmentFilters, AssignmentForm, AssignmentTable
  - `calendar/` -- CalendarGrid, CalendarAgenda, CalendarHeader, EventForm
  - `chat/` -- ChatMessages, ChatInput, ChatEmptyState, ConversationList, StreamingText
  - `dashboard/` -- StatCard, RecentTasks, UpcomingAssignments, AskAI, StudyPlanGenerator
  - `layout/` -- Sidebar, TopBar, ClientLayout
  - `shared/` -- EmptyState
  - `todos/` -- TodoItem, TodoForm, TodoFilters, TodoHeader, TodoAISuggestions
- **14 reusable UI primitives** built on Radix UI (Button, Input, Textarea, Dialog, AlertDialog, Select, Checkbox, Label, Badge, Progress, ScrollArea, Skeleton, Toast, Toaster)
- **Custom hooks:**
  - `useTodos` -- CRUD operations via REST API, filtering, completion tracking, progress percentage
  - `useAssignments` -- Assignment management via REST API with computed stats
  - `useEvents` -- Calendar event management via REST API
  - `useConversations` -- Chat history via REST API with conversation switching and AI streaming
  - `useReducedMotion` -- `prefers-reduced-motion` media query detection
  - `useToast` -- Toast notification queue management
- **3 context providers:** `AuthContext` (JWT authentication, login/register/logout, user state), `ThemeContext` (light/dark mode), `VoiceAssistantContext` (Azure Speech SDK, wake word, command routing)
- **1 ErrorBoundary** for graceful crash recovery with retry UI

All data hooks communicate with the PostgreSQL backend through Next.js API routes and Prisma ORM. The frontend makes standard `fetch()` calls to RESTful endpoints, and the database handles persistence, ensuring data survives browser clears and is accessible from any device.

---

## Backend Architecture

StudyPilot uses a full-stack architecture with a PostgreSQL database, Prisma ORM, and RESTful API routes -- all containerized with Docker.

The architecture diagram is shown in the [Technical Summary](#technical-summary) section above.

The application runs on an **Azure Ubuntu VM** with Docker Engine hosting two containers inside an Azure Virtual Network:

- **studypilot-app** (Next.js 16) — serves the React frontend and API routes on port 3001
- **studypilot-db** (PostgreSQL 16) — persistent data storage with a Docker volume, connected via internal Docker network

External Azure services:
- **Azure OpenAI Service (GPT-5.2)** — called server-side from Next.js API routes for AI chat, study plans, assignment help, and todo suggestions via SSE streaming
- **Azure Speech Services** — called directly from the browser client via WebSocket for real-time voice transcription and wake word detection

### Database Schema (Prisma)

Six models with relations, managed via Prisma migrations:

| Model | Fields | Purpose |
|-------|--------|---------|
| `User` | id, name, email, passwordHash, createdAt, updatedAt | Authentication and user identity |
| `Todo` | id, title, description, completed, priority, category, dueDate, userId | Task management |
| `Assignment` | id, title, subject, description, dueDate, status, priority, grade, userId | Assignment tracking |
| `CalendarEvent` | id, title, description, date, endDate, type, color, userId | Calendar events |
| `Conversation` | id, title, messages[], userId | Chat history container |
| `Message` | id, role, content, timestamp, conversationId | Individual chat messages |

All data models are scoped by `userId` with foreign key constraints and cascade deletes, ensuring complete multi-tenant data isolation.

### API Routes

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/auth/register` | POST | Create new user account |
| `/api/auth/login` | POST | Authenticate and set JWT cookie |
| `/api/auth/logout` | POST | Clear authentication cookie |
| `/api/auth/me` | GET | Get current authenticated user |
| `/api/auth/profile` | PATCH | Update user name, email, or password |
| `/api/todos` | GET, POST | List user's todos / create new todo |
| `/api/todos/[id]` | PATCH, DELETE | Update / delete a specific todo (ownership verified) |
| `/api/assignments` | GET, POST | List user's assignments / create new |
| `/api/assignments/[id]` | PATCH, DELETE | Update / delete a specific assignment (ownership verified) |
| `/api/events` | GET, POST | List user's calendar events / create new |
| `/api/events/[id]` | PATCH, DELETE | Update / delete a specific event (ownership verified) |
| `/api/conversations` | GET, POST | List user's conversations / create new |
| `/api/conversations/[id]` | GET, PATCH, DELETE | Get / rename / delete a conversation (ownership verified) |
| `/api/conversations/[id]/messages` | POST | Add a message to a conversation (ownership verified) |
| `/api/chat` | POST | Azure OpenAI streaming proxy |
| `/api/ai/study-plan` | POST | AI study plan generation (streaming) |
| `/api/ai/todo-suggestions` | POST | AI todo suggestions (JSON) |
| `/api/health` | GET | Database connectivity check |

All data endpoints require JWT authentication via httpOnly cookies. CRUD operations verify resource ownership before allowing modifications.

### Docker Infrastructure

The application is fully containerized with Docker Compose and deployed on an **Azure Ubuntu VM** inside an Azure Virtual Network with a Network Security Group:

- **`studypilot-db`**: PostgreSQL 16 Alpine with health checks and persistent volume
- **`studypilot-app`**: Multi-stage Next.js build (deps → builder → runner) with standalone output, Prisma migrations on startup, runs as non-root user
- **Internal Docker network**: The app container communicates with the database container over an isolated bridge network — the database is never exposed to the public internet

---

## Voice Assistant

The voice assistant is a core differentiator -- it makes StudyPilot usable for students with disabilities who cannot use a traditional mouse/keyboard interface.

### How It Works

1. **Wake Word**: Say "Hey StudyPilot" to activate (passive listening via Azure Speech SDK)
2. **Speech-to-Text**: Azure Speech SDK captures and transcribes speech with high accuracy
3. **Intent Processing**: Natural language is parsed into commands (CRUD operations, navigation, AI queries)
4. **Action Execution**: Commands are routed to the appropriate API endpoint or page navigation
5. **Text-to-Speech**: Azure Neural TTS (`en-US-JennyNeural`) speaks the response back to the user

### Supported Voice Commands

#### Activation
| Method | How |
|--------|-----|
| Wake Word | Say **"Hey StudyPilot"** (also recognizes "Hi StudyPilot", "Hey Study Pilot", etc.) |
| Click | Click the **Voice Assistant** button in the sidebar |
| Keyboard | Press **Ctrl+Shift+V** (or **Cmd+Shift+V** on Mac) |

#### Navigation Commands
| Command | What It Does | Example Phrases |
|---------|-------------|-----------------|
| Go to Dashboard | Navigate to the home dashboard | "Go to dashboard", "Open home", "Show main page", "Take me to the dashboard" |
| Go to Todos | Navigate to the todo list | "Go to todos", "Open tasks", "Show my to-do list", "Take me to tasks" |
| Go to Calendar | Navigate to the calendar | "Go to calendar", "Open schedule", "Show my events", "Navigate to calendar" |
| Go to Assignments | Navigate to assignments | "Go to assignments", "Open homework", "Show assignments" |
| Go to Chat | Navigate to AI chat | "Go to chat", "Open AI chat", "Show the assistant" |

#### Create Commands
| Command | What It Does | Example Phrases |
|---------|-------------|-----------------|
| Add a Todo | Opens the new todo form | "Add a todo", "Create a task", "Make a new to-do", "New task" |
| Add an Assignment | Opens the new assignment form | "Add an assignment", "Create homework", "New assignment" |
| Add an Event | Opens the new event form | "Add an event", "Create a meeting", "New class", "Add a study session" |
| New Chat | Starts a new AI conversation | "New chat", "Start a conversation", "Create a conversation" |

#### AI Query Commands
| Command | What It Does | Example Phrases |
|---------|-------------|-----------------|
| Ask AI | Sends a question to the AI chat | "Ask AI about photosynthesis", "Tell the assistant about calculus", "Query StudyPilot about physics" |

#### Theme Commands
| Command | What It Does | Example Phrases |
|---------|-------------|-----------------|
| Toggle Theme | Switch between light and dark | "Switch theme", "Toggle theme", "Change theme" |
| Dark Mode | Switch to dark mode | "Dark mode", "Go dark", "Switch to dark", "Enable dark mode", "Turn on dark" |
| Light Mode | Switch to light mode | "Light mode", "Go light", "Switch to light", "Enable light mode", "Turn on light" |

#### Control Commands
| Command | What It Does | Example Phrases |
|---------|-------------|-----------------|
| Stop Listening | Deactivate the voice assistant | "Stop listening", "Goodbye", "Go to sleep", "Deactivate", "That's all", "Never mind", "Cancel" |

#### How Voice Works
1. **Wake Word Detection** — The app continuously listens for "Hey StudyPilot" using Azure Speech SDK (passive mode, shown by a green dot on the mic icon)
2. **Command Capture** — After activation, you have a 10-second window to speak your command
3. **Intent Processing** — Speech is matched against command patterns using regex-based NLP
4. **Action Execution** — The matched command triggers navigation, form opening, or AI query
5. **Voice Feedback** — Azure Neural TTS (`en-US-JennyNeural`) speaks a confirmation back to you (e.g., "Opening Assignments now", "Sure, opening the add todo form")
6. **Return to Passive** — After completing the command, the assistant returns to wake word listening

### Visual Feedback

The voice assistant provides multi-layered visual feedback through the sidebar button and floating transcript badges:

**Sidebar Button States:**
| State | Visual | Description |
|-------|--------|-------------|
| Passive Listening | Green dot on mic icon | Listening for "Hey StudyPilot" wake word |
| Active Listening | Blue background, pulsing white dot, animated sound bars | Capturing your voice command |
| Processing | Blue background, "Processing..." text | Analyzing your command |
| Speaking | Blue background, "Speaking..." text | AI is responding via TTS |
| Idle | Default muted styling | Voice available but not active |

**Floating Transcript Badges:**
Voice transcripts appear as floating glassmorphism badges at the top-center of the screen, showing real-time speech-to-text, processing status, and AI responses.

---

## AI Integration

Four distinct AI-powered features, all backed by Azure OpenAI GPT-5.2:

### 1. AI Chat
Full conversational interface at `/chat`. Messages stream in real-time via SSE. Users can start multiple conversations, and history persists to the PostgreSQL database. Suggested prompts help students get started when they are not sure what to ask. The conversation list in the sidebar lets you switch between past chats.

### 2. Study Plan Generator
Lives on the dashboard. When triggered, it gathers all your todos (with completion status and priorities), assignments (with due dates and status), and calendar events, sends them as structured context to GPT-5.2 with a study-planning system prompt, and streams back a day-by-day study plan with specific action items. The plan can be copied to clipboard or regenerated with one click.

### 3. Assignment AI Helper
Every assignment card has a sparkle icon that opens a per-assignment AI tutor dialog. The system prompt is configured to explain concepts and guide thinking rather than write the assignment for the student. Four suggested questions are auto-generated based on the assignment title and subject (e.g., "How should I approach [title]?", "Explain key concepts for [subject]").

### 4. Todo AI Suggestions
Analyzes your current workload -- todos, assignments, and events -- and suggests 3-6 specific, actionable tasks you should create. The AI returns structured JSON that maps directly to the todo data model (title, description, priority, category, due date), so suggestions can be added with one click or bulk-added with "Add All." Each suggestion shows priority and category badges so you can evaluate before adding.

### Technical Details

- **Backend proxy:** Next.js API route at `/api/chat` acts as a proxy to Azure OpenAI, keeping the API key server-side. The client never sees credentials.
- **Streaming:** SSE-based streaming for all chat features. The client reads chunks from a `ReadableStream`, parses `data:` lines, and yields text deltas through an async generator (`streamChat` in `src/lib/azure-openai.ts`).
- **Feature-specific system prompts:** Each AI feature has its own system prompt tuned for that use case -- the chat prompt is conversational, the study plan prompt structures output by day, the assignment helper teaches rather than writes, and the todo suggester returns raw JSON.
- **Context injection:** User data (todos, assignments, events) is serialized into a structured context message appended to the system prompt, so the AI can reference specific items by name and date.
- **Graceful degradation:** When Azure is unavailable (no API key configured, rate limiting, network errors), every AI feature falls back to either static suggestions or a helpful offline message. A toast notification lets the user know they are in offline mode. The app is fully functional without any AI credentials.

---

## Testing

- **315 unit tests** across **52 test files**
- **Coverage:** 87% statements, 89% lines, 82% functions, 78% branches
- **Tools:** Vitest, React Testing Library, jsdom
- **What we tested:**
  - localStorage storage services (read, write, serialization edge cases)
  - All 7 custom hooks (state management, side effects, computed values, edge cases)
  - All 14 UI primitives (Button, Dialog, Select, Input, etc.)
  - Feature components (StatCard, TodoItem, TodoFilters, ChatMessages, ChatInput, AssignmentCard, CalendarGrid, etc.)
  - All 5 page-level components (Dashboard, Todos, Calendar, Assignments, Chat)
  - Layout components (Sidebar, TopBar, ClientLayout)
  - Context providers (ThemeContext mount behavior, toggle, persistence)
  - ErrorBoundary (crash recovery, retry functionality)

We mocked Framer Motion globally in tests to avoid animation-related timing issues, which let us focus test assertions on behavior and rendered output rather than intermediate animation states.

---

## Demo Credentials

After seeding the database, you can log in with the pre-loaded demo account:

| Field | Value |
|-------|-------|
| Email | `demo@sjsu.edu` |
| Password | `password123` |

This account comes with 20 todos, 15 assignments, 25 calendar events, and 5 AI chat conversations pre-loaded for demonstration purposes.

---

## How to Run

### Option 1: Docker (Recommended)

The easiest way to run StudyPilot with the full PostgreSQL backend:

```bash
# Clone the repository
git clone https://github.com/vineetkia/CMPE-280-Team-14-Hackathon-.git
cd CMPE-280-Team-14-Hackathon-

# Start PostgreSQL database
docker compose up db -d

# Wait for database to be healthy, then run migrations
npx prisma migrate deploy

# (Optional) Seed the database with sample data
docker exec -i studypilot-db psql -U studypilot < prisma/seed.sql

# Install dependencies and start dev server
npm install
npm run dev
```

### Option 2: Full Docker Compose (Production)

```bash
# Build and start both PostgreSQL and Next.js in containers
docker compose up --build -d

# Seed the database (optional)
docker exec -i studypilot-db psql -U studypilot < prisma/seed.sql

# App is now running at http://localhost:3001
```

> **Note:** Docker Compose maps port 3001 on your machine to port 3000 inside the container. For local development (Option 1), the app runs on http://localhost:3000.

### Option 3: Local Development (No Docker)

If you have PostgreSQL installed locally:

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL and optional Azure credentials

# Run database migrations
npx prisma migrate deploy

# Start development server
npm run dev
```

The app runs fully without Azure credentials. All AI features gracefully fall back to static responses, and the voice assistant falls back to the browser's Web Speech API.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack enabled by default in Next.js 16) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with V8 coverage report |
| `npm run test:ui` | Run tests with Vitest UI |
| `docker compose up db -d` | Start PostgreSQL container |
| `docker compose up --build` | Build and start all services |
| `npx prisma migrate deploy` | Run database migrations |
| `npx prisma studio` | Open Prisma database GUI |

---

## Environment Variables

```bash
# Database (required)
DATABASE_URL=postgresql://studypilot:studypilot_secret@localhost:5432/studypilot

# Authentication (required)
JWT_SECRET=your-secret-key-here  # Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Azure OpenAI (optional -- falls back to mock responses)
AZURE_OPENAI_ENDPOINT=https://your-resource.cognitiveservices.azure.com/openai/v1/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT=your-deployment-name

# Azure Speech Services (optional -- falls back to Web Speech API)
AZURE_SPEECH_KEY=your-speech-key-here
AZURE_SPEECH_REGION=westus
```

`DATABASE_URL` and `JWT_SECRET` are required. All Azure credentials are optional -- AI features fall back to mock responses and the voice assistant falls back to the browser's Web Speech API.

---

## Project Structure

```
├── docker-compose.yml              # PostgreSQL + Next.js service definitions
├── Dockerfile                      # Multi-stage build (deps → builder → runner)
├── docker-entrypoint.sh            # Runs migrations then starts the app
├── diagram/
│   └── architecture-diagram.png    # Azure deployment architecture diagram
├── prisma/
│   ├── schema.prisma               # Database schema (6 models)
│   ├── migrations/                 # Prisma migration history
│   └── seed.sql                    # Sample data with demo user
├── src/
│   ├── app/                        # Next.js App Router pages + API routes
│   │   ├── api/
│   │   │   ├── auth/              # register, login, logout, me, profile
│   │   │   ├── todos/             # CRUD: GET, POST, PATCH, DELETE
│   │   │   ├── assignments/       # CRUD: GET, POST, PATCH, DELETE
│   │   │   ├── events/            # CRUD: GET, POST, PATCH, DELETE
│   │   │   ├── conversations/     # CRUD + nested messages endpoint
│   │   │   ├── chat/              # Azure OpenAI streaming proxy
│   │   │   ├── ai/               # study-plan, todo-suggestions
│   │   │   └── health/           # Database connectivity check
│   │   ├── assignments/           # Assignment tracker page
│   │   ├── calendar/              # Calendar page
│   │   ├── chat/                  # AI chat page
│   │   ├── login/                 # Login page with glassmorphism UI
│   │   ├── register/              # Registration page
│   │   ├── profile/               # Profile settings (name, email, password)
│   │   ├── todos/                 # Todo manager page
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Dashboard
│   ├── components/
│   │   ├── assignments/           # AssignmentCard, AIHelper, Stats, Filters, Form, Table (6)
│   │   ├── calendar/              # CalendarGrid, CalendarAgenda, CalendarHeader, EventForm (4)
│   │   ├── chat/                  # ChatMessages, ChatInput, ChatEmptyState, ConversationList, StreamingText (5)
│   │   ├── dashboard/             # StatCard, RecentTasks, UpcomingAssignments, AskAI, StudyPlanGenerator (5)
│   │   ├── layout/                # Sidebar, TopBar, ClientLayout (3)
│   │   ├── shared/                # EmptyState (1)
│   │   ├── todos/                 # TodoItem, TodoForm, TodoFilters, TodoHeader, TodoAISuggestions (5)
│   │   ├── voice/                 # VoiceTranscript, VoiceTranscriptOverlay, VoiceOrb (legacy), voice-orb.css (4)
│   │   ├── ui/                    # 14 reusable primitives (Button, Dialog, Select, etc.)
│   │   └── ErrorBoundary.tsx      # Crash recovery with retry UI
│   ├── context/                   # AuthContext, ThemeContext, VoiceAssistantContext
│   ├── hooks/                     # Custom hooks (useTodos, useAssignments, useEvents, etc.)
│   ├── lib/                       # prisma.ts, auth.ts, azure-openai.ts, constants, animations
│   │   └── auth.ts                # JWT verification, requireAuth() middleware
│   ├── types/                     # TypeScript interfaces
│   └── __tests__/                 # 52 test files mirroring src/ structure
├── docs/
│   └── architecture.mmd           # Mermaid architecture diagram
└── diagram/
    └── architecture-diagram.png   # Azure deployment architecture diagram
```

---

## Libraries and Dependencies

| Package | Purpose |
|---------|---------|
| `next` 16.1.7 | React framework with App Router and Turbopack |
| `react` / `react-dom` 19.2.3 | UI library (React 19 with concurrent features) |
| `motion` 12.38.0 | Animation library (Framer Motion) |
| `@prisma/client` 6.x | Type-safe PostgreSQL ORM |
| `microsoft-cognitiveservices-speech-sdk` | Azure Speech-to-Text and Text-to-Speech |
| `@radix-ui/react-dialog` | Accessible modal dialogs |
| `@radix-ui/react-select` | Accessible dropdown selects |
| `@radix-ui/react-checkbox` | Accessible checkboxes |
| `@radix-ui/react-progress` | Accessible progress bars |
| `@radix-ui/react-scroll-area` | Custom scrollbars |
| `@radix-ui/react-toast` | Toast notifications |
| `@radix-ui/react-alert-dialog` | Confirmation dialogs |
| `@radix-ui/react-label` | Form labels |
| `@radix-ui/react-slot` | Component composition primitive |
| `lucide-react` | Icon library (consistent, tree-shakeable SVG icons) |
| `tailwindcss` v4 | Utility-first CSS framework |
| `clsx` + `tailwind-merge` | Conditional class name merging without Tailwind conflicts |
| `class-variance-authority` | Component variant system for prop-based styling |
| `tw-animate-css` | Tailwind animation utilities |
| `vitest` + `@testing-library/react` | Testing framework and DOM testing utilities |
| `@vitest/coverage-v8` | V8-based code coverage reporting |
| `jsdom` | Browser environment simulation for tests |

---

## Presentation Guide -- Design Decisions and Technical Implementation

This section is structured for a 3-5 minute verbal presentation to demonstrate UI/UX understanding and technical depth.

### 1. UI Overview

StudyPilot uses a persistent sidebar navigation layout with five primary screens: Dashboard, Todos, Calendar, Assignments, and AI Chat. The sidebar stays visible on desktop and collapses into a slide-in drawer on mobile, giving users one-tap access to any module without losing context.

The user flow is intentionally linear for new users -- the Dashboard serves as the entry point, showing an at-a-glance summary of tasks, assignments, and upcoming events. From there, students navigate to whichever module needs attention. The AI features are woven into existing screens rather than isolated, so a student working on assignments can get AI help without switching contexts.

Our three design goals were: (1) usability -- every action should take fewer than three clicks, (2) clarity -- the screen should communicate priority and status at a glance through color and hierarchy, and (3) responsiveness -- the app should feel native on a phone without sacrificing functionality on desktop.

### 2. Design Principles and UX Decisions

**Visual hierarchy:** We use font weight, size, and color saturation to establish clear reading order. Stat card numbers are 3xl bold, labels are sm muted. Active states use gradient fills while inactive elements stay translucent. This lets users scan the dashboard in under two seconds and know where they stand.

**Spacing and typography:** Consistent spacing tokens (p-3 on mobile, p-6 on desktop) prevent visual cramming on small screens. The type scale follows a clear hierarchy: page titles at 2xl-3xl, section headings at xl, body text at sm-base. We avoided decorative fonts -- the system font stack keeps things fast and familiar.

**Color usage:** The color palette serves functional purposes, not decorative ones. Red = high priority or overdue, yellow = medium priority or in-progress, green = completed or low priority, blue = informational. This mapping stays consistent across all five modules so users build muscle memory. The gradient background (purple-to-blue-to-pink) establishes brand identity without interfering with content readability because all content sits on glass-morphism cards with backdrop blur.

**Accessibility:** All interactive elements have `aria-label` attributes. A skip-to-content link is the first focusable element for keyboard users. Color contrast meets WCAG AA standards in both light and dark modes. The `prefers-reduced-motion` media query is respected at both the CSS and JavaScript levels, so users with vestibular disorders see a static interface.

**UX patterns:**
- **Cards** for discrete data items (todos, assignments, stats) -- scannable and touch-friendly
- **Tables** for sortable, dense data (assignments on desktop) -- efficient for comparison tasks
- **Modals/dialogs** for create and edit flows -- keeps the user in context without a page navigation
- **Toast notifications** for confirmations (added, updated, deleted) -- non-blocking and auto-dismissing
- **AlertDialogs** for destructive actions (delete) -- prevents accidental data loss
- **Empty states** with clear calls-to-action -- the app never shows a blank screen

### 3. Components and Architecture

We followed a component-driven architecture with three tiers:

**Tier 1 -- UI Primitives (14 components):** Button, Input, Textarea, Dialog, AlertDialog, Select, Checkbox, Label, Badge, Progress, ScrollArea, Skeleton, Toast, Toaster. These are built on Radix UI headless primitives for accessibility, styled with Tailwind and CVA (class-variance-authority) for variant management. They have zero business logic.

**Tier 2 -- Feature Components (26 components):** Each page is decomposed into focused sub-components. For example, the Todos page is composed of TodoHeader (title + progress bar + add button), TodoFilters (search + priority + category selects), TodoItem (single card with checkbox, badges, actions), and TodoForm (create/edit dialog). Each component does one thing and accepts props from its parent orchestrator.

**Tier 3 -- Page Orchestrators (5 pages):** These are thin wrappers that call custom hooks, manage local UI state (which dialog is open, which filters are active), and compose Tier 2 components. No business logic, no direct localStorage calls.

**State management:** We deliberately avoided Redux or Zustand. Custom hooks (`useTodos`, `useAssignments`, `useEvents`, `useConversations`) encapsulate all CRUD operations and communicate with the PostgreSQL backend via RESTful API routes. Each hook returns typed data, a loading state, and computed values (like progress percentage or filtered results). This keeps the component tree simple -- hooks at the top, props flowing down, with the database as the single source of truth.

### 4. Animations and Interactions

We categorized animations into three tiers based on their purpose:

**Tier 1 -- Structural transitions** (help users understand navigation):
- Page transitions use a blur-fade effect via AnimatePresence. When you switch between Dashboard and Todos, the old page fades out with a slight blur while the new one fades in. This provides a spatial cue that content has changed.
- The sidebar active indicator uses `layoutId` to smoothly slide between nav items, so users can track where they are.

**Tier 2 -- Content animations** (make data feel alive):
- Dashboard stat cards stagger in with a cascade effect (60ms between cards), and their numbers count up from 0 to the actual value using requestAnimationFrame with cubic easing. This draws the eye naturally from left to right across the four stats.
- Todo items slide up on creation and slide left on deletion, providing spatial feedback about what changed.
- Chat messages use a Gemini-style streaming text reveal -- new characters fade in with a blur-to-sharp animation, with a blinking cursor at the insertion point.

**Tier 3 -- Micro-interactions** (make the interface feel responsive):
- Cards lift slightly on hover (y: -4, scale: 1.02) with spring physics, giving a tactile sense of interactivity.
- Icon buttons scale and rotate slightly on hover (scale: 1.1, rotate: 5deg).
- The theme toggle icon rotates during the sun-to-moon swap.
- Glass cards have a CSS-only shine effect (a gradient sweep) on hover.

**Why these matter:** Every animation communicates something. The stagger tells users "this is a group of related items." The lift tells them "this is interactive." The blur-fade tells them "you moved to a new place." Without these cues, the app would feel flat and unresponsive.

**Performance and accessibility:** All Framer Motion animations use the `transform` and `opacity` properties, which are GPU-accelerated and avoid layout thrashing. The `useReducedMotion` hook checks the user's system preference, and when reduced motion is active, all hover/tap animations are disabled and the global CSS rule kills all transitions. The animated number counter falls back to showing the final value immediately.

### 5. Technologies and Library Choices

**Next.js 16 with App Router:** We chose Next.js over plain React because the App Router gives us file-based routing, server-side API routes (critical for hiding the AI API key), and built-in code splitting. Turbopack makes the dev server fast enough that HMR feels instant.

**TypeScript:** Non-negotiable for a team project. Typed interfaces for Todo, Assignment, CalendarEvent, and ChatMessage caught integration bugs at compile time that would have been runtime errors in JavaScript.

**Tailwind CSS v4:** Utility-first CSS let us iterate on design quickly without maintaining separate stylesheet files. The CSS custom property system (`--glass`, `--foreground`, etc.) made dark mode a matter of swapping variable values rather than duplicating classes.

**Framer Motion (motion/react):** The leading React animation library. We needed AnimatePresence for exit animations, layoutId for the sidebar indicator, and spring physics for natural-feeling interactions. Alternatives like react-spring lack AnimatePresence, and CSS-only animations cannot coordinate mount/unmount.

**Radix UI:** Headless, accessible primitives. We get proper focus trapping in dialogs, keyboard navigation in selects, and ARIA attributes out of the box. Styling stays in our hands via Tailwind. Alternatives like MUI or Ant Design bundle their own design opinions, which would conflict with our glassmorphism system.

**Vitest + React Testing Library:** Vitest is Vite-native and runs our 315 tests in under 10 seconds. React Testing Library encourages testing behavior over implementation, which made our tests resilient to the animation and refactoring changes.

### 6. Design Style and Inspiration

The design follows a **modern glassmorphism SaaS aesthetic** -- semi-transparent cards with backdrop blur layered over an animated gradient background. This style is inspired by Apple's visionOS interface language and products like Linear, Raycast, and Arc Browser, which all use translucency and blur to create depth without visual clutter.

The gradient background (purple-to-blue-to-pink) was chosen to feel energetic but not distracting -- it establishes a premium tone while the glass cards keep content readable. Dark mode inverts the glass opacity and border colors but keeps the same gradient, so the visual identity is consistent across themes.

We deliberately avoided the "flat white dashboard" look that dominates most productivity tools. Students spend hours in this app -- it should feel like a space they want to be in, not a clinical spreadsheet.

### 7. Challenges and Improvements

**Challenge: SSR hydration with animated values.** Our animated number counter initially used `useState(0)` which rendered 0 on the server but the actual value on the client, causing a hydration mismatch. We solved this by initializing with the real value and only running the count-up animation on mount via `useEffect`.

**Challenge: Mobile calendar.** A 7-column grid is unusable on a 375px screen. Rather than just scaling it down, we built an entirely separate agenda view component that groups events chronologically -- a fundamentally different UX pattern that works better for the use case on small screens.

**Challenge: AI fallback gracefully.** We needed every AI feature to work without credentials (for grading, for demo, for users without API keys). We built the fallback into the hook layer: if the streaming request fails with `shouldFallback: true`, the hook generates a mock response and shows a toast. The UI components never know the difference.

**Challenge: Animation performance.** Early iterations had per-cell animations on the calendar grid (42 cells, each with a spring entrance), which caused visible jank on mid-range devices. We removed individual cell animations and kept only a single container fade, solving the performance issue without sacrificing perceived polish.

**Future improvements:**
- Google Calendar API integration to import existing schedules
- Study analytics with time tracking (planned vs. actual study time)
- Collaborative study groups with shared task boards
- Push notifications for approaching deadlines
- PWA support for offline access and home screen install
- OAuth integration (Google, GitHub) for single sign-on

---

## Hackathon Rubric Alignment

### Scope and Problem Framing (4 pts)
Clear, relatable problem that every student on the team has experienced firsthand. Realistic scope for a four-person team working within a semester. Well-defined target user (college students managing coursework across multiple classes). Five distinct modules that each solve a specific pain point without trying to boil the ocean.

### Technical Execution (6 pts)
Next.js 16 with App Router and TypeScript throughout the entire codebase. Full PostgreSQL backend with Prisma ORM, 19 RESTful API routes, JWT authentication with httpOnly cookies, and Docker containerization deployed on Azure VM. Azure Speech SDK voice assistant integrated into the sidebar with animated visual indicators and floating transcript badges. 315 tests with 87%+ coverage across 52 test files. Clean component decomposition with 50+ components and custom hooks. Real AI integration with SSE streaming (not just a fetch-and-display wrapper). Server-side API proxy for secure credential handling. Centralized animation library and design token system. Fully responsive across mobile, tablet, and desktop viewports.

### Engineering Decision-Making (4 pts)
- **JWT authentication with httpOnly cookies** -- secure, stateless auth with bcrypt password hashing. httpOnly cookies prevent XSS token theft. All API routes verify ownership before allowing data access, ensuring complete multi-tenant isolation
- **PostgreSQL + Prisma ORM** over localStorage -- real database with migrations, relations, and server-side persistence. Data survives browser clears and enables multi-device access
- **Azure VM + Docker Compose** -- production deployment on Azure Ubuntu VM with NSG firewall rules. Docker Compose orchestrates both containers with health checks and persistent volumes
- **Azure Speech SDK** for voice assistant -- enterprise-grade STT/TTS with fallback to Web Speech API when credentials are unavailable
- **Multi-stage Docker build** -- deps → builder → runner stages minimize image size, non-root user for security
- Glassmorphism design system with shared tokens instead of ad-hoc per-component styling
- SSE streaming for AI responses -- dramatically better UX than waiting 5-10 seconds for a complete response
- `useReducedMotion` hook and `prefers-reduced-motion` CSS for users who need reduced motion
- Graceful AI and voice fallbacks so the app is fully functional without credentials or network access
- Centralized animation library to prevent motion inconsistency across independently-built features
- No AI SDK dependency -- direct `fetch()` to Azure OpenAI REST API keeps the bundle lean (~80 lines of streaming client code)

### UI/UX Quality and Accessibility (3 pts)
- **Voice-first interface** for students with disabilities -- full app control via voice commands with Azure Neural TTS spoken feedback
- Full dark mode with persistent user preference
- Responsive design -- sidebar collapses on mobile, calendar switches from grid to agenda view, forms adapt to screen width
- Skip-to-content link for keyboard navigation
- ARIA labels on all icon-only buttons and interactive elements
- `prefers-reduced-motion` respected at both JavaScript and CSS levels
- Error boundaries prevent full-page crashes with retry UI
- Semantic HTML with proper heading hierarchy
- Color contrast tested for both light and dark themes
- Sidebar-integrated voice assistant with animated indicators (green passive dot, pulsing active dot, sound bars) and floating glassmorphism transcript badges

### Team Collaboration (3 pts)
Component-based architecture enabled parallel development -- team members could work on different modules without merge conflicts. Shared design tokens and the centralized animation library kept the visual language consistent across independently-built features. Centralized hooks meant data layer changes did not ripple into UI code across the codebase.

---

## Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible, composable UI primitives
- [Lucide](https://lucide.dev/) for the icon set
- [Framer Motion](https://www.framer.com/motion/) for the animation system

---
