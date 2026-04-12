import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { demoRemoteProps, type AccountProps } from "@micro/contracts";
import { AccountApp } from "./App";
import "./index.css";

const defaultProps: AccountProps = demoRemoteProps.account;

class AccountWidgetElement extends HTMLElement {
  private root: Root | null = null;
  private widgetProps: AccountProps = defaultProps;

  set props(value: AccountProps) {
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
        <AccountApp {...this.widgetProps} />
      </StrictMode>
    );
  }
}

if (!customElements.get("account-widget")) {
  customElements.define("account-widget", AccountWidgetElement);
}

const standaloneRoot = document.getElementById("root");
if (standaloneRoot) {
  createRoot(standaloneRoot).render(
    <StrictMode>
      <main className="acc-shell acc-min-h-screen acc-bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(15,118,110,0.18),transparent_26%),linear-gradient(180deg,#f8fafc_0%,#ecfeff_100%)] acc-px-6 acc-py-10">
        <section className="acc-mx-auto acc-max-w-6xl">
          <article className="acc-rounded-[28px] acc-border acc-border-slate-200 acc-bg-white/90 acc-p-6 acc-shadow-[0_22px_45px_rgba(15,23,42,0.12)] acc-backdrop-blur">
            <div className="acc-mb-5 acc-flex acc-items-start acc-justify-between acc-gap-4">
              <div>
                <p className="acc-text-sm acc-font-semibold acc-uppercase acc-tracking-[0.22em] acc-text-indigo-700">
                  Account
                </p>
                <h1 className="acc-mt-2 acc-text-2xl acc-font-semibold acc-text-slate-900">
                  Owns authenticated journeys, profile completion, and loyalty surfaces.
                </h1>
              </div>
              <a
                className="acc-rounded-full acc-border acc-border-slate-200 acc-px-4 acc-py-2 acc-text-sm acc-font-medium acc-text-slate-600 acc-transition hover:acc-border-indigo-700 hover:acc-text-indigo-700"
                href="http://localhost:3000/#microfrontends"
              >
                Open main shell
              </a>
            </div>
            <div className="acc-min-h-[260px] acc-rounded-[24px] acc-border acc-border-dashed acc-border-slate-200 acc-bg-slate-50 acc-p-4">
              <AccountApp {...defaultProps} />
            </div>
          </article>
        </section>
      </main>
    </StrictMode>
  );
}
