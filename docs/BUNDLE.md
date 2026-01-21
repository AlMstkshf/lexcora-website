Bundle size improvements ⚡️

What I changed

- Added rollup `manualChunks` in `vite.config.ts` to split major vendor code from app code:
  - `react-vendor` (React + react-dom)
  - `icons` (lucide-react)
  - fallback `vendor` chunk for other node_modules
- Lazy-loaded several heavy route/modal components using `React.lazy` + `Suspense` in `App.tsx`:
  - `InsightsPage`, `ArticleDetail`, `CaseStudies`, `TrialSignup`, `Pricing`, `PrivacyPolicy`, `LoginModal`, `ContactModal`.
- Added the `rollup-plugin-visualizer` plugin (disabled by default) to generate `dist/stats.html` when running the analyze script.
- Added an `analyze` npm script to produce a visual bundle report on Windows:
  - `npm run analyze` (Windows) — sets `ANALYZE=true` and runs `vite build` which generates `dist/stats.html`.

How to reproduce and analyze locally

1. Install deps: `npm install`
2. Build and generate report: `npm run analyze`
3. Open `dist/stats.html` to inspect chunk sizes and composition.

Quick suggestions

- Keep server-only libraries out of frontend code.
- Move large or rarely-used UI into dynamic imports.
- Consider splitting icons (only load what you use) or using an icon subset.

If you want, I can run the analysis here and open the report and highlight the biggest sources of bytes and recommendations for further chunking. (✅ ready to run and share)
