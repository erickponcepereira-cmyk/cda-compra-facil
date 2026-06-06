import { MessageCircle } from "lucide-react";

const WHATSAPP = "5566981283314";

export function SupportFab() {
  const href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    "Olá! Gostaria de tirar uma dúvida sobre os produtos da Cia da Limpeza."
  )}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar pelo WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-success px-4 py-3 text-success-foreground shadow-lg shadow-success/30 transition hover:scale-105"
    >
      <MessageCircle className="size-5" />
      <span className="hidden text-sm font-semibold sm:inline">Suporte</span>
    </a>
  );
}
