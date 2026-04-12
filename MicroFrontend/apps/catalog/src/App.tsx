import { currencyFormatter, type CatalogProps } from "@micro/contracts";

export function CatalogApp({ sectionTitle, items }: CatalogProps) {
  return (
    <section className="cat-shell cat-flex cat-h-full cat-min-h-[260px] cat-flex-col cat-rounded-[26px] cat-bg-white cat-p-6">
      <div className="cat-flex cat-items-start cat-justify-between cat-gap-4">
        <div>
          <p className="cat-text-xs cat-font-semibold cat-uppercase cat-tracking-[0.24em] cat-text-cyan-700">
            Catalog Team
          </p>
          <h3 className="cat-mt-3 cat-text-2xl cat-font-semibold cat-text-slate-900">{sectionTitle}</h3>
        </div>
        <span className="cat-rounded-full cat-bg-cyan-50 cat-px-4 cat-py-2 cat-text-xs cat-font-medium cat-text-cyan-700">
          Inventory synced
        </span>
      </div>
      <div className="cat-mt-6 cat-grid cat-flex-1 cat-gap-4">
        {items.map((item) => (
          <article className="cat-rounded-2xl cat-border cat-border-slate-200 cat-p-4" key={item.id}>
            <div className="cat-flex cat-items-start cat-justify-between cat-gap-4">
              <div>
                <p className="cat-text-sm cat-font-semibold cat-text-slate-900">{item.name}</p>
                <p className="cat-mt-1 cat-text-sm cat-text-slate-500">{item.category}</p>
              </div>
              <span
                className={`cat-rounded-full cat-px-3 cat-py-1 cat-text-xs cat-font-semibold ${
                  item.trend === "up" ? "cat-bg-emerald-50 cat-text-emerald-700" : "cat-bg-slate-100 cat-text-slate-600"
                }`}
              >
                {item.trend === "up" ? "Trending up" : "Stable demand"}
              </span>
            </div>
            <div className="cat-mt-5 cat-flex cat-items-center cat-justify-between">
              <span className="cat-text-xl cat-font-semibold cat-text-slate-900">{currencyFormatter.format(item.price)}</span>
              <button className="cat-rounded-full cat-bg-slate-900 cat-px-4 cat-py-2 cat-text-sm cat-font-medium cat-text-white transition hover:cat-bg-cyan-700">
                View details
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
