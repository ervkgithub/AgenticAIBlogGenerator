import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { demoRemoteProps, type CheckoutProps } from "@micro/contracts";
import { CheckoutApp } from "./App";
import "./index.css";

const defaultProps: CheckoutProps = demoRemoteProps.checkout;

class CheckoutWidgetElement extends HTMLElement {
  private root: Root | null = null;
  private widgetProps: CheckoutProps = defaultProps;

  set props(value: CheckoutProps) {
    this.widgetProps = value;
    this.renderApp();
  }

  connectedCallback() {
    this.renderApp();
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
  }

  private renderApp() {
    if (!this.root) {
      this.root = createRoot(this);
    }

    this.root.render(
      <StrictMode>
        <CheckoutApp {...this.widgetProps} />
      </StrictMode>
    );
  }
}

if (!customElements.get("checkout-widget")) {
  customElements.define("checkout-widget", CheckoutWidgetElement);
}

const standaloneRoot = document.getElementById("root");
if (standaloneRoot) {
  createRoot(standaloneRoot).render(
    <StrictMode>
      <main className="chk-shell chk-min-h-screen chk-bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(15,118,110,0.18),transparent_26%),linear-gradient(180deg,#f8fafc_0%,#ecfeff_100%)] chk-px-6 chk-py-10">
        <section className="chk-mx-auto chk-max-w-6xl">
          <article className="chk-rounded-[28px] chk-border chk-border-slate-200 chk-bg-white/90 chk-p-6 chk-shadow-[0_22px_45px_rgba(15,23,42,0.12)] chk-backdrop-blur">
            <div className="chk-mb-5 chk-flex chk-items-start chk-justify-between chk-gap-4">
              <div>
                <p className="chk-text-sm chk-font-semibold chk-uppercase chk-tracking-[0.22em] chk-text-orange-700">
                  Checkout
                </p>
                <h1 className="chk-mt-2 chk-text-2xl chk-font-semibold chk-text-slate-900">
                  Owns trust, payments, and order confidence messaging.
                </h1>
              </div>
              <a
                className="chk-rounded-full chk-border chk-border-slate-200 chk-px-4 chk-py-2 chk-text-sm chk-font-medium chk-text-slate-600 chk-transition hover:chk-border-orange-700 hover:chk-text-orange-700"
                href="http://localhost:3000/#microfrontends"
              >
                Open main shell
              </a>
            </div>
            <div className="chk-min-h-[260px] chk-rounded-[24px] chk-border chk-border-dashed chk-border-slate-200 chk-bg-slate-50 chk-p-4">
              <CheckoutApp {...defaultProps} />
            </div>
          </article>
        </section>
      </main>
    </StrictMode>
  );
}
