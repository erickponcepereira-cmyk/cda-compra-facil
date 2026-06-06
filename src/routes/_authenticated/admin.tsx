import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { formatBRL, resolveImage, type Product, type Category } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel Admin — Cia da Limpeza" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      // not admin
    }
  }, [loading, user, isAdmin]);

  if (loading) return null;
  if (!isAdmin) {
    const claimAdmin = async () => {
      const { data, error } = await supabase.rpc("claim_first_admin");
      if (error) return toast.error(error.message);
      if (data) {
        toast.success("Você agora é admin! Recarregando...");
        setTimeout(() => window.location.reload(), 800);
      } else {
        toast.error("Já existe um administrador no sistema.");
      }
    };
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-12">
          <div className="max-w-md rounded-xl border bg-card p-8 text-center">
            <ShieldAlert className="mx-auto mb-3 size-12 text-destructive" />
            <h1 className="text-xl font-bold">Acesso restrito</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Esta área é exclusiva para administradores. Sua conta ({user?.email}) não tem
              permissão de admin.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Button onClick={claimAdmin} variant="outline">
                Tornar-me admin (primeira configuração)
              </Button>
              <Button onClick={() => navigate({ to: "/" })}>Voltar para a loja</Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              O botão acima só funciona se ainda não houver nenhum admin cadastrado.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Painel Administrativo</h1>
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
          </TabsList>
          <TabsContent value="products"><ProductsAdmin /></TabsContent>
          <TabsContent value="categories"><CategoriesAdmin /></TabsContent>
          <TabsContent value="banners"><BannersAdmin /></TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const load = async () => {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    setProducts((p ?? []) as Product[]);
    setCats((c ?? []) as Category[]);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload = {
      sku: editing.sku ?? "",
      name: editing.name ?? "",
      brand: editing.brand ?? null,
      category_slug: editing.category_slug ?? null,
      image_url: editing.image_url ?? null,
      price: Number(editing.price ?? 0),
      promo_price: editing.promo_price != null && editing.promo_price !== ("" as any) ? Number(editing.promo_price) : null,
      stock: Number(editing.stock ?? 0),
      highlight: !!editing.highlight,
      flash: !!editing.flash,
      active: editing.active ?? true,
    };
    let error;
    if (editing.id) {
      ({ error } = await supabase.from("products").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }
    if (error) toast.error("Erro ao salvar", { description: error.message });
    else { toast.success("Produto salvo"); setEditing(null); load(); }
  };

  const del = async (id: string) => {
    if (!confirm("Excluir este produto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Excluído"); load(); }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing({ active: true, stock: 0, price: 0 })}>
          <Plus className="mr-1 size-4" /> Novo produto
        </Button>
      </div>

      {editing && (
        <div className="space-y-3 rounded-xl border bg-card p-5">
          <h3 className="font-semibold">{editing.id ? "Editar" : "Novo"} produto</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>SKU</Label><Input value={editing.sku ?? ""} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} /></div>
            <div><Label>Nome</Label><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><Label>Marca</Label><Input value={editing.brand ?? ""} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} /></div>
            <div>
              <Label>Categoria</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={editing.category_slug ?? ""}
                onChange={(e) => setEditing({ ...editing, category_slug: e.target.value || null })}
              >
                <option value="">—</option>
                {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div><Label>Preço</Label><Input type="number" step="0.01" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) })} /></div>
            <div><Label>Preço Promo</Label><Input type="number" step="0.01" value={editing.promo_price ?? ""} onChange={(e) => setEditing({ ...editing, promo_price: e.target.value === "" ? null : parseFloat(e.target.value) })} /></div>
            <div><Label>Estoque</Label><Input type="number" value={editing.stock ?? 0} onChange={(e) => setEditing({ ...editing, stock: parseInt(e.target.value) })} /></div>
            <div className="sm:col-span-2"><Label>URL da imagem</Label><Input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://..." /></div>
            <label className="flex items-center gap-2"><Switch checked={!!editing.highlight} onCheckedChange={(v) => setEditing({ ...editing, highlight: v })} /> Destaque</label>
            <label className="flex items-center gap-2"><Switch checked={!!editing.flash} onCheckedChange={(v) => setEditing({ ...editing, flash: v })} /> Oferta Relâmpago</label>
            <label className="flex items-center gap-2"><Switch checked={editing.active ?? true} onCheckedChange={(v) => setEditing({ ...editing, active: v })} /> Ativo</label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button onClick={save}>Salvar</Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase">
            <tr><th className="p-3">Produto</th><th className="p-3">SKU</th><th className="p-3">Preço</th><th className="p-3">Estoque</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="flex items-center gap-2 p-3"><img src={resolveImage(p.image_url)} className="size-10 rounded object-cover" alt="" /><span className="font-medium">{p.name}</span></td>
                <td className="p-3 text-muted-foreground">{p.sku}</td>
                <td className="p-3">{p.promo_price ? <><span className="line-through text-muted-foreground text-xs">{formatBRL(p.price)}</span> <strong>{formatBRL(p.promo_price)}</strong></> : formatBRL(p.price)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3"><span className={`rounded px-2 py-0.5 text-xs ${p.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{p.active ? "Ativo" : "Inativo"}</span></td>
                <td className="flex gap-1 p-3">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(p)}><Pencil className="size-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => del(p.id)}><Trash2 className="size-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoriesAdmin() {
  const [cats, setCats] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setCats((data ?? []) as Category[]);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload = {
      slug: editing.slug ?? "",
      name: editing.name ?? "",
      icon: editing.icon ?? null,
      sort_order: Number(editing.sort_order ?? 0),
      active: editing.active ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("categories").update(payload).eq("id", editing.id)
      : await supabase.from("categories").insert(payload);
    if (error) toast.error(error.message); else { toast.success("Salvo"); setEditing(null); load(); }
  };

  const del = async (id: string) => {
    if (!confirm("Excluir?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing({ active: true, sort_order: cats.length + 1 })}><Plus className="mr-1 size-4" /> Nova categoria</Button>
      </div>
      {editing && (
        <div className="space-y-3 rounded-xl border bg-card p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Slug</Label><Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
            <div><Label>Nome</Label><Input value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><Label>Ícone (emoji)</Label><Input value={editing.icon ?? ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} /></div>
            <div><Label>Ordem</Label><Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) })} /></div>
            <label className="flex items-center gap-2"><Switch checked={editing.active ?? true} onCheckedChange={(v) => setEditing({ ...editing, active: v })} /> Ativo</label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button onClick={save}>Salvar</Button>
          </div>
        </div>
      )}
      <div className="rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase">
            <tr><th className="p-3">Ícone</th><th className="p-3">Nome</th><th className="p-3">Slug</th><th className="p-3">Ordem</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 text-2xl">{c.icon}</td>
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.slug}</td>
                <td className="p-3">{c.sort_order}</td>
                <td className="flex gap-1 p-3">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(c)}><Pencil className="size-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => del(c.id)}><Trash2 className="size-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type Banner = { id: string; title: string | null; subtitle: string | null; image_url: string | null; link_url: string | null; sort_order: number; active: boolean };

function BannersAdmin() {
  const [list, setList] = useState<Banner[]>([]);
  const [editing, setEditing] = useState<Partial<Banner> | null>(null);

  const load = async () => {
    const { data } = await supabase.from("banners").select("*").order("sort_order");
    setList((data ?? []) as Banner[]);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload = {
      title: editing.title ?? null,
      subtitle: editing.subtitle ?? null,
      image_url: editing.image_url ?? null,
      link_url: editing.link_url ?? null,
      sort_order: Number(editing.sort_order ?? 0),
      active: editing.active ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("banners").update(payload).eq("id", editing.id)
      : await supabase.from("banners").insert(payload);
    if (error) toast.error(error.message); else { toast.success("Salvo"); setEditing(null); load(); }
  };

  const del = async (id: string) => {
    if (!confirm("Excluir?")) return;
    await supabase.from("banners").delete().eq("id", id); load();
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing({ active: true, sort_order: list.length + 1 })}><Plus className="mr-1 size-4" /> Novo banner</Button>
      </div>
      {editing && (
        <div className="space-y-3 rounded-xl border bg-card p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Título</Label><Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
            <div><Label>Subtítulo</Label><Input value={editing.subtitle ?? ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label>URL da imagem</Label><Input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label>Link</Label><Input value={editing.link_url ?? ""} onChange={(e) => setEditing({ ...editing, link_url: e.target.value })} /></div>
            <div><Label>Ordem</Label><Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) })} /></div>
            <label className="flex items-center gap-2"><Switch checked={editing.active ?? true} onCheckedChange={(v) => setEditing({ ...editing, active: v })} /> Ativo</label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button onClick={save}>Salvar</Button>
          </div>
        </div>
      )}
      <div className="rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase">
            <tr><th className="p-3">Imagem</th><th className="p-3">Título</th><th className="p-3">Ordem</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.image_url ? <img src={b.image_url} className="h-10 w-16 rounded object-cover" alt="" /> : "—"}</td>
                <td className="p-3 font-medium">{b.title}</td>
                <td className="p-3">{b.sort_order}</td>
                <td className="p-3">{b.active ? "Ativo" : "Inativo"}</td>
                <td className="flex gap-1 p-3">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(b)}><Pencil className="size-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => del(b.id)}><Trash2 className="size-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
