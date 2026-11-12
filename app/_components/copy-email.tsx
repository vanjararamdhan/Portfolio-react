"use client";

import { useEffect, useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

/** Copies an email address to the clipboard, with a short confirmation. */
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure context or permissions): the mailto link still works.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="label inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 transition-colors hover:border-fg/50 hover:text-fg"
    >
      {copied ? <LuCheck aria-hidden className="size-3.5 text-live" /> : <LuCopy aria-hidden className="size-3.5" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
