# Server usage

This server now requires an API key for all `/api/*` endpoints and includes rate limiting and input validation.

Environment variables (copy from `.env.example`):

- `GEMINI_API_KEY` - Gemini API key
- `API_KEY` or `API_KEYS` - single API key or comma-separated allowed keys
- `API_RATE_WINDOW_MS` (optional) - rate-limit window in milliseconds (default 60000)
- `API_RATE_MAX` (optional) - max requests per window (default 20)

Authentication:
- Send `Authorization: Bearer <API_KEY>` header or `x-api-key: <API_KEY>` header with your requests.

Rate-limiting:
- Default allows `API_RATE_MAX` requests per `API_RATE_WINDOW_MS` window (default 20 requests/60s).

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
- Coverage is enforced in CI with these global thresholds:
  - branches: 70%
  - functions: 80%
  - lines: 85%
  - statements: 85%

The CI workflow uploads the coverage report as an artifact named `server-coverage` on each run. If coverage is below these thresholds, the test run (and CI job) will fail.
