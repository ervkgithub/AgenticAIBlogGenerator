# Agentic AI Blog Generator

A Next.js frontend that calls `/api/generate`, which forwards requests to an n8n webhook and returns a complete blog publishing package.

## What it generates
- Long-form markdown blog content
- Viral-style LinkedIn caption
- LinkedIn hashtags
- Cover image generation prompt
- SEO metadata and slug

## Features
- Simple UI form on `/`
- Next.js API route proxies to n8n webhook
- n8n workflow builds complete blog payload
- Designed for n8n Cloud and local development

## Quick start
1. Copy `.env.local.example` or create `AgenticAIBlogGenerator/.env.local`
2. Add:
   ```bash
   N8N_WEBHOOK_URL="https://<your-n8n-domain>/webhook/agentic-ai-blog-generate"
   ```
3. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open `http://localhost:3000`

## n8n setup
1. Import `n8n_blog_workflow.json` into n8n.
2. Set `GEMINI_API_KEY` in n8n (Settings → Variables).
3. Publish the workflow.
4. Use the production webhook URL from n8n in `.env.local`.

## Workflow behavior
- The workflow generates planner, writer, SEO, and social assets entirely inside n8n.
- This avoids failure modes from external model dependencies or malformed HTTP JSON bodies.
- Keep `Build Response` as the final node so the webhook returns the expected payload.
- The API expects fields such as `contentMarkdown`, `linkedinCaption`, `linkedinHashtags`, and `coverImagePrompt`.

## Troubleshooting

### `not registered` webhook error
- Publish the workflow in n8n.
- Use `/webhook/...`, not `/webhook-test/...`, in `.env.local`.

### Missing `contentMarkdown` in the app
- Open the latest n8n execution.
- Confirm the final node is `Build Response`.
- Confirm `Build Response` returns `contentMarkdown`, `linkedinCaption`, `linkedinHashtags`, and `coverImagePrompt`.

### Gemini rate limits (`429 Too Many Requests`)
This workflow calls Gemini three times per blog: Planner → Writer → SEO.
- Wait 1–2 minutes and retry.
- Do not spam the Generate button.
- Confirm billing/quota in Google AI Studio if you have upgraded usage.

### Empty webhook body (`responseBytes: 0`)
On n8n Cloud, using `Respond to Webhook` incorrectly can return no body.
- Use the production webhook flow: `Webhook → Respond: When Last Node Finishes`
- Return `Response Data: First Entry JSON`
- Ensure `Build Response` is the last node and there is no extra Respond node

## Notes
- The app proxy uses `N8N_WEBHOOK_URL` from `.env.local`.
- Keep the n8n workflow updated by re-importing the latest `n8n_blog_workflow.json`.

