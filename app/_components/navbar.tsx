"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LuArrowUpRight, LuMenu, LuX } from "react-icons/lu";
import { navItems, profile } from "../_data/portfolio";
import ThemeToggle from "./theme-toggle";
import { ButtonLink, Container, vars } from "./ui";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // The section crossing the upper third of the viewport is "current".
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1280 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`nav-drop fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-brand/15 bg-bg/75 shadow-[0_10px_30px_-18px_rgb(139_92_246/0.45)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-brand focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Container className={`flex items-center justify-between gap-4 transition-[height] duration-300 ${scrolled ? "h-14" : "h-16"}`}>
        <Link href="/#home" className="flex items-center gap-2.5" aria-label={`${profile.name}, back to top`}>
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-dark font-mono text-xs font-bold text-white shadow-[0_0_16px_-2px_rgb(139_92_246/0.6)]"
          >
            RV
          </span>
          <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-fg">{profile.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="nav-stagger flex items-center gap-1">
            {navItems.map(({ id, label }, i) => (
              <li key={id} style={vars({ "--i": i })}>
                <a
                  href={`/#${id}`}
                  aria-current={active === id ? "location" : undefined}
                  className={`group relative rounded-md px-3 py-2 text-sm transition-colors duration-300 ${
                    active === id ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-3 -bottom-px h-px origin-center bg-gradient-to-r from-brand via-accent to-brand shadow-[0_0_8px_rgb(139_92_246/0.8)] transition-[scale,opacity] duration-300 ${
                      active === id ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-60"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span className="hidden sm:block">
            <ButtonLink href="/#contact" variant="secondary" className="min-h-9! whitespace-nowrap px-3.5!">
              Let&apos;s Connect
              <LuArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </ButtonLink>
          </span>
          <button
            type="button"
            className="ripple-host grid size-10 place-items-center rounded-xl border border-line text-fg transition-colors hover:border-brand/50 active:scale-[0.97] xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <LuX className="size-5" aria-hidden /> : <LuMenu className="size-5" aria-hidden />}
          </button>
        </div>
      </Container>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-bg xl:hidden"
      >
        <Container className="py-6">
          <ul className="flex flex-col">
            {navItems.map(({ id, label }, i) => (
              <li key={id} style={vars({ "--i": i })}>
                <a
                  href={`/#${id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === id ? "location" : undefined}
                  className="flex items-baseline gap-4 border-b border-line py-4 text-2xl font-medium tracking-tight text-fg"
                >
                  <span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink href="/#contact" onClick={() => setOpen(false)} className="mt-8 w-full">
            Let&apos;s Connect
          </ButtonLink>
        </Container>
      </nav>
    </header>
  );
}
