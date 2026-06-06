import spray from "@/assets/prod-spray.jpg";
import detergente from "@/assets/prod-detergente.jpg";
import agua from "@/assets/prod-agua-sanitaria.jpg";
import panos from "@/assets/prod-panos.jpg";
import desinfetante from "@/assets/prod-desinfetante.jpg";
import vassoura from "@/assets/prod-vassoura.jpg";
import luvas from "@/assets/prod-luvas.jpg";
import papel from "@/assets/prod-papel.jpg";

// Map asset-style paths stored in DB to bundled images
const ASSET_MAP: Record<string, string> = {
  "/src/assets/prod-spray.jpg": spray,
  "/src/assets/prod-detergente.jpg": detergente,
  "/src/assets/prod-agua-sanitaria.jpg": agua,
  "/src/assets/prod-panos.jpg": panos,
  "/src/assets/prod-desinfetante.jpg": desinfetante,
  "/src/assets/prod-vassoura.jpg": vassoura,
  "/src/assets/prod-luvas.jpg": luvas,
  "/src/assets/prod-papel.jpg": papel,
};

export function resolveImage(url: string | null | undefined): string {
  if (!url) return spray;
  return ASSET_MAP[url] ?? url;
}

export type Product = {
  id: string;
  sku: string;
  name: string;
  brand: string | null;
  category_slug: string | null;
  image_url: string | null;
  price: number;
  promo_price: number | null;
  stock: number;
  highlight: boolean;
  flash: boolean;
  active: boolean;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  sort_order: number;
  active: boolean;
};

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
