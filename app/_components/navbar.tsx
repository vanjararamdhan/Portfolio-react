"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { LuArrowUpRight, LuDownload } from "react-icons/lu";
import { RESUME_FILENAME, RESUME_PATH, navItems, profile } from "../_data/portfolio";
import { gsap, prefersReducedMotion, scrollToTarget, smooth } from "../_lib/motion";
import { ButtonLink, Container } from "./ui";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ctx = useRef<gsap.Context | null>(null);
  useEffect(() => () => ctx.current?.revert(), []);

  useEffect(() => {
    if (!open && !tl.current) return;
    // Curtain drops, then the links rise in one after another. Built on first open (not at page load),
    // so the page's startup doesn't pay for measuring a menu nobody has opened.
    ctx.current ??= gsap.context(() => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(overlayRef.current, { visibility: "visible" })
        .fromTo(overlayRef.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "expo.inOut" })
        .from(".menu-rise", { yPercent: 110, duration: 0.8, stagger: 0.05, ease: "expo.out" }, "-=0.3")
        .from(".menu-aside", { autoAlpha: 0, y: 20, duration: 0.6, ease: "power3.out" }, "-=0.6");
    }, overlayRef);
    const t = tl.current!;
    if (prefersReducedMotion()) t.progress(open ? 1 : 0);
    else if (open) t.timeScale(1).play();
    else t.timeScale(1.6).reverse();

    if (!open) {
      smooth.lenis?.start();
      return;
    }
    smooth.lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // Focus once the curtain has made the menu visible.
    const focusTimer = window.setTimeout(() => overlayRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true }), 80);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  // In-page jumps go through Lenis; on other routes (404) the href navigates home.
  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToTarget(target, id === "home" ? 0 : -72), open ? 350 : 0);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-on-accent"
      >
        Skip to content
      </a>
      <div
        className={`relative z-10 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled && !open ? "border-line/70 bg-bg/70 backdrop-blur-xl" : "border-transparent"
        }`}
      >
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link href="/#home" onClick={(e) => go(e, "home")} className="flex items-center gap-3" aria-label={`${profile.name}, back to top`}>
            <span aria-hidden className="grid size-8 place-items-center rounded-full border border-line-strong font-serif text-base italic text-accent">
              rv
            </span>
            <span className="whitespace-nowrap text-sm font-medium tracking-tight text-fg">{profile.name}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <ButtonLink
                href={RESUME_PATH}
                download={RESUME_FILENAME}
                type="application/pdf"
                data-magnetic
                data-cursor="Save"
                className="min-h-10! px-4!"
              >
                <LuDownload aria-hidden className="size-4" />
                Resume
              </ButtonLink>
            </span>
            <button
              ref={toggleRef}
              type="button"
              data-magnetic
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
              className="group flex h-10 items-center gap-3 rounded-full border border-line-strong pl-4 pr-3 text-sm text-fg transition-colors hover:border-fg/60"
            >
              <span className="label text-fg">{open ? "Close" : "Menu"}</span>
              <span aria-hidden className="relative block h-2.5 w-5">
                <span
                  className={`absolute left-0 h-px w-5 bg-current transition-transform duration-500 ${open ? "top-1/2 rotate-45" : "top-0 group-hover:scale-x-75"}`}
                />
                <span
                  className={`absolute left-0 h-px w-5 bg-current transition-transform duration-500 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`}
                />
              </span>
            </button>
          </div>
        </Container>
      </div>

      <div
        ref={overlayRef}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        data-lenis-prevent
        className="invisible fixed inset-0 overflow-y-auto bg-bg-2"
      >
        <Container className="grid min-h-full gap-12 pb-12 pt-28 lg:grid-cols-[1fr_20rem] lg:items-end lg:gap-16">
          <nav aria-label="Primary">
            <ol className="group/menu">
              {navItems.map(({ id, label }, i) => (
                <li key={id} className="border-b border-line">
                  <a
                    href={`/#${id}`}
                    onClick={(e) => go(e, id)}
                    className="group/link block overflow-hidden py-2 transition-opacity duration-300 group-hover/menu:opacity-40 hover:opacity-100! sm:py-3"
                  >
                    {/* GSAP lifts .menu-rise; the hover nudge lives on the inner span so the two never fight. */}
                    <span className="menu-rise flex items-baseline gap-5">
                      <span className="label w-8 text-accent">{String(i + 1).padStart(2, "0")}</span>
                      <span className="display block text-5xl text-fg transition-transform duration-500 group-hover/link:translate-x-3 sm:text-7xl lg:text-[5.5rem]">
                        {label}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <aside className="menu-aside space-y-8">
            <div>
              <p className="label mb-3">Get in touch</p>
              <a href={`mailto:${profile.email}`} className="block break-all text-lg text-fg hover:text-accent">
                {profile.email}
              </a>
              <a href={profile.phoneHref} className="mt-1 block text-sm text-muted hover:text-fg">
                {profile.phone}
              </a>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="label inline-flex items-center gap-2 text-fg hover:text-accent">
                <FaLinkedinIn aria-hidden className="size-3.5" /> LinkedIn <LuArrowUpRight aria-hidden className="size-3" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="label inline-flex items-center gap-2 text-fg hover:text-accent">
                <FaGithub aria-hidden className="size-3.5" /> GitHub <LuArrowUpRight aria-hidden className="size-3" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
            <ButtonLink href={RESUME_PATH} download={RESUME_FILENAME} type="application/pdf" className="w-full">
              <LuDownload aria-hidden className="size-4" />
              Download Resume
            </ButtonLink>
            <p className="label">
              {profile.location} · {profile.availability}
            </p>
          </aside>
        </Container>
      </div>
    </header>
  );
}
