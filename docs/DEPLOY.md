# Deployment notes

Short deployment guidance for the frontend and server.

## Environment variables
- The server expects environment variables as shown in `server/.env.example` (do NOT commit real keys).
- Most importantly: `GEMINI_API_KEY` (AI provider key) and `API_KEYS`/`API_KEY` for client auth.

## Frontend
- Build: `npm run build` (from repo root).
- Deploy the generated static files to any static host (Vercel, Netlify, Cloudflare Pages, S3+CloudFront, etc.). If using Vercel/Netlify, point the project to the repo root and configure the build command and output directory as needed.

## Server
- Install and build: `cd server && npm ci && npm run build`.
- Start: `npm start` (ensure `PORT` is set in environment or default is used).
- Recommended platforms: Railway, Render, Heroku, Azure App Service, DigitalOcean App Platform, or a container on your own infrastructure.

### Redis (optional, recommended for production rate limiting)
- To enable a shared rate-limiter store across instances, set `REDIS_URL` (e.g. `redis://:password@redis:6379/0`) in your server environment. If `REDIS_URL` is set the server will use a Redis-backed rate limiter; otherwise it falls back to in-memory limiting (not suitable for multi-instance setups).
- Example (Docker Compose): use the provided `docker-compose.yml` which launches `redis` and `server` services.

### Containerized deploy (Docker)
A minimal Docker setup is provided:

- `Dockerfile` (server-only) builds the server and runs `node dist/index.js` in production mode.
- `docker-compose.yml` provided to run the server with a Redis instance for production-like testing.

Example to build & run:
```bash
# Build server image
docker build -t lexcora-server .

# Run with a Redis container
docker run -d --name redis redis:7
docker run -d --name lexcora-server -e PORT=4000 -e GEMINI_API_KEY=your_key -e API_KEY=your_key -e REDIS_URL=redis://redis:6379 --link redis:redis -p 4000:4000 lexcora-server
```

### CI: build & publish Docker image
A GitHub Actions workflow (`.github/workflows/docker-publish.yml`) has been added to build and push the **server** Docker image to **GitHub Container Registry (GHCR)** when `main` receives a push. The workflow authenticates using the repository-provided `GITHUB_TOKEN` and requires `packages: write` permission (already set in the workflow).

Image tags produced:
- `ghcr.io/<owner>/lexcora-server:${{ github.sha }}` (commit-specific)
- `ghcr.io/<owner>/lexcora-server:latest` (updated on `main` pushes)

If you prefer Docker Hub or another registry, I can add a second workflow or extend this one to support it (requires `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets).

### Smoke tests
A smoke-test workflow (`.github/workflows/docker-smoke-test.yml`) runs after the Docker image is published to GHCR to pull `ghcr.io/<owner>/lexcora-server:latest`, run it with a temporary `API_KEY`, and assert the `/health` endpoint returns `{ status: "ok" }`. If the health check fails, container logs are shown in the workflow output.

> Note: For serving the frontend we recommend deploying the `dist/` static files to a static host (Vercel, Netlify, Cloudflare Pages) or to a CDN-backed origin. See the "Frontend" section above for build steps.

## Non-interactive Vercel project creation (PowerShell) ⚙️

These commands create a Vercel project and parse the response to extract the `project id` and `account id` (org/team). They use the Vercel REST API and assume you have a valid Vercel access token assigned to `$env:VERCEL_TOKEN`.

1) Set your token in the session (or export it to your environment):

```powershell
$env:VERCEL_TOKEN = Read-Host -Prompt 'Paste your Vercel token' -AsSecureString | ConvertFrom-SecureString
# If you already have the token plain: $env:VERCEL_TOKEN = 'your_token_here'
```

2) (Optional) List teams and grab a team id (if you want to create the project under a team):

```powershell
$teams = Invoke-RestMethod -Method Get -Uri "https://api.vercel.com/v1/teams" -Headers @{ Authorization = "Bearer $env:VERCEL_TOKEN" }
$teams | Select-Object id, name
# Use the id of the team you want (assign to $teamId if needed)
```

3) Create the project (example: link to a GitHub repo and set `productionBranch`):

```powershell
$body = @{
  name = "lexcora-website"
  framework = "vite"
  productionBranch = "main"
  gitRepository = @{
    type = "github"
    repo = "your-org/your-repo"    # replace with your GitHub repo
  }
} | ConvertTo-Json -Depth 10

# If creating under a team: $uri = "https://api.vercel.com/v11/projects?teamId=$teamId" else:
$uri = "https://api.vercel.com/v11/projects"

$response = Invoke-RestMethod -Method Post -Uri $uri -Headers @{ Authorization = "Bearer $env:VERCEL_TOKEN"; "Content-Type" = "application/json" } -Body $body

# Parse out ids
$projectId = $response.id
$accountId = $response.accountId
Write-Host "Created project: $($response.name) — project id: $projectId, account id: $accountId"
```

4) Set GitHub repo secrets (using `gh`):

```powershell
# From inside the repo directory
gh secret set VERCEL_TOKEN --body $env:VERCEL_TOKEN
gh secret set VERCEL_PROJECT_ID --body $projectId
gh secret set VERCEL_ORG_ID --body $accountId
```

Notes:
- If `gitRepository` linking fails, ensure the Vercel GitHub App is installed for the organization/repo or that the account you used to create the token has access. The Vercel API can create the project, but GitHub integration configuration may require installing the Vercel app for the org (this step typically happens once via the Vercel web UI or Organization settings).
- You can also list existing projects via the API: `Invoke-RestMethod -Method Get -Uri "https://api.vercel.com/v9/projects" -Headers @{ Authorization = "Bearer $env:VERCEL_TOKEN" }` and inspect the results.

## Security & CI
- Ensure secrets are stored with the host's secret management (GitHub Secrets, Vercel/Netlify environment settings, etc.).
- CI should run tests and builds before deploys (we run server tests for Dependabot PRs via `.github/workflows/dependabot-ci.yml`).
- A PR CI workflow (`.github/workflows/pr-ci.yml`) has been added to run a full frontend build and server tests on pull requests; use branch protection rules to require this check before merging.

## Advanced
- You can host both frontend and server together (single host) or split them. If splitting, configure the frontend to call the server's public URL and set CORS accordingly.
- Consider adding a simple GitHub Actions deploy workflow to automate deploys on `main`.
