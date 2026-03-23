# SphereAI - AI-Optimized Page Generator

Generate 5 AI-search-optimized pages for your product or affiliate service in minutes.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase Database

1. Go to your [Supabase SQL Editor](https://supabase.com/dashboard/project/oeetkauwfkyeykxwbfrt/sql/new)
2. Copy the entire contents of `supabase-schema.sql`
3. Paste into the SQL Editor and click **Run**

This creates the `profiles`, `projects`, and `pages` tables with Row Level Security policies.

### 3. Configure Environment

The `.env.local` file is already configured. For production, update `NEXT_PUBLIC_BASE_URL` to your domain.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

1. **Sign up** with email and password
2. **Create a project** — enter your product name, description, keywords, and target audience
3. **AI generates 5 pages** optimized for AI search engines:
   - Landing Page (Product + WebPage schema)
   - About Page (Organization schema)
   - FAQ Page (FAQPage schema — highest AI citation rate)
   - Blog Article (Article schema)
   - Reviews Page (Review + AggregateRating schema)
4. Pages are published at `/s/{your-slug}/`

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Auth + PostgreSQL)
- RapidAPI (AI content generation)
