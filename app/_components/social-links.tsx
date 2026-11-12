import type { IconType } from "react-icons";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { LuMail } from "react-icons/lu";
import { profile } from "../_data/portfolio";

const links: { label: string; href: string; icon: IconType; external: boolean }[] = [
  { label: "LinkedIn", href: profile.linkedIn, icon: FaLinkedinIn, external: true },
  { label: "GitHub", href: profile.github, icon: FaGithub, external: true },
  { label: "Email", href: `mailto:${profile.email}`, icon: LuMail, external: false },
];

/** Icon buttons for the profiles listed in portfolio data. */
export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-2 ${className}`} aria-label="Social profiles">
      {links.map(({ label, href, icon: Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={external ? `${label} (opens in a new tab)` : label}
            title={label}
            className="grid size-11 place-items-center rounded-full border border-line text-subtle transition-[color,border-color,translate] duration-200 hover:-translate-y-0.5 hover:border-fg/50 hover:text-fg"
          >
            <Icon aria-hidden className="size-[1.05rem]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
