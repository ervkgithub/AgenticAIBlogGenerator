import type { MarketingProps } from "@micro/contracts";

export function MarketingApp({
  headline,
  supportingCopy,
  primaryActionHref,
  primaryActionLabel,
  featuredHighlights
}: MarketingProps) {
  return (
    <section className="mkt-shell mkt-marketing-surface mkt-flex mkt-h-full mkt-min-h-[260px] mkt-flex-col mkt-rounded-[26px] mkt-p-6 mkt-shadow-card">
      <p className="mkt-text-xs mkt-font-semibold mkt-uppercase mkt-tracking-[0.28em] mkt-text-emerald-200">
        Marketing Team
      </p>
      <h3 className="mkt-mt-4 mkt-max-w-xl mkt-text-3xl mkt-font-semibold mkt-leading-tight">{headline}</h3>
      <p className="mkt-mt-4 mkt-max-w-2xl mkt-text-sm mkt-leading-7 mkt-text-emerald-50/90">{supportingCopy}</p>
      <div className="mkt-mt-6 mkt-flex mkt-flex-wrap mkt-gap-3">
        <a
          className="mkt-inline-flex mkt-items-center mkt-rounded-full mkt-bg-white mkt-px-5 mkt-py-3 mkt-text-sm mkt-font-semibold mkt-text-slate-900 mkt-transition hover:mkt-bg-emerald-100"
          href={primaryActionHref}
        >
          {primaryActionLabel}
        </a>
        <span className="mkt-inline-flex mkt-items-center mkt-rounded-full mkt-border mkt-border-white/20 mkt-px-5 mkt-py-3 mkt-text-sm mkt-text-emerald-100">
          Campaign release train healthy
        </span>
      </div>
      <div className="mkt-mt-8 mkt-grid mkt-flex-1 mkt-gap-3 md:mkt-grid-cols-3">
        {featuredHighlights.map((highlight) => (
          <div className="mkt-marketing-highlight mkt-rounded-2xl mkt-p-4 mkt-backdrop-blur" key={highlight}>
            <p className="mkt-text-sm mkt-leading-6 mkt-text-white/90">{highlight}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
