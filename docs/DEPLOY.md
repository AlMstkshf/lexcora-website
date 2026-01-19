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

## Advanced
- You can host both frontend and server together (single host) or split them. If splitting, configure the frontend to call the server's public URL and set CORS accordingly.
- Consider adding a simple GitHub Actions deploy workflow to automate deploys on `main`.
