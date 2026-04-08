## Mini OpenClaw – Personal AI Task Assistant

Mini OpenClaw is a **Next.js + Tailwind** web app that turns your task instructions into results using the **OpenRouter API**.

### Features

- **SaaS-style dashboard landing page**
- **Task Input panel** with:
  - Task type dropdown (📄 summarize, 📝 social content, 📅 plan day)
  - Multi-line instruction input
  - Loading spinner while the AI runs
  - Styled result panel + **Copy result**
- **API Integration** via Next.js route: `POST /api/task`
  - Uses `OPENROUTER_API_KEY` (server-side)
  - Returns **“AI request failed”** on errors
- **Task History panel** (portfolio bonus)
  - Stores last tasks in **localStorage**
  - Type, input, and AI output
  - Clear history button
- **Animated cursor** + dark/light theme toggle

---

## Environment variables

Create a `.env.local` file locally (or set these in Vercel).

```bash
OPENROUTER_API_KEY="your_openrouter_api_key"

# Optional (default: openrouter/auto)
# OPENROUTER_MODEL="openrouter/auto"
# OPENROUTER_SITE_URL="http://localhost:3000"
```

### Notes about `OPENROUTER_MODEL`

OpenRouter model naming can vary. If `openrouter/auto` isn’t your preference,
set `OPENROUTER_MODEL` to the model id you see in your OpenRouter dashboard.

---

## Local development

```bash
npm run dev
```

Then open: `http://localhost:3000`

---

## Deploy to Vercel (free tier)

1. Import your repo in Vercel.
2. Set **Root Directory** to `mini-openclaw` (because the app lives in that folder).
3. Add the environment variable `OPENROUTER_API_KEY`.
4. Deploy.

You’re ready to showcase your live URL.
