import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLoginGate } from "./LoginGate";
import { formatBRL, resolveImage, type Product } from "@/lib/products";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { open } = useLoginGate();
  const { user } = useAuth();
  const { add } = useCart();
  const hasPromo = product.promo_price != null && product.promo_price < product.price;
  const discount = hasPromo
    ? Math.round((1 - (product.promo_price as number) / product.price) * 100)
    : 0;
  const finalPrice = hasPromo ? (product.promo_price as number) : product.price;

  const handleAdd = () => {
    if (!user) return open();
    add(product, 1);
    toast.success("Adicionado ao carrinho", { description: product.name });
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={resolveImage(product.image_url)}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.flash && (
            <Badge className="bg-destructive text-destructive-foreground">Relâmpago</Badge>
          )}
          {hasPromo && (
            <Badge className="bg-warning text-warning-foreground">-{discount}%</Badge>
          )}
          {product.highlight && !product.flash && (
            <Badge className="bg-success text-success-foreground">Destaque</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {product.brand} · SKU {product.sku}
        </div>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {product.name}
        </h3>

        {user ? (
          <div className="mt-auto">
            {hasPromo && (
              <div className="text-xs text-muted-foreground line-through">
                {formatBRL(product.price)}
              </div>
            )}
            <div className="text-lg font-bold text-foreground">{formatBRL(finalPrice)}</div>
          </div>
        ) : (
          <button
            onClick={open}
            className="mt-auto rounded-lg border border-dashed border-primary/40 bg-primary/5 p-2 text-left transition hover:bg-primary/10"
          >
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <Eye className="size-3.5" />
              Entrar para ver preço
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              Login necessário para compras
            </div>
          </button>
        )}

        <Button
          size="sm"
          onClick={handleAdd}
          className="w-full bg-warning text-warning-foreground hover:bg-warning/90"
        >
          <ShoppingCart className="mr-1.5 size-4" /> Adicionar
        </Button>
      </div>
    </article>
  );
}
