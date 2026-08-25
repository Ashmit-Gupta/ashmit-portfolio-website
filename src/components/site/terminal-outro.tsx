import { Container } from "@/components/ui/container";
import { FooterTerminal } from "@/components/site/footer-terminal";

export function TerminalOutro() {
  return (
    <section
      aria-label="Terminal outro"
      className="border-t border-line bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,163,106,0.06)_0%,transparent_55%)] py-16 sm:py-20"
    >
      <Container className="flex flex-col items-center">
        <FooterTerminal />
      </Container>
    </section>
  );
}
