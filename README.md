# Webank

Community Debt & Ledger Tracker built with Next.js, PostgreSQL, Prisma, and Tailwind CSS.

## Features

- Email + 6-digit PIN authentication
- Unique username and human-readable 4-digit Short ID
- Search community members by username or Short ID
- Create peer transactions with mutual confirmation
- Dashboard with "You are owed" and "You owe"
- Ledger history with pending and confirmed transactions

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root with values for your database and secrets:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXTAUTH_SECRET="strong-secret"
JWT_SECRET="strong-secret"
```

### 3. Run database migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Start the app locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Deployment

### GitHub

1. Push this repository to GitHub.
2. Add environment variables in GitHub Settings: `DATABASE_URL`, `NEXTAUTH_SECRET`, `JWT_SECRET`.

### Vercel

1. Import the repository into Vercel.
2. Set environment variables in the Vercel dashboard.
3. Deploy the app.

### Supabase

1. Create a Supabase project.
2. Copy the Supabase connection string to `DATABASE_URL`.
3. Run the Prisma migration against your Supabase database.

## Notes

- This app is configured for PostgreSQL and not SQLite.
- Do not commit `.env` or secret values.
- To use the app, sign up, search a user, log a transaction, and confirm pending entries.
