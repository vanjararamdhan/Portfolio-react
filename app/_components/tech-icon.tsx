import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa";
import {
  LuBoxes,
  LuClock,
  LuCreditCard,
  LuGitBranch,
  LuKeyRound,
  LuLock,
  LuReceipt,
  LuWorkflow,
} from "react-icons/lu";
import {
  SiAngular,
  SiApachekafka,
  SiBootstrap,
  SiClaude,
  SiDocker,
  SiExpress,
  SiGit,
  SiGithubactions,
  SiGithubcopilot,
  SiGraphql,
  SiJavascript,
  SiJest,
  SiJira,
  SiJsonwebtokens,
  SiKubernetes,
  SiMocha,
  SiMoleculer,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNodedotjs,
  SiOpenai,
  SiPaypal,
  SiPostgresql,
  SiPostman,
  SiReact,
  SiRedis,
  SiSequelize,
  SiSwagger,
  SiTailwindcss,
  SiTypescript,
  SiZoho,
} from "react-icons/si";
import { TbApi, TbBrain, TbSql, TbTopologyStar3, TbWebhook } from "react-icons/tb";
import { VscAzure } from "react-icons/vsc";

type Tech = { icon: IconType; color: string };

// Brand colours. Black brand marks and generic concept icons follow the theme via CSS variables.
const FG = "var(--color-fg)";
const CONCEPT = "var(--color-accent)";

const tech: Record<string, Tech> = {
  JavaScript: { icon: SiJavascript, color: "#F7DF1E" },
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  SQL: { icon: TbSql, color: CONCEPT },
  "Node.js": { icon: SiNodedotjs, color: "#5FA04E" },
  NestJS: { icon: SiNestjs, color: "#E0234E" },
  "Express.js": { icon: SiExpress, color: FG },
  "Moleculer.js": { icon: SiMoleculer, color: "#3CAFCE" },
  Microservices: { icon: LuBoxes, color: CONCEPT },
  "Event-Driven Architecture": { icon: LuWorkflow, color: CONCEPT },
  "Event-driven": { icon: LuWorkflow, color: CONCEPT },
  REST: { icon: TbApi, color: CONCEPT },
  GraphQL: { icon: SiGraphql, color: "#E10098" },
  "Zoho APIs": { icon: SiZoho, color: "#E42527" },
  "Zoho CRM API v6": { icon: SiZoho, color: "#E42527" },
  "Zoho Desk": { icon: SiZoho, color: "#E42527" },
  "Zoho Analytics": { icon: SiZoho, color: "#E42527" },
  PayPal: { icon: SiPaypal, color: "#0070E0" },
  Tranzila: { icon: LuCreditCard, color: CONCEPT },
  "Green Invoice": { icon: LuReceipt, color: CONCEPT },
  "Apache Kafka": { icon: SiApachekafka, color: FG },
  "AWS SQS": { icon: FaAws, color: "#FF9900" },
  Webhooks: { icon: TbWebhook, color: CONCEPT },
  "Cron jobs": { icon: LuClock, color: CONCEPT },
  MySQL: { icon: SiMysql, color: "#4479A1" },
  PostgreSQL: { icon: SiPostgresql, color: "#4169E1" },
  MongoDB: { icon: SiMongodb, color: "#47A248" },
  Neo4j: { icon: TbTopologyStar3, color: "#4C8EDA" },
  Redis: { icon: SiRedis, color: "#FF4438" },
  Sequelize: { icon: SiSequelize, color: "#52B0E7" },
  AWS: { icon: FaAws, color: "#FF9900" },
  Azure: { icon: VscAzure, color: "#0089D6" },
  Docker: { icon: SiDocker, color: "#2496ED" },
  Kubernetes: { icon: SiKubernetes, color: "#326CE5" },
  "CI/CD": { icon: LuGitBranch, color: CONCEPT },
  "GitHub Actions": { icon: SiGithubactions, color: "#2088FF" },
  "OAuth 2.0": { icon: LuKeyRound, color: CONCEPT },
  JWT: { icon: SiJsonwebtokens, color: "#d63aff" },
  "Token-based auth": { icon: LuLock, color: CONCEPT },
  Angular: { icon: SiAngular, color: "#DD0031" },
  "React.js": { icon: SiReact, color: "#61DAFB" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
  Bootstrap: { icon: SiBootstrap, color: "#7952B3" },
  Jest: { icon: SiJest, color: "#C21325" },
  Mocha: { icon: SiMocha, color: "#C9A27E" },
  OpenAI: { icon: SiOpenai, color: FG },
  Claude: { icon: SiClaude, color: "#D97757" },
  "LLM APIs": { icon: TbBrain, color: CONCEPT },
  Git: { icon: SiGit, color: "#F05032" },
  Jira: { icon: SiJira, color: "#2684FF" },
  Postman: { icon: SiPostman, color: "#FF6C37" },
  Swagger: { icon: SiSwagger, color: "#85EA2D" },
  "Claude Code": { icon: SiClaude, color: "#D97757" },
  "GitHub Copilot": { icon: SiGithubcopilot, color: FG },
  MEAN: { icon: SiAngular, color: "#DD0031" },
  MERN: { icon: SiReact, color: "#61DAFB" },
};

export const getTech = (name: string): Tech | undefined => tech[name];

/** Technology logo. `brand` renders in the official colour; otherwise it inherits currentColor. */
export function TechIcon({ name, brand = false, className = "size-3.5" }: { name: string; brand?: boolean; className?: string }) {
  const t = tech[name];
  if (!t) return null;
  const Icon = t.icon;
  return <Icon aria-hidden className={`shrink-0 ${className}`} style={brand ? { color: t.color } : undefined} />;
}
