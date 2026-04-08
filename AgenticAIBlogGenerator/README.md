## Agentic AI Blog Generator

Next.js frontend calling `/api/generate`, which forwards to an n8n webhook and returns a complete publishing package.

### What it generates
- Long-form markdown blog content
- Viral-style LinkedIn caption
- LinkedIn hashtags
- Cover image generation prompt
- SEO metadata and slug

### Local setup
Create `.env.local`:

```bash
N8N_WEBHOOK_URL="https://<your-n8n-domain>/webhook/agentic-ai-blog-generate"
```

Run locally:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### n8n setup
1. Import `n8n_blog_workflow.json`.
2. Publish the workflow.
3. Use the production webhook URL in `.env.local`.

### Stability notes
- The current workflow generates planner, writer, SEO, and social assets locally inside n8n.
- This avoids breaking on model quotas or malformed HTTP JSON bodies.
- Keep `Build Response` as the last node so the webhook returns the final payload.

### If production webhook says "not registered"
- Publish the workflow in n8n.
- Use `/webhook/...`, not `/webhook-test/...`, in `.env.local`.

### If the app says `contentMarkdown` is missing
- Open the latest n8n execution.
- Confirm the last node is `Build Response`.
- Confirm `Build Response` returns `contentMarkdown`, `linkedinCaption`, `linkedinHashtags`, and `coverImagePrompt`.
