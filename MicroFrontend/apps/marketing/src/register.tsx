import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { demoRemoteProps, type MarketingProps } from "@micro/contracts";
import { MarketingApp } from "./App";
import "./index.css";

const defaultProps: MarketingProps = demoRemoteProps.marketing;

class MarketingWidgetElement extends HTMLElement {
  private root: Root | null = null;
  private widgetProps: MarketingProps = defaultProps;

  set props(value: MarketingProps) {
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
        <MarketingApp {...this.widgetProps} />
      </StrictMode>
    );
  }
}

if (!customElements.get("marketing-widget")) {
  customElements.define("marketing-widget", MarketingWidgetElement);
}

const standaloneRoot = document.getElementById("root");
if (standaloneRoot) {
  createRoot(standaloneRoot).render(
    <StrictMode>
      <main className="mkt-shell mkt-min-h-screen mkt-bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(15,118,110,0.18),transparent_26%),linear-gradient(180deg,#f8fafc_0%,#ecfeff_100%)] mkt-px-6 mkt-py-10">
        <section className="mkt-mx-auto mkt-max-w-6xl">
          <article className="mkt-rounded-[28px] mkt-border mkt-border-slate-200 mkt-bg-white/90 mkt-p-6 mkt-shadow-[0_22px_45px_rgba(15,23,42,0.12)] mkt-backdrop-blur">
            <div className="mkt-mb-5 mkt-flex mkt-items-start mkt-justify-between mkt-gap-4">
              <div>
                <p className="mkt-text-sm mkt-font-semibold mkt-uppercase mkt-tracking-[0.22em] mkt-text-teal-700">
                  Marketing
                </p>
                <h1 className="mkt-mt-2 mkt-text-2xl mkt-font-semibold mkt-text-slate-900">
                  Owns hero messaging, announcements, and conversion funnels.
                </h1>
              </div>
              <a
                className="mkt-rounded-full mkt-border mkt-border-slate-200 mkt-px-4 mkt-py-2 mkt-text-sm mkt-font-medium mkt-text-slate-600 mkt-transition hover:mkt-border-teal-700 hover:mkt-text-teal-700"
                href="http://localhost:3000/#microfrontends"
              >
                Open main shell
              </a>
            </div>
            <div className="mkt-min-h-[260px] mkt-rounded-[24px] mkt-border mkt-border-dashed mkt-border-slate-200 mkt-bg-slate-50 mkt-p-4">
              <MarketingApp {...defaultProps} />
            </div>
          </article>
        </section>
      </main>
    </StrictMode>
  );
}
