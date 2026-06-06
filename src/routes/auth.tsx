import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { useEffect } from "react";

const searchSchema = z.object({
  mode: z.enum(["login", "signup"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Entrar ou Cadastrar — Cia da Limpeza" },
      { name: "description", content: "Acesse sua conta para ver preços e comprar." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden bg-gradient-to-br from-primary via-secondary to-brand-green p-12 text-primary-foreground md:flex md:flex-col md:justify-between">
        <Logo className="h-14 w-auto brightness-0 invert" />
        <div className="space-y-3">
          <h2 className="text-3xl font-bold">Bem-vindo à Cia da Limpeza</h2>
          <p className="text-white/90">
            Cadastre-se para ver preços, comprar e receber condições exclusivas para empresas.
          </p>
        </div>
        <p className="text-xs text-white/70">© Cia da Limpeza</p>
      </div>

      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center md:hidden">
            <Logo className="mx-auto h-12 w-auto" />
          </div>
          <Tabs defaultValue={mode === "signup" ? "signup" : "login"}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar Conta</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>
          <p className="text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:underline">← Voltar para a loja</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error("Não foi possível entrar", { description: error.message });
      return;
    }
    toast.success("Bem-vindo de volta!");
    navigate({ to: "/" });
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div>
        <Label htmlFor="li-email">E-mail</Label>
        <Input id="li-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="li-pw">Senha</Label>
        <Input id="li-pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" disabled={busy} className="w-full bg-primary hover:bg-primary/90">
        {busy ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}

function SignupForm() {
  const [accountType, setAccountType] = useState<"pf" | "pj">("pf");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [document, setDocument] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Senha deve ter ao menos 6 caracteres");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName,
          account_type: accountType,
          document,
          phone,
          company_name: accountType === "pj" ? companyName : null,
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error("Erro no cadastro", { description: error.message });
      return;
    }
    toast.success("Cadastro realizado!", {
      description: "Verifique seu e-mail para confirmar a conta.",
    });
    navigate({ to: "/" });
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
        {(["pf", "pj"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setAccountType(t)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              accountType === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t === "pf" ? "Pessoa Física" : "Pessoa Jurídica"}
          </button>
        ))}
      </div>

      {accountType === "pj" && (
        <div>
          <Label htmlFor="su-company">Razão Social</Label>
          <Input id="su-company" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>
      )}
      <div>
        <Label htmlFor="su-name">{accountType === "pj" ? "Responsável" : "Nome completo"}</Label>
        <Input id="su-name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="su-doc">{accountType === "pj" ? "CNPJ" : "CPF"}</Label>
          <Input id="su-doc" required value={document} onChange={(e) => setDocument(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="su-phone">Telefone</Label>
          <Input id="su-phone" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>
      <div>
        <Label htmlFor="su-email">E-mail</Label>
        <Input id="su-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="su-pw">Senha</Label>
        <Input id="su-pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" disabled={busy} className="w-full bg-primary hover:bg-primary/90">
        {busy ? "Criando..." : "Criar conta"}
      </Button>
    </form>
  );
}
