import { LuArrowUp } from "react-icons/lu";
import { profile } from "../_data/portfolio";
import SocialLinks from "./social-links";
import { Container } from "./ui";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg-2/60">
      <Container className="flex flex-col items-center gap-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-semibold text-fg">{profile.name}</p>
          <p className="mt-1 text-sm text-subtle">Senior Software Engineer · Backend / Full Stack</p>
        </div>
        <SocialLinks />
        <div className="flex flex-col items-center gap-2 text-sm text-subtle sm:items-end">
          <a
            href="#home"
            className="group inline-flex items-center gap-1.5 rounded-lg transition-colors hover:text-fg"
          >
            <span className="u-link">Back to top</span>
            <LuArrowUp aria-hidden className="size-4 transition-transform duration-200 group-hover:-translate-y-1" />
          </a>
          <p className="text-xs">© {new Date().getFullYear()} {profile.name}</p>
        </div>
      </Container>
    </footer>
  );
}
