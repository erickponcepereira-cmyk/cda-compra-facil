import { Link } from "@tanstack/react-router";
import { Search, ShoppingCart, User, Headphones, Menu } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginGate } from "./LoginGate";

export function Header() {
  const { open } = useLoginGate();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      {/* Top bar */}
      <div className="hidden bg-secondary text-secondary-foreground md:block">
        <div className="container mx-auto flex h-8 items-center justify-between px-4 text-xs">
          <span>Frete grátis acima de R$ 199 · Atendimento PJ disponível</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Vender no Cia</a>
            <a href="#" className="hover:underline">Atacado</a>
            <a href="#" className="hover:underline">Ajuda</a>
          </div>
        </div>
      </div>

      {/* Main row */}
      <div className="container mx-auto flex items-center gap-3 px-4 py-3">
        <Link to="/" className="shrink-0">
          <Logo className="h-10 w-auto md:h-12" />
        </Link>

        <div className="ml-2 hidden flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos, marcas, SKU..."
              className="h-11 rounded-full pl-10 pr-28"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 h-9 -translate-y-1/2 rounded-full bg-warning text-warning-foreground hover:bg-warning/90"
            >
              Buscar
            </Button>
          </div>
        </div>

        <nav className="ml-auto flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="sm" onClick={open} className="hidden md:flex">
            <User className="mr-1.5 size-4" /> Minha Conta
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Headphones className="mr-1.5 size-4" /> Suporte
          </Button>
          <Button variant="default" size="sm" onClick={open} className="bg-primary hover:bg-primary/90">
            <ShoppingCart className="mr-1.5 size-4" /> <span className="hidden sm:inline">Carrinho</span>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
          </Button>
        </nav>
      </div>

      {/* Mobile search */}
      <div className="container mx-auto px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar produtos..." className="h-10 rounded-full pl-10" />
        </div>
      </div>

      {/* Category nav */}
      <div className="border-t bg-card">
        <div className="container mx-auto flex items-center gap-1 overflow-x-auto px-4 py-2 text-sm">
          <Button variant="ghost" size="sm" className="shrink-0 font-semibold">
            <Menu className="mr-1.5 size-4" /> Categorias
          </Button>
          <span className="mx-1 h-5 w-px bg-border" />
          {[
            ["Promoções", "text-destructive"],
            ["Destaques da Semana", ""],
            ["Mais Vendidos", ""],
            ["Lavanderia", ""],
            ["Banheiro", ""],
            ["Cozinha", ""],
            ["EPIs", ""],
            ["Equipamentos", ""],
          ].map(([label, cls]) => (
            <a
              key={label}
              href="#"
              className={`shrink-0 rounded-md px-3 py-1.5 font-medium hover:bg-muted ${cls}`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
