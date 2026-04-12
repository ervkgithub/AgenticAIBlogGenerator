"use client";

import { useEffect, useState } from "react";
import { MicrofrontendCard } from "./MicrofrontendCard";
import { remoteDefinitions } from "../lib/microfrontends";

export function MicrofrontendShowcase() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <article
            className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-panel backdrop-blur"
            key={index}
          >
            <div className="min-h-[260px] animate-pulse rounded-[24px] bg-slate-100" />
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {remoteDefinitions.map((remote) => (
        <MicrofrontendCard key={remote.key} remote={remote} />
      ))}
    </div>
  );
}
