import { ButtonLink, Container } from "./_components/ui";

export const metadata = { title: "Page not found — Ramdhan Vanjara" };

export default function NotFound() {
  return (
    <Container className="flex min-h-[80vh] flex-col items-start justify-center py-32">
      <p className="label text-accent">Error 404</p>
      <h1 className="display mt-4 text-6xl text-fg sm:text-8xl">
        This route <em className="text-accent">doesn&apos;t exist.</em>
      </h1>
      <p className="mt-5 text-muted">The page you&apos;re looking for has moved or never existed.</p>
      <ButtonLink href="/" className="mt-10">
        Back to home
      </ButtonLink>
    </Container>
  );
}
