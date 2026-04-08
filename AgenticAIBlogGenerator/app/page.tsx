'use client';

import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';

type Result = {
  success?: boolean;
  generatedAt?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  metaDescription?: string;
  keywords?: string[];
  contentMarkdown?: string;
  [key: string]: unknown;
};

function formatGenerateError(res: Response, data: Result | null): string {
  const msg =
    typeof data?.error === 'string'
      ? data.error
      : `Request failed (${res.status})`;
  const details =
    data && typeof data === 'object' && 'details' in data
      ? JSON.stringify((data as { details?: unknown }).details)
      : '';
  const preview =
    data && typeof data === 'object' && 'responsePreview' in data
      ? String((data as { responsePreview?: unknown }).responsePreview)
      : '';
  return [msg, details && `Details: ${details}`, preview && `Preview: ${preview}`]
    .filter(Boolean)
    .join(' ');
}

export default function HomePage() {
  const [topic, setTopic] = useState('Agentic AI workflows for content pipelines');
  const [audience, setAudience] = useState('Developers building automation');
  const [tone, setTone] = useState('Practical, detailed, implementation-first');
  const [wordCount, setWordCount] = useState(1400);
  const [cta, setCta] = useState(
    'Pick one workflow and ship a first version today.',
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const payload = useMemo(
    () => ({ topic, audience, tone, wordCount, cta }),
    [topic, audience, tone, wordCount, cta],
  );

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data: Result | null = null;
      try {
        data = (await res.json()) as Result | null;
      } catch {
        setError('Server response was not valid JSON.');
        return;
      }

      if (!res.ok) {
        setError(formatGenerateError(res, data));
        return;
      }

      if (data === null || typeof data !== 'object') {
        setError(
          'Empty response (null). Fix n8n: use Production webhook URL, activate workflow, and ensure “Respond to Webhook” runs.',
        );
        return;
      }

      const md = data.contentMarkdown;
      if (typeof md !== 'string' || !md.trim()) {
        setError(
          'n8n responded but contentMarkdown is missing. In n8n, open the last execution and confirm “Build Response” output.',
        );
        setResult(data);
        return;
      }

      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const markdown = result?.contentMarkdown ?? '';

  return (
    <main style={{ maxWidth: 1450, margin: '0 auto', padding: 24 }}>
      <header style={{ marginBottom: 18 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <h1 style={{ margin: 0, letterSpacing: -0.5 }}>
            Agentic AI Blog Generator
          </h1>
        </div>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 25,
          alignItems: 'start',
        }}
      >
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 14,
            padding: 16,
            background: 'rgba(7,10,18,0.55)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ display: 'grid', gap: 12 }}>
            <Field label="Topic">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Agentic AI for SEO audits"
                style={inputStyle}
              />
            </Field>

            <Field label="Audience">
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                style={inputStyle}
              />
            </Field>

            <Field label="Tone">
              <input
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                style={inputStyle}
              />
            </Field>

            <Field label="Word count">
              <input
                type="number"
                min={700}
                max={3000}
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                style={inputStyle}
              />
            </Field>

            <Field label="Call to action">
              <input
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                style={inputStyle}
              />
            </Field>

            <button
              onClick={onGenerate}
              disabled={loading}
              style={{
                padding: '10px 12px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.18)',
                background: loading ? 'rgba(255,255,255,0.10)' : '#2d6bff',
                color: 'white',
                fontWeight: 650,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Generating…' : 'Generate'}
            </button>

            {error ? (
              <div
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: '1px solid rgba(255,120,120,0.35)',
                  background: 'rgba(255,120,120,0.12)',
                }}
              >
                <strong>Error:</strong> {error}
              </div>
            ) : null}

            {result ? (
              <div
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ display: 'grid', gap: 6 }}>
                  <div>
                    <strong>Title:</strong> {result.title}
                  </div>
                  <div>
                    <strong>Slug:</strong> <code>{result.slug}</code>
                  </div>
                  <div style={{ opacity: 0.9 }}>
                    <strong>Excerpt:</strong> {result.excerpt}
                  </div>
                  <div style={{ opacity: 0.8, fontSize: 13 }}>
                    <strong>Generated:</strong> {result.generatedAt}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 14,
            padding: 16,
            background: 'rgba(7,10,18,0.55)',
            backdropFilter: 'blur(10px)',
            minHeight: 320,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 16, opacity: 0.95 }}>Preview</h2>
            <button
              onClick={() => navigator.clipboard.writeText(markdown)}
              disabled={!markdown}
              style={{
                padding: '6px 10px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.08)',
                color: 'white',
                cursor: markdown ? 'pointer' : 'not-allowed',
              }}
            >
              Copy markdown
            </button>
          </div>

          {markdown ? (
            <article
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: '1px solid rgba(255,255,255,0.10)',
                lineHeight: 1.7,
              }}
            >
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </article>
          ) : (
            <p style={{ opacity: 0.75, lineHeight: 1.6 }}>
              Generate a post to see markdown preview here.
            </p>
          )}
        </div>
      </section>

      {/* <footer style={{ marginTop: 18, opacity: 0.7, fontSize: 13 }}>
        Configure <code>N8N_WEBHOOK_URL</code> in your Next.js environment (e.g.{' '}
        <code>.env.local</code>).
      </footer> */}
    </main>
  );
}

function Field({
  label,
  children,
}: Readonly<{
  label: string;
  children: React.ReactNode;
}>) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 13, opacity: 0.85 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.06)',
  color: 'inherit',
  outline: 'none',
};

