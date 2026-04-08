import { NextResponse } from 'next/server';

type GenerateRequest = {
  topic: string;
  audience?: string;
  tone?: string;
  wordCount?: number;
  cta?: string;
  goal?: string;
  proofPoints?: string;
  systemExample?: string;
};

/** n8n sometimes wraps items as [{ json: {...} }]; webhooks may nest under body. */
function unwrapN8nPayload(raw: unknown): Record<string, unknown> | null {
  if (raw === null || raw === undefined) return null;

  if (typeof raw === 'string') {
    const t = raw.trim();
    if (!t) return null;
    try {
      return unwrapN8nPayload(JSON.parse(t));
    } catch {
      return { contentMarkdown: raw };
    }
  }

  if (Array.isArray(raw)) {
    const first = raw[0];
    if (
      first &&
      typeof first === 'object' &&
      first !== null &&
      'json' in first &&
      typeof (first as { json?: unknown }).json === 'object' &&
      (first as { json?: unknown }).json !== null
    ) {
      return unwrapN8nPayload((first as { json: unknown }).json);
    }
    return null;
  }

  if (typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    if (o.body !== undefined) return unwrapN8nPayload(o.body);
    if (o.data !== undefined) return unwrapN8nPayload(o.data);
    return o;
  }

  return null;
}

export async function POST(req: Request) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing env var N8N_WEBHOOK_URL',
      },
      { status: 500 },
    );
  }

  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  if (!body?.topic?.trim()) {
    return NextResponse.json(
      { success: false, error: 'Missing required field: topic' },
      { status: 400 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await res.text();
    let parsed: unknown = text;
    try {
      parsed = text.trim() ? JSON.parse(text) : null;
    } catch {
      parsed = text.trim() ? { raw: text } : null;
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          status: res.status,
          statusText: res.statusText,
          error: 'n8n webhook call failed',
          details: parsed,
        },
        { status: 502 },
      );
    }

    const unwrapped = unwrapN8nPayload(parsed);

    if (unwrapped === null) {
      return NextResponse.json(
        {
          success: false,
          error:
            'n8n returned an empty or null body. Check: workflow Active, Production webhook URL, and that "Build Response" is the last node.',
          hint:
            'Use Production URL (/webhook/...), not the workflow editor URL. Test URL only works in limited cases.',
          responseBytes: text.length,
          responsePreview: text.slice(0, 500),
        },
        { status: 502 },
      );
    }

    return NextResponse.json(unwrapped, { status: 200 });
  } catch (err) {
    const isAbort =
      typeof err === 'object' &&
      err !== null &&
      'name' in err &&
      (err as { name?: string }).name === 'AbortError';

    return NextResponse.json(
      {
        success: false,
        error: isAbort ? 'Webhook request timed out' : 'Failed to call n8n webhook',
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}

