# Quiz Report App

A full-stack quiz and report application built with Next.js, PostgreSQL, and Prisma.

## Tech Stack

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma ORM
- Tailwind CSS
- shadcn/ui-style components

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

Update the environment values inside `.env`. The required variable is documented in `env.example`.

The application expects a PostgreSQL connection string through:

```env
DATABASE_URL=""
```

Create a PostgreSQL database for the application, then point `DATABASE_URL` to that database. The database name used during development is:

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
