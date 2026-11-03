# enhancedQnA

A React + TypeScript interview-prep Q&A app for system design, Java, Python, cloud, AI, and engineering leadership topics.

## Production deployment overview

This project is configured for deployment on Vercel. The frontend is a static React app and the AI chat backend is implemented as a Vercel serverless function in `api/chat.ts`.

### Recommended hosting path

Use Vercel for the main production deployment.

1. Push code to the `main` branch.
2. Vercel automatically detects the change.
3. Vercel runs `npm run build`.
4. Vercel deploys the output from the `build` directory.

### Required environment variable

The AI assistant relies on a Groq API key in the serverless function.

- Local development: copy `.env.example` to `.env.local` and set `GROQ_API_KEY`.
- Vercel production: add `GROQ_API_KEY` in Project Settings > Environment Variables.

The backend route is:

- `/api/chat`

This route uses the Groq OpenAI-compatible endpoint and should not expose the API key in the browser.

## Vercel deployment steps

```bash
git add .
git commit -m "Deploy update"
git push origin main
```

After pushing, Vercel will build and deploy automatically. The production URL is configured in the Vercel project settings.

## GitHub Pages warning

This project also contains GitHub Pages deployment scripts in `package.json`, but that is a separate deployment path from Vercel.

- Do not run `npm run deploy` unless you intentionally want to publish to GitHub Pages.
- `npm run deploy` is not part of the Vercel deployment flow.
- The GitHub Pages setup is independent and should be treated as a separate environment.
- The GitHub Pages workflow sets `PUBLIC_URL=/enhancedQnA` for its project-page URL. Vercel builds without that override so its assets load from the domain root.

## Local validation

```bash
npm install
npm run build
```

The app should compile successfully before pushing to production.

## Important notes

- `vercel.json` already rewrites SPA routes and forwards `/api/(.*)` requests to the serverless function.
- The app is production-build ready once the required environment variables are configured in Vercel.
- Keep API keys out of source control and never commit raw `.env` files.
