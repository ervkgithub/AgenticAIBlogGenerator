'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const workflowSteps = useMemo(
    () => [
      {
        id: 'webhook',
        name: 'Webhook Trigger',
        detail: 'Frontend sends the request to the n8n production webhook.',
        lane: 'main' as const,
        x: 28,
        y: 30,
        icon: '⏵',
      },
      {
        id: 'normalize',
        name: 'Normalize Input',
        detail: 'Input is cleaned, defaults are added, and structure is prepared.',
        lane: 'main' as const,
        x: 232,
        y: 30,
        icon: '{}',
      },
      {
        id: 'planner',
        name: 'Planner Layer',
        detail: 'The workflow builds the angle, outline, and architecture context.',
        lane: 'main' as const,
        x: 452,
        y: 30,
        icon: 'AI',
      },
      {
        id: 'writer',
        name: 'Writer Layer',
        detail: 'The main article draft is assembled into the long-form blog body.',
        lane: 'main' as const,
        x: 682,
        y: 30,
        icon: '✍',
      },
      {
        id: 'seo',
        name: 'SEO + Social',
        detail: 'Hook, caption, hashtags, and cover prompt are packaged.',
        lane: 'main' as const,
        x: 912,
        y: 30,
        icon: '#',
      },
      {
        id: 'response',
        name: 'Build Response',
        detail: 'The final payload is returned to the app for preview.',
        lane: 'main' as const,
        x: 1142,
        y: 30,
        icon: '✓',
      },
    ],
    [],
  );

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
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [workflowFailed, setWorkflowFailed] = useState(false);

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
    setWorkflowFailed(false);
    setActiveStepIndex(0);

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
        setWorkflowFailed(true);
        setError(formatGenerateError(res, data));
        return;
      }

      if (data === null || typeof data !== 'object') {
        setWorkflowFailed(true);
        setError(
          'Empty response (null). Fix n8n: use the production webhook URL, publish the workflow, and keep "Build Response" as the last node.',
        );
        return;
      }

      const md = data.contentMarkdown;
      if (typeof md !== 'string' || !md.trim()) {
        setWorkflowFailed(true);
        setError(
          'n8n responded but contentMarkdown is missing. Open the last execution in n8n and confirm the "Build Response" output.',
        );
        setResult(data);
        return;
      }

      setActiveStepIndex(workflowSteps.length - 1);
      setResult(data);
    } catch (e) {
      setWorkflowFailed(true);
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!loading) {
      if (result) {
        setActiveStepIndex(workflowSteps.length - 1);
      }
      return;
    }

    setActiveStepIndex(0);
    const timings = [700, 1100, 1600, 2100, 2600];
    const timers = timings.map((delay, index) =>
      window.setTimeout(() => {
        setActiveStepIndex((current) =>
          Math.max(current, Math.min(index + 1, workflowSteps.length - 1)),
        );
      }, delay),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [loading, result, workflowSteps.length]);

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
          border: cardBorder,
          borderRadius: 16,
          padding: 16,
          background: panelBackground,
          backdropFilter: 'blur(10px)',
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 16 }}>Live n8n Workflow</h2>
            <p style={{ margin: '6px 0 0', opacity: 0.75, lineHeight: 1.5 }}>
              Frontend step tracker for the active blog-generation request.
            </p>
          </div>
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.14)',
              background: workflowFailed
                ? 'rgba(255,120,120,0.14)'
                : loading
                  ? 'rgba(45,107,255,0.18)'
                  : result
                    ? 'rgba(92,201,126,0.16)'
                    : 'rgba(255,255,255,0.06)',
              fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            {workflowFailed
              ? 'Workflow failed'
              : loading
                ? `Running: ${workflowSteps[activeStepIndex]?.name}`
                : result
                  ? 'Workflow completed'
                  : 'Waiting to start'}
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            overflowX: 'auto',
            paddingBottom: 4,
          }}
        >
          <div style={workflowCanvasStyle}>
            <div style={workflowCanvasDotsStyle} />

            {workflowSteps.slice(0, -1).map((step, index) => {
              const nextStep = workflowSteps[index + 1];
              const isPathActive =
                !workflowFailed && (result ? true : index < activeStepIndex);
              const isPathRunning =
                !workflowFailed && loading && index === activeStepIndex;

              return (
                <div
                  key={`${step.id}-connector`}
                  style={{
                    position: 'absolute',
                    left: step.x + 138,
                    top: step.y + 42,
                    width: nextStep.x - (step.x + 138),
                    height: 3,
                    borderRadius: 999,
                    background: isPathActive
                      ? 'linear-gradient(90deg, rgba(99,220,142,0.85), rgba(120,242,165,0.65))'
                      : isPathRunning
                        ? 'linear-gradient(90deg, rgba(74,129,255,0.95), rgba(114,188,255,0.45))'
                        : 'rgba(142,154,195,0.22)',
                    boxShadow: isPathRunning
                      ? '0 0 14px rgba(74,129,255,0.35)'
                      : 'none',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      right: -7,
                      top: -4,
                      width: 0,
                      height: 0,
                      borderTop: '5px solid transparent',
                      borderBottom: '5px solid transparent',
                      borderLeft: `8px solid ${isPathActive
                        ? 'rgba(120,242,165,0.85)'
                        : isPathRunning
                          ? 'rgba(114,188,255,0.9)'
                          : 'rgba(142,154,195,0.3)'
                        }`,
                    }}
                  />
                </div>
              );
            })}

            {workflowSteps.map((step, index) => {
              const isCompleted =
                !workflowFailed && (result ? true : index < activeStepIndex);
              const isActive =
                !workflowFailed && loading && index === activeStepIndex;
              const isFailed = workflowFailed && index === activeStepIndex;

              return (
                <div
                  key={step.id}
                  style={{
                    ...workflowNodeStyle,
                    left: step.x,
                    top: step.y,
                    borderColor: isFailed
                      ? 'rgba(255,120,120,0.55)'
                      : isActive
                        ? 'rgba(83,142,255,0.72)'
                        : isCompleted
                          ? 'rgba(99,220,142,0.55)'
                          : 'rgba(205,214,255,0.18)',
                    background: isFailed
                      ? 'linear-gradient(180deg, rgba(64,18,28,0.95), rgba(28,15,22,0.98))'
                      : isActive
                        ? 'linear-gradient(180deg, rgba(29,35,74,0.98), rgba(18,19,38,0.98))'
                        : isCompleted
                          ? 'linear-gradient(180deg, rgba(19,42,40,0.96), rgba(14,20,28,0.98))'
                          : 'linear-gradient(180deg, rgba(34,31,48,0.98), rgba(20,20,31,0.98))',
                    boxShadow: isActive
                      ? '0 0 0 1px rgba(99,156,255,0.3) inset, 0 18px 40px rgba(16,20,44,0.45)'
                      : isCompleted
                        ? '0 0 0 1px rgba(99,220,142,0.15) inset, 0 16px 34px rgba(8,18,18,0.34)'
                        : '0 16px 34px rgba(5,8,20,0.32)',
                  }}
                >
                  <div
                    style={{
                      ...workflowNodeIconStyle,
                      background: isFailed
                        ? 'rgba(255,120,120,0.16)'
                        : isActive
                          ? 'rgba(83,142,255,0.18)'
                          : isCompleted
                            ? 'rgba(99,220,142,0.16)'
                            : 'rgba(255,255,255,0.06)',
                      color: isFailed
                        ? '#ff9f9f'
                        : isActive
                          ? '#9ebcff'
                          : isCompleted
                            ? '#8ff0b4'
                            : '#eef2ff',
                    }}
                  >
                    {step.icon}
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      right: -7,
                      top: 34,
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      background: isFailed
                        ? '#ff8d8d'
                        : isActive
                          ? '#7dacff'
                          : isCompleted
                            ? '#7ae9a6'
                            : 'rgba(215,220,255,0.5)',
                      boxShadow: '0 0 0 4px rgba(13,15,30,0.82)',
                    }}
                  />

                  <div style={{ fontWeight: 700, lineHeight: 1.2, fontSize: 15 }}>
                    {step.name}
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      lineHeight: 1.5,
                      opacity: 0.78,
                    }}
                  >
                    {step.detail}
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 11,
                      letterSpacing: 0.35,
                      textTransform: 'uppercase',
                      color: isFailed
                        ? '#ffb1b1'
                        : isActive
                          ? '#9ebcff'
                          : isCompleted
                            ? '#9bf4bc'
                            : 'rgba(226,231,255,0.65)',
                    }}
                  >
                    {isFailed
                      ? 'Failed'
                      : isActive
                        ? 'Running'
                        : isCompleted
                          ? 'Completed'
                          : 'Queued'}
                  </div>
                </div>
              );
            })}

            <div
              style={{
                position: 'absolute',
                left: 466,
                top: 220,
                display: 'flex',
                gap: 28,
                alignItems: 'flex-start',
              }}
            >
              <ToolBubble
                label="Prompt Logic"
                sublabel="Planner rules"
                accent="rgba(83,142,255,0.9)"
              />
              <ToolBubble
                label="Validation"
                sublabel="Retry + fallback"
                accent="rgba(99,220,142,0.85)"
              />
              <ToolBubble
                label="n8n Cloud"
                sublabel="Production webhook"
                accent="rgba(255,187,94,0.88)"
              />
            </div>
          </div>
        </div>
      </section>

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

function ToolBubble({
  label,
  sublabel,
  accent,
}: Readonly<{
  label: string;
  sublabel: string;
  accent: string;
}>) {
  return (
    <div
      style={{
        position: 'relative',
        width: 126,
        paddingTop: 18,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          margin: '0 auto',
          borderRadius: 999,
          border: '1px solid rgba(228,233,255,0.22)',
          background:
            'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.16), rgba(18,21,39,0.98) 72%)',
          display: 'grid',
          placeItems: 'center',
          boxShadow: `0 0 0 1px rgba(255,255,255,0.04) inset, 0 16px 32px rgba(0,0,0,0.28), 0 0 24px ${accent}22`,
          color: '#f5f7ff',
          fontWeight: 800,
          fontSize: 13,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            background: accent,
            boxShadow: `0 0 18px ${accent}`,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 13,
          fontWeight: 600,
          lineHeight: 1.35,
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 11,
          lineHeight: 1.4,
          opacity: 0.66,
        }}
      >
        {sublabel}
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: -2,
          width: 2,
          height: 18,
          marginLeft: -1,
          background: 'rgba(220,226,255,0.35)',
          borderRadius: 999,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: -8,
          width: 10,
          height: 10,
          marginLeft: -5,
          borderRadius: 999,
          background: 'rgba(220,226,255,0.72)',
          boxShadow: '0 0 0 4px rgba(13,15,30,0.8)',
        }}
      />
    </div>
  );
}

const panelBackground = 'rgba(7,10,18,0.55)';
const cardBorder = '1px solid rgba(255,255,255,0.12)';
const workflowCanvasStyle: React.CSSProperties = {
  position: 'relative',
  width: 1310,
  minWidth: 1310,
  height: 400,
  borderRadius: 24,
  overflow: 'hidden',
  border: '1px solid rgba(255,255,255,0.1)',
  background:
    'radial-gradient(circle at top left, rgba(63,57,104,0.42), rgba(8,10,18,0.98) 36%), linear-gradient(180deg, rgba(16,12,34,0.98), rgba(8,10,18,1))',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 48px rgba(0,0,0,0.3)',
};
const workflowCanvasDotsStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage:
    'radial-gradient(rgba(170,178,225,0.18) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
  opacity: 0.5,
};
const workflowNodeStyle: React.CSSProperties = {
  position: 'absolute',
  width: 138,
  minHeight: 118,
  borderRadius: 20,
  border: '1px solid rgba(255,255,255,0.16)',
  padding: '16px 16px 14px',
  color: '#f3f5ff',
};
const workflowNodeIconStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 12,
  display: 'grid',
  placeItems: 'center',
  marginBottom: 14,
  fontSize: 14,
  fontWeight: 800,
};

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
