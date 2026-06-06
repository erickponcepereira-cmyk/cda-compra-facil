import { formatBRL } from "./products";
import type { CartItem } from "./cart";

export const WHATSAPP_NUMBER = "5566981283314";

export type CheckoutCustomer = {
  name: string;
  document: string;
  phone: string;
  accountType: "pf" | "pj";
  company?: string | null;
};

export function buildWhatsAppMessage(items: CartItem[], total: number, customer: CheckoutCustomer) {
  const lines: string[] = [];
  lines.push("*Novo pedido — Cia da Limpeza*");
  lines.push("");
  lines.push(`*Cliente:* ${customer.name}`);
  lines.push(`*Tipo:* ${customer.accountType === "pj" ? "Pessoa Jurídica" : "Pessoa Física"}`);
  if (customer.company) lines.push(`*Empresa:* ${customer.company}`);
  lines.push(`*Documento:* ${customer.document}`);
  lines.push(`*Telefone:* ${customer.phone}`);
  lines.push("");
  lines.push("*Itens:*");
  items.forEach((i) => {
    lines.push(`• ${i.qty}x ${i.name} (SKU ${i.sku}) — ${formatBRL(i.price * i.qty)}`);
  });
  lines.push("");
  lines.push(`*Total:* ${formatBRL(total)}`);
  return lines.join("\n");
}

export function openWhatsApp(text: string) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
