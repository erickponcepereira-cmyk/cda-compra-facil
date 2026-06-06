import spray from "@/assets/prod-spray.jpg";
import detergente from "@/assets/prod-detergente.jpg";
import agua from "@/assets/prod-agua-sanitaria.jpg";
import panos from "@/assets/prod-panos.jpg";
import desinfetante from "@/assets/prod-desinfetante.jpg";
import vassoura from "@/assets/prod-vassoura.jpg";
import luvas from "@/assets/prod-luvas.jpg";
import papel from "@/assets/prod-papel.jpg";

export type Product = {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  price: number;
  promoPrice?: number;
  stock: number;
  highlight?: boolean;
  flash?: boolean;
};

export const categories = [
  { slug: "limpeza-geral", name: "Limpeza Geral", icon: "🧽" },
  { slug: "lavanderia", name: "Lavanderia", icon: "🧺" },
  { slug: "banheiro", name: "Banheiro", icon: "🚿" },
  { slug: "cozinha", name: "Cozinha", icon: "🍽️" },
  { slug: "papelaria", name: "Papelaria & Descartáveis", icon: "🧻" },
  { slug: "equipamentos", name: "Equipamentos", icon: "🧹" },
  { slug: "epis", name: "EPIs", icon: "🧤" },
];

export const products: Product[] = [
  { id: "1", sku: "LMP-001", name: "Multiuso Concentrado 500ml", brand: "CleanPro", category: "limpeza-geral", image: spray, price: 12.9, promoPrice: 9.9, stock: 120, highlight: true, flash: true },
  { id: "2", sku: "LAV-014", name: "Detergente Líquido 5L", brand: "EcoLav", category: "lavanderia", image: detergente, price: 39.9, promoPrice: 32.5, stock: 45, highlight: true },
  { id: "3", sku: "BAN-002", name: "Água Sanitária 2L", brand: "QPro", category: "banheiro", image: agua, price: 14.5, stock: 200 },
  { id: "4", sku: "ACC-101", name: "Pano de Microfibra (Pack 6)", brand: "Microclean", category: "limpeza-geral", image: panos, price: 29.9, promoPrice: 24.9, stock: 80, highlight: true },
  { id: "5", sku: "BAN-009", name: "Desinfetante Lavanda 1L", brand: "Aroma+", category: "banheiro", image: desinfetante, price: 18.9, stock: 60, flash: true },
  { id: "6", sku: "EQP-031", name: "Kit Vassoura + Pá", brand: "ToolClean", category: "equipamentos", image: vassoura, price: 49.9, promoPrice: 42.0, stock: 30 },
  { id: "7", sku: "EPI-007", name: "Luvas de Borracha Amarela (Par)", brand: "SafeHands", category: "epis", image: luvas, price: 8.9, stock: 250, highlight: true },
  { id: "8", sku: "PAP-022", name: "Papel Toalha Folha Dupla (12un)", brand: "SoftRoll", category: "papelaria", image: papel, price: 34.9, promoPrice: 28.9, stock: 90, flash: true },
];

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
