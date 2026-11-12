import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Cursor from "./_components/cursor";
import Effects from "./_components/effects";
import Footer from "./_components/footer";
import Intro from "./_components/intro";
import Navbar from "./_components/navbar";
import ProgressRail from "./_components/progress-rail";
import Scenes from "./_components/scenes";
import StreamField from "./_components/stream-field";
import { SITE_URL, profile } from "./_data/portfolio";
import "./globals.css";
import "./motion.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const title = "Ramdhan Vanjara — Senior Software Engineer | Node.js, TypeScript & Backend Systems";
const description =
  "Senior Software Engineer (Backend / Full Stack) with 4.5+ years building Node.js and TypeScript systems: Kafka pipelines syncing 1–2M records/day, microservices, REST/GraphQL APIs, OAuth 2.0/JWT and AWS/Azure. Based in Pune, India.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.linkedIn }],
  creator: profile.name,
  keywords: [
    "Ramdhan Vanjara",
    "Senior Software Engineer",
    "Backend Engineer",
    "Full Stack Developer",
    "Node.js",
    "TypeScript",
    "NestJS",
    "Microservices",
    "Apache Kafka",
    "GraphQL",
    "AWS",
    "Pune",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.name,
    title,
    description,
    locale: "en_IN",
    firstName: "Ramdhan",
    lastName: "Vanjara",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0c",
  colorScheme: "dark",
};

// Runs before first paint. Unless the visitor prefers reduced motion it arms motion (pre-animation
// hidden states) and, once per session, the opening intro. Failsafes un-hide everything and drop the
// intro curtain if the JS never takes over, so nothing can stay hidden or block the page.
const bootScript = `(function(){var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.dataset.motion="";var seen=false;try{seen=sessionStorage.getItem("intro-seen")==="1"}catch(e){}if(!seen)d.dataset.intro="";setTimeout(function(){if(!window.__introDone)delete d.dataset.intro},4500);setTimeout(function(){if(!window.__motionReady)delete d.dataset.motion},6000)})()`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Senior Software Engineer – Backend / Full Stack",
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  url: SITE_URL,
  image: `${SITE_URL}/ramdhan-vanjara.jpg`,
  address: { "@type": "PostalAddress", addressLocality: "Pune", addressCountry: "IN" },
  sameAs: [profile.linkedIn, profile.github],
  knowsAbout: ["Node.js", "TypeScript", "NestJS", "Microservices", "Apache Kafka", "GraphQL", "REST APIs", "AWS", "Azure"],
  alumniOf: ["Gujarat Technological University", "Veer Narmad South Gujarat University"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      {/* Browser extensions (password managers, Grammarly, ColorZilla…) add attributes to <body> before React loads. */}
      <body className="font-sans" suppressHydrationWarning>
        <Intro />
        <StreamField />
        <div aria-hidden className="grain" />
        <Navbar />
        <ProgressRail />
        <main id="main">{children}</main>
        <Footer />
        <Scenes />
        <Cursor />
        <Effects />
      </body>
    </html>
  );
}
