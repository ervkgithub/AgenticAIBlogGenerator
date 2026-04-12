"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { RemoteDefinition, RemoteWidgetMap } from "@micro/contracts";

const loadedScripts = new Map<string, Promise<void>>();

const loadScript = (scriptUrl: string): Promise<void> => {
  const existing = loadedScripts.get(scriptUrl);
  if (existing) {
    return existing;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Unable to load remote script ${scriptUrl}`));
    document.head.appendChild(script);
  });

  loadedScripts.set(scriptUrl, promise);
  return promise;
};

type MicrofrontendCardProps<K extends keyof RemoteWidgetMap> = {
  remote: RemoteDefinition<K>;
};

export function MicrofrontendCard<K extends keyof RemoteWidgetMap>({
  remote
}: MicrofrontendCardProps<K>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    loadScript(remote.scriptUrl)
      .then(() => {
        if (cancelled || !containerRef.current) {
          return;
        }

        const element = document.createElement(remote.tagName) as HTMLElement & {
          props?: RemoteWidgetMap[K];
        };
        element.props = remote.props;
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(element);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [remote]);

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-panel backdrop-blur">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">{remote.displayName}</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">{remote.description}</h2>
        </div>
        <a
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand hover:text-brand"
          href={remote.route}
          rel="noreferrer"
          target="_blank"
        >
          Open team app
        </a>
      </div>
      <div
        className={clsx(
          "min-h-[260px] rounded-[24px] border border-dashed p-4 transition",
          status === "error" ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-slate-50"
        )}
      >
        {status === "loading" && <p className="text-sm text-slate-500">Loading remote experience...</p>}
        {status === "error" && (
          <div className="space-y-2 text-sm text-rose-700">
            <p className="font-semibold">Remote unavailable</p>
            <p>
              Start the team app on <span className="font-mono">{remote.route}</span> and refresh the shell.
            </p>
          </div>
        )}
        <div className={status === "ready" ? "block" : "hidden"} ref={containerRef} />
      </div>
    </article>
  );
}
