import { LuArrowUp } from "react-icons/lu";
import { profile } from "../_data/portfolio";
import SocialLinks from "./social-links";
import { Container } from "./ui";

export default function Footer() {
  return (
    <footer data-footer className="relative overflow-hidden border-t border-line">
      <Container className="footer-inner flex flex-col gap-8 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="display text-2xl text-fg">{profile.name}</p>
          <p className="label mt-1.5">{profile.headline}</p>
        </div>
        <SocialLinks />
        <div className="flex items-center justify-between gap-6 text-sm text-subtle sm:flex-col sm:items-end sm:gap-2">
          <a href="#home" className="group inline-flex items-center gap-1.5 transition-colors hover:text-fg">
            <span className="u-link">Back to top</span>
            <LuArrowUp aria-hidden className="size-4 transition-transform duration-200 group-hover:-translate-y-1" />
          </a>
          <p className="label">© {new Date().getFullYear()} {profile.name}</p>
        </div>
      </Container>
    </footer>
  );
}
