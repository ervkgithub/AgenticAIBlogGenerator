import type { AccountProps } from "@micro/contracts";

export function AccountApp({ userName, tier, completionRate, nextBestActions }: AccountProps) {
  return (
    <section className="acc-shell acc-flex acc-h-full acc-min-h-[260px] acc-flex-col acc-rounded-[26px] acc-bg-slate-950 acc-p-6 acc-text-white">
      <div className="acc-flex acc-items-start acc-justify-between acc-gap-4">
        <div>
          <p className="acc-text-xs acc-font-semibold acc-uppercase acc-tracking-[0.24em] acc-text-indigo-300">
            Account Team
          </p>
          <h3 className="acc-mt-3 acc-text-2xl acc-font-semibold">Welcome back, {userName}</h3>
        </div>
        <span className="acc-rounded-full acc-bg-indigo-500/20 acc-px-4 acc-py-2 acc-text-sm acc-font-medium acc-text-indigo-200">
          {tier} tier
        </span>
      </div>
      <div className="acc-mt-6 acc-rounded-2xl acc-bg-white/5 acc-p-5">
        <div className="acc-flex acc-items-center acc-justify-between">
          <p className="acc-text-sm acc-text-slate-300">Profile completion</p>
          <p className="acc-text-sm acc-font-semibold acc-text-white">{completionRate}%</p>
        </div>
        <div className="acc-progress-track acc-mt-3 acc-h-3 acc-overflow-hidden acc-rounded-full">
          <div className="acc-progress-fill acc-h-full acc-rounded-full" style={{ width: `${completionRate}%` }} />
        </div>
      </div>
      <div className="acc-mt-6 acc-grid acc-flex-1 acc-gap-3">
        {nextBestActions.map((action) => (
          <div className="acc-rounded-2xl acc-border acc-border-white/10 acc-bg-white/5 acc-p-4" key={action}>
            <p className="acc-text-sm acc-leading-6 acc-text-slate-100">{action}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
