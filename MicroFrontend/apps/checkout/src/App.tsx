import { currencyFormatter, type CheckoutProps } from "@micro/contracts";

export function CheckoutApp({ cartCount, subtotal, shippingEta, trustSignals }: CheckoutProps) {
  return (
    <section className="chk-shell chk-flex chk-h-full chk-min-h-[260px] chk-flex-col chk-rounded-[26px] chk-bg-orange-50 chk-p-6">
      <div className="chk-flex chk-items-start chk-justify-between chk-gap-4">
        <div>
          <p className="chk-text-xs chk-font-semibold chk-uppercase chk-tracking-[0.24em] chk-text-orange-700">
            Checkout Team
          </p>
          <h3 className="chk-mt-3 chk-text-2xl chk-font-semibold chk-text-slate-900">
            {cartCount} items ready to ship
          </h3>
        </div>
        <span className="chk-rounded-full chk-bg-white chk-px-4 chk-py-2 chk-text-sm chk-font-semibold chk-text-orange-700">
          {shippingEta}
        </span>
      </div>
      <div className="chk-mt-6 chk-rounded-2xl chk-bg-white chk-p-5">
        <p className="chk-text-sm chk-text-slate-500">Estimated subtotal</p>
        <p className="chk-mt-2 chk-text-4xl chk-font-semibold chk-text-slate-900">{currencyFormatter.format(subtotal)}</p>
      </div>
      <div className="chk-mt-6 chk-grid chk-flex-1 chk-gap-3 md:chk-grid-cols-3">
        {trustSignals.map((signal) => (
          <div className="chk-rounded-2xl chk-border chk-border-orange-100 chk-bg-white/80 chk-p-4" key={signal}>
            <p className="chk-text-sm chk-leading-6 chk-text-slate-700">{signal}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
