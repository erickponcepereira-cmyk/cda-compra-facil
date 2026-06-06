import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { buildWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import { formatBRL, resolveImage } from "@/lib/products";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Finalizar pedido — Cia da Limpeza" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { user, loading } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{
    full_name: string | null;
    document: string | null;
    phone: string | null;
    company_name: string | null;
    account_type: "pf" | "pj";
  } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { mode: "login" } });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, document, phone, company_name, account_type")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data as any));
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (items.length === 0) return;
    setBusy(true);

    // persist updated profile fields
    await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        document: profile.document,
        phone: profile.phone,
        company_name: profile.company_name,
      })
      .eq("id", user!.id);

    const text = buildWhatsAppMessage(items, total, {
      name: profile.full_name ?? "",
      document: profile.document ?? "",
      phone: profile.phone ?? "",
      accountType: profile.account_type,
      company: profile.company_name,
    });
    openWhatsApp(text);
    toast.success("Pedido enviado para o WhatsApp!");
    clear();
    setBusy(false);
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Finalizar Pedido</h1>

        {items.length === 0 ? (
          <div className="rounded-xl border bg-card p-10 text-center">
            <ShoppingBag className="mx-auto mb-3 size-12 text-muted-foreground" />
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
            <Button className="mt-4" onClick={() => navigate({ to: "/" })}>
              Continuar comprando
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            <form onSubmit={submit} className="space-y-5 rounded-xl border bg-card p-5">
              <h2 className="text-lg font-semibold">Confirme seus dados</h2>
              {profile ? (
                <>
                  {profile.account_type === "pj" && (
                    <div>
                      <Label>Razão Social</Label>
                      <Input
                        value={profile.company_name ?? ""}
                        onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                      />
                    </div>
                  )}
                  <div>
                    <Label>{profile.account_type === "pj" ? "Responsável" : "Nome completo"}</Label>
                    <Input
                      required
                      value={profile.full_name ?? ""}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>{profile.account_type === "pj" ? "CNPJ" : "CPF"}</Label>
                      <Input
                        required
                        value={profile.document ?? ""}
                        onChange={(e) => setProfile({ ...profile, document: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input
                        required
                        value={profile.phone ?? ""}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={busy}
                    size="lg"
                    className="w-full bg-success text-success-foreground hover:bg-success/90"
                  >
                    <MessageCircle className="mr-2 size-5" />
                    {busy ? "Enviando..." : "Enviar pedido pelo WhatsApp"}
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Carregando...</p>
              )}
            </form>

            <aside className="space-y-3 rounded-xl border bg-card p-5">
              <h2 className="text-lg font-semibold">Resumo</h2>
              <ul className="space-y-3">
                {items.map((i) => (
                  <li key={i.id} className="flex gap-3">
                    <img
                      src={resolveImage(i.image)}
                      alt={i.name}
                      className="size-14 rounded object-cover"
                    />
                    <div className="flex-1 text-sm">
                      <div className="line-clamp-2 font-medium">{i.name}</div>
                      <div className="text-xs text-muted-foreground">Qtd: {i.qty}</div>
                    </div>
                    <span className="text-sm font-semibold">{formatBRL(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t pt-3 text-lg font-bold">
                <span>Total</span>
                <span>{formatBRL(total)}</span>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
