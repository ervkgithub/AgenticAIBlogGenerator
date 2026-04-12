import { MicrofrontendShowcase } from "../components/MicrofrontendShowcase";

const pillars = [
  "Independent teams own isolated deployable frontends.",
  "The shell enforces shared contracts, governance, and composition rules.",
  "Each remote stays reusable, testable, and easy to evolve without cross-team coupling."
];

export default function HomePage() {
  return (
    <main className="bg-hero">
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-10 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[36px] border border-white/50 bg-white/80 p-8 shadow-panel backdrop-blur sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Microfrontend Reference</p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                A production-minded example with a Next.js shell and independently owned React apps
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                This demo shows how multiple frontend teams can ship features separately while still presenting one
                cohesive product. The host composes four remotes that can be developed, tested, and deployed on their
                own lifecycles.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {pillars.map((pillar) => (
                  <div className="rounded-[24px] border border-slate-200 bg-white p-4" key={pillar}>
                    <p className="text-sm leading-6 text-slate-600">{pillar}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[30px] bg-ink p-6 text-slate-100">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-300">Architecture</p>
              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
                <p>
                  `apps/shell` is the orchestration layer. It owns routing, layout, security guardrails, and cross-app
                  composition.
                </p>
                <p>
                  Each remote is a standalone React app exposing one web component bundle, which keeps team boundaries
                  explicit and deployment-friendly.
                </p>
                <p>
                  Shared TypeScript contracts live in `packages/contracts` so integration remains predictable and
                  strongly typed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-8 lg:px-10" id="microfrontends">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent">Composed Experiences</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">Four teams, one seamless storefront</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            In local development each remote runs on its own port, so teams can iterate independently without waiting on
            the full platform build.
          </p>
        </div>
        <MicrofrontendShowcase />
      </section>
    </main>
  );
}
