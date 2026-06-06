import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, Tag, Zap } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SupportFab } from "@/components/SupportFab";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Product, Category } from "@/lib/products";
import hero from "@/assets/hero-cleaning.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cia da Limpeza — Produtos de limpeza profissional" },
      {
        name: "description",
        content:
          "A maior loja de produtos de limpeza para sua casa e empresa. Marcas profissionais, atendimento PF e PJ, pedidos pelo WhatsApp.",
      },
      { property: "og:title", content: "Cia da Limpeza" },
      {
        property: "og:description",
        content: "Produtos de limpeza profissional para casa e empresa.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });

  const highlights = products.filter((p) => p.highlight);
  const flash = products.filter((p) => p.flash);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-brand-green text-primary-foreground">
          <div className="container mx-auto grid items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <Zap className="size-3.5" /> Ofertas Relâmpago ativas
              </span>
              <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                Tudo para limpeza, em um só lugar.
              </h1>
              <p className="max-w-lg text-base text-white/90 md:text-lg">
                Marcas profissionais, preços de atacado e atendimento dedicado para casa e empresa.
                Faça seu pedido em minutos.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-warning text-warning-foreground hover:bg-warning/90">
                  Ver Promoções <ArrowRight className="ml-1 size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white hover:bg-white/20"
                >
                  Conta para Empresas
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={hero}
                alt="Produtos de limpeza"
                width={1600}
                height={900}
                className="aspect-[16/10] w-full rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </section>

        <section className="border-b bg-card">
          <div className="container mx-auto grid gap-4 px-4 py-5 sm:grid-cols-2 md:grid-cols-4">
            {[
              { icon: Truck, t: "Entrega rápida", s: "Para todo o Brasil" },
              { icon: Tag, t: "Preço de atacado", s: "Para empresas (PJ)" },
              { icon: ShieldCheck, t: "Compra segura", s: "LGPD e SSL" },
              { icon: Zap, t: "Pedido pelo WhatsApp", s: "Atendimento direto" },
            ].map(({ icon: Icon, t, s }) => (
              <div key={t} className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{t}</div>
                  <div className="text-xs text-muted-foreground">{s}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <SectionHeader title="Categorias" />
          <div className="grid grid-cols-3 gap-3 md:grid-cols-7">
            {categories.map((c) => (
              <a
                key={c.slug}
                href="#"
                className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center transition hover:border-primary hover:shadow-md"
              >
                <span className="text-3xl">{c.icon}</span>
                <span className="text-xs font-medium leading-tight">{c.name}</span>
              </a>
            ))}
          </div>
        </section>

        {flash.length > 0 && (
          <section className="container mx-auto px-4 py-6">
            <div className="rounded-2xl border bg-gradient-to-r from-destructive/10 via-warning/10 to-warning/5 p-5">
              <div className="mb-4 flex items-end justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-destructive">
                    <Zap className="size-5 fill-current" />
                    <h2 className="text-xl font-bold">Ofertas Relâmpago</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Termina em <CountdownBadge /> · estoque limitado
                  </p>
                </div>
                <a href="#" className="text-sm font-semibold text-primary hover:underline">
                  Ver todas →
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {flash.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {highlights.length > 0 && (
          <section className="container mx-auto px-4 py-10">
            <SectionHeader title="Destaques da Semana" link="Ver tudo" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {highlights.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 py-10">
          <SectionHeader title="Mais Vendidos" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-secondary to-primary p-8 text-primary-foreground md:p-12">
            <div className="max-w-2xl space-y-3">
              <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                Cia Empresas
              </span>
              <h3 className="text-2xl font-bold md:text-3xl">
                Compre como Pessoa Jurídica e ganhe condições especiais.
              </h3>
              <p className="text-white/90">
                Preços de atacado, NF-e e atendimento dedicado por vendedor.
              </p>
              <Button size="lg" className="bg-warning text-warning-foreground hover:bg-warning/90">
                Cadastrar empresa
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <SupportFab />
    </div>
  );
}

function SectionHeader({ title, link }: { title: string; link?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
      {link && (
        <a href="#" className="text-sm font-semibold text-primary hover:underline">
          {link} →
        </a>
      )}
    </div>
  );
}

function CountdownBadge() {
  return (
    <span className="ml-1 inline-flex gap-1 font-mono text-xs font-bold text-destructive">
      <span className="rounded bg-destructive px-1.5 py-0.5 text-destructive-foreground">02</span>:
      <span className="rounded bg-destructive px-1.5 py-0.5 text-destructive-foreground">14</span>:
      <span className="rounded bg-destructive px-1.5 py-0.5 text-destructive-foreground">37</span>
    </span>
  );
}
