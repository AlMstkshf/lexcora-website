# Server usage

The server now exposes a lightweight Express app with a single `/health` endpoint for readiness/liveness checks. All AI and chat endpoints have been removed.

## Run locally

1. Install deps: `npm install`
2. Start dev server: `npm run dev`
3. Build: `npm run build`

CORS origins are controlled by `FRONTEND_ORIGINS` (default `http://localhost:3000`). Redis is optional for the health check; if configured, connectivity is reported in the response.
