# Ramdhan Vanjara — Portfolio

Personal portfolio of Ramdhan Vanjara, Senior Software Engineer (Backend / Full Stack).
Live: https://ramdhanvanjara.vercel.app

Built with Next.js (App Router, fully static), React, TypeScript and Tailwind CSS v4. The cinematic layer
uses GSAP (ScrollTrigger, SplitText), Lenis for smooth scrolling on desktop, and three.js for the
particle stream.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

If styles look stale after big CSS changes, delete `.next/` and restart.

## Where things live

| Path | Purpose |
| --- | --- |
| `app/_data/portfolio.ts` | All content: profile, experience, projects, skills, education. Edit this to update the site. |
| `app/_components/` | Section components (hero, about, experience, projects, expertise, skills, contact) and shared UI. |
| `app/_lib/motion.ts` | GSAP setup, shared media queries, and the state the scenes share with the WebGL stream. |
| `app/_components/scenes.tsx` | Page-wide scroll orchestration: Lenis, section background tones, stream formations, title reveals. |
| `app/_components/stream-scene.ts` | The three.js particle stream (lazy-loaded; skipped on low-power devices and reduced motion). |
| `app/_components/intro.tsx` | The once-per-session opening. |
| `app/_components/cursor.tsx` | Custom cursor, magnetic buttons, card tilt (fine pointers only). |
| `app/_components/tech-icon.tsx` | Technology name → logo and brand colour. |
| `app/globals.css`, `app/motion.css` | Design tokens and the CSS side of the motion system. |
| `app/layout.tsx` | SEO metadata, fonts, JSON-LD, and the boot script that arms motion and the intro. |
| `public/` | Resume PDF (`Ramdhan-Vanjara-Resume.pdf`) and profile photo. Replace the PDF in place to update the download. |

## Motion and accessibility

Visitors with "reduce motion" enabled get a calm version: no intro, smooth scrolling, pinned scenes or
WebGL, and all content visible. Touch devices keep native scrolling and get vertical layouts and tap
interactions instead of hover.
