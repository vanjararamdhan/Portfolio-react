// Single source of truth for all portfolio content.
// Every fact here is taken from Ramdhan_Vanjara_Resume.pdf — keep it that way.

export const SITE_URL = "https://portfolio-ramdhan.netlify.app";
export const RESUME_PATH = "/Ramdhan_Vanjara_Resume.pdf";

export const profile = {
  name: "Ramdhan Vanjara",
  role: "Senior Software Engineer",
  focus: "Backend / Full Stack",
  location: "Pune, India",
  availability: "Immediate joiner",
  email: "vanjararamdhan@gmail.com",
  phone: "+91 70699 89488",
  phoneHref: "tel:+917069989488",
  linkedIn: "https://www.linkedin.com/in/ramdhan-vanjara",
  github: "https://github.com/vanjararamdhan",
} as const;

export type NavItem = { id: string; label: string };

export const navItems: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "architecture", label: "Architecture" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export type Metric = {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Rendered verbatim instead of an animated number (e.g. ranges). */
  display?: string;
  label: string;
};

export const metrics: Metric[] = [
  { value: 4, suffix: "+", label: "Years building production backends" },
  { value: 2, display: "1–2M", label: "Records synchronised per day" },
  { value: 10, label: "Member backend team led" },
  { value: 3, label: "Production platforms at Odek Appcraft" },
];

export const secondaryMetrics: Metric[] = [
  { value: 60, suffix: "%", label: "Faster API response time" },
  { value: 100, suffix: "%", label: "Unit-test coverage on delivered modules" },
  { value: 5, label: "Zoho apps integrated" },
  { value: 100, suffix: "K+", label: "Professionals served by Marcel" },
];

export type Capability = {
  key: "backend" | "distributed" | "api" | "cloud" | "security" | "data" | "ai" | "fullstack";
  title: string;
  summary: string;
  tools: string[];
};

export const capabilities: Capability[] = [
  {
    key: "backend",
    title: "Backend Engineering",
    summary: "Service design and implementation in typed Node.js.",
    tools: ["Node.js", "TypeScript", "Express.js", "NestJS", "Moleculer.js"],
  },
  {
    key: "distributed",
    title: "Distributed Systems",
    summary: "Microservices and event-driven pipelines that stay consistent at volume.",
    tools: ["Microservices", "Event-driven", "Apache Kafka", "Cron jobs"],
  },
  {
    key: "api",
    title: "API Engineering",
    summary: "Contracts other teams build on, and third-party integrations that hold up.",
    tools: ["REST", "GraphQL", "Webhooks", "Zoho APIs"],
  },
  {
    key: "cloud",
    title: "Cloud & DevOps",
    summary: "Containerised services shipped through automated pipelines.",
    tools: ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD"],
  },
  {
    key: "security",
    title: "API Security",
    summary: "Authentication and authorisation across platforms and integrations.",
    tools: ["OAuth 2.0", "JWT", "Token-based auth"],
  },
  {
    key: "data",
    title: "Data",
    summary: "Relational, document and graph models designed for multi-system sync.",
    tools: ["MySQL", "PostgreSQL", "MongoDB", "Neo4j", "Redis"],
  },
  {
    key: "ai",
    title: "AI Integration",
    summary: "LLM APIs wired into applications to prototype AI-assisted features.",
    tools: ["OpenAI", "Claude", "LLM APIs"],
  },
  {
    key: "fullstack",
    title: "Full Stack",
    summary: "Production Angular and React.js screens on top of my own APIs.",
    tools: ["MEAN", "MERN", "Angular", "React.js"],
  },
];

export type SubProject = { name: string; period: string; summary: string; projectId: string };

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  context: string;
  highlights: string[];
  stack: string[];
  subProjects?: SubProject[];
};

export const experiences: Experience[] = [
  {
    company: "Odek Appcraft",
    role: "Product Engineer (Node.js)",
    period: "Mar 2025 – Sep 2026",
    location: "Pune",
    context:
      "South Africa-based technology company building digital products for banking, tourism and insurance clients.",
    highlights: [
      "Built backend services on a Node.js microservices architecture across 3 production platforms: AndBeyond, InsureCraft and ICT Billing.",
      "Ran data-synchronisation pipelines processing 1–2 million records per day with Apache Kafka and scheduled cron jobs.",
      "Integrated 5 Zoho applications (CRM, Desk, Mail, People, Bookings), reused across all 3 platforms.",
      "Kept 100% code coverage on delivered modules with Jest/Mocha; turned client requirements into technical designs and delivered through Jira sprints.",
    ],
    stack: ["Node.js", "Microservices", "Apache Kafka", "Zoho APIs", "Angular", "JWT", "OAuth 2.0", "Jest", "Mocha"],
  },
  {
    company: "Publicis Re:Sources",
    role: "Backend Developer",
    period: "Jul 2024 – Jan 2025",
    location: "Pune",
    context:
      "Enterprise technology arm of Publicis Groupe. Project: Marcel, an AI-powered platform serving 100,000+ professionals worldwide.",
    highlights: [
      "Developed Node.js microservices with GraphQL APIs on a Neo4j graph database for opportunity discovery, expertise matching and collaboration.",
      "Designed RESTful APIs consumed by multiple frontend squads under enterprise-scale load.",
      "Wrote automated unit and integration tests (Jest, Mocha) inside a globally distributed Agile/Scrum organisation.",
    ],
    stack: ["Node.js", "GraphQL", "Neo4j", "REST", "Microservices", "Jest", "Mocha"],
  },
  {
    company: "Koli Infotech Pvt. Ltd.",
    role: "Backend Developer & Team Lead",
    period: "Jan 2022 – Jul 2024",
    location: "Surat",
    context: "IT services company delivering software for domestic and international clients.",
    highlights: [
      "Led a 10-member backend team: architecture decisions, code reviews, code-quality standards and end-to-end delivery.",
      "Primary technical point of contact for international clients, turning non-technical requirements into precise engineering specifications.",
    ],
    stack: ["Node.js", "NestJS", "Moleculer.js", "MongoDB", "MySQL", "Kubernetes", "Azure"],
    subProjects: [
      {
        name: "Proginter",
        period: "Feb 2023 – Jul 2024",
        summary: "Server, domain & hosting platform · Israel",
        projectId: "proginter",
      },
      {
        name: "Centrum Menopause",
        period: "Nov 2022 – Jan 2023",
        summary: "Healthcare platform · Poland",
        projectId: "centrum-menopause",
      },
      {
        name: "AMS",
        period: "Aug 2022 – Oct 2022",
        summary: "Assets management system · in-house",
        projectId: "ams",
      },
    ],
  },
];

export type FeaturedProject = {
  id: string;
  name: string;
  industry: string;
  location?: string;
  company: string;
  role: string;
  /** One line on what the product is. */
  context: string;
  problem: string;
  built: string[];
  achievement: { value: string; label: string };
  stack: string[];
  /** Pipeline rendered as a mini flow diagram (simplified from the work described). */
  flow: string[];
  modules?: string[];
};

export const featuredProjects: FeaturedProject[] = [
  {
    id: "andbeyond",
    context: "Travel & tourism platform for a South African client, kept in sync with Zoho CRM and Zoho Desk.",
    name: "AndBeyond",
    industry: "Travel & Tourism",
    location: "South Africa",
    company: "Odek Appcraft",
    role: "Backend architecture & development",
    problem:
      "Customer and support records lived in Zoho and in the platform's master database, and keeping them aligned meant manual data entry and reconciliation.",
    built: [
      "Event-driven sync: Zoho webhooks publish record changes to Apache Kafka; consumers apply them to master DB tables in near real time.",
      "Custom Zoho CRM API v6 and Zoho Desk sync modules, mail-log and attachment pipelines, ticket routing rules and Zoho Analytics reporting queries.",
      "Resolved production OAuth scope mismatches and duplicate-data conflicts; designed DB structures for high-volume multi-system sync.",
      "Secured platform APIs with JWT authentication and OAuth 2.0 authorisation; contributed Angular components to the Explorer module.",
    ],
    achievement: { value: "Near real time", label: "Zoho ⇄ master DB sync, replacing manual reconciliation" },
    stack: ["Node.js", "Apache Kafka", "Zoho CRM API v6", "Zoho Desk", "Zoho Analytics", "JWT", "OAuth 2.0", "Angular"],
    flow: ["Zoho Webhooks", "Apache Kafka", "Consumers", "Master DB"],
    modules: ["Accounts", "Contacts", "Departments", "Teams", "Tickets", "Mail logs", "Attachments", "Analytics"],
  },
  {
    id: "ict-billing",
    context: "Billing & subscription platform where customers combine multiple services on recurring plans.",
    flow: ["Service selection", "Subscription plan", "Usage & user tier", "Charge calculation", "Invoice"],
    name: "ICT Billing",
    industry: "Billing & Subscriptions",
    company: "Odek Appcraft",
    role: "Billing logic & full-stack delivery",
    problem:
      "Every charge depends on usage, subscription value and the user's type/tier, across both recurring and usage-based billing cycles.",
    built: [
      "Billing logic for multi-service selection with recurring subscription plans.",
      "Charge calculation driven by usage, subscription value and user type/tier.",
      "Automated invoice generation for recurring and usage-based billing cycles.",
      "JWT-secured Angular screens for service selection and subscription management.",
    ],
    achievement: { value: "Automated", label: "Invoicing for recurring and usage-based cycles" },
    stack: ["Node.js", "Microservices", "Angular", "JWT"],
  },
  {
    id: "proginter",
    context: "Platform for server sales, domain registration and hosting services for an Israeli client.",
    flow: ["Server / domain / hosting order", "Payment (PayPal · Tranzila)", "Invoice (Green Invoice)"],
    name: "Proginter",
    industry: "Server, Domain & Hosting Services",
    location: "Israel",
    company: "Koli Infotech",
    role: "Full lifecycle owner",
    problem:
      "Server, domain and hosting sales needed secure billing: multiple payment gateways plus automated invoicing, all behind token-based API authentication.",
    built: [
      "Owned the project end to end, from requirements to deployment.",
      "Integrated PayPal and Tranzila payment gateways and Green Invoice invoicing with token-based API authentication.",
      "Moleculer.js microservices on MongoDB, deployed on Kubernetes on Azure with CI/CD pipelines.",
      "React.js dashboard components for the client-facing portal.",
    ],
    achievement: { value: "End to end", label: "Requirements → architecture → deployment" },
    stack: ["Node.js", "Moleculer.js", "MongoDB", "Kubernetes", "Azure", "CI/CD", "React.js", "PayPal", "Tranzila", "Green Invoice"],
  },
];

export type SecondaryProject = {
  id: string;
  name: string;
  industry: string;
  location?: string;
  company: string;
  role: string;
  summary: string;
  details: string[];
  badge?: { value: string; label: string };
  stack: string[];
};

export const secondaryProjects: SecondaryProject[] = [
  {
    id: "marcel",
    name: "Marcel",
    industry: "Enterprise AI Platform",
    company: "Publicis Re:Sources",
    role: "Backend Developer",
    summary: "AI-powered platform for opportunity discovery, expertise matching and collaboration.",
    details: [
      "Node.js microservices with GraphQL APIs backed by a Neo4j graph database.",
      "RESTful APIs consumed by multiple frontend squads with high-availability requirements.",
    ],
    badge: { value: "100K+", label: "professionals" },
    stack: ["Node.js", "GraphQL", "Neo4j"],
  },
  {
    id: "insurecraft",
    name: "InsureCraft",
    industry: "Life & Health Insurance",
    company: "Odek Appcraft",
    role: "Backend Developer",
    summary: "Policy management for life and health insurance products.",
    details: [
      "Policy-management flows enabling end-to-end policy tracking.",
      "Bank-details verification workflow for agents and partners, supporting secure, accurate payout processing.",
    ],
    stack: ["Node.js", "Microservices"],
  },
  {
    id: "centrum-menopause",
    name: "Centrum Menopause",
    industry: "Healthcare",
    location: "Poland",
    company: "Halion · contract",
    role: "Backend Developer",
    summary: "REST APIs for a healthcare platform, built to enterprise coding standards.",
    details: [
      "NestJS and TypeScript REST APIs inside a distributed international team.",
      "Improved API response time by 60% and delivered modules with 100% unit-test coverage.",
    ],
    badge: { value: "60%", label: "faster APIs" },
    stack: ["NestJS", "TypeScript"],
  },
  {
    id: "ams",
    name: "AMS",
    industry: "Assets Management System",
    company: "Koli Infotech",
    role: "Lead developer",
    summary: "The company's first in-house product, still in active production use.",
    details: ["Led full-cycle development with Node.js and MySQL."],
    stack: ["Node.js", "MySQL"],
  },
];

export type ArchitectureNode = {
  id: string;
  title: string;
  kind: string;
  role: string;
  consideration: string;
};

// Simplified reference flow based on the AndBeyond Zoho ⇄ master DB sync.
export const architectureNodes: ArchitectureNode[] = [
  {
    id: "webhooks",
    title: "Zoho Webhooks",
    kind: "Source",
    role: "Zoho CRM and Desk emit a webhook whenever a record such as an account, contact or ticket changes.",
    consideration: "Webhooks can arrive twice or out of order, so nothing downstream should assume exactly-once delivery.",
  },
  {
    id: "producer",
    title: "Event Producer",
    kind: "Ingress",
    role: "Receives the webhook, authenticates it and publishes a record-change event to Kafka.",
    consideration: "Keep ingress thin: acknowledge fast, defer the work, and let Kafka absorb bursts.",
  },
  {
    id: "kafka",
    title: "Apache Kafka",
    kind: "Event log",
    role: "Durable buffer between Zoho and the platform, decoupling the speed of the source from the speed of the consumers.",
    consideration: "Partitioning by record keeps changes to the same entity in order.",
  },
  {
    id: "consumers",
    title: "Kafka Consumers",
    kind: "Workers",
    role: "Consume change events per module and apply them to the master database.",
    consideration: "Consumers should scale horizontally, and a failed message should be retried, never silently dropped.",
  },
  {
    id: "transform",
    title: "Validation / Transformation",
    kind: "Domain logic",
    role: "Maps Zoho field schemas onto master tables and rejects malformed payloads.",
    consideration: "Writes should be keyed on the source record so a replayed event updates instead of duplicating. Duplicate-data conflicts were one of the production issues resolved here.",
  },
  {
    id: "master",
    title: "Master Database",
    kind: "System of record",
    role: "Consistent master tables, fed by the event stream and by scheduled cron jobs, at 1–2 million records per day.",
    consideration: "Table structures designed for high-volume, multi-system synchronisation.",
  },
  {
    id: "downstream",
    title: "Downstream Services",
    kind: "Consumers of truth",
    role: "Platform services, reporting and Zoho Analytics queries read one consistent dataset.",
    consideration: "No more manual data entry or reconciliation between systems.",
  },
];

export type SkillGroup = { category: string; items: string[] };

/** Highlighted in the stack section as primary expertise. */
export const coreSkills = new Set([
  "Node.js",
  "TypeScript",
  "Express.js",
  "MySQL",
  "Microservices",
  "Event-Driven Architecture",
  "Apache Kafka",
  "REST",
  "GraphQL",
  "MongoDB",
  "AWS",
  "OAuth 2.0",
  "JWT",
]);

export const skillGroups: SkillGroup[] = [
  { category: "Languages", items: ["JavaScript", "TypeScript", "SQL"] },
  { category: "Backend", items: ["Node.js", "Express.js", "NestJS", "Moleculer.js"] },
  { category: "Architecture", items: ["Microservices", "Event-Driven Architecture"] },
  { category: "APIs & Integration", items: ["REST", "GraphQL", "Zoho APIs", "PayPal", "Tranzila", "Green Invoice"] },
  { category: "Messaging & Jobs", items: ["Apache Kafka", "AWS SQS", "Webhooks", "Cron jobs"] },
  { category: "Databases", items: ["MySQL", "PostgreSQL", "MongoDB", "Neo4j", "Redis", "Sequelize"] },
  { category: "Cloud & DevOps", items: ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD", "GitHub Actions"] },
  { category: "Security", items: ["OAuth 2.0", "JWT", "Token-based auth"] },
  { category: "Frontend", items: ["Angular", "React.js", "Tailwind CSS", "Bootstrap"] },
  { category: "Testing", items: ["Jest", "Mocha"] },
  { category: "AI", items: ["OpenAI", "Claude", "LLM APIs"] },
  { category: "Tools", items: ["Git", "Jira", "Postman", "Swagger", "Claude Code", "GitHub Copilot"] },
];

export type LeadershipItem = { title: string; text: string };

export const leadership: LeadershipItem[] = [
  { title: "Technical leadership", text: "Led a 10-member backend team for 2.5 years at Koli Infotech." },
  { title: "Architecture decisions", text: "Owned system design calls across multiple client engagements." },
  { title: "Code review & mentoring", text: "Reviewed the team's code and enforced code-quality standards." },
  { title: "Requirements gathering", text: "Turned non-technical client asks into precise engineering specs." },
  { title: "Client communication", text: "Primary technical point of contact for international clients." },
  { title: "End-to-end ownership", text: "Requirements → design → delivery, with Agile/Scrum and Jira sprints." },
];

/** Simplified shape of the LLM prototype work. */
export const aiFlow = ["Application", "LLM API (OpenAI · Claude)", "Processing", "Product feature"];

export const aiPoints: string[] = [
  "Built a demo application integrating OpenAI and Claude APIs to prototype AI-assisted product features.",
  "Backend engineering on Marcel, an AI-powered enterprise platform at Publicis.",
  "AI-assisted development with Claude Code and GitHub Copilot to ship faster.",
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

export const certifications: string[] = [
  "Zoho APIs and CRM – Professional Course",
  "Domain Names, DNS & Hosting – Udemy",
];
