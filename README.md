## Agentic AI Blog Generator (Next.js → /api/generate → n8n)

### What you get
- UI form on `/` that calls `/api/generate`
- Next.js route handler proxies to **n8n Webhook** (`N8N_WEBHOOK_URL`)
- n8n workflow returns `{ title, slug, excerpt, metaDescription, keywords, contentMarkdown, ... }`

### Setup
Create `AgenticAIBlogGenerator/.env.local`:

```bash
N8N_WEBHOOK_URL="https://<your-n8n-domain>/webhook/agentic-ai-blog-generate"
```

Install + run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### n8n
Import `n8n_blog_workflow.json` into n8n and set variable `GEMINI_API_KEY` in n8n (Settings -> Variables).
The bundled workflow uses the Gemini REST `v1beta` endpoint for `gemini-2.0-flash`, which matches Google's current REST examples.

### Planner node failing in n8n
The latest workflow now generates the planner, writer, and SEO steps locally inside n8n. This avoids Gemini free-tier quota issues entirely and makes the workflow runnable on n8n Cloud without external model dependencies.

If the workflow still stops early, check these first:

- `GEMINI_API_KEY` is set in n8n itself, not only in local `.env.local`.
- The workflow is re-imported or updated with the latest `n8n_blog_workflow.json`.
- Your app uses the n8n Production webhook URL (`/webhook/...`) for normal usage. `webhook-test` is only for editor testing.

### Gemini rate limits (“too many requests”)
Google’s free Gemini API enforces strict per-minute quotas. This workflow calls Gemini **three times** per blog (Planner → Writer → SEO). If you see **429 / “too many requests”**:

- Wait **1–2 minutes** and try again (do not spam Generate).
- Each Gemini **HTTP Request** node has **retry with backoff**. **Wait** nodes are not used on n8n Cloud (they can cause an **empty webhook body** with `Respond to Webhook`).
- In Google AI Studio, confirm billing/quota for your project if you upgraded usage.

### Empty webhook body (`responseBytes: 0`)
On **n8n Cloud**, **Respond to Webhook** + **Webhook** pairing sometimes returns **no body**. The bundled workflow uses **Webhook → Respond: “When Last Node Finishes”** (`lastNode`) and **Response Data: First Entry JSON**, with **Build Response** as the **last** node (no separate Respond node). Re-import the latest `n8n_blog_workflow.json`, **Publish/Activate**, and use the **Production** `/webhook/...` URL.

