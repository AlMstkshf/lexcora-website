# Server usage

This server requires an API key for all `/api/*` endpoints and includes rate limiting and input validation. It also exposes a lightweight `/health` endpoint for readiness/liveness checks.

Environment variables (copy from `.env.example`):

- `GEMINI_API_KEY` - Gemini API key
- `API_KEY` or `API_KEYS` - single API key or comma-separated allowed keys
- `API_RATE_WINDOW_MS` (optional) - rate-limit window in milliseconds (default 60000)
- `API_RATE_MAX` (optional) - max requests per window (default 20)
- `REDIS_URL` (optional) - when set, enables a Redis-backed rate limiter (recommended for multi-instance deployments)
- `FRONTEND_ORIGINS` (optional) - comma-separated allowed origins for CORS (default `http://localhost:3000`)

Authentication:
- Send `Authorization: Bearer <API_KEY>` header or `x-api-key: <API_KEY>` header with your requests.

Network & health:
- `GET /health` returns service uptime and Redis connection status (if configured).
- CORS is restricted to the origins listed in `FRONTEND_ORIGINS` (non-browser requests like curl still allowed).

Rate-limiting:
- Default allows `API_RATE_MAX` requests per `API_RATE_WINDOW_MS` window (default 20 requests/60s).
- For production deployments, set `REDIS_URL` so all instances share a centralized rate-limiter store.

Input validation:
- `POST /api/assistant` expects JSON { query: string, lang?: 'en' | 'ar' }
- `POST /api/analyze` expects JSON { text: string, lang?: 'en' | 'ar' }
- `POST /api/chat` expects JSON { message: string, lang?: 'en' | 'ar', history?: Array<{ role: 'user'|'model', text: string }> }

Example cURL:

curl -X POST http://localhost:4000/api/assistant \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"Explain UAE contract termination rules","lang":"en"}'

---

## Test coverage

- Run coverage locally: `npm run test:coverage` (from the `server` folder). ✅
- CI enforces coverage thresholds defined in `server/jest.config.ts`. If coverage is below thresholds the pipeline job will fail.

The CI workflow uploads the coverage report as an artifact named `server-coverage` on each run.
