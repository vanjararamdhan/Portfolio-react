# Ramdhan Vanjara — Portfolio

Personal portfolio of Ramdhan Vanjara, Senior Software Engineer (Backend / Full Stack).
Live: https://portfolio-ramdhan.netlify.app

Built with Next.js (App Router, fully static), React, TypeScript and Tailwind CSS v4.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Where things live

| Path | Purpose |
| --- | --- |
| `app/_data/portfolio.ts` | All content: profile, experience, projects, skills, education. Edit this to update the site. |
| `app/_components/` | Section components (hero, about, experience, projects, architecture, …) and shared UI. |
| `app/_components/tech-icon.tsx` | Technology name → logo and brand colour. |
| `app/globals.css` | Design tokens (colours, fonts) and animations. |
| `app/layout.tsx` | SEO metadata, fonts, JSON-LD. |
| `public/` | Resume PDF and profile photo. |
