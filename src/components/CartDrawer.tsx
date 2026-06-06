import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useLoginGate } from "./LoginGate";
import { formatBRL, resolveImage } from "@/lib/products";
import { useNavigate } from "@tanstack/react-router";

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
}) {
  const { items, total, setQty, remove, count } = useCart();
  const { user } = useAuth();
  const { open: openLogin } = useLoginGate();
  const navigate = useNavigate();

  const checkout = () => {
    if (!user) {
      onOpenChange(false);
      openLogin();
      return;
    }
    onOpenChange(false);
    navigate({ to: "/checkout" });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5" /> Seu Carrinho ({count})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="grid h-full place-content-center text-center text-muted-foreground">
              <ShoppingBag className="mx-auto mb-2 size-10 opacity-40" />
              <p className="text-sm">Seu carrinho está vazio</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3 rounded-lg border bg-card p-2">
                  <img
                    src={resolveImage(i.image)}
                    alt={i.name}
                    className="size-16 rounded-md object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="line-clamp-2 text-sm font-medium">{i.name}</div>
                    <div className="text-xs text-muted-foreground">SKU {i.sku}</div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-md border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => setQty(i.id, i.qty - 1)}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">{i.qty}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => setQty(i.id, i.qty + 1)}
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                      <span className="text-sm font-semibold">{formatBRL(i.price * i.qty)}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(i.id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <SheetFooter className="border-t bg-muted/30 p-5">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatBRL(total)}</span>
            </div>
            <Button
              className="w-full bg-success text-success-foreground hover:bg-success/90"
              size="lg"
              disabled={items.length === 0}
              onClick={checkout}
            >
              <MessageCircle className="mr-2 size-4" /> Finalizar via WhatsApp
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
