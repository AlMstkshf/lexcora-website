# Deployment notes

## Environment variables
- Server: `PORT` (optional, defaults to 4000) and `FRONTEND_ORIGINS` (optional, comma-separated allowed origins for CORS).
- Frontend: no required runtime variables for the static build.

## Frontend
- Build: `npm run build` (from repo root).
- Deploy the generated `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, S3+CloudFront, etc.).

## Server
- The server now only exposes `/health` for readiness/liveness checks.
- Install/build: `cd server && npm ci && npm run build`.
- Start: `npm start` (set `PORT` if needed).

## CI and automation
- PR CI should run the frontend build; server tests are optional since the API has been removed.
- If you add deploy automation, ensure secrets (if any) are stored in your hosting provider or GitHub Secrets.
