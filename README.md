# Quiz Report App

A full-stack quiz and report application built with Next.js, PostgreSQL, and Prisma.

## Product Thinking

This product helps users take a structured quiz, immediately understand their score, and keep a history of every attempt. The report is designed to be useful after the quiz, not only as a pass/fail result, by showing category performance, per-question correctness, and practical insights for the next retake.

## Target Users

- Learners who want to measure their understanding and track progress over time.
- Instructors or reviewers who need a simple way to inspect quiz outcomes.
- Hiring or assessment teams that need persisted quiz attempts and downloadable reports.

## Problems Solved

- Users can retake the quiz without losing previous attempts.
- Each user can only access their own results after authentication.
- Results are not just stored in the database; they are presented with score, percentage, category, chart, insights, and per-question breakdown.
- Reports can be downloaded as server-generated PDF files for sharing or archiving.

## Tech Stack

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma ORM
- NextAuth
- TanStack Query
- React Hook Form
- Zod
- Recharts
- React PDF
- Tailwind CSS
- shadcn/ui-style components

## Why This Stack

- Next.js keeps pages, API routes, authentication flow, and server-side PDF generation in one codebase.
- PostgreSQL and Prisma provide persistent relational data, migrations, type-safe queries, and a clear schema for users, quizzes, attempts, and answers.
- NextAuth handles credential-based authentication and session management.
- TanStack Query keeps client-side fetching, loading, refetching, and pagination state predictable.
- React Hook Form and Zod keep form state and validation explicit.
- Recharts and shadcn chart components provide interactive UI charts, while React PDF generates downloadable reports on the server side.

## Technical Documentation

### Main Features

- User registration and login.
- Protected dashboard, quiz, result list, result detail, and PDF export.
- One seeded General Knowledge quiz with 10 multiple-choice questions.
- All quiz attempts are persisted.
- Result history table with pagination and global summary statistics.
- Result detail with total score, percentage, performance category, chart, insights, and per-question breakdown.
- Server-side PDF export at `/api/attempts/[attemptId]/pdf`.

### Architecture Overview

- `src/app` contains App Router pages and route handlers.
- `src/app/(auth)` contains login and register flows.
- `src/app/(dashboard)` contains protected dashboard, quiz, and result pages.
- Route-specific `_components` contain UI composition.
- Route-specific `_hooks` contain query, mutation, form, and page logic.
- `src/server` contains server-side domain operations.
- `src/lib` contains shared utilities, Prisma client, scoring, formatting, and API helpers.
- `src/services` contains Axios-based client services.
- `src/validations` contains Zod schemas.
- `prisma` contains schema, migrations, and seed data.

## Prerequisites

Make sure these tools are installed before running the project:

- Node.js
- npm
- PostgreSQL

PostgreSQL can be installed locally or run through tools such as DBngin, Docker, Supabase, or Neon. The app only needs a valid PostgreSQL connection string.

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp env.example .env
```

Update the environment values inside `.env`. The required variables are documented in `env.example`.

The application expects these environment values:

```env
DATABASE_URL="postgresql://postgres:<YourPassword>@<Host>/<DB_Name>?schema=public"
NEXTAUTH_URL="HOST_URL"
NEXTAUTH_SECRET="Replace_With_Your_Random_Secret"
```

Create a PostgreSQL database for the application, then point `DATABASE_URL` to that database. `NEXTAUTH_URL` must match the URL used to open the app. The database name used during development is:

```txt
quiz_report_app
```

Then run the database setup:

```bash
npm run db:setup
```

This command will:

- generate the Prisma Client
- run database migrations
- seed the initial quiz data

Start the development server:

```bash
npm run dev
```

Open the app at:

```txt
http://localhost:3000
```

## Production Verification

Before submitting or reviewing, run:

```bash
npm run lint
npm run build
npm run start
```

Then open:

```txt
http://localhost:3000
```

Test the main flow: register, login, start quiz, submit answers, view result detail, export PDF, and check the result history table.

## Database Commands

```bash
npm run db:generate
```

Generate Prisma Client.

```bash
npm run db:migrate
```

Run Prisma migrations.

```bash
npm run db:seed
```

Seed the initial quiz data.

```bash
npm run db:setup
```

Run generate, migrate, and seed in one command.

```bash
npm run db:studio
```

Open Prisma Studio to inspect database records.

## Useful Commands

```bash
npm run lint
npm run build
```

Use these commands to verify code quality and production build readiness.

## Notes

- `.env` is intentionally ignored and should not be committed.
- `env.example` is committed so reviewers can see the required environment variables.
- The initial seed creates a General Knowledge quiz with 10 questions and multiple-choice answers.
- If `NEXTAUTH_URL` uses a different host or port from the browser URL, NextAuth client requests can fail. Keep it aligned with the app URL.

## Known Limitations and Tradeoffs

- The app currently seeds one quiz only. The data model supports more quizzes, but quiz management UI is not included.
- Insights are rule-based instead of AI-generated to keep the project deterministic and easy to run locally.
- PDF chart rendering is custom server-side drawing rather than Recharts, because the PDF is generated on the server.
- Email verification and password reset are not implemented.
- Automated tests are not included yet; quality is verified with lint, production build, and manual end-to-end flow testing.
