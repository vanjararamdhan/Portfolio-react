"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __motionReady?: boolean;
  }
}

/**
 * Scroll reveal, wired once: an IntersectionObserver marks [data-reveal] with [data-shown]; a
 * MutationObserver picks up nodes React/HMR swaps in, so nothing can stay hidden.
 */
export default function Effects() {
  useEffect(() => {
    window.__motionReady = true;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    const observeIn = (scope: ParentNode) =>
      scope.querySelectorAll("[data-reveal]:not([data-shown])").forEach((el) => io.observe(el));
    observeIn(document);
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations)
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]:not([data-shown])")) io.observe(node);
          observeIn(node);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
