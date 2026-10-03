import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import Effects from "./_components/effects";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";
import { SITE_URL, profile } from "./_data/portfolio";
import "./globals.css";
import "./motion.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const title = "Ramdhan Vanjara — Senior Software Engineer | Node.js, TypeScript & Backend Systems";
const description =
  "Senior Backend / Full Stack Engineer with 4+ years building secure, scalable Node.js and TypeScript systems: microservices, event-driven Kafka pipelines processing 1–2M records/day, REST/GraphQL APIs and AWS/Azure. Based in Pune, India.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: "Ramdhan Vanjara",
  authors: [{ name: profile.name, url: profile.linkedIn }],
  keywords: [
    "Ramdhan Vanjara",
    "Senior Software Engineer",
    "Backend Engineer",
    "Node.js",
    "TypeScript",
    "Express.js",
    "MySQL",
    "Microservices",
    "Apache Kafka",
    "Event-driven architecture",
    "Pune",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: "Ramdhan Vanjara",
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
  themeColor: "#09090b",
  colorScheme: "dark",
};

// Runs before first paint: applies the saved theme, and arms scroll-reveal motion unless the visitor
// prefers reduced motion. If the motion engine never starts, the failsafe un-hides everything.
const themeScript = `(function(){var d=document.documentElement;try{if(localStorage.getItem("theme")==="light")d.dataset.theme="light"}catch(e){}if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.motion="";setTimeout(function(){if(!window.__motionReady)delete d.dataset.motion},4000)}})()`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Senior Software Engineer – Backend / Full Stack",
  email: `mailto:${profile.email}`,
  url: SITE_URL,
  address: { "@type": "PostalAddress", addressLocality: "Pune", addressCountry: "IN" },
  sameAs: [profile.linkedIn, profile.github],
  knowsAbout: ["Node.js", "TypeScript", "Express.js", "MySQL", "Microservices", "Apache Kafka", "GraphQL", "AWS", "Azure"],
  alumniOf: ["Gujarat Technological University", "Veer Narmad South Gujarat University"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before first paint to avoid a flash. Dark is the default. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="font-sans">
        <div aria-hidden className="galaxy" />
        <div aria-hidden className="grain" />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <Effects />
      </body>
    </html>
  );
}
