// Single source of truth for all portfolio content.
// Every fact here comes from Ramdhan's resume (the current one-page version, plus details from the
// earlier two-page version that don't contradict it). Keep it that way: no invented claims.

export const SITE_URL = "https://ramdhanvanjara.vercel.app";
export const RESUME_PATH = "/Ramdhan-Vanjara-Resume.pdf";
export const RESUME_FILENAME = "Ramdhan-Vanjara-Resume.pdf";
export const PHOTO_PATH = "/ramdhan-vanjara.jpg";

export const profile = {
  name: "Ramdhan Vanjara",
  role: "Senior Software Engineer",
  focus: "Backend / Full Stack",
  headline: "Senior Software Engineer — Backend / Full Stack",
  location: "Pune, India",
  availability: "Immediate joiner",
  email: "vanjararamdhan@gmail.com",
  phone: "+91 70699 89488",
  phoneHref: "tel:+917069989488",
  linkedIn: "https://www.linkedin.com/in/ramdhan-vanjara",
  linkedInHandle: "in/ramdhan-vanjara",
  github: "https://github.com/vanjararamdhan",
  githubHandle: "vanjararamdhan",
} as const;

export type NavItem = { id: string; label: string };

export const navItems: NavItem[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "expertise", label: "Expertise" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export type Stat = { value: string; label: string };

/** Headline proof; `count` drives the ticking counter, `value` is the final text. */
export type CountStat = Stat & { count: number; decimals?: number; prefix?: string; suffix?: string };

export const aboutStats: CountStat[] = [
  { value: "4.5+", count: 4.5, decimals: 1, suffix: "+", label: "Years in production" },
  { value: "3", count: 3, label: "Companies" },
  { value: "1–2M", count: 2, prefix: "1–", suffix: "M", label: "Records synced per day" },
  { value: "5", count: 5, label: "Zoho apps integrated" },
  { value: "10", count: 10, label: "Engineers led for 2.5 years" },
  { value: "100%", count: 100, suffix: "%", label: "Unit-test coverage on delivered modules" },
];

export const aboutFacts: { label: string; value: string }[] = [
  { label: "Clients in", value: "South Africa · Israel · Poland" },
  { label: "Domains", value: "Travel · Insurance · Billing · Healthcare · EdTech · Enterprise AI" },
  { label: "Core", value: "Node.js · TypeScript · NestJS · Kafka · AWS" },
  { label: "Based in", value: "Pune, India · Immediate joiner" },
];

export type ClientProject = { name: string; summary: string; period?: string; projectId: string };

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  context: string;
  highlights: string[];
  projects?: ClientProject[];
  stack: string[];
};

export const experiences: Experience[] = [
  {
    company: "Odek Appcraft",
    role: "Product Engineer",
    period: "Mar 2025 – Oct 2026",
    location: "Pune",
    context: "South Africa-based technology company building digital products for banking, tourism and insurance clients.",
    highlights: [
      "Built and operated event-driven sync pipelines processing 1–2 million records/day: Zoho webhooks publish record changes to Apache Kafka, and consumers update master database tables in near real time, backed by scheduled cron jobs.",
      "Integrated 5 Zoho apps (CRM, Desk, Mail, People, Bookings) with Zoho CRM API v6 across 3 client platforms: custom sync modules, mail-log and attachment pipelines, ticket-routing rules and Zoho Analytics reports.",
      "Implemented Tourplan XML API mapping for multi-option travel bookings on AndBeyond, secured its APIs with JWT and OAuth 2.0, and resolved OAuth-scope and duplicate-data issues in production.",
      "Delivered policy management and agent bank-details verification on InsureCraft, and recurring, usage-based subscription billing with automated invoices on ICT Billing.",
      "Maintained 100% unit-test coverage on delivered modules (Jest) and turned client requirements into technical designs delivered through Jira sprints.",
    ],
    projects: [
      { name: "AndBeyond", summary: "Travel & tourism · South Africa", projectId: "andbeyond" },
      { name: "InsureCraft", summary: "Life & health insurance", projectId: "insurecraft" },
      { name: "ICT Billing", summary: "Billing & subscriptions", projectId: "ict-billing" },
    ],
    stack: ["Node.js", "Microservices", "Apache Kafka", "Zoho CRM API v6", "Tourplan XML API", "Angular", "JWT", "OAuth 2.0", "Jest"],
  },
  {
    company: "Publicis Re:Sources",
    role: "Backend Developer",
    period: "Jul 2024 – Jan 2025",
    location: "Pune",
    context: "Enterprise technology arm of Publicis Groupe. Project: Marcel, an AI platform serving 100,000+ professionals.",
    highlights: [
      "Developed Node.js microservices for Marcel, powering opportunity discovery, expertise matching and collaboration.",
      "Delivered 3 modules that create Adobe Experience Manager (AEM) content, store it in a Neo4j graph database and serve it through GraphQL APIs.",
      "Designed REST and GraphQL APIs consumed by multiple frontend squads, meeting high-availability and performance requirements.",
      "Wrote unit and integration tests (Jest, Mocha) in a globally distributed Agile / Scrum team.",
    ],
    projects: [{ name: "Marcel", summary: "Enterprise AI platform", projectId: "marcel" }],
    stack: ["Node.js", "Microservices", "GraphQL", "Neo4j", "Adobe AEM", "REST APIs", "Jest", "Mocha"],
  },
  {
    company: "Koli Infotech Pvt. Ltd.",
    role: "Backend Developer & Team Lead",
    period: "Jan 2022 – Jul 2024",
    location: "Surat",
    context: "IT services company delivering software for domestic and international clients.",
    highlights: [
      "Led a 10-member backend team for 2.5 years: owned architecture decisions, code reviews and quality standards.",
      "Acted as the main technical contact for international clients, turning non-technical requirements into precise engineering specifications.",
      "Owned Proginter end to end: Moleculer.js microservices on MongoDB, PayPal, Tranzila and Green Invoice integrations, CI/CD with Azure and Kubernetes, and React.js dashboards.",
      "Cut API response time by 60% on Centrum Menopause (NestJS, TypeScript) and API execution time by 70% on BYJU'S by removing complex loops and rewriting heavy database queries.",
      "Led full-cycle development of AMS, the company's first in-house product, still in production.",
    ],
    projects: [
      { name: "Proginter", summary: "Hosting & domains · Israel", period: "Feb 2023 – Jul 2024", projectId: "proginter" },
      { name: "Centrum Menopause", summary: "Healthcare · Poland", period: "Nov 2022 – Jan 2023", projectId: "centrum-menopause" },
      { name: "AMS", summary: "Assets management · in-house", period: "Aug 2022 – Oct 2022", projectId: "ams" },
      { name: "BYJU'S", summary: "EdTech platform", projectId: "byjus" },
    ],
    stack: ["Node.js", "NestJS", "TypeScript", "Moleculer.js", "MongoDB", "MySQL", "Kubernetes", "Azure", "React.js"],
  },
];

export type FeaturedProject = {
  id: string;
  name: string;
  industry: string;
  location?: string;
  company: string;
  role: string;
  period?: string;
  /** What the product is. */
  context: string;
  problem?: string;
  built: string[];
  outcome: { value: string; label: string };
  /** Simplified data flow, rendered as a pipeline. */
  flow: string[];
  modules?: string[];
  stack: string[];
};

export const featuredProjects: FeaturedProject[] = [
  {
    id: "andbeyond",
    name: "AndBeyond",
    industry: "Travel & Tourism",
    location: "South Africa",
    company: "Odek Appcraft",
    role: "Backend architecture & development",
    context: "Travel platform kept in sync with Zoho CRM and Zoho Desk.",
    problem:
      "Customer and support records lived in Zoho and in the platform's master database. Keeping them aligned meant manual data entry and reconciliation.",
    built: [
      "Event-driven sync: Zoho webhooks publish record changes to Apache Kafka, and consumers apply them to master database tables in near real time, backed by scheduled cron jobs.",
      "Zoho CRM API v6 and Zoho Desk sync modules, mail-log and attachment pipelines, ticket assignment and routing rules, and Zoho Analytics reporting queries.",
      "Tourplan XML API mapping for multi-option travel bookings.",
      "Secured platform APIs with JWT authentication and OAuth 2.0 authorisation; resolved OAuth-scope mismatches and duplicate-data conflicts in production.",
      "Database structures for high-volume multi-system sync, and Angular components for account and contact management in the Explorer module.",
    ],
    outcome: { value: "1–2M / day", label: "Records synced in near real time, replacing manual reconciliation" },
    flow: ["Zoho webhooks", "Apache Kafka", "Consumers", "Master DB"],
    modules: ["Accounts", "Contacts", "Departments", "Teams", "Tickets", "Mail logs", "Attachments"],
    stack: ["Node.js", "Apache Kafka", "Zoho CRM API v6", "Zoho Desk", "Zoho Analytics", "Tourplan XML API", "JWT", "OAuth 2.0", "Angular"],
  },
  {
    id: "proginter",
    name: "Proginter",
    industry: "Server, Domain & Hosting",
    location: "Israel",
    company: "Koli Infotech",
    role: "End-to-end owner",
    period: "Feb 2023 – Jul 2024",
    context: "Platform for server sales, domain registration and hosting services.",
    built: [
      "Owned the full project lifecycle, from requirements to deployment.",
      "Integrated PayPal and Tranzila payment gateways and Green Invoice invoicing, with token-based API authentication for secure billing.",
      "Built Moleculer.js microservices backed by MongoDB, deployed on Kubernetes on Azure with CI/CD pipelines.",
      "Added React.js dashboard components to the client-facing portal.",
    ],
    outcome: { value: "End to end", label: "Requirements, architecture, delivery and deployment" },
    flow: ["Order", "Payment · PayPal / Tranzila", "Invoice · Green Invoice"],
    stack: ["Node.js", "Moleculer.js", "MongoDB", "Kubernetes", "Azure", "CI/CD", "React.js", "PayPal", "Tranzila", "Green Invoice"],
  },
  {
    id: "marcel",
    name: "Marcel",
    industry: "Enterprise AI Platform",
    company: "Publicis Re:Sources",
    role: "Backend Developer",
    period: "Jul 2024 – Jan 2025",
    context: "Publicis Groupe's AI platform for opportunity discovery, expertise matching and collaboration.",
    built: [
      "Node.js microservices behind Marcel's discovery, matching and collaboration features.",
      "3 modules that create Adobe Experience Manager (AEM) content, store it in a Neo4j graph database and serve it through GraphQL APIs.",
      "REST and GraphQL APIs consumed by multiple frontend squads.",
      "Unit and integration tests with Jest and Mocha.",
    ],
    outcome: { value: "100K+", label: "Professionals served by the platform" },
    flow: ["Adobe AEM", "Node.js services", "Neo4j", "GraphQL API"],
    stack: ["Node.js", "Microservices", "GraphQL", "Neo4j", "Adobe AEM", "Jest", "Mocha"],
  },
];

export type IndexProject = {
  id: string;
  name: string;
  domain: string;
  company: string;
  period?: string;
  summary: string;
  result?: string;
  stack: string[];
};

export const moreProjects: IndexProject[] = [
  {
    id: "ict-billing",
    name: "ICT Billing",
    domain: "Billing & subscriptions",
    company: "Odek Appcraft",
    summary:
      "Billing logic for multi-service recurring plans, with charges calculated from usage, subscription value and user tier; automated invoices and JWT-secured Angular screens.",
    result: "Automated invoicing",
    stack: ["Node.js", "Angular", "JWT"],
  },
  {
    id: "insurecraft",
    name: "InsureCraft",
    domain: "Life & health insurance",
    company: "Odek Appcraft",
    summary: "Policy-management flows for end-to-end policy tracking, and bank-details verification for agent and partner payouts.",
    stack: ["Node.js", "Microservices"],
  },
  {
    id: "centrum-menopause",
    name: "Centrum Menopause",
    domain: "Healthcare · Poland",
    company: "Halion · via Infosys team",
    period: "Nov 2022 – Jan 2023",
    summary:
      "Halion's healthcare platform. As a contract developer in the Infosys team, working alongside Halion's own team, I built REST APIs with NestJS and TypeScript.",
    result: "60% faster APIs · 100% unit-test coverage",
    stack: ["NestJS", "TypeScript"],
  },
  {
    id: "byjus",
    name: "BYJU'S",
    domain: "EdTech",
    company: "Koli Infotech",
    summary: "Optimised Node.js APIs by removing complex loops and rewriting heavy database queries.",
    result: "70% lower API execution time",
    stack: ["Node.js"],
  },
  {
    id: "ams",
    name: "AMS",
    domain: "Assets management",
    company: "Koli Infotech",
    period: "Aug 2022 – Oct 2022",
    summary: "Led full-cycle development of the company's first in-house product.",
    result: "Still in production",
    stack: ["Node.js", "MySQL"],
  },
  {
    id: "llm-demo",
    name: "LLM API demo",
    domain: "Internal AI initiative",
    company: "Odek Appcraft",
    summary: "Demo application integrating the OpenAI and Claude APIs to prototype AI-assisted product features.",
    stack: ["OpenAI API", "Claude API"],
  },
];

export type PipelineStage = { id: string; title: string; kind: string; detail: string };

// The AndBeyond Zoho ⇄ master DB sync, stage by stage. Wording stays within what the resume states.
export const pipelineStages: PipelineStage[] = [
  {
    id: "zoho",
    title: "Zoho CRM & Desk",
    kind: "Source",
    detail: "Accounts, contacts, departments, teams and tickets change in Zoho CRM and Zoho Desk.",
  },
  {
    id: "webhooks",
    title: "Zoho webhooks",
    kind: "Publish",
    detail: "Each record change triggers a webhook that publishes it to Apache Kafka.",
  },
  {
    id: "kafka",
    title: "Apache Kafka",
    kind: "Event stream",
    detail: "Carries record-change events between Zoho and the platform.",
  },
  {
    id: "consumers",
    title: "Kafka consumers",
    kind: "Apply",
    detail: "Consumers update the master database tables in near real time. Scheduled cron jobs back up the event stream.",
  },
  {
    id: "master",
    title: "Master database",
    kind: "System of record",
    detail:
      "Table structures designed for high-volume, multi-system sync at 1–2 million records per day. OAuth-scope mismatches and duplicate-data conflicts were resolved here in production.",
  },
  {
    id: "outcome",
    title: "One consistent dataset",
    kind: "Outcome",
    detail: "Zoho and the master database stay in sync in near real time, with no manual data entry or reconciliation. Zoho Analytics reports run on the same data.",
  },
];

export type ExpertiseArea = {
  key: "services" | "performance" | "integrations" | "data" | "cloud" | "leadership" | "ai";
  title: string;
  /** Optional headline figure(s) from the resume. */
  figures?: Stat[];
  text: string;
  tags: string[];
  wide?: boolean;
};

export const expertise: ExpertiseArea[] = [
  {
    key: "services",
    title: "Microservices & APIs",
    text: "Node.js microservices at Odek Appcraft, Publicis and Proginter. REST and GraphQL APIs consumed by multiple frontend squads, secured with OAuth 2.0 and JWT.",
    tags: ["Node.js", "NestJS", "Express.js", "Moleculer.js", "GraphQL", "OAuth 2.0", "JWT"],
    wide: true,
  },
  {
    key: "performance",
    title: "Performance & quality",
    figures: [
      { value: "60%", label: "faster API responses · Centrum Menopause" },
      { value: "70%", label: "lower API execution time · BYJU'S" },
    ],
    text: "100% unit-test coverage on delivered modules.",
    tags: ["Jest", "Mocha"],
  },
  {
    key: "integrations",
    title: "System integrations",
    text: "5 Zoho apps across 3 platforms, Tourplan XML bookings, Adobe AEM content, and payments through PayPal, Tranzila and Green Invoice.",
    tags: ["Zoho CRM API v6", "Tourplan XML API", "Adobe AEM", "PayPal"],
  },
  {
    key: "data",
    title: "Data",
    text: "Master tables for high-volume multi-system sync, a Neo4j graph behind GraphQL, and heavy queries rewritten for speed.",
    tags: ["MySQL", "PostgreSQL", "MongoDB", "Neo4j", "Redis"],
  },
  {
    key: "cloud",
    title: "Cloud & delivery",
    text: "CI/CD with Azure and Kubernetes on Proginter; AWS services, Docker and GitHub Actions.",
    tags: ["AWS", "Azure", "Kubernetes", "Docker", "GitHub Actions"],
  },
  {
    key: "leadership",
    title: "Technical leadership",
    figures: [{ value: "10", label: "engineers led for 2.5 years" }],
    text: "Owned architecture decisions, code reviews and quality standards at Koli Infotech, and was the main technical contact for international clients.",
    tags: ["Architecture", "Code review", "Agile / Scrum", "Jira"],
    wide: true,
  },
  {
    key: "ai",
    title: "AI in the workflow",
    text: "Built an LLM API demo with OpenAI and Claude to prototype AI features. Uses Claude Code and GitHub Copilot daily.",
    tags: ["OpenAI API", "Claude API", "Claude Code", "GitHub Copilot"],
  },
];

export type SkillGroup = { category: string; items: string[] };

/** Highlighted in the skills section as primary expertise. */
export const coreSkills = new Set([
  "Node.js",
  "TypeScript",
  "NestJS",
  "Express.js",
  "Microservices",
  "Event-Driven Architecture",
  "REST APIs",
  "GraphQL",
  "MySQL",
  "MongoDB",
  "Apache Kafka",
  "AWS (S3, Lambda, IAM)",
  "OAuth 2.0",
  "JWT",
]);

export const skillGroups: SkillGroup[] = [
  { category: "Languages", items: ["JavaScript", "TypeScript", "SQL"] },
  { category: "Backend", items: ["Node.js", "NestJS", "Express.js", "Moleculer.js"] },
  { category: "Architecture & APIs", items: ["Microservices", "Event-Driven Architecture", "REST APIs", "GraphQL"] },
  { category: "Databases", items: ["MySQL", "PostgreSQL", "MongoDB", "Neo4j", "Redis", "Sequelize ORM"] },
  { category: "Messaging & Jobs", items: ["Apache Kafka", "AWS SQS", "Webhooks", "Cron jobs"] },
  { category: "Cloud & DevOps", items: ["AWS (S3, Lambda, IAM)", "Azure", "Docker", "Kubernetes", "CI/CD", "GitHub Actions"] },
  {
    category: "Integrations",
    items: ["Zoho CRM API v6", "Zoho Analytics", "Tourplan XML API", "Adobe AEM", "OpenAI API", "Claude API"],
  },
  { category: "Payments", items: ["PayPal", "Tranzila", "Green Invoice"] },
  { category: "Frontend", items: ["Angular", "React.js", "Tailwind CSS", "Bootstrap"] },
  { category: "Security & Testing", items: ["OAuth 2.0", "JWT", "Jest", "Mocha"] },
  { category: "Tools", items: ["Git", "Jira", "Postman", "Swagger", "Claude Code", "GitHub Copilot"] },
];

export type Education = { degree: string; name: string; institution: string; period: string };

export const education: Education[] = [
  {
    degree: "MCA",
    name: "Master of Computer Applications",
    institution: "Gujarat Technological University, Ahmedabad",
    period: "Oct 2020 – Jun 2022",
  },
  {
    degree: "BCA",
    name: "Bachelor of Computer Applications",
    institution: "Veer Narmad South Gujarat University, Surat",
    period: "Aug 2017 – Feb 2020",
  },
];

export const certifications: { name: string; issuer: string }[] = [
  { name: "AWS Educate", issuer: "Amazon Web Services" },
  { name: "Zoho APIs and CRM", issuer: "Professional course" },
  { name: "Domain Names, DNS & Hosting", issuer: "Udemy" },
];
