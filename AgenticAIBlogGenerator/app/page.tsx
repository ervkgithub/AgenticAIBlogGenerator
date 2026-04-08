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
  viralHook?: string;
  linkedinCaption?: string;
  linkedinHashtags?: string[];
  coverImagePrompt?: string;
  architectureSnapshot?: string;
  input?: {
    topic?: string;
    audience?: string;
    tone?: string;
    wordCount?: number;
    cta?: string;
    goal?: string;
    proofPoints?: string;
    systemExample?: string;
  };
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
  const [topic, setTopic] = useState(
    'Agentic AI workflows for content pipelines',
  );
  const [audience, setAudience] = useState(
    'Founders, hiring managers, and product teams evaluating serious AI execution talent',
  );
  const [tone, setTone] = useState(
    'Sharp, credible, implementation-first, and insight-dense',
  );
  const [wordCount, setWordCount] = useState(1600);
  const [goal, setGoal] = useState(
    'Show the difference between systems that demo well and systems that survive production.',
  );
  const [proofPoints, setProofPoints] = useState(
    'I have built agentic systems that generate, validate, and package content across blog and social in a single pipeline with failure isolation, structured outputs, and retry logic.',
  );
  const [systemExample, setSystemExample] = useState(
    'User input -> topic normalizer -> planner -> section generator -> validation layer -> metadata formatter -> output API. Validation checks length, duplication, structure, and tone alignment. If validation fails, regenerate only the weak section. If retries fail, fall back to a safe response template.',
  );
  const [cta, setCta] = useState(
    'The gap between demo AI and production AI is not tooling. It is execution discipline. Teams that understand this will ship faster, break less, and win more.',
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const payload = useMemo(
    () => ({
      topic,
      audience,
      tone,
      wordCount,
      goal,
      proofPoints,
      systemExample,
      cta,
    }),
    [topic, audience, tone, wordCount, goal, proofPoints, systemExample, cta],
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
          'Empty response (null). Fix n8n: use the production webhook URL, publish the workflow, and keep "Build Response" as the last node.',
        );
        return;
      }

      const md = data.contentMarkdown;
      if (typeof md !== 'string' || !md.trim()) {
        setError(
          'n8n responded but contentMarkdown is missing. Open the last execution in n8n and confirm the "Build Response" output.',
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
  const linkedinCaption = result?.linkedinCaption ?? '';
  const linkedinHashtags = result?.linkedinHashtags ?? [];
  const coverImagePrompt = result?.coverImagePrompt ?? '';
  const architectureSnapshot = result?.architectureSnapshot ?? '';

  return (
    <main style={{ maxWidth: 1500, margin: '0 auto', padding: 24 }}>
      <header style={{ marginBottom: 18 }}>
        <h1 style={{ margin: 0, letterSpacing: -0.5 }}>
          Agentic AI Blog Generator
        </h1>
        <p style={{ margin: '10px 0 0', opacity: 0.8, lineHeight: 1.5 }}>
          Generate a polished blog package designed to impress clients, hiring
          managers, and decision-makers in one run.
        </p>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(360px, 1fr) minmax(0, 2fr)',
          gap: 24,
          alignItems: 'start',
        }}
      >
        <div
          style={{
            border: cardBorder,
            borderRadius: 16,
            padding: 18,
            background: panelBackground,
            backdropFilter: 'blur(10px)',
            display: 'grid',
            gap: 12,
            position: 'sticky',
            top: 24,
          }}
        >
          <Field label="Topic">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Building agentic AI systems clients trust"
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
              min={900}
              max={3200}
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              style={inputStyle}
            />
          </Field>

          <Field label="Primary goal">
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              style={textAreaStyle}
            />
          </Field>

          <Field label="Credibility proof points">
            <textarea
              value={proofPoints}
              onChange={(e) => setProofPoints(e.target.value)}
              rows={4}
              style={textAreaStyle}
            />
          </Field>

          <Field label="Real system example">
            <textarea
              value={systemExample}
              onChange={(e) => setSystemExample(e.target.value)}
              rows={5}
              style={textAreaStyle}
            />
          </Field>

          <Field label="Call to action">
            <textarea
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              rows={3}
              style={textAreaStyle}
            />
          </Field>

          <button onClick={onGenerate} disabled={loading} style={primaryButton}>
            {loading ? 'Generating...' : 'Generate Content Package'}
          </button>

          {error ? (
            <div
              style={{
                padding: 12,
                borderRadius: 12,
                border: '1px solid rgba(255,120,120,0.35)',
                background: 'rgba(255,120,120,0.12)',
                lineHeight: 1.5,
              }}
            >
              <strong>Error:</strong> {error}
            </div>
          ) : null}

          {result ? (
            <div
              style={{
                padding: 14,
                borderRadius: 14,
                border: cardBorder,
                background: 'rgba(255,255,255,0.05)',
                display: 'grid',
                gap: 8,
              }}
            >
              <div>
                <strong>Title:</strong> {result.title}
              </div>
              <div>
                <strong>Slug:</strong> <code>{result.slug}</code>
              </div>
              <div>
                <strong>Excerpt:</strong> {result.excerpt}
              </div>
              <div>
                <strong>Viral hook:</strong> {result.viralHook}
              </div>
              <div style={{ opacity: 0.75, fontSize: 13 }}>
                <strong>Generated:</strong> {result.generatedAt}
              </div>
            </div>
          ) : null}
        </div>

        <div style={{ display: 'grid', gap: 18 }}>
          <AssetCard
            title="Architecture Snapshot"
            copyText={architectureSnapshot}
            emptyText="Generate once to get a text-based system flow you can reuse in the article or a post."
          >
            <PreBlock text={architectureSnapshot} />
          </AssetCard>

          <AssetCard
            title="LinkedIn Caption"
            copyText={linkedinCaption}
            emptyText="Generate once to get a LinkedIn-ready caption with a stronger opening hook."
          >
            <PreBlock text={linkedinCaption} />
          </AssetCard>

          <AssetCard
            title="Hashtags"
            copyText={linkedinHashtags.join(' ')}
            emptyText="Generate once to get a hashtag pack."
          >
            {linkedinHashtags.length ? (
              <div style={tagWrapStyle}>
                {linkedinHashtags.map((tag) => (
                  <span key={tag} style={tagStyle}>
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <EmptyText text="Generate once to get a hashtag pack." />
            )}
          </AssetCard>

          <AssetCard
            title="Cover Image Prompt"
            copyText={coverImagePrompt}
            emptyText="Generate once to get a polished cover-image prompt."
          >
            <PreBlock text={coverImagePrompt} />
          </AssetCard>

          <AssetCard
            title="Blog Markdown"
            copyText={markdown}
            emptyText="Generate a post to preview the long-form article here."
          >
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
              <EmptyText text="Generate a post to preview the long-form article here." />
            )}
          </AssetCard>
        </div>
      </section>
    </main>
  );
}

function AssetCard({
  title,
  copyText,
  emptyText,
  children,
}: Readonly<{
  title: string;
  copyText: string;
  emptyText: string;
  children: React.ReactNode;
}>) {
  const hasContent = Boolean(copyText.trim());

  return (
    <section
      style={{
        border: cardBorder,
        borderRadius: 16,
        padding: 16,
        background: panelBackground,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}
      >
        <h2 style={{ margin: 0, fontSize: 16 }}>{title}</h2>
        <button
          onClick={() => navigator.clipboard.writeText(copyText)}
          disabled={!hasContent}
          style={{
            ...secondaryButton,
            cursor: hasContent ? 'pointer' : 'not-allowed',
            opacity: hasContent ? 1 : 0.6,
          }}
        >
          Copy
        </button>
      </div>
      <div style={{ marginTop: 12 }}>
        {hasContent ? children : <EmptyText text={emptyText} />}
      </div>
    </section>
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

function EmptyText({ text }: Readonly<{ text: string }>) {
  return <p style={{ opacity: 0.72, lineHeight: 1.6, margin: 0 }}>{text}</p>;
}

function PreBlock({ text }: Readonly<{ text: string }>) {
  return text ? (
    <pre
      style={{
        margin: 0,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        lineHeight: 1.65,
        fontFamily:
          'ui-monospace, SFMono-Regular, SFMono, Menlo, Consolas, monospace',
      }}
    >
      {text}
    </pre>
  ) : null;
}

const panelBackground = 'rgba(7,10,18,0.55)';
const cardBorder = '1px solid rgba(255,255,255,0.12)';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.06)',
  color: 'inherit',
  outline: 'none',
};

const textAreaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 88,
  fontFamily: 'inherit',
};

const primaryButton: React.CSSProperties = {
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.18)',
  background: '#2d6bff',
  color: 'white',
  fontWeight: 700,
  cursor: 'pointer',
};

const secondaryButton: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(255,255,255,0.08)',
  color: 'white',
};

const tagWrapStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
};

const tagStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.07)',
  fontSize: 14,
};
