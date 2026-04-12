import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { demoRemoteProps, type CatalogProps } from "@micro/contracts";
import { CatalogApp } from "./App";
import "./index.css";

const defaultProps: CatalogProps = demoRemoteProps.catalog;

class CatalogWidgetElement extends HTMLElement {
  private root: Root | null = null;
  private widgetProps: CatalogProps = defaultProps;

  set props(value: CatalogProps) {
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
        <CatalogApp {...this.widgetProps} />
      </StrictMode>
    );
  }
}

if (!customElements.get("catalog-widget")) {
  customElements.define("catalog-widget", CatalogWidgetElement);
}

const standaloneRoot = document.getElementById("root");
if (standaloneRoot) {
  createRoot(standaloneRoot).render(
    <StrictMode>
      <main className="cat-shell cat-min-h-screen cat-bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(15,118,110,0.18),transparent_26%),linear-gradient(180deg,#f8fafc_0%,#ecfeff_100%)] cat-px-6 cat-py-10">
        <section className="cat-mx-auto cat-max-w-6xl">
          <article className="cat-rounded-[28px] cat-border cat-border-slate-200 cat-bg-white/90 cat-p-6 cat-shadow-[0_22px_45px_rgba(15,23,42,0.12)] cat-backdrop-blur">
            <div className="cat-mb-5 cat-flex cat-items-start cat-justify-between cat-gap-4">
              <div>
                <p className="cat-text-sm cat-font-semibold cat-uppercase cat-tracking-[0.22em] cat-text-cyan-700">
                  Catalog
                </p>
                <h1 className="cat-mt-2 cat-text-2xl cat-font-semibold cat-text-slate-900">
                  Owns discovery, merchandising, and inventory-rich experiences.
                </h1>
              </div>
              <a
                className="cat-rounded-full cat-border cat-border-slate-200 cat-px-4 cat-py-2 cat-text-sm cat-font-medium cat-text-slate-600 cat-transition hover:cat-border-cyan-700 hover:cat-text-cyan-700"
                href="http://localhost:3000/#microfrontends"
              >
                Open main shell
              </a>
            </div>
            <div className="cat-min-h-[260px] cat-rounded-[24px] cat-border cat-border-dashed cat-border-slate-200 cat-bg-slate-50 cat-p-4">
              <CatalogApp {...defaultProps} />
            </div>
          </article>
        </section>
      </main>
    </StrictMode>
  );
}
