import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <Logo className="h-12 w-auto" />
          <p className="text-sm text-muted-foreground">
            Sua plataforma de produtos de limpeza profissional. Atendimento PF e PJ.
          </p>
        </div>
        {[
          { title: "Institucional", links: ["Sobre nós", "Trabalhe conosco", "Política Comercial"] },
          { title: "Atendimento", links: ["Central de Ajuda", "Fale Conosco", "WhatsApp"] },
          { title: "Legal", links: ["Termos de Uso", "Privacidade", "Cookies", "LGPD"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold">{col.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-foreground">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Cia da Limpeza. Todos os direitos reservados.</span>
          <span>CNPJ 00.000.000/0001-00</span>
        </div>
      </div>
    </footer>
  );
}
