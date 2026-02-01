# College Research Tool

A standalone Next.js application for exploring university data, including admissions statistics, costs, and student outcomes.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Create a `.env` file with your PostgreSQL connection:

```bash
cp .env.example .env
# Edit .env with your database URL
```

Push the schema to your database:

```bash
npm run db:push
```

### 3. Seed Data

You can import college data from your main LMS database, or run the seed script:

```bash
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
npx vercel
```

### Option 2: GitHub Integration

1. Push this folder to a new GitHub repository
2. Import the repo in [Vercel Dashboard](https://vercel.com/new)
3. Add your `DATABASE_URL` environment variable
4. Deploy

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives

## Features

- Browse 1000+ colleges with filtering and sorting
- Filter by selectivity, type (public/private), test policy, and setting
- Search by name, location, or major
- Detailed college profiles with:
  - Admissions statistics (acceptance rate, ED/EA/RD data)
  - Test score ranges (SAT/ACT)
  - Cost of attendance and financial aid
  - Student demographics
  - Graduation rates and earnings outcomes

## Data Sources

College data is sourced from:
- Common Data Set (CDS)
- IPEDS (Integrated Postsecondary Education Data System)
- Institutional reporting
