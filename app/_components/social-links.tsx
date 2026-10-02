import type { IconType } from "react-icons";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { LuMail } from "react-icons/lu";
import { profile } from "../_data/portfolio";
import { vars } from "./ui";

const links: { label: string; href: string; icon: IconType; external: boolean }[] = [
  { label: "GitHub", href: profile.github, icon: FaGithub, external: true },
  { label: "LinkedIn", href: profile.linkedIn, icon: FaLinkedinIn, external: true },
  { label: "Email", href: `mailto:${profile.email}`, icon: LuMail, external: false },
];

/** Icon buttons for the profiles listed in portfolio data. */
export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`pop flex items-center gap-2 ${className}`} aria-label="Social profiles">
      {links.map(({ label, href, icon: Icon, external }, i) => (
        <li key={label} style={vars({ "--j": i })}>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={external ? `${label} (opens in a new tab)` : label}
            title={label}
            className="ripple-host group grid size-10 place-items-center rounded-xl border border-line bg-surface/50 text-subtle transition-[color,border-color,background-color,box-shadow,translate,scale] duration-200 hover:-translate-y-0.5 hover:border-brand/50 hover:bg-surface-2 hover:text-fg hover:shadow-[0_6px_20px_-8px_rgb(139_92_246/0.6)] active:scale-[0.94]"
          >
            <Icon aria-hidden className="size-[1.05rem] transition-transform duration-200 group-hover:scale-110" />
          </a>
        </li>
      ))}
    </ul>
  );
}
