"use client";

import { LuMoon, LuSun } from "react-icons/lu";

/** Switches between the dark (default) and light theme and remembers the choice. */
export default function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    if (next === "light") root.dataset.theme = "light";
    else delete root.dataset.theme;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage unavailable (private mode): the choice just won't persist.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className="ripple-host group grid size-10 place-items-center rounded-xl border border-line text-subtle transition-[color,border-color,scale] duration-200 hover:border-brand/50 hover:text-fg active:scale-[0.94]"
    >
      <LuSun aria-hidden className="size-[1.1rem] transition-transform duration-500 group-hover:rotate-90 light:hidden" />
      <LuMoon aria-hidden className="hidden size-[1.1rem] transition-transform duration-500 group-hover:-rotate-12 light:block" />
    </button>
  );
}
