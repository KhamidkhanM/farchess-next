# farchess-web

The farchess frontend, built with Next.js (pages router), TypeScript and Tailwind CSS.
All data comes from the farchess-api backend (the `farchess` repo).

## Run it locally

1. Start the backend first: in the `farchess` repo run `npm run seed` once, then `npm run start:dev`. It listens on http://localhost:4000.
2. Copy `.env.example` to `.env.local` if your backend runs somewhere else.
3. Start the frontend:

```bash
cd farchess-web
npm install
npm run dev
```

Then open http://localhost:3000.
