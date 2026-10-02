import { ButtonLink, Container } from "./_components/ui";

export const metadata = { title: "Page not found — Ramdhan Vanjara" };

export default function NotFound() {
  return (
    <Container className="flex min-h-[80vh] flex-col items-center justify-center py-32 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">This route doesn&apos;t exist.</h1>
      <p className="mt-3 text-muted">The page you&apos;re looking for has moved or never existed.</p>
      <ButtonLink href="/" className="mt-8">
        Back to home
      </ButtonLink>
    </Container>
  );
}
