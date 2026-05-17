# Day 0 Frontend Setup

## Requirements

- Node.js 20 LTS
- npm 10+

## Quick start

1. Install dependencies:
   - npm install
2. Create local environment file:
   - copy .env.example .env.local
3. Start development server:
   - npm run dev

## Required environment variables

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

## Script reference

- npm run dev: start local Vite server
- npm run lint: run ESLint checks
- npm run type-check: run TypeScript checks
- npm run test: run Vitest test suite
- npm run build: generate production build
- npm run preview: preview built app

## Troubleshooting

- If the app throws "Missing required environment variable", verify .env.local exists and includes both Supabase keys.
- If tests fail due to DOM environment, run npm install to ensure jsdom and test packages are installed.
