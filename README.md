<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1hipztc01zGP4uBy4qw0_BjbRRzJjTdMa

## Run Locally

**Prerequisites:** Node.js

1. Install frontend deps (from repo root):
   `npm install`
2. Install server deps (from `server`):
   `cd server && npm install`
3. Create server env file (copy `server/.env.example` to `server/.env.local`) and set `GEMINI_API_KEY` there. **Do not commit `.env.local`. Rotate any exposed keys immediately.**
4. Start the server (dev):
   `cd server && npm run dev`
5. Start the frontend (from repo root):
   `npm run dev`

Notes:
- The app now proxies AI requests via `/api/*` to the local server to keep API keys on the server side.
- If a key was committed, revoke/rotate it and purge history as needed.
