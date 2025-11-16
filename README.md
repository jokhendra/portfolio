This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Out-of-the-box Setup (This Portfolio)

This project is pre-built to run without any mandatory configuration. Optional integrations (DB and scheduler) can be enabled via environment variables.

1) Install dependencies and run:

```bash
npm install
npm run dev
```

2) Optional configuration (copy `env.example` to `.env.local` and adjust):

```bash
# Public site URL for SEO metadata, robots and sitemap
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Cal.com embed link (optional). Example: yourhandle/30min
# NEXT_PUBLIC_CAL_LINK=

# MongoDB URI (optional). If not set, contact form works in demo mode without persistence
# MONGODB_URI=
```

Notes:
- Contact form: If `MONGODB_URI` is not set, submissions will return success in demo mode (no database write).
- Scheduler: If `NEXT_PUBLIC_CAL_LINK` is not set, the schedule section is hidden.
- Update branding (title, descriptions, social links) in `src/app/layout.tsx`, `src/components/Contact.tsx`, and project data in `src/data/projects.ts`.
