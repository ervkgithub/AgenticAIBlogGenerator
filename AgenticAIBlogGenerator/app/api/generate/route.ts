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

type ContentPackage = Record<string, unknown> & {
  generatedAt?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  metaDescription?: string;
  keywords?: string[];
  viralHook?: string;
  linkedinCaption?: string;
  linkedinHashtags?: string[];
  coverImagePrompt?: string;
  architectureSnapshot?: string;
  contentMarkdown?: string;
};

function s(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function a(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean)
    : [];
}

function uniq<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function rng(seed: number) {
  let value = seed || 1;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(next: () => number, items: T[]): T {
  return items[Math.floor(next() * items.length)] ?? items[0];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function plain(markdown: string): string {
  return markdown
    .replace(/^#+\s+/gm, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[>*_#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function termsFrom(text: string): string[] {
  const stop = new Set([
    'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'your', 'about',
    'will', 'than', 'then', 'they', 'them', 'their', 'how', 'why', 'what', 'most',
    'does', 'well', 'more', 'like', 'when', 'where', 'which', 'one', 'can',
  ]);

  return uniq(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stop.has(word)),
  );
}

function pascal(value: string): string {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

function enhanceContentPackage(
  input: GenerateRequest,
  raw: Record<string, unknown>,
): ContentPackage {
  const pkg = raw as ContentPackage;
  const topic = s(input.topic, s(pkg.title, 'AI System Design'));
  const audience = s(input.audience, 'Founders, hiring managers, and product teams');
  const tone = s(input.tone, 'Sharp, credible, implementation-first');
  const goal = s(
    input.goal,
    'Show the difference between systems that demo well and systems that survive production.',
  );
  const proofPoints = s(
    input.proofPoints,
    'I have built agentic systems that generate, validate, and package content across blog and social in a single pipeline with failure isolation, structured outputs, and retry logic.',
  );
  const systemExample = s(
    input.systemExample,
    'Input -> planner -> generator -> validator -> formatter -> output.',
  );
  const seed = hashSeed(`${topic}|${s(pkg.generatedAt, new Date().toISOString())}|${systemExample}`);
  const next = rng(seed);
  const lower = `${topic} ${systemExample}`.toLowerCase();
  const profile = /(security|attack|exploit|frontend|browser|auth|client-side|deepfake)/.test(lower)
    ? {
        artifact: 'defensePlan',
        arch: 'Signal intake -> threat triage -> exploit analysis -> mitigation check -> response output',
        market: ['Frontend security is no longer just a checklist problem.', 'Client-side trust is now part of the attack surface.', 'AI-assisted attacks changed how interface trust has to be defended.'],
        fail: ['Most teams defend endpoints while underestimating the browser.', 'Weak frontend defenses break when trust signals are easy to fake.', 'The dangerous gap is usually between what the UI implies and what the system verifies.'],
        contract: ['The system only works if each layer passes forward something the next layer can actually trust.', 'Detection, verification, and mitigation need cleaner boundaries than most teams give them.'],
      }
    : /(coding|editor|cursor|developer|code|ide|copilot|programming)/.test(lower)
      ? {
          artifact: 'patch',
          arch: 'Context intake -> task planner -> code generator -> compile/test check -> trust scorer -> diff output',
          market: ['Coding tools are being judged by trust, not just speed.', 'The editor battle is now about cognitive load and reliability.', 'Developer tooling only feels magical until reviewability becomes the requirement.'],
          fail: ['Most coding assistants look strong in isolated prompts but degrade once repository context expands.', 'The real breakage comes from weak verification, not weak autocomplete.', 'Developer trust collapses when fast output becomes expensive to review.'],
          contract: ['Planning, generation, and verification have to divide responsibility cleanly.', 'The workflow becomes useful only when every stage returns something the next stage can trust.'],
        }
      : /(seo|content|blog|linkedin|caption|copywriting|marketing|social)/.test(lower)
        ? {
            artifact: 'draft',
            arch: 'Topic intake -> angle planner -> draft builder -> structure validator -> distribution formatter -> publishing package',
            market: ['Content systems are now judged by asset quality, not just draft speed.', 'The winning content systems turn one idea into a reusable package.', 'The shift is from raw generation toward structured publishing workflows.'],
            fail: ['Most content pipelines break when repurposing starts, not when drafting starts.', 'Volume is easy. Structural quality under repetition is harder.', 'The weakest systems produce output that looks usable but cannot be packaged well.'],
            contract: ['Planning, drafting, validation, and packaging each need a clean role.', 'A content system fails fast when every stage tries to do everything at once.'],
          }
        : {
            artifact: 'response',
            arch: 'Input normalization -> orchestration planner -> execution stage -> validator -> formatter -> API response',
            market: ['The market is shifting from novelty toward operating discipline.', 'Systems are now judged by whether they survive real constraints.', 'Execution quality matters more once multiple stages are involved.'],
            fail: ['Most systems fail at handoffs, not at the first output.', 'Weak systems hide too much responsibility inside one step.', 'The biggest issue is usually structure, not raw capability.'],
            contract: ['The quality of the handoff matters as much as the quality of the output.', 'A multi-stage system only works when each layer returns something dependable.'],
          };

  const title = s(pkg.title, `${topic}: What Actually Holds Up In Production`);
  const hook = pick(next, [
    s(pkg.viralHook, ''),
    `Most ${topic} demos look stronger than the production system behind them.`,
    `The hard part of ${topic} is not the first result. It is what happens after trust becomes necessary.`,
    `Most teams talk about ${topic} like a feature problem. In practice, it behaves like a systems problem.`,
  ].filter(Boolean));
  const architectureSnapshot = s(
    pkg.architectureSnapshot,
    systemExample.includes('->')
      ? `${systemExample.split('.').map((part) => part.trim()).find((part) => part.includes('->')) ?? profile.arch}\nFallback path: targeted retry -> retry cap -> safe fallback output`
      : `${profile.arch}\nFallback path: targeted retry -> retry cap -> safe fallback output`,
  );

  const terms = uniq([...termsFrom(topic), ...termsFrom(systemExample), ...a(pkg.keywords)]).slice(0, 8);
  const primary = pascal(terms[0] || topic.split(':')[0] || 'System');
  const beforeRate = 27 + Math.floor(next() * 19);
  const afterRate = 3 + Math.floor(next() * 7);
  const latencyGain = 16 + Math.floor(next() * 24);
  const showSnippet = /(api|workflow|automation|validator|editor|security|code|developer)/.test(lower);
  const snippet = showSnippet
    ? [
        '```ts',
        'let retryCount = 0;',
        '',
        `while (!isValid${primary}(${profile.artifact}) && retryCount < MAX_RETRIES) {`,
        `  ${profile.artifact} = await regenerate${primary}(${profile.artifact});`,
        '  retryCount++;',
        '}',
        '',
        `if (!isValid${primary}(${profile.artifact})) {`,
        `  return fallback${primary}Template();`,
        '}',
        '```',
      ].join('\n')
    : '';

  const markdown = [
    `# ${title}`,
    `> ${hook}`,
    '',
    `${topic} becomes far more interesting once the surface-level demo is removed and the real operating pressure shows up.`,
    '',
    pick(next, [
      `This piece takes a ${tone.toLowerCase()} view of ${topic}: what changes when the workflow has to survive real users, real ambiguity, and real failure modes.`,
      `For ${audience}, the useful question is not whether ${topic} can look impressive once. It is whether the surrounding system can keep it reliable.`,
      `The real story in ${topic} is rarely the first output. It is the structure around that output and whether the system keeps holding shape when conditions get messy.`,
    ]),
    '',
    `## ${pick(next, ['Why This Space Is Shifting', 'The Shift Happening Around This Problem', `What Changed For ${primary}`])}`,
    pick(next, profile.market),
    `${topic} matters because the upside is meaningful, but the operating burden grows quickly once trust, validation, and handoffs become part of the same system.`,
    '',
    `## ${pick(next, ['Where Most Teams Break It', 'Why Good Demos Still Fail', `The Hidden Failure Modes In ${primary}`])}`,
    pick(next, profile.fail),
    pick(next, [
      `For ${topic}, the pressure usually appears after the first impressive output. That is when validation, state, retries, and reviewability stop being optional and start becoming the product.`,
      `The weak point is usually not the first result. It is the stage after that result, when another layer has to trust it without guessing.`,
      `Once ${topic} moves past the happy path, structure becomes more important than surface polish.`,
    ]),
    pick(next, [
      `Better ${topic} models will not fix a weak operating structure. Better system boundaries will.`,
      `More power does not automatically create better outcomes in ${topic}. Better workflow discipline does.`,
      `The edge in ${topic} is usually structural, not cosmetic.`,
    ]),
    '',
    `## ${pick(next, ['A Practical System Model', 'A Mental Model Worth Trusting', `A Delivery Shape For ${primary}`])}`,
    '```text',
    architectureSnapshot,
    '```',
    `A grounded example looks like this: ${systemExample}`,
    pick(next, [
      `The important move here is separation of responsibility. One layer narrows intent, one produces the working ${profile.artifact}, one checks it, and one packages it for the next consumer.`,
      `This structure matters because the early stages reduce ambiguity, the middle stage produces the working ${profile.artifact}, and the later stages decide whether that ${profile.artifact} is trustworthy enough to ship.`,
      `That division of labor is what prevents the whole system from collapsing into one large, unreviewable generation step.`,
    ]),
    '',
    `## ${pick(next, ['How The Layers Stay Aligned', 'How Responsibility Moves Through The System', 'How The Stages Coordinate'])}`,
    pick(next, profile.contract),
    `- Planning should narrow the problem before the main ${profile.artifact} is generated.`,
    `- Generation should focus on producing the ${profile.artifact} instead of pretending to also be validator and formatter.`,
    '- Validation should test structure, drift, and whether the output is safe enough to trust.',
    '- Formatting should make the result usable for the next human or system immediately.',
    pick(next, [
      `That contract-first mindset is what makes ${topic} feel dependable instead of lucky.`,
      `This is where ${topic} stops behaving like a one-off trick and starts behaving like a system.`,
      `Once the handoff rules are clear, the whole workflow becomes easier to trust and extend.`,
    ]),
    '',
    `## ${pick(next, ['Failure Handling That Actually Matters', 'What Recovery Looks Like In Practice', 'How The System Behaves Under Stress'])}`,
    pick(next, [
      `The hardest failures in ${topic} usually do not arrive as dramatic crashes. They arrive as subtle outputs that look acceptable until the next stage depends on them.`,
      `This is the part weak articles usually skip. In practice, recovery logic is often the difference between a believable system and a fragile one.`,
      `Most systems are judged by how they recover, not by how they perform when nothing goes wrong.`,
    ]),
    `- If ${profile.artifact} validation fails, regenerate only the weak section instead of restarting the entire ${topic} flow.`,
    `- If retry limits are reached, return a safe fallback ${profile.artifact} rather than an inconsistent output.`,
    `- If latency spikes, simplify optional enrichment before compromising the core ${profile.artifact}.`,
    '- If state becomes ambiguous, prefer explicit stage outputs over hidden assumptions.',
    pick(next, [
      `That pattern earns trust because ${topic} no longer depends on one perfect pass.`,
      `That recovery shape matters because it lowers the cost of failure instead of pretending failure will disappear.`,
      `The system feels more senior the moment failure stops destroying the whole chain.`,
    ]),
    snippet,
    '',
    `## ${pick(next, ['Proof Through System Behavior', 'What This Actually Proves', 'Why This Reads Like Delivery Work'])}`,
    `That matters because ${proofPoints}`,
    pick(next, [
      `In one comparable ${topic} workflow, unstable outputs showed up in roughly ${beforeRate}% of runs before a proper verification layer existed. After targeted retries and stronger checks, that dropped closer to ${afterRate}%, and the workflow stopped wasting full reruns on every weak stage.`,
      `A useful benchmark here is recovery cost. In a similar system, validation plus targeted retries improved effective delivery speed by about ${latencyGain}% because only the risky part had to be regenerated.`,
      `On one similar delivery pattern, structure drift created failure pressure in roughly ${beforeRate}% of outputs before stage-level validation existed. Recovery logic brought that down toward ${afterRate}% by isolating the weak step instead of restarting everything.`,
    ]),
    `When ${topic} can be explained through architecture, output contracts, validation logic, and fallback behavior, it stops sounding like commentary and starts sounding like proof.`,
    '',
    '## Why This Matters',
    pick(next, [
      `This is the difference between ${topic} systems that demo well and ${topic} systems that survive production.`,
      `Once the novelty wears off, this is what clients, employers, and product leaders are actually evaluating in ${topic}.`,
      `The commercial value of ${topic} shows up when the workflow survives ambiguity, imperfect inputs, and operational drift.`,
    ]),
    goal,
    '',
    `## ${pick(next, ['A Delivery Pattern That Scales', 'One Practical Shipping Pattern', 'A Realistic Production Flow'])}`,
    pick(next, [
      'Normalize the input before any execution starts.',
      'Plan the structure before expanding the core artifact.',
      `Generate the ${profile.artifact} with clear responsibility boundaries.`,
      'Validate for duplication, completeness, and drift.',
      `Package the validated ${profile.artifact} into downstream-ready assets.`,
    ]).toString(),
    `- Normalize the input before any execution starts.`,
    `- Plan the structure before expanding the core artifact.`,
    `- Generate the ${profile.artifact} with clear responsibility boundaries.`,
    `- Validate for duplication, structure, completeness, and drift.`,
    `- Package the validated ${profile.artifact} into downstream-ready assets.`,
    queries.length ? `Useful adjacent angles for follow-up content include: ${queries.join(', ')}.` : '',
    '',
    '## FAQ',
    `### What separates strong ${primary} writing from generic writing?`,
    pick(next, [
      `It makes the operating logic visible. Strong writing shows where ${topic} breaks, how it recovers, and why the system design choices exist.`,
      `It focuses on structure, recovery, and trust instead of hiding behind polished abstraction.`,
      `It reads like system judgment, not like trend commentary.`,
    ]),
    `### What do serious buyers or employers notice first in ${primary} work?`,
    pick(next, [
      'They notice whether the work reflects real judgment: handoff clarity, validation logic, recovery design, and business relevance.',
      'They care about whether the writer understands what happens after the first result, not just how to get the first result.',
      'They are looking for evidence that the author understands trust, structure, and operating pressure.',
    ]),
    `### What should a hiring-magnet article about ${primary} prove?`,
    pick(next, [
      `It should prove that the author understands how ${topic} behaves as a real system, not just as an idea.`,
      'It should make the reader feel they are hearing from a builder instead of a commentator.',
      'It should connect architecture, failure handling, and business value in one coherent story.',
    ]),
    '',
    '## Final Takeaway',
    cta,
  ]
    .filter(Boolean)
    .join('\n\n');

  const keywords = uniq([
    ...a(pkg.keywords),
    ...termsFrom(topic).slice(0, 6).map(pascal),
  ]).slice(0, 10);

  return {
    ...pkg,
    title,
    slug: s(pkg.slug, slugify(title)),
    excerpt: plain(markdown).slice(0, 220).trim(),
    metaDescription: plain(markdown).slice(0, 155).trim(),
    keywords,
    viralHook: hook,
    architectureSnapshot,
    linkedinHashtags: uniq(
      keywords.map((item) => `#${pascal(item)}`).filter((item) => item.length <= 29),
    ).slice(0, 10),
    linkedinCaption: [
      hook,
      '',
      `What makes ${topic} interesting is not the first result. It is whether the workflow keeps holding shape after trust, review, and recovery become part of the equation.`,
      '',
      'A few things this piece makes concrete:',
      `- where ${primary.toLowerCase()} breaks first`,
      '- how a stronger operating model changes the quality of the output',
      '- why validation, retries, and packaging matter more than most teams expect',
      '',
      goal,
      '',
      `Article title: ${title}`,
    ].join('\n'),
    coverImagePrompt:
      s(pkg.coverImagePrompt) ||
      `Create a premium editorial technology cover image for "${title}". Visual direction: clean enterprise design, subtle system-diagram energy, strong hierarchy, modern interface cues, and a polished product-operator aesthetic.`,
    contentMarkdown: markdown,
  };
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

    try {
      return NextResponse.json(enhanceContentPackage(body, unwrapped), {
        status: 200,
      });
    } catch (enhanceErr) {
      const message =
        enhanceErr instanceof Error
          ? enhanceErr.message
          : 'Post-processing failed';

      return NextResponse.json(
        {
          ...unwrapped,
          enhancementWarning: message,
        },
        { status: 200 },
      );
    }
  } catch (err) {
    const isAbort =
      typeof err === 'object' &&
      err !== null &&
      'name' in err &&
      (err as { name?: string }).name === 'AbortError';
    const message = err instanceof Error ? err.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: isAbort ? 'Webhook request timed out' : 'Failed to call n8n webhook',
        details: { message },
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}

